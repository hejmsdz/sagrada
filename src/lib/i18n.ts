import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      selectPublicObjectives: "Select public objectives",
      back: "Back",
      objectivesSelectionMessage: "Select {{count}} objectives to continue",
      scanYourWindowFrame: "Scan your window frame",
      cameraPreview: "Camera preview",
      startScanning: "Start scanning",
      capture: "Capture",
      enterManually: "Enter manually",
      photoFramingTip:
        "Place your camera directly above the board and align the photo so that each die fits between the grid lines.",
      reviewScanningResults: "Review your board",
      enterBoardManually: "Enter your board",
      emptyField: "Empty field",
      diceLabel: "$t(colors:{{color}}) dice with number {{value}}",
      editDice: "Edit dice in row {{row}} and column {{column}}",
      selectColor: "Select color",
      selectValue: "Select value",
      scanAgain: "Scan again",
      backToScanning: "Back to scanning",
      continue: "Continue",
      boardReviewTip: "If any dice was misidentified, click it to correct it.",
      boardManualEntryTip:
        "Click on a field to set the color and value of the dice.",
      keyboardEntryTip:
        "You can navigate using the arrow keys on your keyboard, select values with numeric keys (1-6) and colors with the letters B, G, P, R, Y. To clear a field, press X or 0.",
      placementRulesCheck: "Placement rules check",
      placementRulesCheckInfo:
        "Some dice are placed incorrectly and have to be removed from the board. Click on a dice to remove it.",
      placementRulesCheckInfoAdditional:
        "Note: if this is a scanning mistake, go back and correct it.",
      placementRulesSatisfied:
        "Well done! All dice placement rules are now satisfied.",
      selectPrivateObjective: "Select your private objective",
      favorTokens: "Favor tokens",
      favorTokensDescription:
        "How many favor tokens did you keep until the end of the game?",
      increment: "Increase by 1",
      decrement: "Reduce by 1",
      calculateScore: "Calculate score",
      scoring: "Scoring",
      total: "Total",
      checkAnotherBoard: "Check another board",
      leaderboard: "Leaderboard",
      whoseScoreWasThis: "Whose score was this?",
      enterPlayerName:
        "Enter the name of the player whose scoring we've just calculated in order to include them in a leaderboard.",
      ok: "OK",
      playerName: "Name",
      defaultPlayerName: "Player {{number}}",
      newGame: "New game",
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
    scoringRules: {
      blankPenalty: "Penalty for blank spaces",
      privateObjective: "Private objective ($t(colors:{{color}}, lowercase))",
      favorTokens: "Favor tokens left",
    },
    colors: {
      blue: "Blue",
      green: "Green",
      purple: "Purple",
      red: "Red",
      yellow: "Yellow",
    },
    home: {
      title: "Sagrada Scoring Assistant",
      description:
        "Welcome! This app makes scoring your <1>Sagrada</1> game quick and easy.",
      howDoesItWork: "How does it work?",
      features: {
        scan: {
          title: "Scan your window frame",
          description:
            "As soon as you point the camera at your board, all dice will be identified automatically.",
        },
        review: {
          title: "Review and edit",
          description:
            "Verify scanned results and adjust any dice manually, if needed. The app will make sure that all placement rules are satisfied.",
        },
        score: {
          title: "Automatic score calculation",
          description:
            "Instantly calculate scores for all public and private objectives, as well as favor tokens.",
        },
        leaderboard: {
          title: "Leaderboard",
          description:
            "Track scores for multiple players and crown the winner!",
        },
      },
      getStarted: "Get started",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
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
