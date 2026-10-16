import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { type ActivityEntry, day, type Status } from "@/lib/activity-source";
import { CommitBars } from "./CommitBars";
import { Section } from "./Sections";

// Plug fill by status: full = active, half = quiet, an open dashed slot = no recent activity.
const MARK: Record<Status, { fill: number; plug: "solid" | "open" }> = {
  active: { fill: 100, plug: "solid" },
  quiet: { fill: 50, plug: "solid" },
  dormant: { fill: 0, plug: "open" },
  archived: { fill: 0, plug: "open" },
  unknown: { fill: 0, plug: "open" },
};

function StatusMark({ status }: { status: Status }) {
  const { fill, plug } = MARK[status];
  return (
    <span aria-hidden className="flex h-5 flex-none items-stretch">
      <span className="w-9 border-[3px] border-r-0 border-fg p-[3px]">
        <span className="block h-full w-[calc(var(--f)*1%)] bg-purple" style={{ "--f": fill } as CSSProperties} />
      </span>
      <span className={plug === "solid" ? "w-3.5 bg-purple" : "w-3.5 border-2 border-dashed border-purple"} />
    </span>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5">
      <dt className="text-mut">{label}</dt>
      <dd className="m-0 text-right font-semibold [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

type Props = { entry?: ActivityEntry; repo?: string; unavailable: boolean };

/** Is this project still alive? Public GitHub activity, collected by the backend. Renders nothing without data. */
export function Activity({ entry, repo, unavailable }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const link = "underline decoration-accent decoration-2 underline-offset-4";

  if (!entry?.github) {
    // The backend is down: say so and point at the repo instead of guessing. No github line, nothing to show.
    if (!unavailable || !repo) return null;
    return (
      <Section title={t("act_h")}>
        <p className="m-0">
          {t("act_down")}{" "}
          <a className={`font-bold ${link}`} href={`https://github.com/${repo}`} target="_blank" rel="noopener">
            {t("act_open_gh")}
          </a>
        </p>
      </Section>
    );
  }

  const g = entry.github;
  const release = g.releases[0];
  return (
    <Section title={t("act_h")}>
      <div className="flex items-center gap-4">
        <StatusMark status={entry.status} />
        <p className="m-0 font-extrabold">
          {t(`act_s_${entry.status}`)}
          {entry.lastActivityAt && (
            <span className="ml-3 font-mono text-[.9rem] font-medium text-mut">{t("act_last", { d: day(entry.lastActivityAt) })}</span>
          )}
        </p>
      </div>
      <p className="mt-2 mb-0 max-w-[62ch] text-[.95rem] text-mut">{t(`act_d_${entry.status}`)}</p>

      <div className="mt-7 grid grid-cols-1 items-start gap-x-[clamp(28px,5vw,64px)] gap-y-8 min-[561px]:grid-cols-2">
        <CommitBars weekly={g.weekly} />
        <dl className="m-0 border-t-2 border-fg text-[.95rem]">
          {g.lastCommitAt && <Fact label={t("sg_commit")}>{day(g.lastCommitAt)}</Fact>}
          <Fact label={t("act_c30")}>{g.commits30d.toLocaleString(locale)}</Fact>
          <Fact label={t("act_c90")}>{g.commits90d.toLocaleString(locale)}</Fact>
          {release && (
            <Fact label={t("act_release")}>
              <a className={link} href={release.url} target="_blank" rel="noopener">
                {release.name || release.tag}
              </a>{" "}
              <span className="font-mono text-[.85rem] font-medium text-mut">{day(release.at)}</span>
            </Fact>
          )}
          <Fact label={t("sg_stars")}>{g.stars.toLocaleString(locale)}</Fact>
          <Fact label={t("sg_license")}>{g.license ?? t("sg_none")}</Fact>
        </dl>
      </div>
      <p className="mt-5 mb-0 max-w-[62ch] font-mono text-[.8rem] font-medium text-mut">
        {repo && (
          <>
            <a className={link} href={`https://github.com/${repo}`} target="_blank" rel="noopener">
              github.com/{repo}
            </a>
            {" · "}
          </>
        )}
        {t("act_src", { d: day(g.fetchedAt) })}
      </p>
      <p className="mt-1.5 mb-0 max-w-[62ch] text-[.85rem] text-mut">{t("act_note")}</p>
    </Section>
  );
}
