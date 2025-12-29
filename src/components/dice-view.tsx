import type { OptionalDice } from "@/game/types";
import { COLOR_CLASSES_BG } from "@/lib/colors";

export function DiceView({
  className: customClassName = "",
  dice,
}: {
  className?: string;
  dice: OptionalDice;
}) {
  const className = `${customClassName} aspect-square rounded-lg`;

  if (!dice) {
    return <div className={`${className} bg-gray-300`}></div>;
  }
  return (
    <div
      className={`${className} ${COLOR_CLASSES_BG[dice.color]} flex items-center justify-center text-3xl`}
    >
      {dice.value}
    </div>
  );
}
