import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PlayerNameDialogTrigger } from "./player-name-dialog-trigger";
import { useStore } from "@/lib/store";
import { TrophyIcon } from "lucide-react";

export function LeaderboardButton({ playerId }: { playerId: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const numPlayers = useStore((state) => state.players.length);

  const onPlayerNameSubmit = () => {
    navigate({ to: "/{$locale}/leaderboard" });
  };

  if (numPlayers < 2) {
    return null;
  }

  return (
    <PlayerNameDialogTrigger playerId={playerId} onSubmit={onPlayerNameSubmit}>
      <Button variant="outline" className="w-full">
        <TrophyIcon />
        {t("leaderboard")}
      </Button>
    </PlayerNameDialogTrigger>
  );
}
