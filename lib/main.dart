import 'dart:async';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:image/image.dart' as img;
import 'package:sagrada/ai.dart';
import 'package:sagrada/game.dart' as game;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final cameras = await availableCameras();
  final firstCamera = cameras.first;

  runApp(
    MaterialApp(
      title: 'Sagrada',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: TakePictureScreen(
        camera: firstCamera,
      ),
    ),
  );
}

class TakePictureScreen extends StatefulWidget {
  const TakePictureScreen({
    super.key,
    required this.camera,
  });

  final CameraDescription camera;

  @override
  TakePictureScreenState createState() => TakePictureScreenState();
}

class TakePictureScreenState extends State<TakePictureScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;

  @override
  void initState() {
    super.initState();
    _controller = CameraController(
      widget.camera,
      ResolutionPreset.high,
      enableAudio: false,
    );

    _initializeControllerFuture = _controller.initialize();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Take a picture')),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                CameraPreview(_controller),
                Positioned.fill(child: CustomPaint(painter: GridLinesPainter()))
              ],
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          try {
            await _initializeControllerFuture;

            final image = await _controller.takePicture();

            if (!mounted) return;

            await Navigator.of(context).push(
              MaterialPageRoute(
                builder: (context) => DisplayPictureScreen(
                  imagePath: image.path,
                ),
              ),
            );
          } catch (e) {
            print(e);
          }
        },
        child: const Icon(Icons.camera_alt),
      ),
    );
  }
}

class GridCoordinates {
  late double margin;
  late double left;
  late double width;
  late double right;
  late double cellSize;
  late double height;
  late double top;
  late double bottom;

  GridCoordinates(double containerWidth, double containerHeight) {
    margin = 0.05 * containerWidth;
    left = margin;
    width = containerWidth - 2 * margin;
    right = left + width;
    cellSize = width / 5;
    height = cellSize * 4;
    top = (containerHeight - height) / 2;
    bottom = top + height;
  }
}

class GridLinesPainter extends CustomPainter {
  Size? lastSize;

  @override
  void paint(Canvas canvas, Size size) {
    final grid = GridCoordinates(size.width, size.height);

    paintOverlay(canvas, size, grid);
    paintGridLines(canvas, size, grid);

    lastSize = size;
  }

  void paintOverlay(Canvas canvas, Size size, GridCoordinates grid) {
    final paint = Paint()..color = Colors.black54;

    canvas.drawRect(Rect.fromLTRB(0, 0, size.width, grid.top), paint);
    canvas.drawRect(
        Rect.fromLTRB(0, grid.bottom, size.width, size.height), paint);
    canvas.drawRect(Rect.fromLTRB(0, grid.top, grid.left, grid.bottom), paint);
    canvas.drawRect(
        Rect.fromLTRB(grid.right, grid.top, size.width, grid.bottom), paint);
  }

  void paintGridLines(Canvas canvas, Size size, GridCoordinates grid) {
    final paint = Paint()
      ..color = Colors.white70
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    final path = Path();

    for (int i = 0; i <= game.numRows; i++) {
      final y = grid.top + i * grid.cellSize;
      path.moveTo(grid.left, y);
      path.lineTo(grid.right, y);
    }

    for (int j = 0; j <= game.numColumns; j++) {
      final x = grid.left + j * grid.cellSize;
      path.moveTo(x, grid.top);
      path.lineTo(x, grid.bottom);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(GridLinesPainter oldDelegate) =>
      lastSize != oldDelegate.lastSize;
}

class DisplayPictureScreen extends StatefulWidget {
  final String imagePath;

  const DisplayPictureScreen({super.key, required this.imagePath});

  @override
  DisplayPictureScreenState createState() => DisplayPictureScreenState();
}

class DisplayPictureScreenState extends State<DisplayPictureScreen> {
  List<Image> thumbnails = [];
  List<game.Dice?> dice = [];

  static final diceColors = {
    game.Color.blue: Colors.blue,
    game.Color.green: Colors.green,
    game.Color.purple: Colors.purple,
    game.Color.red: Colors.red,
    game.Color.yellow: Colors.yellow,
  };

  @override
  void initState() {
    super.initState();

    () async {
      final fullImage = await img.decodeImageFile(widget.imagePath);
      if (fullImage == null) {
        return;
      }

      final grid = GridCoordinates(
          fullImage.width.toDouble(), fullImage.height.toDouble());
      final cellSize = grid.cellSize.round();

      final inputs = <ImageTensor>[];

      setState(() {
        thumbnails.clear();

        for (int i = 0; i < game.numRows; i++) {
          final y = (grid.top + i * grid.cellSize).round();
          for (int j = 0; j < game.numColumns; j++) {
            final x = (grid.left + j * grid.cellSize).round();

            var diceImage = img.copyCrop(fullImage,
                x: x, y: y, width: cellSize, height: cellSize);

            diceImage = img.copyResize(
              diceImage,
              width: diceImageWidth,
              height: diceImageHeight,
            );

            thumbnails.add(Image.memory(img.encodePng(diceImage)));
            inputs.add(imageToTensor(diceImage));
          }
        }
      });

      final classifyNumber = await getNumbersClassifier();
      final classifyColor = await getColorsClassifier();

      final numbers = classifyNumber(inputs);
      final colors = classifyColor(inputs);

      setState(() {
        dice.clear();
        for (int i = 0; i < game.numRows * game.numColumns; i++) {
          if (colors[i] == null) {
            dice.add(null);
          } else {
            dice.add(game.Dice(colors[i]!, numbers[i]));
          }
        }
      });
    }();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Display the Picture')),
        body: Container(
          child: Column(children: [
            Expanded(
                child: GridView.count(
              crossAxisCount: 5,
              mainAxisSpacing: 15.0,
              children: List.generate(
                  thumbnails.length,
                  (index) => Center(
                          child: Column(children: [
                        thumbnails[index],
                        dice[index] == null
                            ? const Text("")
                            : Text("${dice[index]!.number}",
                                style: TextStyle(
                                  color: diceColors[dice[index]!.color],
                                  fontSize: 32.0,
                                ))
                      ]))).toList(),
            )),
          ]),
        ));
  }
}
