import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Leaderboard } from "@/components/screens/leaderboard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/leaderboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const players = useStore((state) => state.players);
  if (players.length < 2) {
    return <Navigate to="/objectives" replace />;
  }

  return <Leaderboard />;
}
