import { createFileRoute } from "@tanstack/react-router";
import { PublicObjectives } from "@/components/screens/public-objectives";

export const Route = createFileRoute("/{-$locale}/objectives")({
  component: PublicObjectives,
});
