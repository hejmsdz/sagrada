import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useStore, MAX_PLAYERS } from "@/lib/store";
import { PlayerNameDialogTrigger } from "./player-name-dialog-trigger";
import { PlusIcon } from "lucide-react";

export function CheckAnotherBoardButton({ playerId }: { playerId: string }) {
  const addPlayer = useStore((state) => state.addPlayer);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const playersCount = useStore((state) => state.players.length);
  const nextPlayerId = Number(playerId) + 1;
  const nextPlayerExists = useStore((state) =>
    Boolean(state.players[nextPlayerId]),
  );

  if (playersCount >= MAX_PLAYERS) {
    return null;
  }

  const onPlayerNameSubmit = () => {
    const playerIdToNavigateTo = nextPlayerExists ? nextPlayerId : addPlayer();

    navigate({
      to: "/{-$locale}/player/$id/scan",
      params: { id: playerIdToNavigateTo.toString() },
    });
  };

  return (
    <PlayerNameDialogTrigger playerId={playerId} onSubmit={onPlayerNameSubmit}>
      <Button variant="outline" className="w-full">
        <PlusIcon />
        {t("checkAnotherBoard")}
      </Button>
    </PlayerNameDialogTrigger>
  );
}
