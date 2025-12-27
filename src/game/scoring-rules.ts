import type { Mask, Color, Value, OptionalDice } from "./types";
import { Board, COLORS, NUM_COLUMNS, NUM_ROWS, VALUES } from "./types";

export type ScoringResult = {
  score: number;
  calculation: string;
  mask: Mask;
};

export type ScoringRule = (board: Board) => ScoringResult;

const times = "×";

const checkValue = (value: Value) => (dice: OptionalDice) =>
  dice?.value === value;
const checkColor = (color: Color) => (dice: OptionalDice) =>
  dice?.color === color;

export function blankPenalty(board: Board): ScoringResult {
  const mask = board.createMask((dice) => dice === null);
  const numBlanks = board.diceAtMask(mask).length;
  const penaltyPerBlank = -1;

  return {
    score: numBlanks * penaltyPerBlank,
    calculation: `${numBlanks} ${times} (${penaltyPerBlank})`,
    mask,
  };
}

export function sumColorFactory(color: Color): ScoringRule {
  return (board: Board) => {
    const mask = board.createMask(checkColor(color));
    const numbers = board.diceAtMask(mask).map((dice) => dice?.value ?? 0);
    const score = numbers.reduce((a, b) => a + b, 0);

    return {
      score,
      calculation: numbers.join(" + "),
      mask,
    };
  };
}

function setBasedScoringRuleFactory(
  scorePerSet: number,
  diceClassifiers: ((dice: OptionalDice) => boolean)[],
): ScoringRule {
  return (board: Board) => {
    const itemCounts = diceClassifiers.map(
      (classifier) => board.diceAtMask(board.createMask(classifier)).length,
    );
    const minCount = Math.min(...itemCounts);
    const leastFrequentClassIndices = itemCounts.reduce((acc, count, index) => {
      if (count === minCount) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
    const mask = board.createMask((dice) =>
      leastFrequentClassIndices.some((index) => diceClassifiers[index](dice)),
    );
    const score = minCount * scorePerSet;

    return {
      score,
      calculation: `min(${itemCounts.join(", ")}) ${times} ${scorePerSet}`,
      mask,
    };
  };
}

export const lightShades = setBasedScoringRuleFactory(2, [
  checkValue(1),
  checkValue(2),
]);
export const mediumShades = setBasedScoringRuleFactory(2, [
  checkValue(3),
  checkValue(4),
]);
export const deepShades = setBasedScoringRuleFactory(2, [
  checkValue(5),
  checkValue(6),
]);

export const colorVariety = setBasedScoringRuleFactory(
  4,
  COLORS.map(checkColor),
);
export const shadeVariety = setBasedScoringRuleFactory(
  5,
  VALUES.map(checkValue),
);

function columnVarietyFactory<T>(
  scorePerColumn: number,
  diceClassifier: (dice: OptionalDice) => T,
): ScoringRule {
  return (board: Board) => {
    const satisfyingColumns = new Set(
      Array.from({ length: NUM_COLUMNS }, (_, j) => j).filter((j) => {
        const valuesSeen = new Set<T>();

        for (let i = 0; i < NUM_ROWS; i++) {
          const dice = board.at(i, j);

          if (dice === null || valuesSeen.has(diceClassifier(dice))) {
            return false;
          }

          valuesSeen.add(diceClassifier(dice));
        }

        return true;
      }),
    );

    const numSatisfyingColumns = satisfyingColumns.size;
    const mask = board.createMask((dice, i, j) => satisfyingColumns.has(j));
    const score = numSatisfyingColumns * scorePerColumn;

    return {
      score,
      calculation: `${numSatisfyingColumns} ${times} ${scorePerColumn}`,
      mask,
    };
  };
}

export const columnColorVariety = columnVarietyFactory(
  5,
  (dice) => dice?.color,
);
export const columnShadeVariety = columnVarietyFactory(
  4,
  (dice) => dice?.value,
);

function rowVarietyFactory<T>(
  scorePerRow: number,
  diceClassifier: (dice: OptionalDice) => T,
): ScoringRule {
  return (board: Board) => {
    const satisfyingRows = new Set(
      Array.from({ length: NUM_ROWS }, (_, i) => i).filter((i) => {
        const valuesSeen = new Set<T>();

        for (let j = 0; j < NUM_COLUMNS; j++) {
          const dice = board.at(i, j);

          if (dice === null || valuesSeen.has(diceClassifier(dice))) {
            return false;
          }

          valuesSeen.add(diceClassifier(dice));
        }

        return true;
      }),
    );

    const numSatisfyingRows = satisfyingRows.size;
    const mask = board.createMask((_dice, i) => satisfyingRows.has(i));
    const score = numSatisfyingRows * scorePerRow;

    return {
      score,
      calculation: `${numSatisfyingRows} ${times} ${scorePerRow}`,
      mask,
    };
  };
}

export const rowColorVariety = rowVarietyFactory(6, (dice) => dice?.color);
export const rowShadeVariety = rowVarietyFactory(5, (dice) => dice?.value);

export const colorDiagonals = (board: Board) => {
  const mask = board.createMask((dice, i, j) => {
    if (dice === null) {
      return false;
    }

    const neighbors = [
      [i - 1, j - 1],
      [i - 1, j + 1],
      [i + 1, j - 1],
      [i + 1, j + 1],
    ];

    return neighbors
      .filter(([row, column]) => Board.validCoordinates(row, column))
      .some(([row, column]) => {
        const neighbor = board.at(row, column);
        return neighbor !== null && neighbor.color === dice.color;
      });
  });

  const countByColors = board.diceAtMask(mask).reduce(
    (stack, dice) => {
      if (dice === null) {
        return stack;
      }

      stack[dice.color] = (stack[dice.color] || 0) + 1;
      return stack;
    },
    {} as Record<Color, number>,
  );
  const values = Object.values(countByColors);

  return {
    score: values.reduce((a, b) => a + b, 0),
    calculation: values.join(" + "),
    mask,
  };
};
