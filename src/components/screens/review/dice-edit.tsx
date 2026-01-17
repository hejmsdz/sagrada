import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import type { Color, OptionalDice, Value } from "@/game/types";
import { COLORS, VALUES } from "@/game/types";
import { Dice5Icon, SquareIcon } from "lucide-react";
import { COLOR_CLASSES_TEXT } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useKeyboard } from "@/components/board-view/use-keyboard";
import { useSettingsStore } from "@/stores/settings";

export function DiceEdit({
  dice,
  rowIndex,
  columnIndex,
  onChange,
  onNavigate,
}: {
  dice: OptionalDice;
  rowIndex: number;
  columnIndex: number;
  onChange: (dice: OptionalDice) => void;
  onNavigate: (rowIndex: number, columnIndex: number) => void;
}) {
  const { t } = useTranslation();
  const buttonClasses = "flex-1 aria-checked:bg-primary/40 transition-all";
  const lastNotNullDiceRef = useRef<OptionalDice>(dice);
  const colorButtonRefs = useRef<
    Record<Color | "null", HTMLButtonElement | null>
  >({
    blue: null,
    green: null,
    purple: null,
    red: null,
    yellow: null,
    null: null,
  });
  const valueButtonRefs = useRef<Record<Value, HTMLButtonElement | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });

  useEffect(() => {
    if (dice !== null) {
      lastNotNullDiceRef.current = dice;
    }
  }, [dice]);

  const handleKeyDown = useKeyboard({
    getField: () => ({ dice, rowIndex, columnIndex }),
    onNavigate,
    onChange: (_i, _j, newDice, changeType) => {
      if (changeType === "clear" || !newDice) {
        colorButtonRefs.current.null?.focus();
      } else if (changeType === "color") {
        colorButtonRefs.current[newDice?.color]?.focus();
      } else if (changeType === "value") {
        valueButtonRefs.current[newDice?.value]?.focus();
      }
      onChange(newDice);
    },
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    colorButtonRefs.current[dice?.color ?? "null"]?.focus();
  }, [rowIndex, columnIndex]);

  const isColorBlindMode = useSettingsStore((store) => store.colorBlindMode);

  return (
    <div className="flex flex-col gap-2">
      <ButtonGroup
        className="w-full"
        role="radiogroup"
        aria-label={t("selectColor")}
      >
        {COLORS.map((color) => (
          <Button
            key={color}
            ref={(el) => {
              colorButtonRefs.current[color] = el;
            }}
            variant="outline"
            className={cn(buttonClasses, "relative")}
            role="radio"
            aria-checked={dice?.color === color}
            aria-keyshortcuts={color.toUpperCase().slice(0, 1)}
            aria-label={t(color, { ns: "colors" })}
            onClick={() =>
              onChange({
                color,
                value:
                  dice?.value ?? lastNotNullDiceRef.current?.value ?? VALUES[0],
              })
            }
          >
            {isColorBlindMode ? (
              <>
                <span>{color.toUpperCase().slice(0, 1)}</span>
                <SquareIcon
                  className={cn("absolute size-7", COLOR_CLASSES_TEXT[color])}
                />
              </>
            ) : (
              <Dice5Icon
                className={cn(
                  COLOR_CLASSES_TEXT[color],
                  "fill-current [&_path]:stroke-white [&_path]:stroke-3",
                )}
              />
            )}
          </Button>
        ))}
        <Button
          ref={(el) => {
            colorButtonRefs.current.null = el;
          }}
          variant="outline"
          className={buttonClasses}
          role="radio"
          aria-checked={!dice}
          aria-keyshortcuts="x 0"
          onClick={() => onChange(null)}
        >
          <SquareIcon aria-label={t("emptyField")} />
        </Button>
      </ButtonGroup>
      <ButtonGroup
        className="w-full"
        role="radiogroup"
        aria-label={t("selectValue")}
      >
        {VALUES.map((value) => (
          <Button
            key={value}
            ref={(el) => {
              valueButtonRefs.current[value] = el;
            }}
            role="radio"
            variant="outline"
            className={buttonClasses}
            aria-checked={dice?.value === value}
            aria-keyshortcuts={value.toString()}
            onClick={() =>
              onChange({
                color:
                  dice?.color ?? lastNotNullDiceRef.current?.color ?? COLORS[0],
                value,
              })
            }
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
