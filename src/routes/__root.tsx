import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";
import { useSystemTheme } from "@/hooks/use-system-theme";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [t, i18n.language]);

  const theme = useSettingsStore((store) => store.theme);
  const systemTheme = useSystemTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, [currentTheme]);

  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
