import { createFileRoute } from "@tanstack/react-router";
import { FavorTokens } from "@/components/screens/favor-tokens";
import { EnsurePlayerHas } from "@/components/ensure-player-has";

export const Route = createFileRoute("/{-$locale}/player/$id/tokens")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <EnsurePlayerHas board privateObjective playerId={id}>
      <FavorTokens playerId={id} />
    </EnsurePlayerHas>
  );
}
