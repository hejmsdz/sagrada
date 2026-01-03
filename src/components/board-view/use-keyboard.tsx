import { useCallback, useRef } from "react";
import {
  Board,
  COLORS,
  VALUES,
  type Color,
  type OptionalDice,
  type Value,
} from "@/game/types";

const keysToColors: Record<string, Color> = {
  b: "blue",
  g: "green",
  p: "purple",
  r: "red",
  y: "yellow",
};

const keysToValues: Record<string, Value> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
};

type EventType = React.KeyboardEvent | KeyboardEvent;

export function useKeyboard({
  getField,
  onChange,
  onNavigate,
  onEnter,
}: {
  getField: (
    event: EventType,
  ) => { rowIndex: number; columnIndex: number; dice: OptionalDice } | null;
  onChange?: (
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
    changeType: "clear" | "color" | "value",
  ) => void;
  onNavigate?: (rowIndex: number, columnIndex: number) => void;
  onEnter?: (rowIndex: number, columnIndex: number) => void;
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

      const canUseLastNotNullDice =
        lastNotNullCoordinatesRef.current?.[0] === rowIndex &&
        lastNotNullCoordinatesRef.current?.[1] === columnIndex;
      const lastNotNullDice = canUseLastNotNullDice
        ? lastNotNullDiceRef.current
        : null;

      const key = event.key.toLowerCase();

      if (onNavigate && key.startsWith("arrow")) {
        const navigate = (rowIndex: number, columnIndex: number) => {
          event.preventDefault();
          if (Board.validCoordinates(rowIndex, columnIndex)) {
            onNavigate?.(rowIndex, columnIndex);
          }
        };

        if (key === "arrowup") {
          navigate(rowIndex - 1, columnIndex);
        } else if (key === "arrowdown") {
          navigate(rowIndex + 1, columnIndex);
        } else if (key === "arrowleft") {
          navigate(rowIndex, columnIndex - 1);
        } else if (key === "arrowright") {
          navigate(rowIndex, columnIndex + 1);
        }
      } else if (key === "enter" && onEnter) {
        onEnter(rowIndex, columnIndex);
        event.preventDefault();
      } else if (onChange && keysToColors[key]) {
        event.preventDefault();
        onChange(
          rowIndex,
          columnIndex,
          {
            color: keysToColors[event.key.toLowerCase()],
            value: dice?.value ?? lastNotNullDice?.value ?? VALUES[0],
          },
          "color",
        );
      } else if (onChange && keysToValues[key]) {
        event.preventDefault();
        onChange(
          rowIndex,
          columnIndex,
          {
            color: dice?.color ?? lastNotNullDice?.color ?? COLORS[0],
            value: keysToValues[key],
          },
          "value",
        );
      } else if (onChange && (key === "x" || key === "0")) {
        event.preventDefault();
        onChange(rowIndex, columnIndex, null, "clear");
      }
    },
    [getField, onChange, onNavigate, onEnter],
  );

  return handleKeyDown;
}
