import publicObjectives from "@/game/public-objectives";
import { PublicObjectiveItem } from "./public-objective-item";
import { useStore } from "@/lib/store";
import { Page } from "@/components/layout/page";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function PublicObjectives() {
  const selectedObjectives = useStore((state) => state.publicObjectives);
  const togglePublicObjective = useStore(
    (store) => store.togglePublicObjective,
  );

  const isValid = selectedObjectives.length === 3;

  return (
    <Page>
      <Header>Public Objectives</Header>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {publicObjectives.map((objective) => (
          <PublicObjectiveItem
            key={objective.name}
            name={objective.name}
            description={objective.description}
            checked={selectedObjectives.includes(objective.name)}
            onChange={(isSelected) =>
              togglePublicObjective(objective.name, isSelected)
            }
          />
        ))}
      </div>
      <Button variant="default" className="w-full" asChild>
        <Link to="/player/$id/scan" params={{ id: "0" }} disabled={!isValid}>
          {isValid ? "Next" : "Select 3 objectives to continue"}
        </Link>
      </Button>
    </Page>
  );
}
