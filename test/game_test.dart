import 'package:flutter_test/flutter_test.dart';

import 'package:sagrada/game.dart';

void main() {
  test('findIllegallyPlacedDice', () {
    final board = Board([
      [R(3), P(4), B(1), G(5), P(6)],
      [B(5), R(6), P(2), B(1), Y(1)],
      [R(3), G(2), R(4), Y(3), R(4)],
      [R(5), P(3), Y(6), R(1), B(6)],
    ]);

    expect(board.findIllegallyPlacedDice(), [
      [false, false, false, false, false],
      [false, false, false, true, true],
      [true, false, false, false, false],
      [true, false, false, false, false]
    ]);
  });
}
