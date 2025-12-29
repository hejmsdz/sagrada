export function ClickableDiceWrapper({
  children,
  ...rest
}: React.ComponentProps<"button"> & {
  children: React.ReactNode;
}) {
  return (
    <button
      className="rounded-lg cursor-pointer hover:brightness-90 focus:brightness-90 focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all"
      {...rest}
    >
      {children}
    </button>
  );
}
