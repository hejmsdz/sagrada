import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import type { Color, OptionalDice, Value } from "@/game/types";
import { COLORS, VALUES } from "@/game/types";
import { Dice5Icon, SquareIcon } from "lucide-react";
import { COLOR_CLASSES_TEXT } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const keysToColors: Record<string, Color> = {
  b: "blue",
  g: "green",
  p: "purple",
  r: "red",
  y: "yellow",
};

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
  const buttonClasses = "flex-1 aria-checked:bg-primary/40";
  const lastValueRef = useRef<Value | null>(dice?.value ?? null);
  const lastColorRef = useRef<Color | null>(dice?.color ?? null);
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
    if (dice) {
      lastValueRef.current = dice.value;
      lastColorRef.current = dice.color;
    }
  }, [dice]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6": {
          const value = Number(event.key);
          onChange({
            color: dice?.color ?? lastColorRef.current ?? COLORS[0],
            value,
          });
          valueButtonRefs.current[value]?.focus();
          break;
        }
        case "b":
        case "g":
        case "p":
        case "r":
        case "y":
          onChange({
            color: keysToColors[event.key.toLowerCase()],
            value: dice?.value ?? lastValueRef.current ?? VALUES[0],
          });
          colorButtonRefs.current[
            keysToColors[event.key.toLowerCase()]
          ]?.focus();
          break;
        case "x":
        case "0":
          onChange(null);
          colorButtonRefs.current.null?.focus();
          break;
        case "arrowup":
          onNavigate(rowIndex - 1, columnIndex);
          break;
        case "arrowdown":
          onNavigate(rowIndex + 1, columnIndex);
          break;
        case "arrowleft":
          onNavigate(rowIndex, columnIndex - 1);
          break;
        case "arrowright":
          onNavigate(rowIndex, columnIndex + 1);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onChange, dice, rowIndex, columnIndex]);

  useEffect(() => {
    colorButtonRefs.current[dice?.color ?? "null"]?.focus();
  }, []);

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
            className={buttonClasses}
            role="radio"
            aria-checked={dice?.color === color}
            aria-keyshortcuts={color.toUpperCase().slice(0, 1)}
            aria-label={t(color, { ns: "colors" })}
            onClick={() =>
              onChange({
                color,
                value: dice?.value ?? lastValueRef.current ?? VALUES[0],
              })
            }
          >
            <Dice5Icon
              className={cn(
                COLOR_CLASSES_TEXT[color],
                "fill-current [&_path]:stroke-white [&_path]:stroke-3",
              )}
            />
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
                color: dice?.color ?? lastColorRef.current ?? COLORS[0],
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
