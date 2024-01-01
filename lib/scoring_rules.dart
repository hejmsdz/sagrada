import 'dart:math';

import 'package:sagrada/game.dart';

abstract class ScoringRule {
  int getScore(Board board);
}

class SumColor extends ScoringRule {
  final Color color;

  SumColor(this.color);

  @override
  int getScore(Board board) {
    int total = 0;

    board.forEachDice((dice, i, j) {
      if (dice?.color == color) {
        total += dice!.number;
      }
    });

    return total;
  }
}

class BlankPenalty extends ScoringRule {
  @override
  int getScore(Board board) {
    return -1 * board.countIf((dice) => dice == null);
  }
}

class LightShades extends ScoringRule {
  @override
  int getScore(Board board) {
    final ones = board.countIf((dice) => dice?.number == 1);
    final twos = board.countIf((dice) => dice?.number == 2);
    return 2 * min(ones, twos);
  }
}

class MediumShades extends ScoringRule {
  @override
  int getScore(Board board) {
    final threes = board.countIf((dice) => dice?.number == 3);
    final fours = board.countIf((dice) => dice?.number == 4);
    return 2 * min(threes, fours);
  }
}

class DarkShades extends ScoringRule {
  @override
  int getScore(Board board) {
    final fives = board.countIf((dice) => dice?.number == 5);
    final sixes = board.countIf((dice) => dice?.number == 6);
    return 2 * min(fives, sixes);
  }
}

class VariousColors extends ScoringRule {
  @override
  int getScore(Board board) {
    return 4 *
        Color.values
            .map((color) => board.countIf((dice) => dice?.color == color))
            .reduce(min);
  }
}

class VariousNumbers extends ScoringRule {
  @override
  int getScore(Board board) {
    return 5 *
        [1, 2, 3, 4, 5, 6]
            .map((number) => board.countIf((dice) => dice?.number == number))
            .reduce(min);
  }
}

abstract class VariousColumns<T> extends ScoringRule {
  int scorePerColumn;

  VariousColumns(this.scorePerColumn);

  T key(Dice dice);

  @override
  int getScore(Board board) {
    int total = 0;

    for (int j = 0; j < 5; j++) {
      final valuesSeen = <T>{};
      bool isFailed = false;

      for (int i = 0; i < 4; i++) {
        Dice? dice = board.board[i][j];

        if (dice == null || valuesSeen.contains(dice.color)) {
          isFailed = true;
          break;
        }

        valuesSeen.add(key(dice));
      }

      if (!isFailed) {
        total += scorePerColumn;
      }
    }

    return total;
  }
}

class VariousColorsInColumn extends VariousColumns {
  VariousColorsInColumn() : super(5);

  @override
  key(Dice dice) {
    return dice.color;
  }
}

class VariousNumbersInColumn extends VariousColumns {
  VariousNumbersInColumn() : super(4);

  @override
  key(Dice dice) {
    return dice.number;
  }
}

abstract class VariousRows<T> extends ScoringRule {
  int scorePerRow;

  VariousRows(this.scorePerRow);

  T key(Dice dice);

  @override
  int getScore(Board board) {
    int total = 0;

    for (int i = 0; i < 4; i++) {
      final valuesSeen = <T>{};
      bool isFailed = false;

      for (int j = 0; j < 5; j++) {
        Dice? dice = board.board[i][j];

        if (dice == null || valuesSeen.contains(dice.color)) {
          isFailed = true;
          break;
        }

        valuesSeen.add(key(dice));
      }

      if (!isFailed) {
        total += scorePerRow;
      }
    }

    return total;
  }
}

class VariousColorsInRow extends VariousRows {
  VariousColorsInRow() : super(6);

  @override
  key(Dice dice) {
    return dice.color;
  }
}

class VariousNumbersInRow extends VariousRows {
  VariousNumbersInRow() : super(5);

  @override
  key(Dice dice) {
    return dice.number;
  }
}

class Diagonals extends ScoringRule {
  @override
  int getScore(Board board) {
    int total = 0;
    final mask = getDiagonalMask(board);

    board.forEachDice((dice, i, j) {
      if (dice != null && mask[i][j]) {
        total += dice.number;
      }
    });

    return total;
  }

  List<List<bool>> getDiagonalMask(Board board) {
    final mask =
        List.generate(numRows, (i) => List<bool>.filled(numColumns, false));

    board.forEachDice((dice, i, j) {
      if (dice == null) {
        return;
      }

      final steps = [-1, 1];
      final coordinates = [
        for (final di in steps)
          for (final dj in steps) [i + di, j + dj]
      ].where((point) {
        final i = point[0];
        final j = point[1];

        return i >= 0 && i < numRows && j >= 0 && j < numColumns;
      });
      final neighbors =
          coordinates.map((point) => board.board[point[0]][point[1]]);

      mask[i][j] = neighbors.any((neighbor) => neighbor?.color == dice.color);
    });

    return mask;
  }
}
