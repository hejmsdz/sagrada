import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { MAX_FAVOR_TOKENS, useGameStore } from "@/stores/game";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, CheckIcon } from "lucide-react";
import { Actions } from "@/components/layout/actions";
import { Link } from "@tanstack/react-router";
import { useId } from "react";

export function FavorTokens({ playerId }: { playerId: string }) {
  const favorTokens = useGameStore(
    (state) => state.players[Number(playerId)]?.favorTokens ?? 0,
  );
  const incrementFavorTokens = useGameStore(
    (state) => state.incrementFavorTokens,
  );
  const decrementFavorTokens = useGameStore(
    (state) => state.decrementFavorTokens,
  );

  const { t } = useTranslation();
  const htmlId = useId();

  return (
    <Page>
      <Header>{t("favorTokens")}</Header>
      <p className="text-center">{t("favorTokensDescription")}</p>
      <div className="text-5xl text-center my-8" id={htmlId} aria-live="polite">
        {favorTokens}
      </div>
      <div className="flex flex-row gap-2 justify-center mb-4">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => incrementFavorTokens(Number(playerId))}
          disabled={favorTokens >= MAX_FAVOR_TOKENS}
          aria-controls={htmlId}
        >
          <PlusIcon className="size-4" aria-label={t("increment")} />
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => decrementFavorTokens(Number(playerId))}
          disabled={favorTokens <= 0}
          aria-controls={htmlId}
        >
          <MinusIcon className="size-4" aria-label={t("decrement")} />
        </Button>
      </div>
      <Actions>
        <Button variant="default" className="w-full" asChild>
          <Link to="/{-$locale}/player/$id/score" params={{ id: playerId }}>
            <CheckIcon />
            {t("calculateScore")}
          </Link>
        </Button>
      </Actions>
    </Page>
  );
}
