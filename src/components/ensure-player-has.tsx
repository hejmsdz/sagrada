import { useGameStore } from "@/stores/game";
import { Navigate } from "@tanstack/react-router";

export function EnsurePlayerHas({
  playerId,
  children,
  board: isBoardRequired,
  privateObjective: isPrivateObjectiveRequired,
}: {
  playerId: string;
  children: React.ReactNode;
  board?: boolean;
  privateObjective?: boolean;
}) {
  const player = useGameStore((state) => state.players[Number(playerId)]);

  if (!player) {
    return <Navigate to="/{-$locale}/objectives" replace />;
  }

  if (isBoardRequired && !player?.board) {
    return (
      <Navigate
        to="/{-$locale}/player/$id/scan"
        params={{ id: playerId }}
        replace
      />
    );
  }

  if (isPrivateObjectiveRequired && !player?.privateObjective) {
    return (
      <Navigate
        to="/{-$locale}/player/$id/objective"
        params={{ id: playerId }}
        replace
      />
    );
  }

  return children;
}
