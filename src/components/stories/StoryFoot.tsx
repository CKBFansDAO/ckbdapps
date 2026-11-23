import { useLocale, useTranslations } from "next-intl";
import { pick } from "@/lib/content/derive";
import type { StoryEntry } from "@/lib/content/stories";
import { storyErrorUrl } from "@/lib/site";

/** Who wrote it and that the builder approved it, the disclaimer, any corrections, and how to report a mistake. */
export function StoryFoot({ s }: { s: StoryEntry }) {
  const t = useTranslations();
  const locale = useLocale();
  const corrections = (s.corrections ?? []).toSorted((a, b) => b.date.localeCompare(a.date));
  return (
    <footer className="mt-12 grid max-w-[66ch] gap-3.5 border-t-2 border-fg pt-[22px]">
      <p className="m-0 font-semibold">{t(s.voice === "as-told-to" ? "sy_by_told" : "sy_by", { a: s.author, n: s.person.name })}</p>
      <p className="m-0 font-mono text-[.82rem] font-medium text-mut">{t("sy_published", { d: s.published })}</p>
      <p className="m-0 text-[.94rem] text-mut">
        {t("sy_disc")}
        {s.disclosure && ` ${pick(s.disclosure, locale)}`}
      </p>
      {corrections.length > 0 && (
        <div>
          <h2 className="semi mt-2 mb-1.5 text-base">{t("sy_corr_h")}</h2>
          <ul className="m-0 grid list-none gap-1.5 p-0 text-[.94rem]">
            {corrections.map((c) => (
              <li key={c.date} className="grid grid-cols-[6.6rem_minmax(0,1fr)] gap-2.5">
                <span className="font-mono text-[.85rem]">{c.date}</span>
                {pick(c.note, locale)}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="m-0 text-[.94rem] text-mut">
        {t("sy_err")}{" "}
        <a className="linkbtn text-fg" href={storyErrorUrl(s.en.title)} target="_blank" rel="noopener">
          {t("sy_err_cta")}
        </a>
      </p>
    </footer>
  );
}
