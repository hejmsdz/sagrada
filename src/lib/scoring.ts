import { useMemo } from "react";
import { useStore } from "./store";
import {
  calculateScore,
  calculateLeaderboard,
  type LeaderboardEntry,
} from "@/game/calculate-score";
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

export function useLeaderboard(): LeaderboardEntry[] {
  const { t } = useTranslation();
  const players = useStore((state) => state.players);
  const publicObjectives = useStore((state) => state.publicObjectives);

  return useMemo(
    () => calculateLeaderboard({ players, publicObjectives, t }),
    [players, publicObjectives, t],
  );
}
