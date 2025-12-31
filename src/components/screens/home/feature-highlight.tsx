import type { LucideIcon } from "lucide-react";

export function FeatureHighlight({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <Icon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
