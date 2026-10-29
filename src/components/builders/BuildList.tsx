import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Build } from "@/lib/builders-source";
import { FramedAvatar } from "../ui/FramedAvatar";

export type BuildItem = Build & { slug?: string };

const LINK =
  "inline-flex min-h-8 items-center border border-line px-2.5 text-[.85rem] font-semibold text-fg no-underline hover:border-fg";

/** One tracker project per row: avatar, name and builder, the description, then its links. */
export function BuildList({ items }: { items: BuildItem[] }) {
  const t = useTranslations();
  return (
    <ul className="m-0 list-none p-0 [--avatar-ic:var(--accent)]">
      {items.map((b) => (
        <li
          key={b.id}
          className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-b border-line py-3.5 md:grid-cols-[44px_minmax(0,1fr)_minmax(0,1.4fr)_15rem]"
        >
          <FramedAvatar slug={b.id} size="sm" />
          <span className="flex min-w-0 flex-col">
            <strong className="text-[1.1rem] leading-[1.2] [overflow-wrap:anywhere]">{b.name}</strong>
            <span className="text-[.85rem] text-mut [overflow-wrap:anywhere]">{t("bd_by", { name: b.builder })}</span>
          </span>
          <span className="col-start-2 text-[.95rem] text-mut empty:hidden md:col-start-auto md:empty:block">{b.about}</span>
          <span className="col-start-2 flex flex-wrap gap-2 md:col-start-auto">
            {b.link && (
              <a className={LINK} href={b.link} target="_blank" rel="noopener">
                {t("bd_try")}
              </a>
            )}
            {b.repo && (
              <a className={LINK} href={b.repo} target="_blank" rel="noopener">
                {t("bd_code")}
              </a>
            )}
            {b.slug && (
              <Link className={`${LINK} border-accent text-accent`} href={`/projects/${b.slug}`}>
                {t("bd_listed")}
              </Link>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
