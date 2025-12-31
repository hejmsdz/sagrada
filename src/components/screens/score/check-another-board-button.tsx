import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/store";
import { PlayerNameDialogTrigger } from "./player-name-dialog-trigger";

export function CheckAnotherBoardButton({ playerId }: { playerId: string }) {
  const addPlayer = useStore((state) => state.addPlayer);
  const router = useRouter();
  const { t } = useTranslation();

  const onPlayerNameSubmit = () => {
    const newPlayerId = addPlayer();

    router.history.push(`/player/${newPlayerId}/scan`);
  };

  return (
    <PlayerNameDialogTrigger playerId={playerId} onSubmit={onPlayerNameSubmit}>
      <Button variant="outline" className="w-full">
        {t("checkAnotherBoard")}
      </Button>
    </PlayerNameDialogTrigger>
  );
}
