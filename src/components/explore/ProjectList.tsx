import { Link } from "@/i18n/navigation";
import { FramedAvatar } from "../ui/FramedAvatar";

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
    "grid-cols-[53px_minmax(0,1fr)] items-center gap-4 border-b border-line py-3.5 pr-[18px] hover:bg-surface min-[761px]:grid-cols-[53px_minmax(0,1.1fr)_minmax(0,1.9fr)_7.5rem]",
  grid:
    "min-h-[220px] grid-cols-1 content-start gap-[18px] bg-surface p-[18px] hover:bg-ink hover:[--accent:var(--purple-hi)] hover:[--fg:var(--white)] hover:[--line:var(--line-d)] hover:[--mut:var(--mut-d)]",
};

export function ProjectList({ items, view, catLabels, groupLabels, communityLabel }: Props) {
  const grid = view === "grid";
  // List rows collapse to two columns on mobile: the tags and the community mark move to column 2.
  const narrow = grid ? "" : "col-start-2 min-[761px]:col-start-auto";

  return (
    <ul
      className={`mt-3 list-none p-0 [--avatar-ic:var(--accent)] ${grid ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,230px),1fr))] gap-3.5" : ""}`}
    >
      {items.map((it) => (
        <li key={it.slug}>
          <Link
            href={`/projects/${it.slug}`}
            className={`group relative grid text-fg no-underline after:absolute after:inset-y-0 after:right-0 after:w-0 after:bg-purple after:transition-[width] after:duration-150 hover:after:w-3 focus-visible:after:w-3 motion-reduce:after:transition-none ${ROW[view]}`}
          >
            <FramedAvatar slug={it.slug} logo={it.logo} size={grid ? "md" : "sm"} />
            <span className="flex min-w-0 flex-col">
              <strong className="text-[1.1rem] leading-[1.2] [overflow-wrap:anywhere]">{it.name}</strong>
              <span className="text-[.85rem] text-mut">{groupLabels[it.group]}</span>
            </span>
            <span className={`flex flex-wrap gap-1.5 justify-self-start min-[761px]:justify-self-auto ${narrow}`}>
              {(it.cats.length ? it.cats.map((c) => catLabels[c]) : [groupLabels[it.group]]).map((label) => (
                <span key={label} className="border border-line px-2 py-px text-[.8rem] font-semibold text-mut">
                  {label}
                </span>
              ))}
            </span>
            <span
              className={`text-[.82rem] font-bold text-accent ${grid ? "justify-self-start" : `-mt-1.5 justify-self-start min-[761px]:mt-0 min-[761px]:justify-self-end ${narrow}`}`}
            >
              {it.community ? communityLabel : ""}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
