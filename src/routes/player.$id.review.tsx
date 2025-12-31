import { createFileRoute } from "@tanstack/react-router";
import { Review } from "@/components/screens/review";
import { EnsurePlayerHas } from "@/components/ensure-player-has";

export const Route = createFileRoute("/player/$id/review")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <EnsurePlayerHas board playerId={id}>
      <Review playerId={id} />
    </EnsurePlayerHas>
  );
}
