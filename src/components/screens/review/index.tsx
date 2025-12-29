import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClickableDiceWrapper } from "@/components/clickable-dice-wrapper";
import { BoardView } from "@/components/board-view";
import { DiceEdit } from "./dice-edit";
import { BackButton } from "@/components/back-button";
import { Board } from "@/game/types";
// import { Link } from "@tanstack/react-router";

export function Review({ playerId }: { playerId: string }) {
  const board = useStore((state) => state.players[Number(playerId)]?.board);
  const updateDice = useStore((state) => state.updateDice);
  const setPlayerBoard = useStore((state) => state.setPlayerBoard);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const mask = useMemo(
    () =>
      selected && board
        ? board.createMask(
            (_dice, rowIndex, columnIndex) =>
              selected[0] === rowIndex && selected[1] === columnIndex,
          )
        : undefined,
    [board, selected],
  );

  const resetBoard = () => {
    setPlayerBoard(
      Number(playerId),
      Board.build(() => null),
    );
  };

  if (!board) {
    return null;
  }

  return (
    <Page>
      <Header>Review</Header>
      <div className="mb-4">
        <BoardView
          board={board}
          mask={mask}
          diceWrapper={(children, rowIndex, columnIndex) => (
            <Popover
              onOpenChange={(open) =>
                setSelected(open ? [rowIndex, columnIndex] : null)
              }
            >
              <PopoverTrigger asChild>
                <ClickableDiceWrapper>{children}</ClickableDiceWrapper>
              </PopoverTrigger>
              <PopoverContent>
                <DiceEdit
                  dice={board.at(rowIndex, columnIndex)}
                  onChange={(dice) =>
                    updateDice(Number(playerId), rowIndex, columnIndex, dice)
                  }
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="default" className="w-full">
          Continue
        </Button>
        <BackButton onClick={resetBoard}>Scan again</BackButton>
      </div>
    </Page>
  );
}
