import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function PublicObjectiveItem({
  name,
  description,
  checked,
  onChange,
}: {
  name: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Label className="flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-primary-500 dark:has-aria-checked:border-primary dark:has-aria-checked:bg-primary">
      <Checkbox
        id={name}
        className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white dark:data-[state=checked]:border-primary dark:data-[state=checked]:bg-primary"
        checked={checked}
        onCheckedChange={onChange}
      />
      <div className="grid gap-1.5 font-normal">
        <p className="text-sm leading-none font-medium">{name}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </Label>
  );
}
