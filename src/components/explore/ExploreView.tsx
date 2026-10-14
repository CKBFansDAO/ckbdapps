"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SlotButton } from "../ui/SlotButton";
import { FilterChips } from "./FilterChips";
import { ProjectList, type ExploreItem, type View } from "./ProjectList";
import { Toolbar } from "./Toolbar";

type Props = {
  items: ExploreItem[];
  groups: { id: string; label: string; count: number }[];
  catLabels: Record<string, string>;
};

type Filters = { q: string; group: string | null; cat: string | null; community: boolean; view: View };

const PAGE = 30;
const URL_CHANGE = "explore:url";

// The URL query is the state: ?q=&group=&cat=&community=1&view=grid.
// On the server (and during hydration) the query is empty, so the static HTML is the default listing.
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_CHANGE, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_CHANGE, cb);
  };
};
const useSearch = () =>
  useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );

export function ExploreView({ items, groups, catLabels }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const sp = new URLSearchParams(useSearch());
  const f: Filters = {
    q: sp.get("q") ?? "",
    group: groups.some((g) => g.id === sp.get("group")) ? sp.get("group") : null,
    cat: sp.get("cat") && sp.get("cat")! in catLabels ? sp.get("cat") : null,
    community: sp.get("community") === "1",
    view: sp.get("view") === "grid" ? "grid" : "list",
  };

  const set = (next: Partial<Filters>) => {
    const m = { ...f, ...next };
    const qs = new URLSearchParams();
    if (m.q) qs.set("q", m.q);
    if (m.group) qs.set("group", m.group);
    if (m.cat) qs.set("cat", m.cat);
    if (m.community) qs.set("community", "1");
    if (m.view === "grid") qs.set("view", "grid");
    const s = qs.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
    window.dispatchEvent(new Event(URL_CHANGE));
  };

  const needle = f.q.trim().toLowerCase();
  const visible = items.filter(
    (it) =>
      (!f.group || it.group === f.group) &&
      (!f.cat || it.cats.includes(f.cat)) &&
      (!f.community || it.community) &&
      (!needle || `${it.name} ${it.cats.join(" ")} ${it.cats.map((c) => catLabels[c]).join(" ")}`.toLowerCase().includes(needle)),
  );

  // "Show more" resets whenever the filters (not the view) change.
  const filterKey = [needle, f.group, f.cat, f.community].join("|");
  const [page, setPage] = useState({ key: filterKey, n: PAGE });
  const shown = page.key === filterKey ? page.n : PAGE;

  // Chips: the 16 most used categories in the current group, plus the selected one.
  const counts = new Map<string, number>();
  for (const it of items) if (!f.group || it.group === f.group) for (const c of it.cats) counts.set(c, (counts.get(c) ?? 0) + 1);
  const chipIds = [...counts.keys()]
    .sort((a, b) => counts.get(b)! - counts.get(a)! || catLabels[a].localeCompare(catLabels[b], locale))
    .slice(0, 16);
  if (f.cat && !chipIds.includes(f.cat)) chipIds.unshift(f.cat);
  const groupLabels = Object.fromEntries(groups.map((g) => [g.id, g.label]));

  return (
    <>
      <div className="in pt-[clamp(40px,7vw,88px)] pb-3">
        <h1 className="wide m-0 text-[clamp(2.6rem,9vw,7rem)] leading-[.92]">{t("ex_h")}</h1>
        <p className="mt-3.5 mb-0 font-semibold text-mut" aria-live="polite">
          {t("ex_cnt", { n: visible.length, t: items.length })}
        </p>
      </div>
      <div className="in">
        <div role="note" className="mb-5 flex items-start gap-3.5 border-2 border-ink bg-purple-tint py-3.5 pr-[18px]">
          <span aria-hidden="true" className="-my-3.5 -ml-0.5 w-3 shrink-0 self-stretch border-r-2 border-ink bg-purple" />
          <p className="m-0 text-[.95rem] leading-normal text-ink">{t.rich("ex_risk", { b: (c) => <b>{c}</b> })}</p>
        </div>
      </div>
      <Toolbar
        q={f.q}
        onQ={(q) => set({ q })}
        groups={groups}
        total={items.length}
        group={f.group}
        onGroup={(group) => set({ group, cat: null })}
        community={f.community}
        onCommunity={(community) => set({ community })}
        view={f.view}
        onView={(view) => set({ view })}
      />
      <div className="in pb-[clamp(48px,8vw,104px)]">
        <FilterChips
          chips={chipIds.map((id) => ({ id, label: catLabels[id] }))}
          selected={f.cat}
          onSelect={(cat) => set({ cat })}
        />
        {visible.length ? (
          <ProjectList
            items={visible.slice(0, shown)}
            view={f.view}
            catLabels={catLabels}
            groupLabels={groupLabels}
            communityLabel={t("community")}
          />
        ) : (
          <div className="py-12">
            <p className="mt-0 mb-6 text-[1.1rem] text-mut">{t("none")}</p>
            <SlotButton onClick={() => set({ q: "", group: null, cat: null, community: false })}>{t("clear")}</SlotButton>
          </div>
        )}
        {visible.length > shown && (
          <SlotButton className="mt-7" onClick={() => setPage({ key: filterKey, n: shown + PAGE })}>
            {t("more")}
          </SlotButton>
        )}
      </div>
    </>
  );
}
