import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = { big?: boolean; className?: string; children: ReactNode } & (
  | { href: string }
  | (Omit<ComponentProps<"button">, "className" | "children"> & { href?: never })
);

/** Bracket with a plug that grows on hover and focus. A link when given `href`, otherwise a button. */
export function SlotButton({ big, className, children, href, ...rest }: Props) {
  const cls = ["btn", big && "big", className].filter(Boolean).join(" ");

  if (href) {
    return /^https?:\/\//.test(href) ? (
      <a className={cls} href={href} target="_blank" rel="noopener">
        {children}
      </a>
    ) : (
      <Link className={cls} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
