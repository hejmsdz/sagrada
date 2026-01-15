import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useStore } from "@/lib/store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckIcon, CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { useMemo, useRef } from "react";
import { Actions } from "@/components/layout/actions";
import { useTranslation } from "react-i18next";
import { Navigate } from "@tanstack/react-router";
import { BackButton } from "@/components/back-button";
import { DisablableButtonLink } from "@/components/disablable-button-link";
import { InteractiveBoardView } from "@/components/board-view/interactive-board-view";
import { NUM_COLUMNS, NUM_ROWS } from "@/game/types";

export function PlacementRulesCheck({ playerId }: { playerId: string }) {
  const board = useStore((state) => state.players[Number(playerId)]?.board);
  const updateDice = useStore((state) => state.updateDice);
  const setPlayerBoard = useStore((state) => state.setPlayerBoard);
  const { current: initialBoard } = useRef(board);
  const illegallyPlacedDice = board?.findIllegallyPlacedDice();
  const { current: initialIllegallyPlacedDice } = useRef(illegallyPlacedDice);
  const hasIllegallyPlacedDice =
    illegallyPlacedDice?.some((row) => row.some(Boolean)) ?? false;
  const hasInitialIllegallyPlacedDice = useMemo(
    // eslint-disable-next-line react-hooks/refs
    () => initialIllegallyPlacedDice?.some((row) => row.some(Boolean)),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const firstMistakeCoordinates = useMemo<[number, number]>(() => {
    for (let rowIndex = 0; rowIndex < NUM_ROWS; rowIndex++) {
      for (let columnIndex = 0; columnIndex < NUM_COLUMNS; columnIndex++) {
        if (illegallyPlacedDice?.[rowIndex][columnIndex]) {
          return [rowIndex, columnIndex];
        }
      }
    }
    return [0, 0];
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const { t } = useTranslation();

  if (!board || !hasInitialIllegallyPlacedDice) {
    return (
      <Navigate
        to="/{-$locale}/player/$id/objective"
        params={{ id: playerId }}
        replace
      />
    );
  }

  return (
    <Page>
      <Header>{t("placementRulesCheck")}</Header>
      <InteractiveBoardView
        board={board}
        mask={hasIllegallyPlacedDice ? illegallyPlacedDice : undefined}
        initialSelectedCoordinates={firstMistakeCoordinates}
        onClick={(rowIndex, columnIndex) => {
          const wasInitiallyIllegal =
            initialIllegallyPlacedDice?.[rowIndex][columnIndex];
          const isCurrentlyIllegal =
            illegallyPlacedDice?.[rowIndex][columnIndex];

          if (
            !wasInitiallyIllegal ||
            (wasInitiallyIllegal &&
              !isCurrentlyIllegal &&
              board.at(rowIndex, columnIndex) !== null)
          ) {
            return;
          }

          const replacement = isCurrentlyIllegal
            ? null
            : (initialBoard?.at(rowIndex, columnIndex) ?? null);
          updateDice(Number(playerId), rowIndex, columnIndex, replacement);
        }}
        onChange={() => {}}
      />
      <div className="my-4" aria-live="polite">
        {hasIllegallyPlacedDice ? (
          <Alert>
            <CircleAlertIcon />
            <AlertTitle>{t("placementRulesCheckInfo")}</AlertTitle>
            <AlertDescription>
              {t("placementRulesCheckInfoAdditional")}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>{t("placementRulesSatisfied")}</AlertTitle>
          </Alert>
        )}
      </div>
      <Actions>
        <DisablableButtonLink
          variant="default"
          className="w-full"
          to="/{-$locale}/player/$id/objective"
          params={{ id: playerId }}
          disabled={hasIllegallyPlacedDice}
          disabledText={t("placementRulesCheckMessage")}
        >
          <CheckIcon />
          {t("continue")}
        </DisablableButtonLink>
        <BackButton
          onClick={() => {
            if (initialBoard) {
              setPlayerBoard(Number(playerId), initialBoard);
            }
          }}
        >
          {t("back")}
        </BackButton>
      </Actions>
    </Page>
  );
}
