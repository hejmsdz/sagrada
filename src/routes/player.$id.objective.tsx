import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/player/$id/objective")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/player/$id/objective"!</div>;
}
