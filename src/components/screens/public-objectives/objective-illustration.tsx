import {
  SquareIcon,
  Dice1Icon,
  Dice2Icon,
  Dice3Icon,
  Dice4Icon,
  Dice5Icon,
  Dice6Icon,
} from "lucide-react";
import { type Color } from "@/game/types";
import { cn } from "@/lib/utils";
import { COLOR_CLASSES_TEXT } from "@/lib/colors";

const ICONS = [
  SquareIcon,
  Dice1Icon,
  Dice2Icon,
  Dice3Icon,
  Dice4Icon,
  Dice5Icon,
  Dice6Icon,
];

const SHADE_COLORS = [
  "text-transparent",
  "text-neutral-500",
  "text-neutral-600",
  "text-neutral-700",
  "text-neutral-800",
  "text-neutral-900",
];

const COLORS: Record<string, Color> = {
  b: "blue",
  g: "green",
  p: "purple",
  r: "red",
  y: "yellow",
};

export function ObjectiveIllustration({
  description,
}: {
  description: string;
}) {
  return (
    <div
      className="grid grid-cols-5 gap-1 mb-2 w-full aspect-5/4 bg-neutral-50 rounded-md p-2 content-center"
      role="presentation"
    >
      {description.split("").map((char, index) => {
        const isDigit = !isNaN(Number(char));
        const isColor = Boolean(COLORS[char]);
        const Component = isDigit
          ? ICONS[Number(char)]
          : isColor
            ? SquareIcon
            : "span";

        return (
          <span className="flex items-center justify-center">
            <Component
              className={cn(
                "fill-current",
                "[&_path]:stroke-white [&_path]:stroke-4 [&_path]:sm:stroke-3",
                "size-[5vw] sm:size-6 xl:size-8",
                isColor ? COLOR_CLASSES_TEXT[COLORS[char]] : "text-neutral",
                isDigit ? SHADE_COLORS[Number(char)] : "",
              )}
              key={index}
            />
          </span>
        );
      })}
    </div>
  );
}
