import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { useLeaderboard } from "@/lib/scoring";
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemMedia,
} from "@/components/ui/item";
import { RankBadge } from "./rank-badge";
import { Actions } from "@/components/layout/actions";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";

export function Leaderboard() {
  const { t } = useTranslation();

  const leaderboard = useLeaderboard();
  const resetStore = useStore((state) => state.resetStore);

  return (
    <Page>
      <Header>{t("leaderboard")}</Header>
      <ul className="flex flex-col gap-2 max-w-sm mx-auto">
        {leaderboard.map((player) => (
          <Item key={player.name} variant="muted" asChild>
            <li>
              <ItemMedia>
                <RankBadge rank={player.rank} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{player.name}</ItemTitle>
              </ItemContent>
              <ItemActions>{player.score}</ItemActions>
            </li>
          </Item>
        ))}
      </ul>
      <Actions>
        <Button
          variant="outline"
          className="w-full"
          asChild
          onClick={() => resetStore()}
        >
          <Link to="/objectives">{t("newGame")}</Link>
        </Button>
      </Actions>
    </Page>
  );
}
