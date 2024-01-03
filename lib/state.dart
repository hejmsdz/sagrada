import 'package:flutter/material.dart';
import 'package:sagrada/game.dart' as game;

class AppState with ChangeNotifier {
  game.Board? board;

  void setBoard(game.Board newBoard) {
    board = newBoard;
    notifyListeners();
  }
}
