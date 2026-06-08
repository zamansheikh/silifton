import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "ghost" | "link";
type ButtonSize = "sm" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = CommonProps & { href: string; onClick?: () => void };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size, className, children } = props;
  const cls = cn("btn", `btn-${variant}`, size && `btn-${size}`, className);

  if ("href" in props && props.href) {
    const isExternal = /^https?:\/\//.test(props.href);
    if (isExternal) {
      return (
        <a className={cls} href={props.href} target="_blank" rel="noreferrer noopener" onClick={props.onClick}>
          {children}
        </a>
      );
    }
    return (
      <Link className={cls} href={props.href} onClick={props.onClick}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsButton;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
