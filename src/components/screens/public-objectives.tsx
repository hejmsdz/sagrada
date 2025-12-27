import publicObjectives from "@/game/public-objectives";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PublicObjectives() {
  return (
    <div>
      <div>
        <h1>Public Objectives</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {publicObjectives.map((goal) => (
          <Label
            key={goal.name}
            className="flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-primary-500 dark:has-aria-checked:border-primary dark:has-aria-checked:bg-primary"
          >
            <Checkbox
              id={goal.name}
              className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
            />
            <div className="grid gap-1.5 font-normal">
              <p className="text-sm leading-none font-medium">{goal.name}</p>
              <p className="text-muted-foreground text-xs">
                {goal.description}
              </p>
            </div>
          </Label>
        ))}
      </div>
    </div>
  );
}
