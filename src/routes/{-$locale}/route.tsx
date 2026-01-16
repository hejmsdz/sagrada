import i18n, {
  supportedLocalesSet,
  supportedLocales,
  defaultLocale,
} from "@/i18n/i18n";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useBeforeUnload } from "@/hooks/use-before-unload";
import { useSettingsStore } from "@/stores/settings";

function findPreferredLocale(
  preferredLanguages: readonly string[],
  fallback: string,
): string {
  for (const fullLocale of preferredLanguages) {
    const [language] = fullLocale.split("-");

    if (supportedLocalesSet.has(fullLocale)) {
      return fullLocale;
    }

    if (supportedLocalesSet.has(language)) {
      return language;
    }
  }

  return fallback;
}

export const Route = createFileRoute("/{-$locale}")({
  component: RouteComponent,
  beforeLoad: async ({ params, location }) => {
    if (params.locale) {
      if (!supportedLocalesSet.has(params.locale)) {
        throw notFound();
      } else if (params.locale !== i18n.language) {
        i18n.changeLanguage(params.locale);
      }
    } else {
      const storedLocale = useSettingsStore.getState().defaultLocale;
      const preferredLocale = findPreferredLocale(
        [...(storedLocale ? [storedLocale] : []), ...navigator.languages],
        defaultLocale,
      );

      const localizedHref = `/${preferredLocale}${location.href}`;
      throw redirect({ to: localizedHref });
    }
  },
  head: ({ params, matches }) => {
    const mostSpecificMatch = matches[matches.length - 1];

    return {
      meta: [
        {
          name: "description",
          content: i18n.t("seoDescription", { ns: "home" }),
        },
      ],
      links: [
        ...supportedLocales
          .filter((locale) => locale !== params.locale)
          .map((locale) => ({
            rel: "alternate",
            href: new URL(
              `/${locale}/${mostSpecificMatch.pathname.slice(`/${params.locale}/`.length)}`.replace(
                /\/$/,
                "",
              ),
              location.origin,
            ).toString(),
            hrefLang: locale,
          })),
      ],
    };
  },
});

function RouteComponent() {
  useBeforeUnload();

  return <Outlet />;
}
