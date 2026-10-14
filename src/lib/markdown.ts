import { Marked, type Tokens } from "marked";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;

// Server-only: runs at build time, never shipped to the client.
const marked = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // No raw HTML from content files.
    html: ({ text }: Tokens.HTML | Tokens.Tag) => escape(text),
    // The page already has h1/h2; body headings start at h3.
    heading({ tokens, depth }: Tokens.Heading) {
      const level = Math.min(depth + 2, 6);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      if (!SAFE_HREF.test(href)) return text;
      const ext = /^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : "";
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ""}${ext}>${text}</a>`;
    },
    // Images are not part of the content model; keep the alt text.
    image: ({ text }: Tokens.Image) => escape(text),
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md) as string;
}
