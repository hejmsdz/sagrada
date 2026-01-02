import { Actions } from "@/components/layout/actions";
import { Header } from "@/components/layout/header";
import { Page } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function NotFound() {
  const { t } = useTranslation();

  return (
    <Page>
      <Header>{t("notFound")}</Header>
      <p>{t("notFoundDescription")}</p>
      <Actions>
        <Button variant="default" className="w-full" asChild>
          <Link to="/">{t("notFoundHomePage")}</Link>
        </Button>
      </Actions>
    </Page>
  );
}
