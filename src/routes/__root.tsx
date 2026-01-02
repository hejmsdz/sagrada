import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NotFound } from "@/components/screens/not-found";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = t("title", { ns: "home" });
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  return <Outlet />;
}
