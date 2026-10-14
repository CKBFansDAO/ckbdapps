"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const ITEMS = [
  { key: "n_home", href: "/", match: (p: string) => p === "/" },
  { key: "n_explore", href: "/explore", match: (p: string) => p.startsWith("/explore") },
  { key: "n_map", href: "/#map" },
  { key: "n_halving", href: "/halving", match: (p: string) => p.startsWith("/halving") },
] as const;

export function NavLinks() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav aria-label={t("nav")} className="ml-auto flex gap-6 max-[760px]:hidden">
      {ITEMS.map((it) => {
        const current = "match" in it && it.match(pathname);
        return (
          <Link
            key={it.key}
            href={it.href}
            aria-current={current ? "page" : undefined}
            className="border-b-2 border-transparent py-1.5 text-[.92rem] font-semibold text-mut no-underline hover:border-purple-hi hover:text-fg aria-[current=page]:border-purple-hi aria-[current=page]:text-fg"
          >
            {t(it.key)}
          </Link>
        );
      })}
    </nav>
  );
}
