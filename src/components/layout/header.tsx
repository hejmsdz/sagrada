import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Settings } from "../settings/settings";
import { useTranslation } from "react-i18next";

export function Header({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <header className="mb-4 flex justify-between items-center gap-2">
      <h1 className="text-2xl font-bold">{children}</h1>
      <Settings>
        <Button variant="ghost" size="icon" aria-label={t("settings")}>
          <MenuIcon />
        </Button>
      </Settings>
    </header>
  );
}
