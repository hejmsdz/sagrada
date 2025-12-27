import { describe, expect, it } from "vitest";
import type { Dice, Color, Value } from "./types";
import { Board } from "./types";
import { blankPenalty, sumColorFactory } from "./scoring-rules";

const buildDice =
  (color: Color) =>
  (value: Value): Dice => ({ color, value });

const R = buildDice("red");
const G = buildDice("green");
const B = buildDice("blue");
const Y = buildDice("yellow");
const P = buildDice("purple");

describe("scoring rules", () => {
  const board = new Board([
    [G(6), P(5), B(1), R(6), Y(5)],
    [Y(5), R(6), P(5), B(2), G(1)],
    [R(4), null, Y(1), P(6), null],
    [Y(6), R(2), B(5), null, Y(3)],
  ]);

  describe("blank penalty", () => {
    it("should return the correct score for a given board", () => {
      const scoring = blankPenalty(board);
      expect(scoring.score).toBe(-3);
      expect(scoring.calculation).toBe("3 × (-1)");
      expect(scoring.mask).toEqual([
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, true, false, false, true],
        [false, false, false, true, false],
      ]);
    });
  });

  describe("sum color", () => {
    it.each([
      ["red", 18],
      ["green", 7],
      ["blue", 8],
      ["yellow", 20],
      ["purple", 16],
    ] as [Color, number][])(
      "should return the correct %s score for a given board",
      (color, expectedScore) => {
        const scoring = sumColorFactory(color)(board);
        expect(scoring.score).toBe(expectedScore);
      },
    );
  });
});
