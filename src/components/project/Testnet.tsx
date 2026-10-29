import { useTranslations } from "next-intl";
import { Section } from "./Sections";

/** Under the hero of a testnet proof: not dismissible, so nobody sends real assets to it. */
export function TestnetNote() {
  const t = useTranslations();
  return (
    <div role="note" className="on-paper border-b border-line">
      <div className="in flex items-start gap-3.5 py-4 before:h-6 before:w-3.5 before:flex-none before:bg-purple before:content-['']">
        <p className="m-0 max-w-[80ch] font-semibold">
          {t("pf_note")} <span className="font-normal text-mut">{t("pf_note2")}</span>
        </p>
      </div>
    </div>
  );
}

const ROW = "grid grid-cols-1 gap-x-4 gap-y-0.5 border-b border-line py-3 min-[561px]:grid-cols-[10rem_minmax(0,1fr)]";

/** Where a builder picks a proof up: its code, and the way to reach whoever wrote it. */
export function BuildOnIt({ repo }: { repo: string }) {
  const t = useTranslations();
  const rows = [
    { label: t("pf_repo"), href: `https://github.com/${repo}`, text: `github.com/${repo}` },
    { label: t("pf_talk"), href: `https://github.com/${repo}/issues/new`, text: t("pf_talk_v") },
  ];
  return (
    <Section title={t("pf_build_h")}>
      <dl className="m-0 border-t-2 border-fg">
        {rows.map((r) => (
          <div key={r.href} className={ROW}>
            <dt className="text-[.9rem] font-semibold text-mut">{r.label}</dt>
            <dd className="m-0 [overflow-wrap:anywhere]">
              <a className="linkbtn" href={r.href} target="_blank" rel="noopener">
                {r.text}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
