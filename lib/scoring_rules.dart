import 'dart:math';

import 'package:sagrada/game.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ScoringResult {
  final int score;
  final List<List<bool>> mask;
  final String calculation;

  ScoringResult(this.score, this.mask, this.calculation);
}

abstract class ScoringRule {
  ScoringResult getScore(Board board);
  String getTranslation(AppLocalizations l10n);
}

const times = '×';

class SumColor extends ScoringRule {
  final Color color;

  SumColor(this.color);

  @override
  ScoringResult getScore(Board board) {
    final mask = board.createMask((dice, i, j) => dice?.color == color);
    final numbers = board.diceAtMask(mask).map((dice) => dice!.number);
    final score = numbers.reduce((a, b) => a + b);

    return ScoringResult(score, mask, numbers.join(" + "));
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.privateGoal(color.getTranslation(l10n));
  }
}

class BlankPenalty extends ScoringRule {
  @override
  ScoringResult getScore(Board board) {
    final mask = board.createMask((dice, i, j) => dice == null);
    final numBlanks = board.diceAtMask(mask).length;
    final score = numBlanks * -1;

    return ScoringResult(score, mask, "$numBlanks $times (-1)");
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.blankPenalty;
  }
}

typedef SetClassifier = bool Function(Dice?);

abstract class SetBasedScoringRule<T> extends ScoringRule {
  int scorePerSet;
  List<SetClassifier> diceClassifiers;

  SetBasedScoringRule(this.scorePerSet, this.diceClassifiers);

  @override
  ScoringResult getScore(Board board) {
    final itemCounts = List.filled(diceClassifiers.length, 0);

    board.forEachDice((dice, i, j) {
      for (int k = 0; k < diceClassifiers.length; k++) {
        if (diceClassifiers[k](dice)) {
          itemCounts[k]++;
        }
      }
    });

    final lowestItemCount = itemCounts.reduce(min);

    final leastFrequentClassesIndices = itemCounts.indexed
        .where((el) => el.$2 == lowestItemCount)
        .map((el) => el.$1);

    final mask = board.createMask((dice, i, j) {
      return leastFrequentClassesIndices.any((k) => diceClassifiers[k](dice));
    });

    final score = lowestItemCount * scorePerSet;

    return ScoringResult(
        score, mask, "min(${itemCounts.join(', ')}) $times $scorePerSet");
  }
}

class LightShades extends SetBasedScoringRule {
  LightShades()
      : super(2, [
          (dice) => dice?.number == 1,
          (dice) => dice?.number == 2,
        ]);

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.lightShades;
  }
}

class MediumShades extends SetBasedScoringRule {
  MediumShades()
      : super(2, [
          (dice) => dice?.number == 3,
          (dice) => dice?.number == 4,
        ]);

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.mediumShades;
  }
}

class DeepShades extends SetBasedScoringRule {
  DeepShades()
      : super(2, [
          (dice) => dice?.number == 5,
          (dice) => dice?.number == 6,
        ]);

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.deepShades;
  }
}

class ColorVariety extends SetBasedScoringRule {
  ColorVariety()
      : super(
            4,
            Color.values
                .map((color) => (dice) => dice?.color == color)
                .toList());

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.colorVariety;
  }
}

class ShadeVariety extends SetBasedScoringRule {
  ShadeVariety()
      : super(
            5,
            [1, 2, 3, 4, 5, 6]
                .map((number) => (dice) => dice?.number == number)
                .toList());

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.shadeVariety;
  }
}

abstract class ColumnVariety<T> extends ScoringRule {
  int scorePerColumn;

  ColumnVariety(this.scorePerColumn);

  T key(Dice dice);

  @override
  ScoringResult getScore(Board board) {
    final satisfyingColumns = <int>{};

    for (int j = 0; j < numColumns; j++) {
      final valuesSeen = <T>{};
      bool isFailed = false;

      for (int i = 0; i < numRows; i++) {
        Dice? dice = board.at(i, j);

        if (dice == null || valuesSeen.contains(key(dice))) {
          isFailed = true;
          break;
        }

        valuesSeen.add(key(dice));
      }

      if (!isFailed) {
        satisfyingColumns.add(j);
      }
    }

    final numSatisfyingColumns = satisfyingColumns.length;
    final mask =
        board.createMask((dice, i, j) => satisfyingColumns.contains(j));
    final score = numSatisfyingColumns * scorePerColumn;

    return ScoringResult(
        score, mask, "$numSatisfyingColumns $times $scorePerColumn");
  }
}

class ColumnColorVariety extends ColumnVariety {
  ColumnColorVariety() : super(5);

  @override
  key(Dice dice) {
    return dice.color;
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.columnColorVariety;
  }
}

class ColumnShadeVariety extends ColumnVariety {
  ColumnShadeVariety() : super(4);

  @override
  key(Dice dice) {
    return dice.number;
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.columnShadeVariety;
  }
}

abstract class RowVariety<T> extends ScoringRule {
  int scorePerRow;

  RowVariety(this.scorePerRow);

  T key(Dice dice);

  @override
  ScoringResult getScore(Board board) {
    final satisfyingRows = <int>{};

    for (int i = 0; i < numRows; i++) {
      final valuesSeen = <T>{};
      bool isFailed = false;

      for (int j = 0; j < numColumns; j++) {
        Dice? dice = board.at(i, j);

        if (dice == null || valuesSeen.contains(key(dice))) {
          isFailed = true;
          break;
        }

        valuesSeen.add(key(dice));
      }

      if (!isFailed) {
        satisfyingRows.add(i);
      }
    }

    final numSatisfyingColumns = satisfyingRows.length;
    final mask = board.createMask((dice, i, j) => satisfyingRows.contains(i));
    final score = numSatisfyingColumns * scorePerRow;

    return ScoringResult(
        score, mask, "$numSatisfyingColumns $times $scorePerRow");
  }
}

class RowColorVariety extends RowVariety {
  RowColorVariety() : super(6);

  @override
  key(Dice dice) {
    return dice.color;
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.rowColorVariety;
  }
}

class RowShadeVariety extends RowVariety {
  RowShadeVariety() : super(5);

  @override
  key(Dice dice) {
    return dice.number;
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.rowShadeVariety;
  }
}

class ColorDiagonals extends ScoringRule {
  @override
  ScoringResult getScore(Board board) {
    final mask = getMask(board);
    final countByColors = <Color, int>{};
    board.diceAtMask(mask).forEach((dice) {
      final color = dice!.color;
      countByColors.update(color, (value) => value + 1, ifAbsent: () => 1);
    });
    final score = countByColors.values.reduce((a, b) => a + b);

    return ScoringResult(score, mask, countByColors.values.join(" + "));
  }

  Mask getMask(Board board) {
    final mask =
        List.generate(numRows, (i) => List<bool>.filled(numColumns, false));

    board.forEachDice((dice, i, j) {
      if (dice == null) {
        return;
      }

      final steps = [-1, 1];
      final coordinates = [
        for (final di in steps)
          for (final dj in steps) (i + di, j + dj)
      ].where(validCoordinates);
      final neighbors =
          coordinates.map(((int, int) point) => board.at(point.$1, point.$2));

      mask[i][j] = neighbors.any((neighbor) => neighbor?.color == dice.color);
    });

    return mask;
  }

  @override
  String getTranslation(AppLocalizations l10n) {
    return l10n.colorDiagonals;
  }
}
