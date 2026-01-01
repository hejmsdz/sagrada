import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Actions } from "@/components/layout/actions";
import {
  CameraIcon,
  CalculatorIcon,
  TrophyIcon,
  CheckCircleIcon,
} from "lucide-react";
import { FeatureHighlight } from "./feature-highlight";
import { Trans, useTranslation } from "react-i18next";
import { useStore } from "@/lib/store";

const features = [
  {
    name: "scan",
    icon: CameraIcon,
  },
  {
    name: "review",
    icon: CheckCircleIcon,
  },
  {
    name: "score",
    icon: CalculatorIcon,
  },
  {
    name: "leaderboard",
    icon: TrophyIcon,
  },
];

export function Home() {
  const { t } = useTranslation("home");
  const resetStore = useStore((state) => state.resetStore);

  return (
    <Page>
      <Header>Sagrada Scoring Assistant</Header>

      <p className="text-lg mb-6">
        <Trans i18nKey="description" ns="home">
          ...
          <a
            href="https://floodgate.games/products/sagrada"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
          >
            ...
          </a>
          ...
        </Trans>
      </p>

      <div className="space-y-4 mb-6">
        {features.map(({ name, icon }) => (
          <FeatureHighlight
            key={name}
            icon={icon}
            title={t(`features.${name}.title`)}
            description={t(`features.${name}.description`)}
          />
        ))}
      </div>

      <Actions>
        <Button
          variant="default"
          className="w-full"
          asChild
          onClick={() => {
            resetStore();
          }}
        >
          <Link to="/objectives">{t("getStarted")}</Link>
        </Button>
      </Actions>
    </Page>
  );
}
