import { useMemo } from "react";
import { useStore } from "./store";
import { calculateScore } from "@/game/calculate-score";
import { useTranslation } from "react-i18next";

export function usePlayerScore(playerId: number) {
  const { t } = useTranslation();
  const board = useStore((state) => state.players[playerId]?.board);
  const publicObjectives = useStore((state) => state.publicObjectives);
  const privateObjective = useStore(
    (state) => state.players[playerId]?.privateObjective,
  );
  const favorTokens = useStore(
    (state) => state.players[playerId]?.favorTokens ?? 0,
  );

  return useMemo(() => {
    if (!board || !publicObjectives || !privateObjective) {
      return null;
    }

    return calculateScore({
      board,
      publicObjectives,
      privateObjective,
      favorTokens,
      t,
    });
  }, [board, publicObjectives, privateObjective, favorTokens, t]);
}
