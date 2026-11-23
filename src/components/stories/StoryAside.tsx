import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryLabel } from "@/lib/content/derive";
import type { ProjectEntry } from "@/lib/content/load";
import type { StoryEntry } from "@/lib/content/stories";
import { FramedAvatar } from "../ui/FramedAvatar";
import { Bracket } from "./Bracket";
import { ExternalLinks, personLinks } from "./PersonLinks";
import { PersonAvatar } from "./StoryByline";

const PILL = "border-[1.5px] px-2.5 py-0.5 text-[.84rem] font-semibold";

/** Side card: who the builder is, what they build (status derived from the project file) and the Talk thread. */
export function StoryAside({ s, p }: { s: StoryEntry; p: ProjectEntry }) {
  const t = useTranslations();
  const locale = useLocale();
  const audit = p.audits?.toSorted((a, b) => b.date.localeCompare(a.date))[0];
  const links = personLinks(s.person.links);
  return (
    <Bracket as="aside" aria-labelledby="sy-who" className="[&>section]:p-5 [&>section+section]:border-t [&>section+section]:border-line">
      <section>
        <h2 id="sy-who" className="semi mt-0 mb-3.5 text-[1.1rem]">
          {t("sy_c_about", { n: s.person.name })}
        </h2>
        <div className="flex items-center gap-3">
          <PersonAvatar story={s} size="md" />
          <strong className="text-[1.05rem]">{s.person.name}</strong>
        </div>
        {links.length > 0 && (
          <p className="mt-3 mb-0 flex flex-wrap items-center gap-x-[18px] gap-y-1">
            <span className="font-semibold text-mut">{t("sy_c_say")}</span>
            <ExternalLinks links={links} />
          </p>
        )}
      </section>
      <section>
        <p className="mt-0 mb-2.5 text-[.92rem] font-semibold text-mut">{t("sy_c_builds")}</p>
        <div className="flex items-center gap-3">
          <FramedAvatar slug={p.slug} logo={p.logo} size="sm" />
          <strong className="semi text-[1.05rem]">{p.name}</strong>
        </div>
        <ul className="mt-3 mb-0 flex list-none flex-wrap gap-1.5 p-0">
          <li className={`${PILL} ${p.testnet ? "border-accent text-accent" : "border-line"}`}>{t(p.testnet ? "pf_net" : "sy_mainnet")}</li>
          {p.categories.slice(0, 2).map((c) => (
            <li key={c} className={`${PILL} border-line`}>
              {categoryLabel(c, locale)}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 mb-2 text-[.9rem] text-mut">
          {audit ? t("sy_audited", { l: audit.label, d: audit.date.slice(0, 7) }) : t("sy_no_audit")}
        </p>
        <Link href={`/projects/${p.slug}`} className="linkbtn">
          {t("sy_c_page", { p: p.name })}
        </Link>
      </section>
      {s.talk && (
        <section>
          <a className="linkbtn" href={s.talk} target="_blank" rel="noopener">
            {t("sy_talk")}
          </a>
        </section>
      )}
    </Bracket>
  );
}
