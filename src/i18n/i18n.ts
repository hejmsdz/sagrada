import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";

const resources = {
  en,
  pl,
};

export type SupportedLocale = keyof typeof resources;
export const defaultLocale = "en";
export const supportedLocales = Object.keys(resources) as SupportedLocale[];
export const supportedLocalesSet = new Set(
  supportedLocales,
) as ReadonlySet<string>;

export const supportedLocalesNames = {
  en: "English",
  pl: "Polski",
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: defaultLocale,
  supportedLngs: supportedLocales,
  interpolation: {
    escapeValue: false,
    format: (value, format) => {
      if (format === "lowercase") {
        return value.toLowerCase();
      }
      return value;
    },
  },
});

export default i18n;
