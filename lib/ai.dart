import 'package:sagrada/images.dart';
import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as image;
import 'package:sagrada/game.dart' as game;

typedef Classifier<T> = Future<List<ClassificationResult<T>>> Function(
    List<dynamic>);

class ClassificationResult<T> {
  final T label;
  final double confidence;

  const ClassificationResult({required this.label, required this.confidence});
}

const diceImageWidth = 32;
const diceImageHeight = 32;

Future<Classifier<T>> wrapModel<T>(Interpreter model, List<T> classes) async {
  final asyncModel = await IsolateInterpreter.create(address: model.address);
  final numClasses = classes.length;

  return (List<dynamic> inputs) async {
    final numInputs = inputs.length;
    var outputs = List.filled(numInputs * numClasses, 0.0)
        .reshape([numInputs, numClasses]);

    await asyncModel.run(inputs, outputs);

    return (outputs as List<List<dynamic>>).map((probabilities) {
      int maxIndex = 0;

      for (int i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > probabilities[maxIndex]) {
          maxIndex = i;
        }
      }

      return ClassificationResult(
        label: classes[maxIndex],
        confidence: probabilities[maxIndex],
      );
    }).toList();
  };
}

typedef ImageTensor = List<List<List<double>>>;

ImageTensor imageToTensor(image.Image image) {
  return List.generate(
      image.height,
      (int y) => List.generate(image.width, (int x) {
            final pixel = image.getPixel(x, y);

            return [pixel.b / 255.0, pixel.g / 255.0, pixel.r / 255.0];
          }));
}

Future<Classifier<int?>> getNumbersClassifier() async {
  final model = await Interpreter.fromAsset('models/numbers.tflite');
  return wrapModel(model, [null, 1, 2, 3, 4, 5, 6]);
}

Future<Classifier<game.Color?>> getColorsClassifier() async {
  final model = await Interpreter.fromAsset('models/colors.tflite');
  return wrapModel(model, [null, ...game.Color.values]);
}

class ImageRecognitionResult {
  final game.Board board;
  final List<image.Image> diceCrops;
  final double confidence;

  ImageRecognitionResult({
    required this.board,
    required this.diceCrops,
    required this.confidence,
  });
}

class ImageRecognizer {
  late Classifier<int?> numbersClassifier;
  late Classifier<game.Color?> colorsClassifier;

  ImageRecognizer(this.numbersClassifier, this.colorsClassifier);

  static Future<ImageRecognizer> create() async {
    return ImageRecognizer(
      await getNumbersClassifier(),
      await getColorsClassifier(),
    );
  }

  Future<ImageRecognitionResult> readBoard(
      image.Image boardImage, GridCoordinates grid) async {
    final diceCrops = await getDiceCrops(boardImage, grid);
    final diceCropTensors = diceCrops.map(imageToTensor).toList();

    final numberResults = await numbersClassifier(diceCropTensors);
    final colorResults = await colorsClassifier(diceCropTensors);

    final flatDiceList = <game.Dice?>[];
    for (int i = 0; i < game.numRows * game.numColumns; i++) {
      final color = colorResults[i].label;
      final number = numberResults[i].label;

      print(
          "<C=${colorResults[i].confidence.toStringAsFixed(3)}; N=${numberResults[i].confidence.toStringAsFixed(3)}>");

      if (color == null || number == null) {
        flatDiceList.add(null);
      } else {
        flatDiceList.add(game.Dice(color, number));
      }
    }
    final confidences = [
      ...colorResults.map((r) => r.confidence),
      ...numberResults.map((r) => r.confidence)
    ];
    final avgConfidence = confidences.reduce((a, b) => a + b) /
        (2 * game.numRows * game.numColumns);

    final board = game.Board(List.generate(
        game.numRows,
        (i) => List.generate(game.numColumns, (j) {
              final sequentialIndex = i * game.numColumns + j;
              return flatDiceList[sequentialIndex];
            })));

    return ImageRecognitionResult(
      board: board,
      diceCrops: diceCrops,
      confidence: avgConfidence,
    );
  }

  Future<List<image.Image>> getDiceCrops(
      image.Image boardImage, GridCoordinates grid) async {
    final diceCrops = <image.Image>[];
    final cellSize = grid.cellSize.round();

    for (int i = 0; i < game.numRows; i++) {
      final y = (grid.top + i * grid.cellSize).round();
      for (int j = 0; j < game.numColumns; j++) {
        final x = (grid.left + j * grid.cellSize).round();

        final command = image.Command()
          ..image(boardImage)
          ..copyCrop(x: x, y: y, width: cellSize, height: cellSize)
          ..copyResize(
            width: diceImageWidth,
            height: diceImageHeight,
          );

        final diceImage = await command.getImageThread();

        if (diceImage == null) {
          throw Exception("Failed to process the image from camera.");
        }

        diceCrops.add(diceImage);
      }
    }

    return diceCrops;
  }
}
