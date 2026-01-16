import { useId } from "react";
import { useMatches, useNavigate } from "@tanstack/react-router";
import { Field, FieldLabel } from "@/components/ui/field";
import { supportedLocales, supportedLocalesNames } from "@/i18n/i18n";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/stores/settings";

export function LanguageSettings() {
  const { i18n, t } = useTranslation();
  const match = useMatches();
  const mostSpecificMatch = match[match.length - 1];
  const navigate = useNavigate();
  const htmlId = useId();
  const setDefaultLocale = useSettingsStore((store) => store.setDefaultLocale);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = event.target.value;

    const targetRoute =
      mostSpecificMatch.routeId === "__root__" ||
      mostSpecificMatch.routeId === "/{-$locale}/"
        ? "/{-$locale}"
        : mostSpecificMatch.routeId;

    navigate({
      to: targetRoute,
      params: {
        locale: event.target.value,
      },
      replace: true,
    });
    setDefaultLocale(locale);
  };

  return (
    <Field>
      <FieldLabel htmlFor={htmlId}>{t("language")}</FieldLabel>
      <NativeSelect id={htmlId} onChange={handleChange} value={i18n.language}>
        {supportedLocales.map((locale) => (
          <NativeSelectOption key={locale} value={locale}>
            {supportedLocalesNames[locale]}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}
