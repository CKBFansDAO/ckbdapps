import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type Props = { title: string; className?: string } & (
  | { href: string; cta: string; children?: never }
  | { href?: never; cta?: never; children: ReactNode }
);

/**
 * Bracket with a dashed plug: "this slot is open, add your project".
 * Either the whole card is one link (`href` + `cta`), or it holds its own actions (`children`).
 */
export function EmptySlot({ title, className = "", href, cta, children }: Props) {
  const cls = `empty-slot ${className}`;
  if (!href) {
    return (
      <div className={cls}>
        <strong className="semi">{title}</strong>
        <div className="grid justify-items-start gap-1.5">{children}</div>
      </div>
    );
  }
  const body = (
    <>
      <strong className="semi">{title}</strong>
      <span>{cta}</span>
    </>
  );
  return /^https?:\/\//.test(href) ? (
    <a className={cls} href={href} target="_blank" rel="noopener">
      {body}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {body}
    </Link>
  );
}
