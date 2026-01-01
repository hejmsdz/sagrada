import { createFileRoute } from "@tanstack/react-router";
import { Review } from "@/components/screens/review";
import { EnsurePlayerHas } from "@/components/ensure-player-has";

interface ReviewSearch {
  manual?: boolean;
}

export const Route = createFileRoute("/player/$id/review")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): ReviewSearch => {
    return {
      manual: Boolean(search.manual),
    };
  },
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { manual } = Route.useSearch();

  return (
    <EnsurePlayerHas board playerId={id}>
      <Review playerId={id} isManual={manual ?? false} />
    </EnsurePlayerHas>
  );
}
