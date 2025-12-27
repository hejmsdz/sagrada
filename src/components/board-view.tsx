import React from "react";
import { NUM_ROWS, NUM_COLUMNS } from "@/game/types";
import type { Board, Mask } from "@/game/types";
import { DiceView } from "./dice-view";
import { cn } from "@/lib/utils";

const ROWS = Array.from({ length: NUM_ROWS }, (_, rowIndex) => rowIndex);
const COLUMNS = Array.from({ length: NUM_COLUMNS }, (_, columnIndex) => columnIndex);

export function BoardView({ board, mask }: { board: Board, mask?: Mask }) {
  return (
    <div className={`grid grid-cols-5 grid-rows-4 gap-2`}>
      {ROWS.map((rowIndex) => (
        <React.Fragment key={rowIndex}>
          {COLUMNS.map((columnIndex) => (
              <DiceView
                className={cn({ 'opacity-20': (mask && !mask[rowIndex][columnIndex]) })}
                key={columnIndex}
                dice={board.at(rowIndex, columnIndex)}
              />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
