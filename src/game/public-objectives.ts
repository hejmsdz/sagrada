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
};

export const publicObjectives = {
  diagonals: {
    scoringRule: colorDiagonals,
  },
  colorVariety: {
    scoringRule: colorVariety,
  },
  columnColorVariety: {
    scoringRule: columnColorVariety,
  },
  columnShadeVariety: {
    scoringRule: columnShadeVariety,
  },
  lightShades: {
    scoringRule: lightShades,
  },
  mediumShades: {
    scoringRule: mediumShades,
  },
  deepShades: {
    scoringRule: deepShades,
  },
  rowColorVariety: {
    scoringRule: rowColorVariety,
  },
  rowShadeVariety: {
    scoringRule: rowShadeVariety,
  },
  shadeVariety: {
    scoringRule: shadeVariety,
  },
} satisfies Record<string, Goal>;

export type PublicObjectiveName = keyof typeof publicObjectives;

export const publicObjectiveNames = Object.keys(
  publicObjectives,
) as PublicObjectiveName[];

export default publicObjectives;
