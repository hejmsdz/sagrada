import { cn } from "@/lib/utils";

export function ClickableDiceWrapper({
  children,
  isSelected,
  ...rest
}: React.ComponentProps<"button"> & {
  children: React.ReactNode;
  isSelected?: boolean;
}) {
  return (
    <button
      className={cn(
        "rounded-lg cursor-pointer hover:brightness-90 focus:brightness-90 focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all",
        isSelected && "border-ring ring-ring/50 ring-[3px]",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
