import { Score } from "@/components/screens/score";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/player/$id/score")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <Score playerId={id} />;
}
