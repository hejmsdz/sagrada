import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import pl from "./pl.json";

const resources = {
  en,
  pl,
};

export const defaultLocale = "en";
const supportedLocalesArray = Object.keys(resources);
export const supportedLocales = new Set(
  supportedLocalesArray,
) as ReadonlySet<string>;

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: defaultLocale,
  supportedLngs: supportedLocalesArray,
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
