export function Page({
  children,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<"main">) {
  return (
    <main className="p-4 container mx-auto" {...rest}>
      {children}
    </main>
  );
}
