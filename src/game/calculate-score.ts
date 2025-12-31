import type { Board, Color } from "./types";
import {
  publicObjectives as availablePublicObjectives,
  type PublicObjectiveName,
} from "./public-objectives";
import {
  blankPenalty,
  sumColorFactory,
  type ScoringRule,
  type ScoringResult,
} from "./scoring-rules";
import type { TFunction } from "i18next";

const favorTokensScoringRule =
  (favorTokens: number): ScoringRule =>
  (board) => {
    return {
      score: favorTokens,
      calculation: "",
      mask: board.createMask(() => true),
    };
  };

type NamedScoringResult = ScoringResult & {
  name: string;
};

export function calculateScore({
  board,
  publicObjectives,
  privateObjective,
  favorTokens,
  t,
}: {
  board: Board;
  publicObjectives: PublicObjectiveName[];
  privateObjective: Color;
  favorTokens: number;
  t: TFunction<"translation">;
}) {
  const rules: { name: string; rule: ScoringRule }[] = [
    {
      name: t("blankPenalty", { ns: "scoringRules" }),
      rule: blankPenalty,
    },
    {
      name: t("privateObjective", {
        color: privateObjective.toString(),
        ns: "scoringRules",
      }),
      rule: sumColorFactory(privateObjective),
    },
    ...publicObjectives.map((objective) => ({
      name: t(`${objective}.name`, { ns: "publicObjectives" }),
      rule: availablePublicObjectives[objective].scoringRule,
    })),
    {
      name: t("favorTokens", { ns: "scoringRules" }),
      rule: favorTokensScoringRule(favorTokens),
    },
  ];

  const results: NamedScoringResult[] = rules
    .map(({ name, rule }) => ({
      name,
      ...rule(board),
    }))
    .filter((result) => result.score !== 0);

  const total = results.reduce((sum, result) => sum + result.score, 0);

  return {
    results,
    total,
  };
}
