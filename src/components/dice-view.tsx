import type { OptionalDice } from "@/game/types";
import { COLOR_CLASSES_BG } from "@/lib/colors";
import { useTranslation } from "react-i18next";

export function DiceView({
  className: customClassName = "",
  dice,
}: {
  className?: string;
  dice: OptionalDice;
}) {
  const { t } = useTranslation();
  const className = `${customClassName} aspect-square rounded-lg`;

  if (!dice) {
    return (
      <div
        className={`${className} bg-gray-300`}
        aria-label={t("emptyField")}
      />
    );
  }
  return (
    <div
      className={`${className} ${COLOR_CLASSES_BG[dice.color]} flex items-center justify-center text-3xl`}
      aria-label={t("diceLabel", { color: dice.color, value: dice.value })}
    >
      {dice.value}
    </div>
  );
}
