import { useMemo } from "react";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/game/types";
import { COLOR_CLASSES_BG } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { Actions } from "@/components/layout/actions";
import { DisablableButtonLink } from "@/components/disablable-button-link";
import { CheckIcon } from "lucide-react";

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
      <div
        className="grid grid-cols-5 gap-2 my-32 max-w-sm mx-auto"
        role="radiogroup"
      >
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
                isSelected && "outline-2 outline-foreground-100 bg-muted",
              )}
              disabled={takenColors.has(color)}
            >
              <div
                className={cn(
                  "rounded-full aspect-square w-full",
                  COLOR_CLASSES_BG[color],
                )}
              />
              <span>{t(color, { ns: "colors" })}</span>
            </button>
          );
        })}
      </div>
      <Actions>
        <DisablableButtonLink
          variant="default"
          className="w-full"
          to="/{-$locale}/player/$id/tokens"
          params={{ id: playerId }}
          disabled={!selectedColor}
        >
          <CheckIcon />
          {t("continue")}
        </DisablableButtonLink>
      </Actions>
    </Page>
  );
}
