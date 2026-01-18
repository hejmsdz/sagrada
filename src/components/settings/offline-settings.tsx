import { useId, useMemo, useState, useEffect } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

type ServiceWorkerStatus = 'unsupported' | 'notInstalled' | 'installing' | 'offlineReady' | 'error';

const useServiceWorker = () => {
  const [offlineReady, setOfflineReady] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready.then(() => {
      setOfflineReady(true);
    });
  }, [isInstalling]);

  const register = async () => {
    setHasError(false);
    setIsInstalling(true);
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch {
      setHasError(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const unregister = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));

    setOfflineReady(false);
  };

  const status: ServiceWorkerStatus = useMemo(() => {
    if (!("serviceWorker" in navigator)) {
      return 'unsupported';
    }
    if (offlineReady) {
      return 'offlineReady';
    }
    if (isInstalling) {
      return 'installing';
    }
    if (hasError) {
      return 'error';
    }
    return 'notInstalled';
  }, [offlineReady, hasError, isInstalling]);

  return {
    register,
    unregister,
    status,
  };
};

export function OfflineSettings() {
  const { t } = useTranslation("settings");
  const htmlId = useId();
  const { register, unregister, status } = useServiceWorker();

  if (status === 'unsupported') {
    return null;
  }

  return (
    <Field orientation="horizontal" aria-busy={status === 'installing'}>
      <Checkbox
        id={htmlId}
        checked={status !== 'notInstalled' && status !== 'error'}
        disabled={status === 'installing'}
        onCheckedChange={() => {
          if (status === 'notInstalled' || status === 'error') {
            register();
          } else {
            unregister();
          }
        }}
      />
      <FieldContent>
        <FieldLabel htmlFor={htmlId}>
          {t("offlineMode")}
        </FieldLabel>
        <FieldDescription>
          {t(`offlineModeStatus.${status}`)}
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
