import { createFileRoute } from "@tanstack/react-router";
import { PlacementRulesCheck } from "@/components/screens/placement-rules-check";

export const Route = createFileRoute("/player/$id/rules")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <PlacementRulesCheck playerId={id} />;
}
