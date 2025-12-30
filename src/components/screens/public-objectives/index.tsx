import { publicObjectiveNames } from "@/game/public-objectives";
import { PublicObjectiveItem } from "./public-objective-item";
import { useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Actions } from "@/components/layout/actions";

export function PublicObjectives() {
  const selectedObjectives = useStore((state) => state.publicObjectives);
  const togglePublicObjective = useStore(
    (store) => store.togglePublicObjective,
  );

  const isValid = selectedObjectives.length === 3;

  const { t } = useTranslation();

  return (
    <Page>
      <Header>{t("selectPublicObjectives")}</Header>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {publicObjectiveNames.map((name) => (
          <PublicObjectiveItem
            key={name}
            name={t(`${name}.name`, { ns: "publicObjectives" })}
            description={t(`${name}.description`, { ns: "publicObjectives" })}
            checked={selectedObjectives.includes(name)}
            onChange={(isSelected) => togglePublicObjective(name, isSelected)}
          />
        ))}
      </div>
      <Actions>
        <Button
          variant="default"
          className="w-full"
          asChild
          disabled={!isValid}
        >
          {isValid ? (
            <Link to="/player/$id/scan" params={{ id: "0" }}>
              {t("next")}
            </Link>
          ) : (
            <button disabled>{t("objectivesSelectionMessage")}</button>
          )}
        </Button>
      </Actions>
    </Page>
  );
}
