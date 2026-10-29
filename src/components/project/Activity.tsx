import type { CSSProperties, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { pulseRepoUrl } from "@/lib/activity";
import { day, type RepoActivity, type Status } from "@/lib/activity-source";
import { ActivityEvents } from "./ActivityEvents";
import { DailyBars } from "./DailyBars";
import { Section } from "./Sections";

// Plug fill by status: full = active, half = quiet, an open dashed slot = no recent activity.
const MARK: Record<Status, { fill: number; plug: "solid" | "open" }> = {
  active: { fill: 100, plug: "solid" },
  quiet: { fill: 50, plug: "solid" },
  dormant: { fill: 0, plug: "open" },
};

export function StatusMark({ status }: { status: Status }) {
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

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5">
      <dt className="text-mut">{label}</dt>
      <dd className="m-0 text-right font-semibold [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

/**
 * Is this project still alive? Public GitHub activity from CKB Pulse.
 * Renders nothing when the project has no github line or Pulse does not follow it (data undefined).
 */
export function Activity({ data, repo }: { data: RepoActivity | null | undefined; repo?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  if (data === undefined || !repo) return null;

  if (data === null) {
    // Pulse is down: say so and point at the repo instead of guessing.
    return (
      <Section title={t("act_h")}>
        <p className="m-0">
          {t("act_down")}{" "}
          <a className="linkbtn" href={`https://github.com/${repo}`} target="_blank" rel="noopener">
            {t("act_open_gh")}
          </a>
        </p>
      </Section>
    );
  }

  return (
    <Section title={t("act_h")}>
      <div className="flex items-center gap-4">
        <StatusMark status={data.status} />
        <p className="m-0 font-extrabold">
          {t(`act_s_${data.status}`)}
          {data.lastActivityAt && (
            <span className="ml-3 font-mono text-[.9rem] font-medium text-mut">{t("act_last", { d: day(data.lastActivityAt) })}</span>
          )}
        </p>
      </div>
      <p className="mt-2 mb-0 max-w-[62ch] text-[.95rem] text-mut">{t(`act_d_${data.status}`)}</p>

      <div className="mt-7 grid grid-cols-1 items-start gap-x-[clamp(28px,5vw,64px)] gap-y-8 min-[561px]:grid-cols-2">
        <DailyBars daily={data.daily} />
        <dl className="m-0 border-t-2 border-fg text-[.95rem]">
          <Fact label={t("act_e30")}>{sum(data.daily).toLocaleString(locale)}</Fact>
          <Fact label={t("act_people")}>{data.contributors.toLocaleString(locale)}</Fact>
          <Fact label={t("sg_stars")}>{data.stars.toLocaleString(locale)}</Fact>
        </dl>
      </div>

      <ActivityEvents events={data.events} />

      <p className="mt-5 mb-0 max-w-[62ch] font-mono text-[.8rem] font-medium text-mut">
        <a className="linkbtn" href={`https://github.com/${data.name}`} target="_blank" rel="noopener">
          github.com/{data.name}
        </a>
        {" · "}
        {t.rich("act_src", {
          d: day(data.fetchedAt),
          pulse: (c) => (
            <a className="linkbtn" href={pulseRepoUrl(data.name)} target="_blank" rel="noopener">
              {c}
            </a>
          ),
        })}
      </p>
      <p className="mt-1.5 mb-0 max-w-[62ch] text-[.85rem] text-mut">{t("act_note")}</p>
    </Section>
  );
}
