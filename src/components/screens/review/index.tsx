import { useState, useMemo, useEffect, useId, useRef } from "react";
import { useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { PopoverAnchor } from "@/components/ui/popover";
import { ControlledInteractiveBoardView } from "@/components/board-view/controlled-interactive-board-view";
import { BackButton } from "@/components/back-button";
import { Board, type OptionalDice } from "@/game/types";
import { useTranslation } from "react-i18next";
import { HelpText } from "@/components/help-text";
import { Link } from "@tanstack/react-router";
import { Actions } from "@/components/layout/actions";
import { CheckIcon } from "lucide-react";
import { DiceEditPopover } from "./dice-edit-popover";
import { type Measurable } from "@radix-ui/rect";

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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number]
  >([0, 0]);
  const mask = useMemo(
    () =>
      isPopoverOpen && board
        ? board.createMask(
            (_dice, rowIndex, columnIndex) =>
              selectedCoordinates[0] === rowIndex &&
              selectedCoordinates[1] === columnIndex,
          )
        : undefined,
    [board, isPopoverOpen, selectedCoordinates],
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

  const onNavigate = (rowIndex: number, columnIndex: number) => {
    setSelectedCoordinates([rowIndex, columnIndex]);
  };

  const focusedRef = useRef<HTMLElement>(null);
  useEffect(() => {
    focusedRef.current = document.getElementById(
      `${diceHtmlId}-${selectedCoordinates[0]}-${selectedCoordinates[1]}`,
    );
  }, [selectedCoordinates, diceHtmlId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log("keydown", event.key);
      if (
        event.key.startsWith("Arrow") &&
        event.target === document.body &&
        !isPopoverOpen &&
        !(event.metaKey || event.ctrlKey || event.altKey)
      ) {
        document.getElementById(`${diceHtmlId}-0-0`)?.focus();
        event.preventDefault();
      } else if (event.key === "Escape" && isPopoverOpen) {
        setIsPopoverOpen(false);
        focusedRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPopoverOpen, diceHtmlId]);

  const isSwitchingBetweenFieldsRef = useRef(false);
  useEffect(() => {
    setTimeout(() => {
      console.log("not switching anymore");
      isSwitchingBetweenFieldsRef.current = false;
    }, 100);
  }, [selectedCoordinates]);

  if (!board) {
    return null;
  }

  return (
    <Page>
      <Header>
        {t(isManual ? "enterBoardManually" : "reviewScanningResults")}
      </Header>
      <div className="mb-4">
        <ControlledInteractiveBoardView
          board={board}
          mask={mask}
          selectedCoordinates={selectedCoordinates}
          onNavigate={onNavigate}
          onClick={() => {
            isSwitchingBetweenFieldsRef.current = true;
            setIsPopoverOpen(true);
          }}
          onChange={onChange}
          customIsSelected={isPopoverOpen}
          diceHtmlId={diceHtmlId}
        />
        <DiceEditPopover
          open={isPopoverOpen}
          selectedCoordinates={isPopoverOpen ? selectedCoordinates : null}
          onNavigate={onNavigate}
          onOpenChange={(open) => {
            if (!open && isSwitchingBetweenFieldsRef.current) {
              isSwitchingBetweenFieldsRef.current = false;
              return;
            }
            setIsPopoverOpen(open);
          }}
          board={board}
          onChange={onChange}
        >
          <PopoverAnchor
            key={selectedCoordinates.join("-")}
            virtualRef={focusedRef as React.RefObject<Measurable>}
          />
        </DiceEditPopover>
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
