import { Trans } from "react-i18next";

const authorName = "Mikołaj Rozwadowski";
const authorUrl = "https://mrozwadowski.com";
const githubUrl = "https://github.com/hejmsdz/sagrada";

export function SettingsFooter() {
  return (
    <p className="text-sm text-muted-foreground">
      <Trans i18nKey="createdBy" values={{ name: authorName }}>
        ...
        <a
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:no-underline"
        >
          ...
        </a>
      </Trans>{" "}
      &middot;{" "}
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:no-underline"
      >
        GitHub
      </a>
    </p>
  );
}
