import { SettingsButton } from "../settings/settings-button";

export function Header({ children }: { children: React.ReactNode }) {

  return (
    <header className="mb-4 flex justify-between items-center gap-2">
      <h1 className="text-2xl font-bold">{children}</h1>
      <SettingsButton />
    </header>
  );
}
