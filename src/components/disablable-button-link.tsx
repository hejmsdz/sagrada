import { Link } from "@tanstack/react-router";
import type {
  LinkComponentProps,
  AnyRouter,
  RegisteredRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type DisablableButtonLinkProps<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = ".",
  TMaskFrom extends string = TFrom,
  TMaskTo extends string = ".",
> = Pick<
  LinkComponentProps<"a", TRouter, TFrom, TTo, TMaskFrom, TMaskTo>,
  "to" | "params"
> & {
  disabled: boolean;
  disabledText?: ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  children: ReactNode;
};

export function DisablableButtonLink<
  TRouter extends AnyRouter = RegisteredRouter,
  TFrom extends string = string,
  TTo extends string | undefined = ".",
  TMaskFrom extends string = TFrom,
  TMaskTo extends string = ".",
>({
  children,
  disabled,
  disabledText,
  className,
  variant,
  to,
  params,
}: DisablableButtonLinkProps<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>) {
  return (
    <Button className={className} variant={variant} disabled={disabled} asChild>
      {disabled ? (
        <button disabled>{disabledText ?? children}</button>
      ) : (
        <Link<TRouter, TFrom, TTo, TMaskFrom, TMaskTo>
          to={to!}
          params={params!}
        >
          {children}
        </Link>
      )}
    </Button>
  );
}
