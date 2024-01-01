// import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:sagrada/game.dart';
import 'package:sagrada/scoring_rules.dart';

void main() {
  final board = Board([
    [R(3), P(4), B(1), G(5), P(6)],
    [B(5), R(6), P(2), B(1), Y(2)],
    [P(3), G(2), R(4), Y(3), R(4)],
    [R(5), P(3), Y(6), R(1), null],
  ]);

  test('SumColor', () {
    final scoreBlue = SumColor(Color.blue).getScore(board);
    final scoreGreen = SumColor(Color.green).getScore(board);
    final scorePurple = SumColor(Color.purple).getScore(board);
    final scoreRed = SumColor(Color.red).getScore(board);
    final scoreYellow = SumColor(Color.yellow).getScore(board);

    expect(scoreBlue, 1 + 5 + 1);
    expect(scoreGreen, 5 + 2);
    expect(scorePurple, 4 + 6 + 2 + 3 + 3);
    expect(scoreRed, 3 + 6 + 4 + 4 + 5 + 1);
    expect(scoreYellow, 2 + 3 + 6);
  });

  test('BlankPenalty', () {
    final score = BlankPenalty().getScore(board);

    expect(score, -1);
  });

  test('LightShades', () {
    final score = LightShades().getScore(board);

    expect(score, 3 * 2); // three 1's and three 2's
  });

  test('ColorVariety', () {
    final score = ColorVariety().getScore(board);

    expect(score, 2 * 4); // two green dice
  });

  test('ColumnShadeVariety', () {
    final score = ColumnShadeVariety().getScore(board);

    expect(score, 2 * 4); // second and fourth columns satisfy the condition
  });

  test('RowColorVariety', () {
    final score = RowColorVariety().getScore(board);

    expect(score, 0); // no rows satisfy the condition
  });

  test('ColorDiagonals', () {
    final score = ColorDiagonals().getScore(board);
    const expectedScore = (3 + 6 + 4 + 1 + 4) // red
        +
        (2 + 3 + 6) // yellow
        +
        (1 + 1) // blue
        +
        (4 + 2) +
        (3 + 3); // purple

    expect(score, expectedScore);
  });
}
