import { cn } from "@/lib/utils";

const rankColors: Record<number, string> = {
  1: "bg-amber-300",
  2: "bg-slate-300",
  3: "bg-orange-900 text-white",
};

export function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "rounded-full w-10 h-10 flex items-center justify-center text-lg",
        rankColors[rank] ?? "bg-neutral-200 dark:bg-neutral-800",
      )}
    >
      {rank}
    </span>
  );
}
