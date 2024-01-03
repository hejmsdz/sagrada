import 'package:flutter/material.dart';
import 'package:sagrada/game.dart' as game;

class BoardView extends StatelessWidget {
  final game.Board board;
  final List<List<bool>>? mask;
  final Function(int, int)? onDiceTap;

  const BoardView({
    Key? key,
    required this.board,
    this.onDiceTap,
    this.mask,
  }) : super(key: key);

  static final diceColors = {
    game.Color.blue: Colors.blue,
    game.Color.green: Colors.green,
    game.Color.purple: Colors.purple,
    game.Color.red: Colors.red,
    game.Color.yellow: Colors.yellow,
  };

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(5.0),
        child: GridView.count(
            crossAxisCount: game.numColumns,
            mainAxisSpacing: 5.0,
            crossAxisSpacing: 5.0,
            children: List.generate(game.numRows * game.numColumns, (index) {
              final i = index ~/ game.numColumns;
              final j = index % game.numColumns;
              final dice = board.board[i][j];
              final opacity = (mask == null || mask![i][j]) ? 1.0 : 0.2;

              return Opacity(
                  opacity: opacity,
                  child: Material(
                      borderRadius: BorderRadius.circular(5.0),
                      elevation: 3.0,
                      color: dice == null
                          ? Colors.black38
                          : diceColors[dice.color],
                      child: InkWell(
                        onTap: () {
                          onDiceTap?.call(i, j);
                        },
                        child: dice == null
                            ? null
                            : Center(
                                child: Text(
                                '${dice.number}',
                                style: const TextStyle(fontSize: 32),
                              )),
                      )));
            })));
  }
}
