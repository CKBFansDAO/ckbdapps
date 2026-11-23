import { useLocale, useTranslations } from "next-intl";
import { pick } from "@/lib/content/derive";
import type { StoryEntry } from "@/lib/content/stories";
import { Bracket } from "./Bracket";
import { ExternalLinks, personLinks } from "./PersonLinks";

/** "Want to help <name>?": one to three things a reader can do now, and where to reach them. */
export function StoryHelp({ s }: { s: StoryEntry }) {
  const t = useTranslations();
  const locale = useLocale();
  if (!s.help) return null;
  return (
    <Bracket as="section" aria-labelledby="sy-help" className="mt-12 px-[clamp(18px,3vw,26px)] py-6">
      <h2 id="sy-help" className="semi mt-0 mb-3.5 text-[1.45rem]">
        {t("sy_help_h", { n: s.person.name })}
      </h2>
      <ol className="m-0 grid list-none gap-3 p-0">
        {s.help.map((h, i) => (
          <li key={i} className="grid grid-cols-[2.2rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="pt-0.5 font-mono text-[.9rem] font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            {pick(h, locale)}
          </li>
        ))}
      </ol>
      <p className="mt-4 mb-0 flex flex-wrap items-center gap-x-[22px] gap-y-1 border-t border-line pt-2.5">
        <ExternalLinks links={[...personLinks(s.person.links), ...(s.talk ? [{ label: t("sy_talk"), href: s.talk }] : [])]} />
      </p>
    </Bracket>
  );
}
