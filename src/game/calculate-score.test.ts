import { describe, expect, it } from "vitest";
import { calculateScore } from "./calculate-score";
import { Board } from "./types";
import { R, G, B, Y, P } from "./test-utils";

describe("calculateScore", () => {
  it("should calculate the score for an example from the rulebook", () => {
    const board = new Board([
      [null, G(4), R(2), Y(5), P(6)],
      [R(3), B(1), null, G(1), Y(2)],
      [P(5), G(6), null, P(6), R(3)],
      [B(4), Y(3), G(4), B(2), G(4)],
    ]);

    const score = calculateScore({
      board,
      publicObjectives: ["columnColorVariety", "lightShades", "colorVariety"],
      privateObjective: "purple",
      favorTokens: 0,
      // @ts-expect-error - actual type is more complex
      t: (key: string) => key,
    });

    expect(score.total).toEqual(40);
    expect(score.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "columnColorVariety.name",
          score: 10,
        }),
        expect.objectContaining({
          name: "lightShades.name",
          score: 4,
        }),
        expect.objectContaining({
          name: "colorVariety.name",
          score: 12,
        }),
        expect.objectContaining({
          name: "privateObjective",
          score: 17,
        }),
        expect.objectContaining({
          name: "blankPenalty",
          score: -3,
        }),
      ]),
    );
  });
});
