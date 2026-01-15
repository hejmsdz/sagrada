import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
