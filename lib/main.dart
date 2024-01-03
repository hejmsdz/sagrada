import 'dart:async';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:image/image.dart' as image;
import 'package:provider/provider.dart';
import 'package:sagrada/ai.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/images.dart';
import 'package:sagrada/scoring_rules.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/widgets/board_view.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final cameras = await availableCameras();
  final firstCamera = cameras.first;

  runApp(ChangeNotifierProvider(
    create: (context) => AppState(),
    child: MaterialApp(
      title: 'Sagrada',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: TakePictureScreen(
        camera: firstCamera,
      ),
    ),
  ));
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
      appBar: AppBar(title: const Text('Scan your board')),
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
  List<List<bool>>? mask;

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);
    state.resetBoard();

    () async {
      final boardImage = await image.decodeImageFile(widget.imagePath);
      if (boardImage == null) {
        return;
      }

      final grid = GridCoordinates(
          boardImage.width.toDouble(), boardImage.height.toDouble());

      final recognizer = await ImageRecognizer.create();
      final result = await recognizer.readBoard(boardImage, grid);
      state.setBoard(result);
    }();
  }

  void handleDiceTap(int i, int j) async {
    setState(() {
      mask = List.generate(
          game.numRows, (i) => List.filled(game.numColumns, false));
      mask![i][j] = true;
    });

    final result = await showDialog<String>(
        context: context,
        builder: (BuildContext context) {
          return Consumer<AppState>(builder: (context, state, child) {
            final dice = state.board?.board[i][j];
            final isBlank = dice == null;

            return SimpleDialog(
              contentPadding: const EdgeInsets.all(12.0),
              children: [
                SegmentedButton<int>(
                  showSelectedIcon: false,
                  segments: [1, 2, 3, 4, 5, 6]
                      .map((number) => ButtonSegment<int>(
                            value: number,
                            label: Text('$number'),
                          ))
                      .toList(),
                  selected: {isBlank ? 0 : dice.number},
                  onSelectionChanged: (Set<int> newSelection) {
                    state.setDiceNumber(i, j, newSelection.first);
                  },
                ),
                const SizedBox(height: 8),
                SegmentedButton<game.Color?>(
                  showSelectedIcon: false,
                  segments: [...game.Color.values, null]
                      .map((color) => ButtonSegment<game.Color?>(
                          value: color,
                          icon: color == null
                              ? const Icon(Icons.check_box_outline_blank)
                              : Icon(Icons.casino,
                                  color: BoardView.diceColors[color]!)))
                      .toList(),
                  selected: {dice?.color},
                  onSelectionChanged: (Set<game.Color?> newSelection) {
                    if (newSelection.first == null) {
                      state.removeDice(i, j);
                    } else {
                      state.setDiceColor(i, j, newSelection.first!);
                    }
                  },
                ),
              ],
            );
          });
        });
    setState(() {
      mask = null;
    });

    print(result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text('Board scanning result')),
        body: Consumer<AppState>(builder: (context, state, child) {
          if (state.board == null) {
            return const Center(child: CircularProgressIndicator());
          }

          return BoardView(
            board: state.board!,
            mask: mask,
            onDiceTap: handleDiceTap,
          );
        }));
  }
}
