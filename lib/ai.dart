import 'package:tflite_flutter/tflite_flutter.dart';
import 'package:image/image.dart' as image;
import 'package:sagrada/game.dart' as game;

typedef Classifier<T> = List<T> Function(List<dynamic>);

const diceImageWidth = 32;
const diceImageHeight = 32;

Classifier<T> wrapModel<T>(Interpreter model, List<T> classes) {
  final numClasses = classes.length;

  return (List<dynamic> inputs) {
    final numInputs = inputs.length;
    var outputs = List.filled(numInputs * numClasses, 0.0)
        .reshape([numInputs, numClasses]);

    model.run(inputs, outputs);

    return (outputs as List<List<dynamic>>).map((probabilities) {
      int maxIndex = 0;

      for (int i = 1; i < probabilities.length; i++) {
        if (probabilities[i] > probabilities[maxIndex]) {
          maxIndex = i;
        }
      }

      return classes[maxIndex];
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

Future<Classifier<int>> getNumbersClassifier() async {
  final model = await Interpreter.fromAsset('models/numbers.tflite');
  return wrapModel<int>(model, [1, 2, 3, 4, 5, 6]);
}

Future<Classifier<game.Color?>> getColorsClassifier() async {
  final model = await Interpreter.fromAsset('models/colors.tflite');
  return wrapModel(model, [null, ...game.Color.values]);
}
