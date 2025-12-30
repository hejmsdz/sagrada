import { createFileRoute } from "@tanstack/react-router";
import { PrivateObjective } from "@/components/screens/private-objective";

export const Route = createFileRoute("/player/$id/objective")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <PrivateObjective playerId={id} />;
}
