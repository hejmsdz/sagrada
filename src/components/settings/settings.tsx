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
import { AppearanceSettings } from "./appearance-settings";

export function Settings({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("settings");

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        onOpenAutoFocus={(event) => {
          if (!(event.target instanceof HTMLElement)) return;
          const closeButton = event.target.querySelector(
            '[data-slot="sheet-close"]',
          );

          if (closeButton instanceof HTMLElement) {
            closeButton.focus();
            event.preventDefault();
          }
        }}
      >
        <SheetHeader>
          <SheetTitle>{t("settings")}</SheetTitle>
        </SheetHeader>
        <div className="px-6 flex flex-col gap-7">
          <LanguageSettings />
          <AppearanceSettings />
        </div>
        <SheetFooter>
          <SettingsFooter />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
