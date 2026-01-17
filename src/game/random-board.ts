import { Board, type Dice, COLORS, NUM_COLUMNS, NUM_ROWS, VALUES, type Coordinate, type OptionalDice } from "@/game/types";

const pickRandom = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const isNotNeighbor = <T>(neighbors: Coordinate[], fields: OptionalDice[][], key: keyof Dice) => (x: T) => !neighbors.some(([i, j]) => x === fields[i][j]?.[key])

export const buildRandomBoard = () => {
  const fields: OptionalDice[][] = Array.from({ length: NUM_ROWS }, () => Array.from({ length: NUM_COLUMNS }, () => null));

  for (let row = 0; row < NUM_ROWS; row++) {
    for (let column = 0; column < NUM_COLUMNS; column++) {
      const neighbors = Board.neighbors(row, column);

      const possibleColors = COLORS.filter(isNotNeighbor(neighbors, fields, "color"));
      const possibleValues = VALUES.filter(isNotNeighbor(neighbors, fields, "value"));

      if (!possibleColors.length || !possibleValues.length) {
        continue;
      }

      fields[row][column] = {
        color: pickRandom(possibleColors),
        value: pickRandom(possibleValues),
      };
    }
  }

  return new Board(fields);
};
