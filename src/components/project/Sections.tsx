import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { categoryLabel } from "@/lib/content/derive";
import type { ProjectEntry } from "@/lib/content/load";
import { renderMarkdown } from "@/lib/markdown";
import { Tile } from "../ui/Tile";

// Main column of the project page. Each section renders only when its data exists.

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="semi mt-0 mb-[18px] text-[1.8rem] leading-none">{title}</h2>
      {children}
    </section>
  );
}

export function About({ body }: { body: string }) {
  const t = useTranslations();
  if (!body) return null;
  return (
    <Section title={t("about_h")}>
      <div
        className="text-[1.08rem] [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4 [&_h3]:mt-7 [&_h3]:font-extrabold [&_h3]:mb-2 [&_h3]:text-[1.2rem] [&_li]:mb-1.5 [&_ol]:mb-3.5 [&_ol]:max-w-[62ch] [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-0 [&_p]:mb-3.5 [&_p]:max-w-[62ch] [&_ul]:mb-3.5 [&_ul]:max-w-[62ch] [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </Section>
  );
}

const ROW =
  "grid grid-cols-[1fr_4.5rem] gap-x-4 gap-y-2 border-b border-line py-3 min-[561px]:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_5rem]";

export function Contracts({ contracts }: { contracts: ProjectEntry["contracts"] }) {
  const t = useTranslations();
  if (!contracts?.length) return null;
  return (
    <Section title={t("ctr_h")}>
      <div className="border-t-2 border-fg text-[.95rem]" role="table">
        <div className={`${ROW} text-[.85rem] font-bold text-mut`} role="row">
          <span role="columnheader">{t("ctr_name")}</span>
          <span role="columnheader" className="hidden min-[561px]:inline">
            {t("ctr_hash")}
          </span>
          <span role="columnheader">{t("ctr_type")}</span>
        </div>
        {contracts.map((c) => (
          <div key={c.code_hash + c.hash_type} className={ROW} role="row">
            <span role="cell">{c.name}</span>
            <code role="cell" className="col-span-full row-start-2 font-mono text-[.85rem] font-medium [overflow-wrap:anywhere] min-[561px]:col-auto min-[561px]:row-start-auto">
              {c.code_hash}
            </code>
            <span role="cell">{c.hash_type}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Audits({ audits }: { audits: ProjectEntry["audits"] }) {
  const t = useTranslations();
  if (!audits?.length) return null;
  return (
    <Section title={t("aud_h")}>
      <ul className="m-0 list-none border-t-2 border-fg p-0">
        {audits.map((a) => (
          <li key={a.url} className="flex justify-between gap-4 border-b border-line py-3">
            <a href={a.url} target="_blank" rel="noopener" className="font-bold">
              {a.label}
            </a>
            <span className="font-mono text-[.88rem] font-medium text-mut">{a.date}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Similar({ projects, title }: { projects: ProjectEntry[]; title?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  if (!projects.length) return null;
  return (
    <Section title={title ?? t("sim")}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,150px),1fr))] gap-3.5">
        {projects.map((o) => (
          <Tile
            key={o.slug}
            small
            slug={o.slug}
            name={o.name}
            logo={o.logo}
            meta={o.categories.slice(0, 3).map((c) => categoryLabel(c, locale)).join(", ")}
          />
        ))}
      </div>
    </Section>
  );
}
