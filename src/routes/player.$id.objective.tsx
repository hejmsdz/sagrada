import { createFileRoute } from "@tanstack/react-router";
import { PrivateObjective } from "@/components/screens/private-objective";
import { EnsurePlayerHas } from "@/components/ensure-player-has";

export const Route = createFileRoute("/player/$id/objective")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <EnsurePlayerHas board playerId={id}>
      <PrivateObjective playerId={id} />
    </EnsurePlayerHas>
  );
}
