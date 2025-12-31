import { useMemo } from "react";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/game/types";
import { Button } from "@/components/ui/button";
import { COLOR_CLASSES_BG } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Actions } from "@/components/layout/actions";

export function PrivateObjective({ playerId }: { playerId: string }) {
  const { t } = useTranslation();

  const selectedColor = useStore(
    (state) => state.players[Number(playerId)]?.privateObjective,
  );
  const players = useStore((state) => state.players);
  const takenColors = useMemo(
    () =>
      new Set(
        players
          .filter(
            (player, i) =>
              i !== Number(playerId) && Boolean(player.privateObjective),
          )
          .map((player) => player.privateObjective),
      ),
    [players, playerId],
  );
  const setSelectedColor = useStore((state) => state.setPlayerPrivateObjective);

  return (
    <Page>
      <Header>{t("selectPrivateObjective")}</Header>
      <div className="flex flex-row gap-2 flex-wrap my-32">
        {COLORS.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <button
              key={color}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedColor(Number(playerId), color)}
              className={cn(
                "flex flex-1 aspect-square flex-col items-center justify-center gap-2 p-2 rounded-xl cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed",
                isSelected && "outline-2 outline-black-400 bg-neutral-50",
              )}
              disabled={takenColors.has(color)}
            >
              <div
                className={cn(
                  "rounded-full size-[10vw]",
                  COLOR_CLASSES_BG[color],
                )}
              />
              <span>{t(color, { ns: "colors" })}</span>
            </button>
          );
        })}
      </div>
      <Actions>
        <Button variant="default" className="w-full" asChild>
          {selectedColor ? (
            <Link to="/player/$id/tokens" params={{ id: playerId }}>
              {t("continue")}
            </Link>
          ) : (
            <button disabled>{t("continue")}</button>
          )}
        </Button>
      </Actions>
    </Page>
  );
}
