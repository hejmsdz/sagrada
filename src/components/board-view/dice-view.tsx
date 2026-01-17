import type { Color, OptionalDice } from "@/game/types";
import { COLOR_CLASSES_BG, COLOR_CLASSES_TEXT_CONTRAST } from "@/lib/colors";
import { useSettingsStore } from "@/stores/settings";
import { useTranslation } from "react-i18next";
import { Pattern } from "./pattern";

export function DiceView({
  className: customClassName = "",
  dice,
  ...rest
}: {
  className?: string;
  dice: OptionalDice;
} & React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const className = `${customClassName} aspect-square rounded-lg aria-disabled:opacity-20`;
  const props: React.ComponentProps<"div"> = {
    ...rest,
    "aria-live": "assertive",
  };

  const isColorBlindMode = useSettingsStore((store) => store.colorBlindMode);

  if (!dice) {
    return (
      <div className={`${className} bg-muted`} {...props}>
        <span className="sr-only">{t("emptyField")}</span>
      </div>
    );
  }

  return (
    <div
      className={`${className} ${COLOR_CLASSES_BG[dice.color]} ${COLOR_CLASSES_TEXT_CONTRAST[dice.color]} flex items-center justify-center text-3xl relative overflow-hidden`}
      {...props}
    >
      <span className="sr-only">
        {t("diceLabel", { color: dice.color, value: dice.value })}
      </span>
      {isColorBlindMode && (
        <>
          <span
            aria-hidden="true"
            className="text-xs absolute top-0 left-0 py-1 w-7 text-center font-bold bg-black/30 text-white rounded-tl-lg rounded-br-lg"
          >
            {dice.color.toUpperCase().slice(0, 1)}
          </span>
          <Pattern color={dice.color} />
        </>
      )}
      <span aria-hidden="true">{dice.value}</span>
    </div>
  );
}
