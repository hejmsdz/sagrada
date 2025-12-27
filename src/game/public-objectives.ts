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
  name: string;
  description: string;
  scoringRule: ScoringRule;
  // image: string;
};

export default [
  {
    name: "Diagonals",
    description: "2 or more pieces of the same color",
    scoringRule: colorDiagonals,
  },
  {
    name: "ColorVariety",
    description: "Sets of one each color everywhere",
    scoringRule: colorVariety,
  },
  {
    name: "ColumnColorVariety",
    description: "Columns with no repeated colors",
    scoringRule: columnColorVariety,
  },
  {
    name: "ColumnShadeVariety",
    description: "Columns with no repeated values",
    scoringRule: columnShadeVariety,
  },
  {
    name: "DeepShades",
    description: "Sets of 5 & 6 values anywhere",
    scoringRule: deepShades,
  },
  {
    name: "LightShades",
    description: "Sets of 1 & 2 values anywhere",
    scoringRule: lightShades,
  },
  {
    name: "MediumShades",
    description: "Sets of 3 & 4 values anywhere",
    scoringRule: mediumShades,
  },
  {
    name: "RowColorVariety",
    description: "Rows with no repeated colors",
    scoringRule: rowColorVariety,
  },
  {
    name: "RowShadeVariety",
    description: "Rows with no repeated values",
    scoringRule: rowShadeVariety,
  },
  {
    name: "ShadeVariety",
    description: "Sets of 1 of each shade",
    scoringRule: shadeVariety,
  },
] satisfies Goal[];
