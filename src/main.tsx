import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import "./lib/sentry.ts";
import "./i18n/i18n.ts";
import "./index.css";
import { LoadingScreen } from "./components/screens/loading";
import { NotFound } from "./components/screens/not-found";

const router = createRouter({
  routeTree,
  defaultPendingComponent: LoadingScreen,
  defaultErrorComponent: ErrorComponent,
  defaultNotFoundComponent: NotFound,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
