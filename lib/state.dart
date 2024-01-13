import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:sagrada/game.dart';
import 'package:sagrada/scoring_rules.dart';

class AppState with ChangeNotifier {
  final CameraDescription camera;
  Set<ScoringRule> publicObjectives = {};
  Color? privateObjectiveColor;
  Board? board;

  AppState({required this.camera});

  void setBoard(Board? newBoard, {bool silent = false}) {
    board = newBoard;

    if (!silent) {
      notifyListeners();
    }
  }

  void setPublicObjectives(Set<ScoringRule> newPublicObjectives) {
    publicObjectives = newPublicObjectives;
    notifyListeners();
  }

  void setPrivateObjectiveColor(Color color) {
    privateObjectiveColor = color;
    notifyListeners();
  }
}
