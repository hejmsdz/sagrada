import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t("title", { ns: "home" });
  }, [t]);

  return <Outlet />;
}
