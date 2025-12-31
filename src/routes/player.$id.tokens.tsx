import { createFileRoute } from "@tanstack/react-router";
import { FavorTokens } from "@/components/screens/favor-tokens";

export const Route = createFileRoute("/player/$id/tokens")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <FavorTokens playerId={id} />;
}
