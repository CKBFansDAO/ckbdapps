import { Marked, type Token, type Tokens, type TokensList } from "marked";
import { storyAssetPath } from "./content/stories";
import type { ImageSizes } from "./story-images";

// Server-only: runs at build time. Stories are plain GitHub Markdown; nothing here needs syntax GitHub cannot show.

export type StoryBlock =
  | { kind: "html"; html: string }
  | { kind: "image"; src: string; alt: string; width: number; height: number };

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;
/** A picture next to the Markdown file: `./shot-1.webp` or `shot-1.webp`. */
const LOCAL_IMAGE = /^(?:\.\/)?([\w.-]+\.webp)$/;

/** File name of a local story image, or undefined for anything else. */
export const localImage = (href: string) => LOCAL_IMAGE.exec(href)?.[1];

// Pull quote in the slot motif: three sides of the bracket, the plug on the right. The builder's name goes under it.
const QUOTE =
  "relative my-9 mr-[18px] border-[6px] border-r-0 border-fg px-[clamp(18px,3vw,26px)] py-[clamp(16px,2.6vw,22px)] after:absolute after:-top-[6px] after:-right-[18px] after:-bottom-[6px] after:w-[18px] after:bg-purple after:content-['']";
const QUOTE_TEXT =
  "semi text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.22] zh:leading-[1.45] [&_p]:m-0 [&_p+p]:mt-3";

function marked(quoteBy: string) {
  return new Marked({
    gfm: true,
    async: false,
    renderer: {
      // No raw HTML from content files.
      html: ({ text }: Tokens.HTML | Tokens.Tag) => escape(text),
      // The page's h1 is the title; ## is a section (h2), ### a sub-section.
      heading({ tokens, depth }: Tokens.Heading) {
        const level = Math.min(Math.max(depth, 2), 4);
        return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        if (!SAFE_HREF.test(href)) return text;
        const ext = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ""}${ext}>${text}</a>`;
      },
      // Long lines scroll sideways, so the block takes keyboard focus to be scrollable without a mouse.
      code: ({ text, lang }: Tokens.Code) =>
        `<pre tabindex="0"><code${lang ? ` class="language-${escape(lang)}"` : ""}>${escape(text)}</code></pre>\n`,
      // A picture inside a sentence is not a figure; keep its description.
      image: ({ text }: Tokens.Image) => escape(text),
      blockquote({ tokens }: Tokens.Blockquote) {
        return `<blockquote class="${QUOTE}"><div class="${QUOTE_TEXT}">${this.parser.parse(tokens)}</div><footer class="mt-3.5 text-[.92rem] font-semibold text-mut">${escape(quoteBy)}</footer></blockquote>\n`;
      },
    },
  });
}

/** A paragraph that is only a picture: that becomes a figure with the description as its caption. */
function figureOf(token: Token): Tokens.Image | undefined {
  if (token.type !== "paragraph") return undefined;
  const inner = (token as Tokens.Paragraph).tokens.filter((t) => !(t.type === "text" && !t.raw.trim()));
  return inner.length === 1 && inner[0].type === "image" ? (inner[0] as Tokens.Image) : undefined;
}

/**
 * The story body as HTML runs and figures. Figures are separate so the page can render them with explicit
 * sizes; their files live next to the Markdown and are served from /stories/<slug>/.
 */
export function renderStory(
  md: string,
  { slug, quoteBy, images = {} }: { slug: string; quoteBy: string; images?: ImageSizes },
): StoryBlock[] {
  const m = marked(quoteBy);
  const tokens = m.lexer(md);
  const blocks: StoryBlock[] = [];
  let run: Token[] = [];
  const flush = () => {
    if (!run.length) return;
    blocks.push({ kind: "html", html: m.parser(Object.assign(run, { links: tokens.links }) as TokensList) });
    run = [];
  };
  for (const token of tokens) {
    const img = figureOf(token);
    const file = img && localImage(img.href);
    const size = file ? images[file] : undefined;
    if (!img || !file || !size) {
      run.push(token);
      continue;
    }
    flush();
    blocks.push({ kind: "image", src: storyAssetPath(slug, file), alt: img.text, ...size });
  }
  flush();
  return blocks;
}

/** What validation needs to know about a body: every picture it points to and whether it has raw HTML. */
export function inspectStory(md: string): { images: string[]; html: boolean } {
  const m = new Marked({ gfm: true });
  const out = { images: [] as string[], html: false };
  m.walkTokens(m.lexer(md), (t) => {
    if (t.type === "image") out.images.push((t as Tokens.Image).href);
    if (t.type === "html") out.html = true;
  });
  return out;
}
