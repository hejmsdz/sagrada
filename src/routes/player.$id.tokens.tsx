import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/player/$id/tokens")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/player/$id/tokens"!</div>;
}
