import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Settings = {
  defaultLocale?: string;
  setDefaultLocale: (locale: string) => void;
};

export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      defaultLocale: undefined,
      setDefaultLocale: (value) => set({ defaultLocale: value }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
