import { useTranslations } from "next-intl";
import { type ActivityEvent, day } from "@/lib/activity-source";

/** The latest few things people did in the repository, each linking to it on GitHub. */
export function ActivityEvents({ events }: { events: ActivityEvent[] }) {
  const t = useTranslations();
  if (!events.length) return null;
  return (
    <div className="mt-8">
      <h3 className="mt-0 mb-3 text-[.95rem] font-bold">{t("act_recent_h")}</h3>
      <ol className="m-0 list-none border-t-2 border-fg p-0">
        {events.map((e) => (
          <li key={e.url} className="border-b border-line py-3">
            <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[.8rem] font-semibold whitespace-nowrap text-accent">{t(`act_k_${e.kind}`)}</span>
              <a className="linkbtn min-w-0 font-semibold [overflow-wrap:anywhere]" href={e.url} target="_blank" rel="noopener">
                {e.title || e.url.replace(/^https:\/\/github\.com\//, "")}
              </a>
              {e.times > 1 && <span className="font-mono text-[.8rem] text-mut">{t("act_times", { n: e.times })}</span>}
            </p>
            <p className="mt-1 mb-0 font-mono text-[.8rem] font-medium text-mut">
              {e.actor} · {day(e.at)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
