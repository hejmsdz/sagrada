import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { REQUIRED_PUBLIC_OBJECTIVES, useGameStore } from "@/stores/game";

export const Route = createFileRoute("/{-$locale}/player/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const player = useGameStore((state) => state.players[Number(id)]);
  const publicObjectives = useGameStore((state) => state.publicObjectives);

  if (!player || publicObjectives.length !== REQUIRED_PUBLIC_OBJECTIVES) {
    return <Navigate to="/{-$locale}/objectives" replace />;
  }

  return <Outlet />;
}
