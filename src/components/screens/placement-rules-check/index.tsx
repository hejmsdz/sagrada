import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useStore } from "@/lib/store";
import { BoardView } from "@/components/board-view";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { ClickableDiceWrapper } from "@/components/clickable-dice-wrapper";
import { useMemo, useRef } from "react";
import { Actions } from "@/components/layout/actions";
import { useTranslation } from "react-i18next";
import { Navigate } from "@tanstack/react-router";
import { BackButton } from "@/components/back-button";
import { DisablableButtonLink } from "@/components/disablable-button-link";

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
  const { t } = useTranslation();

  if (!board || !hasInitialIllegallyPlacedDice) {
    return (
      <Navigate to="/player/$id/objective" params={{ id: playerId }} replace />
    );
  }

  return (
    <Page>
      <Header>{t("placementRulesCheck")}</Header>
      <BoardView
        board={board}
        mask={hasIllegallyPlacedDice ? illegallyPlacedDice : undefined}
        diceWrapper={(children, rowIndex, columnIndex) => {
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
            return children;
          }

          return (
            <ClickableDiceWrapper
              onClick={() => {
                const replacement = isCurrentlyIllegal
                  ? null
                  : (initialBoard?.at(rowIndex, columnIndex) ?? null);
                updateDice(
                  Number(playerId),
                  rowIndex,
                  columnIndex,
                  replacement,
                );
              }}
            >
              {children}
            </ClickableDiceWrapper>
          );
        }}
      />
      <div className="my-4">
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
          to="/player/$id/objective"
          params={{ id: playerId }}
          disabled={hasIllegallyPlacedDice}
        >
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
