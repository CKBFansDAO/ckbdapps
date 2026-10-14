import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { RepoSignals } from "@/lib/github";
import { editUrl, projectFilePath } from "@/lib/site";
import { SlotButton } from "../ui/SlotButton";

// Side column of the project page: derived signals and the one file the team maintains.

function Panel({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <div className="on-dark mb-3.5 bg-ink p-[22px]">
      <h2 className="semi mt-0 mb-3.5 text-[1.1rem]">{title}</h2>
      <p className="-mt-1.5 mb-3.5 text-[.9rem] text-mut">{note}</p>
      {children}
    </div>
  );
}

function Tile({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="min-w-0 bg-fg/6 p-4">
      <div className="wide text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.05] [overflow-wrap:anywhere]">{value}</div>
      <div className="mt-2.5 text-[.9rem] font-semibold">{label}</div>
      <div className="mt-0.5 font-mono text-[.74rem] font-medium text-mut">{sub}</div>
    </div>
  );
}

export function Signals({ signals, now }: { signals: RepoSignals | null; now: number }) {
  const t = useTranslations();
  const locale = useLocale();
  // No github line or a repo GitHub could not answer for: the whole panel hides rather than guessing.
  if (!signals) return null;
  const ago = (iso: string) => {
    const days = Math.max(0, Math.floor((now - Date.parse(iso)) / 86_400_000));
    return days < 60 ? t("ago_d", { n: days }) : t("ago_mo", { n: Math.round(days / 30) });
  };
  return (
    <Panel title={t("sig_h")} note={t("sig_p")}>
      <div className="grid grid-cols-2 gap-2.5">
        <Tile value={signals.license ?? t("sg_none")} label={t("sg_license")} sub="GitHub" />
        {signals.lastCommit && <Tile value={ago(signals.lastCommit)} label={t("sg_commit")} sub="GitHub" />}
        <Tile value={signals.stars.toLocaleString(locale)} label={t("sg_stars")} sub="GitHub" />
      </div>
    </Panel>
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
