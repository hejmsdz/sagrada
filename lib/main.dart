import 'dart:async';
import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:image/image.dart' as image;
import 'package:provider/provider.dart';
import 'package:sagrada/ai.dart';
import 'package:sagrada/game.dart' as game;
import 'package:sagrada/images.dart';
import 'package:sagrada/screens/public_goals_selection.dart';
import 'package:sagrada/state.dart';
import 'package:sagrada/widgets/board_view.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final cameras = await availableCameras();
  final firstCamera = cameras.first;

  runApp(ChangeNotifierProvider(
    create: (context) => AppState(camera: firstCamera),
    child: MaterialApp(
      title: 'Sagrada',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const PublicGoalsSelectionScreen(),
    ),
  ));
}
