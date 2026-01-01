import {
  colorDiagonals,
  colorVariety,
  columnColorVariety,
  columnShadeVariety,
  deepShades,
  lightShades,
  mediumShades,
  rowColorVariety,
  rowShadeVariety,
  shadeVariety,
} from "./scoring-rules";
import type { ScoringRule } from "./scoring-rules";

export type Goal = {
  scoringRule: ScoringRule;
  illustration: string;
};

export const publicObjectives = {
  diagonals: {
    scoringRule: colorDiagonals,
    illustration: "......b..yb.by...yb.",
  },
  colorVariety: {
    scoringRule: colorVariety,
    illustration: "y.b.r.g.p.",
  },
  columnColorVariety: {
    scoringRule: columnColorVariety,
    illustration: "..g....p....y....b..",
  },
  columnShadeVariety: {
    scoringRule: columnShadeVariety,
    illustration: "..3....1....4....2..",
  },
  lightShades: {
    scoringRule: lightShades,
    illustration: ".1.2.",
  },
  mediumShades: {
    scoringRule: mediumShades,
    illustration: ".3.4.",
  },
  deepShades: {
    scoringRule: deepShades,
    illustration: ".5.6.",
  },
  rowColorVariety: {
    scoringRule: rowColorVariety,
    illustration: "rygbp",
  },
  rowShadeVariety: {
    scoringRule: rowShadeVariety,
    illustration: "36124",
  },
  shadeVariety: {
    scoringRule: shadeVariety,
    illustration: "1.3.5.2.4...6..",
  },
} satisfies Record<string, Goal>;

export type PublicObjectiveName = keyof typeof publicObjectives;

export const publicObjectiveNames = Object.keys(
  publicObjectives,
) as PublicObjectiveName[];

export default publicObjectives;
