import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Leaderboard } from "@/components/screens/leaderboard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/{-$locale}/leaderboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const players = useStore((state) => state.players);
  if (players.length < 2) {
    return <Navigate to="/{-$locale}/objectives" replace />;
  }

  return <Leaderboard />;
}
