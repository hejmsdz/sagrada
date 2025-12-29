import React from "react";
import { NUM_ROWS, NUM_COLUMNS } from "@/game/types";
import type { Board, Mask } from "@/game/types";
import { DiceView } from "./dice-view";
import { cn } from "@/lib/utils";

const ROWS = Array.from({ length: NUM_ROWS }, (_, rowIndex) => rowIndex);
const COLUMNS = Array.from(
  { length: NUM_COLUMNS },
  (_, columnIndex) => columnIndex,
);

const defaultDiceWrapper = (children: React.ReactNode) => children;

export function BoardView({
  board,
  mask,
  diceWrapper = defaultDiceWrapper,
}: {
  board: Board;
  mask?: Mask;
  diceWrapper?: (
    children: React.ReactNode,
    rowIndex: number,
    columnIndex: number,
  ) => React.ReactNode;
}) {
  return (
    <div className={`grid grid-cols-5 grid-rows-4 gap-2 max-w-sm mx-auto`}>
      {ROWS.map((rowIndex) => (
        <React.Fragment key={rowIndex}>
          {COLUMNS.map((columnIndex) => (
            <React.Fragment key={columnIndex}>
              {diceWrapper(
                <DiceView
                  className={cn("transition-opacity", {
                    "opacity-20": mask && !mask[rowIndex][columnIndex],
                  })}
                  dice={board.at(rowIndex, columnIndex)}
                />,
                rowIndex,
                columnIndex,
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
