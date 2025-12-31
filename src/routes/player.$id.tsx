import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { REQUIRED_PUBLIC_OBJECTIVES, useStore } from "@/lib/store";

export const Route = createFileRoute("/player/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const player = useStore((state) => state.players[Number(id)]);
  const publicObjectives = useStore((state) => state.publicObjectives);

  if (!player || publicObjectives.length !== REQUIRED_PUBLIC_OBJECTIVES) {
    return <Navigate to="/objectives" replace />;
  }

  return <Outlet />;
}
