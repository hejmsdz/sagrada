import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/stores/settings";

export function ColorBlindSettings() {
  const { t } = useTranslation("settings");
  const htmlId = useId();
  const colorBlindMode = useSettingsStore((store) => store.colorBlindMode);
  const setColorBlindMode = useSettingsStore(
    (store) => store.setColorBlindMode,
  );

  const handleChange = (checked: boolean) => {
    setColorBlindMode(checked);
  };

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={htmlId}
        checked={colorBlindMode}
        onCheckedChange={handleChange}
      />
      <FieldLabel htmlFor={htmlId}>
        {t("colorBlindMode")}
      </FieldLabel>
    </Field>
  );
}
