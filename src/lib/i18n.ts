import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      selectPublicObjectives: "Select public objectives",
      next: "Next",
      objectivesSelectionMessage: "Select 3 objectives to continue",
      scanYourWindowFrame: "Scan your window frame",
      startScanning: "Start scanning",
      capture: "Capture",
      enterManually: "Enter manually",
      photoFramingTip:
        "Place your camera directly above the board and align the photo so that each die fits between the grid lines.",
      reviewScanningResults: "Review your board",
      scanAgain: "Scan again",
      continue: "Continue",
      boardReviewTip: "If any dice was misidentified, click it to correct it.",
      selectPrivateObjective: "Select your private objective",
    },
    publicObjectives: {
      diagonals: {
        name: "Diagonals",
        description: "2 or more pieces of the same color",
      },
      colorVariety: {
        name: "Color variety",
        description: "Sets of 1 of each color anywhere",
      },
      columnColorVariety: {
        name: "Column color variety",
        description: "Columns with no repeated colors",
      },
      columnShadeVariety: {
        name: "Column shade variety",
        description: "Columns with no repeated values",
      },
      lightShades: {
        name: "Light shades",
        description: "Sets of 1 & 2 values anywhere",
      },
      mediumShades: {
        name: "Medium shades",
        description: "Sets of 3 & 4 values anywhere",
      },
      deepShades: {
        name: "Deep shades",
        description: "Sets of 5 & 6 values anywhere",
      },
      rowColorVariety: {
        name: "Row color variety",
        description: "Rows with no repeated colors",
      },
      rowShadeVariety: {
        name: "Row shade variety",
        description: "Rows with no repeated values",
      },
      shadeVariety: {
        name: "Shade variety",
        description: "Sets of 1 of each shade",
      },
    },
    colors: {
      blue: "Blue",
      green: "Green",
      purple: "Purple",
      red: "Red",
      yellow: "Yellow",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
