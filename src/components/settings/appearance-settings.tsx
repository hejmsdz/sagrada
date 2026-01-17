import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { useTranslation } from "react-i18next";
import { useSettingsStore, type Theme } from "@/stores/settings";

const themes: Theme[] = ["system", "light", "dark"];

export function AppearanceSettings() {
  const { t } = useTranslation("settings");
  const htmlId = useId();
  const currentTheme = useSettingsStore((store) => store.theme);
  const setTheme = useSettingsStore((store) => store.setTheme);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = event.target.value as Theme;
    setTheme(theme);
  };

  return (
    <Field>
      <FieldLabel htmlFor={htmlId}>{t("appearance")}</FieldLabel>
      <NativeSelect id={htmlId} onChange={handleChange} value={currentTheme}>
        {themes.map((theme) => (
          <NativeSelectOption key={theme} value={theme}>
            {t(`themes.${theme}`)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}
