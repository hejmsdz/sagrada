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
import { useGameStore } from "@/stores/game";

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
  const resetStore = useGameStore((state) => state.resetStore);

  return (
    <Page>
      <Header>{t("title")}</Header>

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

      <h2 className="text-xl font-semibold mb-4">{t("howDoesItWork")}</h2>
      <ul className="space-y-4 mb-6">
        {features.map(({ name, icon }) => (
          <li key={name}>
            <FeatureHighlight
              icon={icon}
              title={t(`features.${name}.title`)}
              description={t(`features.${name}.description`)}
            />
          </li>
        ))}
      </ul>

      <Actions>
        <Button
          variant="default"
          className="w-full"
          asChild
          onClick={() => {
            resetStore();
          }}
        >
          <Link to="/{-$locale}/objectives">{t("getStarted")}</Link>
        </Button>
      </Actions>
    </Page>
  );
}
