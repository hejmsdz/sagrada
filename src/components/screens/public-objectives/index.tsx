import { publicObjectiveNames } from "@/game/public-objectives";
import { PublicObjectiveItem } from "./public-objective-item";
import { REQUIRED_PUBLIC_OBJECTIVES, useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { useTranslation } from "react-i18next";
import { Actions } from "@/components/layout/actions";
import { DisablableButtonLink } from "@/components/disablable-button-link";

export function PublicObjectives() {
  const selectedObjectives = useStore((state) => state.publicObjectives);
  const togglePublicObjective = useStore(
    (store) => store.togglePublicObjective,
  );

  const isValid = selectedObjectives.length === REQUIRED_PUBLIC_OBJECTIVES;

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
        <DisablableButtonLink
          variant="default"
          className="w-full"
          to="/player/$id/scan"
          params={{ id: "0" }}
          disabled={!isValid}
          disabledText={t("objectivesSelectionMessage", {
            count: REQUIRED_PUBLIC_OBJECTIVES,
          })}
        >
          {t("continue")}
        </DisablableButtonLink>
      </Actions>
    </Page>
  );
}
