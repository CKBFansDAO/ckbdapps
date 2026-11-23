import type { StoryData } from "@/lib/content/schema";

const SITES = {
  github: ["GitHub", "https://github.com/"],
  x: ["X", "https://x.com/"],
  telegram: ["Telegram", "https://t.me/"],
} as const;

/** The builder's own links, in a fixed order. */
export function personLinks(links: StoryData["person"]["links"]): { label: string; href: string }[] {
  return (Object.keys(SITES) as (keyof typeof SITES)[]).flatMap((k) => (links?.[k] ? [{ label: SITES[k][0], href: SITES[k][1] + links[k] }] : []));
}

export function ExternalLinks({ links }: { links: { label: string; href: string }[] }) {
  return links.map((l) => (
    <a key={l.href} className="linkbtn" href={l.href} target="_blank" rel="noopener">
      {l.label}
    </a>
  ));
}
