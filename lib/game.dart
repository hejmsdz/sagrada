import 'package:flutter_gen/gen_l10n/app_localizations.dart';

enum Color { blue, green, purple, red, yellow }

extension ColorExtension on Color {
  String getTranslation(AppLocalizations l10n) {
    switch (this) {
      case Color.blue:
        return l10n.blue;
      case Color.green:
        return l10n.green;
      case Color.purple:
        return l10n.purple;
      case Color.red:
        return l10n.red;
      case Color.yellow:
        return l10n.yellow;
    }
  }
}

class Dice {
  final Color color;
  final int number;

  const Dice(this.color, this.number);

  @override
  bool operator ==(Object other) {
    return other is Dice && other.color == color && other.number == number;
  }

  @override
  int get hashCode => Object.hash(color, number);
}

const numRows = 4;
const numColumns = 5;

typedef Mask = List<List<bool>>;

class Board {
  final List<List<Dice?>> _board;

  const Board(this._board);

  Dice? at(int i, int j) {
    return _board[i][j];
  }

  void set(int i, int j, Dice? newDice) {
    _board[i][j] = newDice;
  }

  Board copy() {
    return Board(List.generate(
        numRows, (i) => List.generate(numColumns, (j) => at(i, j))));
  }

  void forEachDice(void Function(Dice? dice, int i, int j) callback) {
    for (int i = 0; i < numRows; i++) {
      final row = _board[i];
      for (int j = 0; j < numColumns; j++) {
        callback(row[j], i, j);
      }
    }
  }

  Mask createMask(bool Function(Dice? dice, int i, int j) predicate) {
    return List.generate(numRows,
        (i) => List.generate(numColumns, (j) => predicate(at(i, j), i, j)));
  }

  List<Dice?> diceAtMask(Mask mask) {
    final diceList = <Dice?>[];
    for (int i = 0; i < numRows; i++) {
      for (int j = 0; j < numColumns; j++) {
        if (mask[i][j]) {
          diceList.add(_board[i][j]);
        }
      }
    }
    return diceList;
  }

  Mask findIllegallyPlacedDice() {
    return createMask((dice, i, j) {
      return [(i - 1, j), (i + 1, j), (i, j - 1), (i, j + 1)]
          .where(validCoordinates)
          .any((point) => isSameColorOrNumber(dice, at(point.$1, point.$2)));
    });
  }
}

bool validCoordinates((int, int) coordinates) {
  final (i, j) = coordinates;
  return i >= 0 && i < numRows && j >= 0 && j < numColumns;
}

bool isSameColorOrNumber(Dice? dice1, Dice? dice2) {
  if (dice1 == null || dice2 == null) {
    return false;
  }

  return dice1.color == dice2.color || dice1.number == dice2.number;
}

// convenience functions for shorthand board definitions
Dice B(int number) {
  return Dice(Color.blue, number);
}

Dice G(int number) {
  return Dice(Color.green, number);
}

Dice P(int number) {
  return Dice(Color.purple, number);
}

Dice R(int number) {
  return Dice(Color.red, number);
}

Dice Y(int number) {
  return Dice(Color.yellow, number);
}

/* like this:
final board = Board([
  [G(6), P(5), B(1), R(6), Y(5)],
  [Y(5), R(6), P(5), B(2), G(1)],
  [R(4), null, Y(1), P(6), null],
  [Y(6), R(2), B(5), null, Y(3)],
]);
*/
