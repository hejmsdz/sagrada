import { useState } from "react";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/store";
import { BoardView } from "@/components/board-view/board-view";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { usePlayerScore } from "@/lib/scoring";
import { Actions } from "@/components/layout/actions";
import { CheckAnotherBoardButton } from "./check-another-board-button";
import { LeaderboardButton } from "./leaderboard-button";

export function Score({ playerId }: { playerId: string }) {
  const board = useStore((state) => state.players[Number(playerId)]?.board);
  const score = usePlayerScore(Number(playerId));
  const { t } = useTranslation();
  const [activeResultIndex, setActiveResultIndex] = useState<
    number | undefined
  >();

  if (!board || !score) {
    return null;
  }

  const { results, total } = score;

  return (
    <Page>
      <Header>{t("scoring")}</Header>
      <BoardView board={board} mask={results[activeResultIndex ?? -1]?.mask} />
      <ul className="max-w-sm mx-auto mt-8 flex flex-col gap-2">
        {results.map((result, index) => (
          <Item
            key={result.name}
            tabIndex={0}
            variant="muted"
            onMouseEnter={() => setActiveResultIndex(index)}
            onMouseLeave={() => setActiveResultIndex(undefined)}
            onFocus={() => setActiveResultIndex(index)}
            onBlur={() => setActiveResultIndex(undefined)}
            className={cn(
              "cursor-pointer",
              activeResultIndex === index && "text-primary bg-primary/10",
            )}
            asChild
          >
            <li>
              <ItemContent>
                <ItemTitle>{result.name}</ItemTitle>
                {result.calculation && (
                  <ItemDescription>{result.calculation}</ItemDescription>
                )}
              </ItemContent>
              <ItemActions>{result.score}</ItemActions>
            </li>
          </Item>
        ))}
        <Item variant="muted" asChild>
          <li>
            <ItemContent>
              <ItemTitle className="font-bold">{t("total")}</ItemTitle>
            </ItemContent>
            <ItemActions className="font-bold">{total}</ItemActions>
          </li>
        </Item>
      </ul>
      <Actions>
        <CheckAnotherBoardButton playerId={playerId} />
        <LeaderboardButton playerId={playerId} />
      </Actions>
    </Page>
  );
}
