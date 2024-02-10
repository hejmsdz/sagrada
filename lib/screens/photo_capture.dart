import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:provider/provider.dart';
import 'package:sagrada/images.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/game.dart' as game;
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:sagrada/widgets/photo_review_sheet.dart';

class PhotoCaptureScreen extends StatefulWidget {
  const PhotoCaptureScreen({
    super.key,
  });

  @override
  PhotoCaptureScreenState createState() => PhotoCaptureScreenState();
}

class PhotoCaptureScreenState extends State<PhotoCaptureScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;
  bool isPhotoTaken = false;

  @override
  void initState() {
    super.initState();

    final state = Provider.of<AppState>(context, listen: false);

    _controller = CameraController(
      state.camera,
      ResolutionPreset.high,
      enableAudio: false,
    );

    initializeController();
  }

  initializeController() {
    setState(() {
      _initializeControllerFuture = _controller.initialize();
    });

    _initializeControllerFuture.catchError((error) {
      showErrorDialog();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> showErrorDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(AppLocalizations.of(context)!.cameraAccessRequired),
          content:
              Text(AppLocalizations.of(context)!.cameraAccessRequiredMessage),
          actions: <Widget>[
            TextButton(
              child: Text(AppLocalizations.of(context)!.retry),
              onPressed: () {
                initializeController();
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> capturePhoto() async {
    try {
      await _initializeControllerFuture;

      final image = await _controller.takePicture();
      setState(() {
        isPhotoTaken = true;
      });
      _controller.pausePreview();

      if (!mounted) return;
      Navigator.of(context)
          .push(ModalBottomSheetRoute(
        builder: (context) {
          return SizedBox(
              height: 400,
              child: Scaffold(
                  backgroundColor: Colors.transparent,
                  body: PhotoReviewSheet(imagePath: image.path)));
        },
        isScrollControlled: false,
        showDragHandle: true,
      ))
          .then((value) {
        _controller.resumePreview();
        setState(() {
          isPhotoTaken = false;
        });
      });
    } catch (e) {
      print(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppLocalizations.of(context)!.scanYourWindowFrame,
        ),
      ),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return Container();
          }

          if (snapshot.connectionState == ConnectionState.done) {
            final media = MediaQuery.of(context);

            return AspectRatio(
              aspectRatio: media.orientation == Orientation.landscape
                  ? _controller.value.aspectRatio
                  : 1 / _controller.value.aspectRatio,
              child: CameraPreview(
                _controller,
                child: CustomPaint(
                  painter: GridLinesPainter(),
                ),
              ),
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
      floatingActionButton: FloatingActionButton.large(
        onPressed: () async {
          capturePhoto();
        },
        child: const Icon(Icons.camera_alt),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
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
