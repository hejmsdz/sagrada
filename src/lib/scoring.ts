import { useMemo } from "react";
import { useGameStore } from "@/stores/game";
import {
  calculateScore,
  calculateLeaderboard,
  type LeaderboardEntry,
} from "@/game/calculate-score";
import { useTranslation } from "react-i18next";

export function usePlayerScore(playerId: number) {
  const { t } = useTranslation();
  const board = useGameStore((state) => state.players[playerId]?.board);
  const publicObjectives = useGameStore((state) => state.publicObjectives);
  const privateObjective = useGameStore(
    (state) => state.players[playerId]?.privateObjective,
  );
  const favorTokens = useGameStore(
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
  const players = useGameStore((state) => state.players);
  const publicObjectives = useGameStore((state) => state.publicObjectives);

  return useMemo(
    () => calculateLeaderboard({ players, publicObjectives, t }),
    [players, publicObjectives, t],
  );
}
