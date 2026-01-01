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
import { useTranslation } from "react-i18next";
import { HelpText } from "@/components/help-text";
import { Link } from "@tanstack/react-router";
import { Actions } from "@/components/layout/actions";
import { CheckIcon } from "lucide-react";

export function Review({
  playerId,
  isManual,
}: {
  playerId: string;
  isManual: boolean;
}) {
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

  const { t } = useTranslation();

  if (!board) {
    return null;
  }

  return (
    <Page>
      <Header>
        {t(isManual ? "enterBoardManually" : "reviewScanningResults")}
      </Header>
      <div className="mb-4">
        <BoardView
          board={board}
          mask={mask}
          diceWrapper={(children, rowIndex, columnIndex) => (
            <Popover
              open={
                selected !== null &&
                selected[0] === rowIndex &&
                selected[1] === columnIndex
              }
              onOpenChange={(open) =>
                setSelected(open ? [rowIndex, columnIndex] : null)
              }
            >
              <PopoverTrigger asChild>
                <ClickableDiceWrapper>{children}</ClickableDiceWrapper>
              </PopoverTrigger>
              <PopoverContent
                aria-label={t("editDice", {
                  row: rowIndex + 1,
                  column: columnIndex + 1,
                })}
              >
                <DiceEdit
                  dice={board.at(rowIndex, columnIndex)}
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  onChange={(dice) =>
                    updateDice(Number(playerId), rowIndex, columnIndex, dice)
                  }
                  onNavigate={(rowIndex, columnIndex) => {
                    if (Board.validCoordinates(rowIndex, columnIndex)) {
                      setSelected([rowIndex, columnIndex]);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
      <HelpText>
        {t(isManual ? "boardManualEntryTip" : "boardReviewTip")}
      </HelpText>
      {/* <div className="pointer-fine:block hidden">
        <HelpText>{t("keyboardEntryTip")}</HelpText>
      </div> */}
      <Actions>
        <Button variant="default" className="w-full" asChild>
          <Link to="/player/$id/rules" params={{ id: playerId }}>
            <CheckIcon />
            {t("continue")}
          </Link>
        </Button>
        <BackButton onClick={resetBoard}>
          {t(isManual ? "backToScanning" : "scanAgain")}
        </BackButton>
      </Actions>
    </Page>
  );
}
