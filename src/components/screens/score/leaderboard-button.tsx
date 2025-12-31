import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PlayerNameDialogTrigger } from "./player-name-dialog-trigger";
import { useStore } from "@/lib/store";

export function LeaderboardButton({ playerId }: { playerId: string }) {
  const router = useRouter();
  const { t } = useTranslation();
  const numPlayers = useStore((state) => state.players.length);

  const onPlayerNameSubmit = () => {
    router.history.push(`/leaderboard`);
  };

  if (numPlayers < 2) {
    return null;
  }

  return (
    <PlayerNameDialogTrigger playerId={playerId} onSubmit={onPlayerNameSubmit}>
      <Button variant="outline" className="w-full">
        {t("leaderboard")}
      </Button>
    </PlayerNameDialogTrigger>
  );
}
