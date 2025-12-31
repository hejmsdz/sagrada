import { createFileRoute } from "@tanstack/react-router";
import { Leaderboard } from "@/components/screens/leaderboard";

export const Route = createFileRoute("/leaderboard")({
  component: Leaderboard,
});
