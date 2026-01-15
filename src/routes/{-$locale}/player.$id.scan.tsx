import { createFileRoute } from "@tanstack/react-router";
import { Scan } from "@/components/screens/scan";

export const Route = createFileRoute("/{-$locale}/player/$id/scan")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <Scan playerId={id} />;
}
