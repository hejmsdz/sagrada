import { useState, useMemo, useEffect, useId } from "react";
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
import { Board, type OptionalDice } from "@/game/types";
import { useTranslation } from "react-i18next";
import { HelpText } from "@/components/help-text";
import { Link } from "@tanstack/react-router";
import { Actions } from "@/components/layout/actions";
import { CheckIcon } from "lucide-react";
import { useKeyboard } from "./use-keyboard";

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

  const diceHtmlId = useId();

  const onChange = (
    rowIndex: number,
    columnIndex: number,
    dice: OptionalDice,
  ) => updateDice(Number(playerId), rowIndex, columnIndex, dice);

  const handleButtonKeyDown = useKeyboard({
    getField: (event) => {
      const id = (event.target as HTMLButtonElement).id;
      if (!id?.startsWith(diceHtmlId)) {
        return null;
      }

      const [rowIndex, columnIndex] = id.split("-").slice(1).map(Number);

      return { rowIndex, columnIndex, dice: board.at(rowIndex, columnIndex) };
    },
    onNavigate: (rowIndex, columnIndex) => {
      document
        .getElementById(`${diceHtmlId}-${rowIndex}-${columnIndex}`)
        ?.focus();
    },
    onChange,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.startsWith("Arrow") &&
        event.target === document.body &&
        !selected &&
        !(event.metaKey || event.ctrlKey || event.altKey)
      ) {
        document.getElementById(`${diceHtmlId}-0-0`)?.focus();
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected, diceHtmlId]);

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
          diceWrapper={(children, rowIndex, columnIndex) => {
            const isSelected =
              selected !== null &&
              selected[0] === rowIndex &&
              selected[1] === columnIndex;

            return (
              <Popover
                open={isSelected}
                onOpenChange={(open) =>
                  setSelected(open ? [rowIndex, columnIndex] : null)
                }
              >
                <PopoverTrigger asChild>
                  <ClickableDiceWrapper
                    id={`${diceHtmlId}-${rowIndex}-${columnIndex}`}
                    isSelected={isSelected}
                    onKeyDown={handleButtonKeyDown}
                  >
                    {children}
                  </ClickableDiceWrapper>
                </PopoverTrigger>
                <PopoverContent
                  aria-label={t("editDice", {
                    row: rowIndex + 1,
                    column: columnIndex + 1,
                  })}
                >
                  <DiceEdit
                    dice={board.at(rowIndex, columnIndex)}
                    onChange={(dice) => onChange(rowIndex, columnIndex, dice)}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    onNavigate={(rowIndex, columnIndex) =>
                      setSelected([rowIndex, columnIndex])
                    }
                  />
                </PopoverContent>
              </Popover>
            );
          }}
        />
      </div>
      <HelpText>
        {t(isManual ? "boardManualEntryTip" : "boardReviewTip")}
      </HelpText>
      <div className="pointer-fine:block hidden">
        <HelpText>{t("keyboardEntryTip")}</HelpText>
      </div>
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
