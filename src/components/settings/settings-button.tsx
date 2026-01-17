import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

const LazySettings = lazy(() =>
  import("./settings").then((module) => ({ default: module.Settings })),
);

const FragmentWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

type SettingsComponentType = React.ComponentType<{
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}>;

export function SettingsButton() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [SettingsComponent, setSettingsComponent] =
    useState<SettingsComponentType>(() => FragmentWrapper);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setSettingsComponent(LazySettings);
  };

  const button = (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("settings")}
      onClick={handleClick}
    >
      <MenuIcon />
    </Button>
  );

  return (
    <Suspense fallback={button}>
      <SettingsComponent open={isOpen} setOpen={setIsOpen}>
        {button}
      </SettingsComponent>
    </Suspense>
  );
}
