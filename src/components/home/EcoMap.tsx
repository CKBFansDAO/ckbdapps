"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Cell = { slug: string; name: string; sym: string; community: boolean; tags: string };
type Props = { groups: { id: string; label: string; cells: Cell[] }[] };

/**
 * Overview, not a second list: every project is one cell, grouped.
 * A group's link opens Explore with that filter; a cell opens the project.
 */
export function EcoMap({ groups }: Props) {
  const t = useTranslations();
  const [active, setActive] = useState<Cell | null>(null);

  return (
    <section id="map" className="on-dark scroll-mt-(--hh) py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="mb-[clamp(24px,4vw,44px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <h2 className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("map_h")}</h2>
          <p className="m-0 max-w-[42ch] text-mut">{t("map_p")}</p>
        </div>
        <div onMouseLeave={() => setActive(null)} onBlur={() => setActive(null)}>
          {groups.map((g) => (
            <div
              key={g.id}
              className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line py-[26px] last:border-b min-[761px]:grid-cols-[240px_minmax(0,1fr)]"
            >
              <div>
                <h3 className="semi m-0 text-2xl leading-[1.1]">{g.label}</h3>
                <p className="mt-1.5 mb-3 text-[.9rem] text-mut">{g.cells.length}</p>
                <Link href={{ pathname: "/explore", query: { group: g.id } }} className="linkbtn">
                  {t("map_all")}
                </Link>
              </div>
              <ul className="m-0 flex list-none flex-wrap content-start gap-1.5 p-0">
                {g.cells.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/projects/${c.slug}`}
                      aria-label={`${c.sym} ${c.name}`}
                      onMouseEnter={() => setActive(c)}
                      onFocus={() => setActive(c)}
                      className={`grid size-[34px] place-items-center font-mono text-[.66rem] font-semibold no-underline transition-colors duration-100 hover:border-purple hover:bg-purple hover:text-white min-[521px]:size-10 min-[521px]:text-[.74rem] ${c.community ? "border-2 border-purple-hi text-purple-hi" : "border border-white/26"}`}
                    >
                      {c.sym}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-[18px] mb-0 min-h-[1.7em] text-[.95rem] text-mut" aria-live="polite">
          {active ? (
            <>
              <strong className="text-fg">{active.name}</strong> {active.tags}
            </>
          ) : (
            t("map_idle")
          )}
        </p>
      </div>
    </section>
  );
}
