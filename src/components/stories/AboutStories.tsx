import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const BAR = ["sy_bar_1", "sy_bar_2", "sy_bar_3"] as const;

/** How stories are picked, who we look for, and that a story is not an endorsement: always readable, never folded away. */
export function AboutStories({ feed }: { feed: string }) {
  const t = useTranslations();
  return (
    <aside aria-labelledby="sy-about" className="border-t-2 border-fg pt-6">
      <h2 id="sy-about" className="semi mt-0 mb-3 text-[1.2rem]">
        {t("sy_about_h")}
      </h2>
      <p className="mt-0 mb-2.5 text-[.95rem]">{t("sy_about_1")}</p>
      <p className="mt-0 mb-0 text-[.95rem]">{t("sy_about_2")}</p>
      <h3 className="semi mt-6 mb-2.5 text-base">{t("sy_bar_h")}</h3>
      <ol className="m-0 grid list-none gap-2.5 p-0">
        {BAR.map((k, i) => (
          <li key={k} className="grid grid-cols-[2rem_minmax(0,1fr)] text-[.93rem]">
            <span aria-hidden="true" className="pt-0.5 font-mono text-[.85rem] font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              {t.rich(k, {
                a: (c) => (
                  <Link href="/submit" className="linkbtn">
                    {c}
                  </Link>
                ),
              })}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-5 mb-0 border-t border-line pt-4 text-[.88rem] text-mut">{t("sy_disc")}</p>
      <p className="mt-3 mb-0">
        <a href={feed} className="linkbtn font-mono text-[.82rem]">
          {t("sy_rss")}
        </a>
      </p>
    </aside>
  );
}
