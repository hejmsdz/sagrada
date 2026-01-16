import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Leaderboard } from "@/components/screens/leaderboard";
import { useGameStore } from "@/stores/game";

export const Route = createFileRoute("/{-$locale}/leaderboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const players = useGameStore((state) => state.players);
  if (players.length < 2) {
    return <Navigate to="/{-$locale}/objectives" replace />;
  }

  return <Leaderboard />;
}
