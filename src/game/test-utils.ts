import { expect } from "vitest";
import type { Color, Value, Board, OptionalDice } from "./types";
import { NUM_ROWS, NUM_COLUMNS } from "./types";

const buildDice = (color: Color) => (value: Value) => ({ color, value });

export const R = buildDice("red");
export const G = buildDice("green");
export const B = buildDice("blue");
export const Y = buildDice("yellow");
export const P = buildDice("purple");

export function checkBoard(board: Board, expected: OptionalDice[][]) {
  for (let row = 0; row < NUM_ROWS; row++) {
    for (let column = 0; column < NUM_COLUMNS; column++) {
      const dice = board.at(row, column);
      const expectedDice = expected[row][column];
      expect(dice, `dice in row ${row + 1}, column ${column + 1}`).toEqual(
        expectedDice,
      );
    }
  }
}
