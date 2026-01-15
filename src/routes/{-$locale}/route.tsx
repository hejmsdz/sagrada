import i18n, { supportedLocales, defaultLocale } from "@/i18n/i18n";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

function findPreferredLocale(
  preferredLanguages: readonly string[],
  fallback: string,
): string {
  for (const fullLocale of preferredLanguages) {
    const [language] = fullLocale.split("-");

    if (supportedLocales.has(fullLocale)) {
      return fullLocale;
    }

    if (supportedLocales.has(language)) {
      return language;
    }
  }

  return fallback;
}

export const Route = createFileRoute("/{-$locale}")({
  component: RouteComponent,
  beforeLoad: async ({ params, location }) => {
    if (params.locale) {
      if (!supportedLocales.has(params.locale)) {
        throw notFound();
      } else if (params.locale !== i18n.language) {
        i18n.changeLanguage(params.locale);
      }
    } else {
      const preferredLocale = findPreferredLocale(
        navigator.languages,
        defaultLocale,
      );

      const localizedHref = `/${preferredLocale}${location.href}`;
      throw redirect({ to: localizedHref });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
