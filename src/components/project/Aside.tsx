import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { editUrl, projectFilePath } from "@/lib/site";
import { SlotButton } from "../ui/SlotButton";

// Side column of the project page: the one file the team maintains.

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="on-dark mb-3.5 bg-ink p-[22px]">
      <h2 className="semi mt-0 mb-3.5 text-[1.1rem]">{title}</h2>
      <p className="-mt-1.5 mb-3.5 text-[.9rem] text-mut">{note}</p>
      {children}
    </div>
  );
}

export function SourceFile({ slug, source }: { slug: string; source: string }) {
  const t = useTranslations();
  const all = source.replace(/\n+$/, "").split("\n");
  // Front matter only: up to and including the closing fence (falls back to the whole file if malformed).
  const close = all.indexOf("---", 1);
  const lines = close > 0 ? all.slice(0, close + 1) : all;
  return (
    <Panel title={t("src_h")} note={t("src_p", { n: lines.length })}>
      <p className="mt-0 mb-1.5 font-mono text-[.78rem] font-medium text-mut">{projectFilePath(slug)}</p>
      <pre className="mt-0 mb-4 border border-line bg-page p-3.5 font-mono text-[.78rem] leading-[1.65] font-medium whitespace-pre-wrap text-fg/90 [overflow-wrap:anywhere]">
        {lines.map((line, i) => {
          const m = /^(\s*(?:- )?)([a-z_]+)(:.*)$/.exec(line);
          return (
            <span key={i}>
              {line === "---" ? (
                <span className="text-mut">{line}</span>
              ) : m ? (
                <>
                  {m[1]}
                  <span className="text-purple-hi">{m[2]}</span>
                  {m[3]}
                </>
              ) : (
                line
              )}
              {"\n"}
            </span>
          );
        })}
      </pre>
      <SlotButton href={editUrl(slug)}>{t("edit")}</SlotButton>
    </Panel>
  );
}
