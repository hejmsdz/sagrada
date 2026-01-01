import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import pl from "./pl.json";

const resources = {
  en,
  pl,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
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
