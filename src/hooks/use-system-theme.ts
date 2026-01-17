import { useSyncExternalStore } from "react";

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const subscribe = (callback: () => void) => {
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
};

const getSnapshot = () => mediaQuery.matches;

export function useSystemTheme() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot);

  return isDark ? "dark" : "light";
}
