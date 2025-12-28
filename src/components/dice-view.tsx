import type { OptionalDice } from "@/game/types";

const COLOR_MAP = {
  blue: "bg-sky-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  yellow: "bg-yellow-300",
};

export function DiceView({
  className: customClassName = "",
  dice,
}: {
  className?: string;
  dice: OptionalDice;
}) {
  const className = `${customClassName} aspect-square rounded-lg`;

  if (!dice) {
    return <div className={`${className} bg-gray-500`}></div>;
  }
  return (
    <div
      className={`${className} ${COLOR_MAP[dice.color]} flex items-center justify-center text-3xl`}
    >
      {dice.value}
    </div>
  );
}
