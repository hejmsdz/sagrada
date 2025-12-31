import { useStore } from "@/lib/store";
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
  const player = useStore((state) => state.players[Number(playerId)]);

  if (!player) {
    return <Navigate to="/objectives" replace />;
  }

  if (isBoardRequired && !player?.board) {
    return <Navigate to="/player/$id/scan" params={{ id: playerId }} replace />;
  }

  if (isPrivateObjectiveRequired && !player?.privateObjective) {
    return (
      <Navigate to="/player/$id/objective" params={{ id: playerId }} replace />
    );
  }

  return children;
}
