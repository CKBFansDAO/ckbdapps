import { useTranslations } from "next-intl";
import type { View } from "./ProjectList";

type Props = {
  q: string;
  onQ: (q: string) => void;
  groups: { id: string; label: string; count: number }[];
  total: number;
  group: string | null;
  onGroup: (g: string | null) => void;
  community: boolean;
  onCommunity: (on: boolean) => void;
  view: View;
  onView: (v: View) => void;
};

const TAB =
  "min-h-10 border-b-[3px] border-transparent px-3 py-2 text-[.92rem] font-bold text-mut hover:text-fg aria-pressed:border-purple aria-pressed:text-fg";

export function Toolbar({ q, onQ, groups, total, group, onGroup, community, onCommunity, view, onView }: Props) {
  const t = useTranslations();
  const tab = (id: string | null, label: string, count: number) => (
    <button key={id ?? "all"} type="button" className={TAB} aria-pressed={group === id} onClick={() => onGroup(id)}>
      {label}
      <b className="ml-[5px] font-mono text-[.72rem] font-medium">{count}</b>
    </button>
  );

  return (
    <div className="static border-y-2 border-fg bg-bg sm:sticky sm:top-[calc(var(--hh)+env(safe-area-inset-top,0px))] sm:z-30">
      <div className="in flex flex-wrap items-center gap-x-5 gap-y-2.5 py-3">
        {/* A small slot: the filter field is the bracket, the plug grows while it has focus */}
        <div className="flex h-[46px] min-w-0 flex-[1_1_260px]">
          <input
            type="search"
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder={t("fph")}
            aria-label={t("fph")}
            autoComplete="off"
            className="peer min-w-0 flex-1 rounded-none border-4 border-r-0 border-fg bg-surface px-3.5 font-semibold text-fg outline-offset-4 placeholder:text-mut placeholder:opacity-100"
          />
          <span
            aria-hidden="true"
            className="my-1 w-[18px] flex-none bg-purple transition-[width] duration-150 peer-focus:w-[26px] motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-wrap gap-1" role="group" aria-label={t("groups")}>
          {tab(null, t("all"), total)}
          {groups.map((g) => tab(g.id, g.label, g.count))}
        </div>
        <label className="inline-flex min-h-10 items-center gap-2 text-[.9rem] font-semibold">
          <input
            type="checkbox"
            checked={community}
            onChange={(e) => onCommunity(e.target.checked)}
            className="m-0 size-[17px] accent-accent"
          />
          {t("comm")}
        </label>
        <div className="ml-auto inline-flex border-2 border-fg" role="group" aria-label={t("view")}>
          {(["list", "grid"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => onView(v)}
              className="min-h-9 px-3 py-1.5 text-[.85rem] font-bold aria-pressed:bg-fg aria-pressed:text-bg"
            >
              {t(v)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
