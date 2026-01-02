import { useCallback, useRef } from "react";
import {
  Board,
  COLORS,
  VALUES,
  type Color,
  type OptionalDice,
} from "@/game/types";

const keysToColors: Record<string, Color> = {
  b: "blue",
  g: "green",
  p: "purple",
  r: "red",
  y: "yellow",
};

type EventType = React.KeyboardEvent | KeyboardEvent;

export function useKeyboard({
  getField,
  onChange,
  onNavigate,
}: {
  getField: (
    event: EventType,
  ) => { rowIndex: number; columnIndex: number; dice: OptionalDice } | null;
  onChange: (
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
    changeType: "clear" | "color" | "value",
  ) => void;
  onNavigate: (rowIndex: number, columnIndex: number) => void;
}) {
  const lastNotNullDiceRef = useRef<OptionalDice>(null);
  const lastNotNullCoordinatesRef = useRef<[number, number] | null>(null);

  const handleKeyDown = useCallback(
    (event: EventType) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const field = getField(event);
      if (!field) {
        return;
      }
      const { rowIndex, columnIndex, dice } = field;

      const navigate = (rowIndex: number, columnIndex: number) => {
        if (Board.validCoordinates(rowIndex, columnIndex)) {
          onNavigate(rowIndex, columnIndex);
        }
      };

      const canUseLastNotNullDice =
        lastNotNullCoordinatesRef.current?.[0] === rowIndex &&
        lastNotNullCoordinatesRef.current?.[1] === columnIndex;
      const lastNotNullDice = canUseLastNotNullDice
        ? lastNotNullDiceRef.current
        : null;

      switch (event.key.toLowerCase()) {
        case "arrowup":
          navigate(rowIndex - 1, columnIndex);
          break;
        case "arrowdown":
          navigate(rowIndex + 1, columnIndex);
          break;
        case "arrowleft":
          navigate(rowIndex, columnIndex - 1);
          break;
        case "arrowright":
          navigate(rowIndex, columnIndex + 1);
          break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6": {
          const value = Number(event.key);
          onChange(
            rowIndex,
            columnIndex,
            {
              color: dice?.color ?? lastNotNullDice?.color ?? COLORS[0],
              value,
            },
            "value",
          );
          break;
        }

        case "b":
        case "g":
        case "p":
        case "r":
        case "y": {
          onChange(
            rowIndex,
            columnIndex,
            {
              color: keysToColors[event.key.toLowerCase()],
              value: dice?.value ?? lastNotNullDice?.value ?? VALUES[0],
            },
            "color",
          );
          break;
        }

        case "x":
        case "0":
          lastNotNullDiceRef.current = dice;
          lastNotNullCoordinatesRef.current = [rowIndex, columnIndex];

          onChange(rowIndex, columnIndex, null, "clear");
          break;

        default:
          return;
      }

      event.preventDefault();
    },
    [getField, onChange, onNavigate],
  );

  return handleKeyDown;
}
