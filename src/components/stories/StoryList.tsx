import { Link } from "@/i18n/navigation";
import { htmlLang } from "@/i18n/routing";
import type { StoryCard } from "@/lib/content/stories";
import { NameLine } from "./StoryByline";
import { StoryCover } from "./StoryCover";

/** Stories as rows (a list, not a card grid): cover, who, title, one line, date. */
export function StoryList({ stories }: { stories: StoryCard[] }) {
  return (
    <ul className="m-0 list-none p-0">
      {stories.map((s) => (
        <li key={s.slug}>
          <Link
            href={`/stories/${s.slug}`}
            className="group grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 border-b border-line py-[22px] no-underline"
          >
            <StoryCover no={s.no} size="sm" />
            <span>
              <NameLine story={s} className="block text-[.92rem]" />
              <strong lang={htmlLang(s.lang)} className="semi mt-1 block text-[1.35rem] leading-[1.15] decoration-accent decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline">
                {s.title}
              </strong>
              <span lang={htmlLang(s.lang)} className="mt-1.5 block max-w-[64ch] text-mut">{s.dek}</span>
              <span className="mt-2 block font-mono text-[.82rem] font-medium text-mut">
                {s.published}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
