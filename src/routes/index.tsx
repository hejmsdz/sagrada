import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/screens/home";

export const Route = createFileRoute("/")({
  component: Home,
});
