enum Color { blue, green, purple, red, yellow }

class Dice {
  final Color color;
  final int number;

  const Dice(this.color, this.number);
}

const numRows = 4;
const numColumns = 5;

class Board {
  final List<List<Dice?>> board;

  const Board(this.board);

  void forEachDice(void Function(Dice? dice, int i, int j) callback) {
    for (int i = 0; i < numRows; i++) {
      final row = board[i];
      for (int j = 0; j < numColumns; j++) {
        callback(row[j], i, j);
      }
    }
  }

  int countIf(bool Function(Dice? dice) callback) {
    int total = 0;
    forEachDice((dice, i, j) {
      if (callback(dice)) {
        total++;
      }
    });
    return total;
  }

  Map<T, int> countBy<T>(T? Function(Dice? dice) callback) {
    final counter = <T, int>{};

    forEachDice((dice, i, j) {
      T? key = callback(dice);
      if (key != null) {
        if (counter.containsKey(key)) {
          counter[key] = counter[key]! + 1;
        } else {
          counter[key] = 1;
        }
      }
    });

    return counter;
  }
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
