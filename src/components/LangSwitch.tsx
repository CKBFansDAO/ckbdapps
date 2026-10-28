"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { htmlLang, routing } from "@/i18n/routing";

const LABEL = { en: "EN", zh: "中文" } as const;

export function LangSwitch() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav className="inline-flex border border-line" aria-label={t("lang")}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          lang={htmlLang(l)}
          aria-current={l === locale ? "true" : undefined}
          className="grid min-h-10 min-w-10 place-items-center px-2.5 font-mono whitespace-nowrap text-[.78rem] font-semibold text-mut no-underline aria-[current]:bg-white aria-[current]:text-ink"
        >
          {LABEL[l]}
        </Link>
      ))}
    </nav>
  );
}
