import 'package:flutter/material.dart';
import 'package:sagrada/game.dart' as game;

class AppState with ChangeNotifier {
  game.Board? board;

  void setBoard(game.Board newBoard) {
    board = newBoard;
    notifyListeners();
  }

  void setDiceColor(int i, int j, game.Color color) {
    final dice = board!.board[i][j];
    board!.board[i][j] = game.Dice(color, dice?.number ?? 1);
    notifyListeners();
  }

  void setDiceNumber(int i, int j, int number) {
    final dice = board!.board[i][j];
    board!.board[i][j] = game.Dice(dice?.color ?? game.Color.blue, number);
    notifyListeners();
  }

  void removeDice(int i, int j) {
    board!.board[i][j] = null;
    notifyListeners();
  }
}
