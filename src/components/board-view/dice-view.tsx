import type { OptionalDice } from "@/game/types";
import { COLOR_CLASSES_BG, COLOR_CLASSES_TEXT_CONTRAST } from "@/lib/colors";
import { useTranslation } from "react-i18next";

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

  if (!dice) {
    return (
      <div className={`${className} bg-muted`} {...props}>
        <span className="sr-only">{t("emptyField")}</span>
      </div>
    );
  }
  return (
    <div
      className={`${className} ${COLOR_CLASSES_BG[dice.color]} ${COLOR_CLASSES_TEXT_CONTRAST[dice.color]} flex items-center justify-center text-3xl`}
      {...props}
    >
      <span className="sr-only">
        {t("diceLabel", { color: dice.color, value: dice.value })}
      </span>
      <span aria-hidden="true">{dice.value}</span>
    </div>
  );
}
