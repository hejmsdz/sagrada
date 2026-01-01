import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useStore } from "@/lib/store";
import { CheckIcon } from "lucide-react";

export function PlayerNameDialogTrigger({
  playerId,
  children,
  onSubmit,
}: {
  playerId: string;
  children: React.ReactNode;
  onSubmit: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const inputId = useId();
  const setPlayerName = useStore((state) => state.setPlayerName);
  const currentPlayerName = useStore(
    (state) => state.players[Number(playerId)]?.name,
  );
  const players = useStore((state) => state.players);
  const takenPlayerNames = useMemo(
    () =>
      new Set(
        players
          .filter((player, i) => i !== Number(playerId) && Boolean(player.name))
          .map((player) => player.name),
      ),
    [players, playerId],
  );
  const [name, setName] = useState(
    currentPlayerName ??
      t("defaultPlayerName", {
        number: Number(playerId) + 1,
      }),
  );

  const isInvalid = !name.trim() || takenPlayerNames.has(name);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isInvalid) {
      return;
    }

    setPlayerName(Number(playerId), name.trim());
    setOpen(false);
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("whoseScoreWasThis")}</DialogTitle>
            <DialogDescription>{t("enterPlayerName")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 my-4">
            <Label htmlFor={inputId}>{t("playerName")}</Label>
            <Input
              id={inputId}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isInvalid}>
              <CheckIcon />
              {t("ok")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
