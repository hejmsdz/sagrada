import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { publicObjectives: "Public objectives" } },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
