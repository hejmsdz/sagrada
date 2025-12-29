import { createFileRoute } from "@tanstack/react-router";
import { Review } from "@/components/screens/review";

export const Route = createFileRoute("/player/$id/review")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <Review playerId={id} />;
}
