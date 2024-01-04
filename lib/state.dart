import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:sagrada/game.dart';
import 'package:sagrada/scoring_rules.dart';

class AppState with ChangeNotifier {
  final CameraDescription camera;
  Set<ScoringRule> publicGoals = {};
  Board? board;

  AppState({required this.camera});

  void setPublicGoals(Set<ScoringRule> newPublicGoals) {
    publicGoals = newPublicGoals;
    notifyListeners();
  }

  List<ScoringRule> getScoringRules() {
    return [
      // SumColor(),
      BlankPenalty(),
      ...publicGoals,
    ];
  }

  void setBoard(Board newBoard) {
    board = newBoard;
    notifyListeners();
  }

  void resetBoard() {
    board = null;
    notifyListeners();
  }

  void setDiceColor(int i, int j, Color color) {
    final dice = board!.board[i][j];
    board!.board[i][j] = Dice(color, dice?.number ?? 1);
    notifyListeners();
  }

  void setDiceNumber(int i, int j, int number) {
    final dice = board!.board[i][j];
    board!.board[i][j] = Dice(dice?.color ?? Color.blue, number);
    notifyListeners();
  }

  void removeDice(int i, int j) {
    board!.board[i][j] = null;
    notifyListeners();
  }
}
