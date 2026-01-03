import { useState, useId } from "react";
import { BoardView } from "./board-view";
import { Board, type Mask, type OptionalDice } from "@/game/types";
import { useKeyboard } from "./use-keyboard";

export function ControlledInteractiveBoardView({
  board,
  mask,
  selectedCoordinates,
  onClick,
  onNavigate,
  onChange,
  customIsSelected,
  diceHtmlId: passedDiceHtmlId,
}: {
  board: Board;
  mask?: Mask;
  onClick: (rowIndex: number, columnIndex: number) => void;
  diceHtmlId?: string;
  customIsSelected?: boolean;
  selectedCoordinates: [number, number];
  onNavigate: (rowIndex: number, columnIndex: number) => void;
  onChange: (rowIndex: number, columnIndex: number, dice: OptionalDice) => void;
}) {
  const [isBoardFocused, setIsBoardFocused] = useState(false);

  const defaultDiceHtmlId = useId();
  const diceHtmlId = passedDiceHtmlId ?? defaultDiceHtmlId;

  const [selectedRowIndex, selectedColumnIndex] = selectedCoordinates;

  const handleButtonKeyDown = useKeyboard({
    getField: () => ({
      rowIndex: selectedRowIndex,
      columnIndex: selectedColumnIndex,
      dice: board.at(selectedRowIndex, selectedColumnIndex),
    }),
    onNavigate: (rowIndex, columnIndex) => {
      document
        .getElementById(`${diceHtmlId}-${rowIndex}-${columnIndex}`)
        ?.focus();
    },
    onChange,
    onEnter: () => onClick(selectedRowIndex, selectedColumnIndex),
  });

  return (
    <BoardView
      board={board}
      mask={mask}
      onFocus={() => setIsBoardFocused(true)}
      onBlur={() => setIsBoardFocused(false)}
      extraDiceProps={(rowIndex, columnIndex) => {
        const isSelected =
          selectedRowIndex === rowIndex && selectedColumnIndex === columnIndex;

        return {
          id: `${diceHtmlId}-${rowIndex}-${columnIndex}`,
          className:
            "rounded-lg cursor-pointer hover:brightness-90 focus:brightness-90 focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all size-full aria-selected:border-ring aria-selected:ring-ring/50 aria-selected:ring-[3px]",
          "aria-selected": isSelected && (isBoardFocused || customIsSelected),
          "aria-description": `row ${rowIndex + 1}, column ${columnIndex + 1},`,
          tabIndex: isSelected ? 0 : -1,
          onClick: () => {
            onNavigate(rowIndex, columnIndex);
            onClick(rowIndex, columnIndex);
          },
          onKeyDown: handleButtonKeyDown,
          onFocus: () => onNavigate(rowIndex, columnIndex),
        };
      }}
    />
  );
}
