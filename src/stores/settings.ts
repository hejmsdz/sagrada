import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "system" | "light" | "dark";

type Settings = {
  defaultLocale?: string;
  setDefaultLocale: (locale: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      defaultLocale: undefined,
      setDefaultLocale: (value) => set({ defaultLocale: value }),
      theme: "system",
      setTheme: (value) => set({ theme: value }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
