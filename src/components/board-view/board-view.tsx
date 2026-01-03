import React from "react";
import { NUM_ROWS, NUM_COLUMNS } from "@/game/types";
import type { Board, Mask, OptionalDice } from "@/game/types";
import { DiceView } from "./dice-view";

const ROWS = Array.from({ length: NUM_ROWS }, (_, rowIndex) => rowIndex);
const COLUMNS = Array.from(
  { length: NUM_COLUMNS },
  (_, columnIndex) => columnIndex,
);

export function BoardView({
  board,
  mask,
  extraDiceProps,
  ...rest
}: {
  board: Board;
  mask?: Mask;
  extraDiceProps?: (
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => Partial<React.ComponentProps<"div">>;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={`grid grid-rows-4 gap-2 max-w-sm mx-auto`}
      role="grid"
      {...rest}
    >
      {ROWS.map((rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2" role="row">
          {COLUMNS.map((columnIndex) => (
            <DiceView
              key={columnIndex}
              // className="aspect-square flex transition-opacity"
              dice={board.at(rowIndex, columnIndex)}
              role="gridcell"
              aria-rowindex={rowIndex + 1}
              aria-colindex={columnIndex + 1}
              aria-disabled={mask && !mask[rowIndex][columnIndex]}
              {...extraDiceProps?.(
                rowIndex,
                columnIndex,
                board.at(rowIndex, columnIndex),
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
