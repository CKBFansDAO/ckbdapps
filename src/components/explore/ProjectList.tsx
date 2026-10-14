import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Identicon } from "../ui/Identicon";

export type ExploreItem = { slug: string; name: string; group: string; cats: string[]; community: boolean; logo?: string };
export type View = "list" | "grid";

type Props = {
  items: ExploreItem[];
  view: View;
  catLabels: Record<string, string>;
  groupLabels: Record<string, string>;
  communityLabel: string;
};

// In grid view a hovered card turns dark: re-point the scoped tokens so every child follows.
const ROW = {
  list:
    "grid-cols-[44px_minmax(0,1.1fr)_minmax(0,1.9fr)_7.5rem] items-center gap-4 border-b border-line py-3.5 pr-[18px] hover:bg-surface max-[760px]:grid-cols-[44px_minmax(0,1fr)]",
  grid:
    "min-h-[220px] grid-cols-1 content-start gap-[18px] bg-surface p-[18px] hover:bg-ink hover:[--accent:var(--purple-hi)] hover:[--fg:var(--white)] hover:[--line:var(--line-d)] hover:[--mut:var(--mut-d)]",
};

export function ProjectList({ items, view, catLabels, groupLabels, communityLabel }: Props) {
  const grid = view === "grid";
  const icon = grid ? "size-16" : "size-[38px]";
  const narrow = grid ? "" : "max-[760px]:col-start-2 max-[760px]:justify-self-start";

  return (
    <ul
      className={`mt-3 list-none p-0 ${grid ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-3.5" : ""}`}
    >
      {items.map((it, i) => (
        <li key={it.slug}>
          <Link
            href={`/projects/${it.slug}`}
            className={`group relative grid text-fg no-underline after:absolute after:inset-y-0 after:right-0 after:w-0 after:bg-purple after:transition-[width] after:duration-150 hover:after:w-3 focus-visible:after:w-3 motion-reduce:after:transition-none ${ROW[view]}`}
          >
            {it.logo ? (
              <Image src={it.logo} alt="" width={64} height={64} sizes={grid ? "64px" : "38px"} className={icon} loading={i < 8 ? "eager" : "lazy"} />
            ) : (
              <Identicon slug={it.slug} className={`${icon} text-fg group-hover:text-accent`} />
            )}
            <span className="flex min-w-0 flex-col">
              <strong className="text-[1.1rem] leading-[1.2] [overflow-wrap:anywhere]">{it.name}</strong>
              <span className="text-[.85rem] text-mut">{groupLabels[it.group]}</span>
            </span>
            <span className={`flex flex-wrap gap-1.5 ${narrow}`}>
              {(it.cats.length ? it.cats.map((c) => catLabels[c]) : [groupLabels[it.group]]).map((label) => (
                <span key={label} className="border border-line px-2 py-px text-[.8rem] font-semibold text-mut">
                  {label}
                </span>
              ))}
            </span>
            <span
              className={`text-[.82rem] font-bold text-accent ${grid ? "justify-self-start" : `justify-self-end ${narrow} max-[760px]:-mt-1.5`}`}
            >
              {it.community ? communityLabel : ""}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
