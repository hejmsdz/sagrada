import { createFileRoute } from "@tanstack/react-router";
import { PlacementRulesCheck } from "@/components/screens/placement-rules-check";
import { EnsurePlayerHas } from "@/components/ensure-player-has";

export const Route = createFileRoute("/player/$id/rules")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <EnsurePlayerHas board playerId={id}>
      <PlacementRulesCheck playerId={id} />
    </EnsurePlayerHas>
  );
}
