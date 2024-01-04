import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:sagrada/game.dart';
import 'package:sagrada/scoring_rules.dart';

class AppState with ChangeNotifier {
  final CameraDescription camera;
  Set<ScoringRule> publicGoals = {};
  Color? privateGoalColor;
  Board? board;

  AppState({required this.camera});

  void setPublicGoals(Set<ScoringRule> newPublicGoals) {
    publicGoals = newPublicGoals;
    notifyListeners();
  }

  void setPrivateGoalColor(Color color) {
    privateGoalColor = color;
    notifyListeners();
  }

  void setBoard(Board newBoard) {
    board = newBoard;
    notifyListeners();
  }

  void resetBoard() {
    board = null;
    notifyListeners();
  }

  void setDice(int i, int j, Dice? newDice) {
    board!.board[i][j] = newDice;
    notifyListeners();
  }
}
