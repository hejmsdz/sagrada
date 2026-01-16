import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";
import { LanguageSettings } from "./language-settings";
import { SettingsFooter } from "./settings-footer";

export function Settings({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("settings")}</SheetTitle>
        </SheetHeader>
        <div className="px-6">
          <LanguageSettings />
        </div>
        <SheetFooter>
          <SettingsFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
