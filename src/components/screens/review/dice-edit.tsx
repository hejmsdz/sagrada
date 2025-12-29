import {
  ButtonGroup,
  // ButtonGroupSeparator,
  // ButtonGroupText,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import type { OptionalDice, Value } from "@/game/types";
import { COLORS, VALUES } from "@/game/types";
import { Dice5Icon, SquareIcon } from "lucide-react";
import { COLOR_CLASSES_TEXT } from "@/lib/colors";

export function DiceEdit({
  dice,
  onChange,
}: {
  dice: OptionalDice;
  onChange: (dice: OptionalDice) => void;
}) {
  const buttonClasses = "flex-1 aria-checked:bg-primary/40";
  const lastValueRef = useRef<Value | null>(dice?.value ?? null);

  useEffect(() => {
    if (dice) {
      lastValueRef.current = dice.value;
    }
  }, [dice]);

  return (
    <div className="flex flex-col gap-2">
      <ButtonGroup className="w-full" role="radiogroup">
        {COLORS.map((color) => (
          <Button
            key={color}
            variant="outline"
            className={buttonClasses}
            role="radio"
            aria-checked={dice?.color === color}
            onClick={() =>
              onChange({
                color,
                value: dice?.value ?? lastValueRef.current ?? VALUES[0],
              })
            }
          >
            <Dice5Icon
              className={COLOR_CLASSES_TEXT[color]}
              aria-label={color} /* TODO: i18n */
            />
          </Button>
        ))}
        <Button
          variant="outline"
          className={buttonClasses}
          role="radio"
          aria-checked={!dice}
          onClick={() => onChange(null)}
        >
          <SquareIcon aria-label="Empty field" />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="w-full">
        {VALUES.map((value) => (
          <Button
            key={value}
            variant="outline"
            className={buttonClasses}
            aria-checked={dice?.value === value}
            disabled={!dice}
            onClick={() => onChange({ color: dice?.color ?? COLORS[0], value })}
          >
            {value}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
}
