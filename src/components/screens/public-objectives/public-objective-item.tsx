import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useId } from "react";
import { ObjectiveIllustration } from "./objective-illustration";

export function PublicObjectiveItem({
  name,
  description,
  illustration,
  checked,
  onChange,
}: {
  name: string;
  description: string;
  illustration: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const htmlId = useId();
  const labelId = `${htmlId}-label`;
  const descriptionId = `${htmlId}-description`;
  return (
    <Label className="flex flex-col items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-primary-500 dark:has-aria-checked:border-primary dark:has-aria-checked:bg-primary cursor-pointer">
      <ObjectiveIllustration description={illustration} />
      <Checkbox
        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
        checked={checked}
        onCheckedChange={onChange}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
      />
      <h2 id={labelId} className="text leading-none font-medium">
        {name}
      </h2>
      <p id={descriptionId} className="text-muted-foreground text-sm">
        {description}
      </p>
    </Label>
  );
}
