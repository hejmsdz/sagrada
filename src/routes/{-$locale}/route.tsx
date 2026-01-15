import i18n from "@/i18n/i18n";
import {
  createFileRoute,
  notFound,
  Outlet,
  redirect,
} from "@tanstack/react-router";

const availableLocales = i18n.services.resourceStore.data;

export const Route = createFileRoute("/{-$locale}")({
  component: RouteComponent,
  beforeLoad: async ({ params, location }) => {
    console.log("beforeLoad", location.href, params.locale, availableLocales);
    if (params.locale) {
      if (!availableLocales[params.locale]) {
        console.log("locale not found, throwing not found", params.locale);
        throw notFound();
      } else if (params.locale !== i18n.language) {
        console.log("locale found, changing language to", params.locale);
        i18n.changeLanguage(params.locale);
      }
    } else {
      const preferredLocale =
        navigator.languages.find((locale) => availableLocales[locale]) ||
        i18n.options.fallbackLng;

      console.log("no locale, redirecting to", preferredLocale);

      throw redirect({ to: `/${preferredLocale}/${location.href}` });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
