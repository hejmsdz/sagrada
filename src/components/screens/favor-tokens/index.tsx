import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { MAX_FAVOR_TOKENS, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";
import { Actions } from "@/components/layout/actions";
import { Link } from "@tanstack/react-router";

export function FavorTokens({ playerId }: { playerId: string }) {
  const favorTokens = useStore(
    (state) => state.players[Number(playerId)]?.favorTokens ?? 0,
  );
  const incrementFavorTokens = useStore((state) => state.incrementFavorTokens);
  const decrementFavorTokens = useStore((state) => state.decrementFavorTokens);

  const { t } = useTranslation();

  return (
    <Page>
      <Header>{t("favorTokens")}</Header>
      <p className="text-center">{t("favorTokensDescription")}</p>
      <div className="text-5xl text-center my-8">{favorTokens}</div>
      <div className="flex flex-row gap-2 justify-center mb-4">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => incrementFavorTokens(Number(playerId))}
          disabled={favorTokens >= MAX_FAVOR_TOKENS}
        >
          <PlusIcon className="size-4" aria-label={t("incrementFavorTokens")} />
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => decrementFavorTokens(Number(playerId))}
          disabled={favorTokens <= 0}
        >
          <MinusIcon
            className="size-4"
            aria-label={t("decrementFavorTokens")}
          />
        </Button>
      </div>
      <Actions>
        <Button variant="default" className="w-full" asChild>
          <Link to="/player/$id/score" params={{ id: playerId }}>
            {t("calculateScore")}
          </Link>
        </Button>
      </Actions>
    </Page>
  );
}
