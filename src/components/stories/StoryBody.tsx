import Image from "next/image";
import { htmlLang } from "@/i18n/routing";
import type { StoryBlock } from "@/lib/story-markdown";

// Reading column for the story's own Markdown: paragraphs, sections, lists, code, links. Direct children only,
// so the pull quotes (styled by the renderer) keep their own spacing.
const PROSE =
  "text-[1.1rem] leading-[1.72] zh:leading-[1.9] [&>p]:mt-0 [&>p]:mb-5 [&>h2]:semi [&>h2]:mt-[2.2em] [&>h2]:mb-[.7em] [&>h2]:text-[clamp(1.45rem,2.4vw,1.8rem)] [&>h2]:leading-[1.12] [&>h3]:semi [&>h3]:mt-8 [&>h3]:mb-2 [&>h3]:text-[1.2rem] [&>h4]:mt-6 [&>h4]:mb-2 [&>h4]:font-bold [&>ul]:mb-5 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:mb-5 [&>ol]:list-decimal [&>ol]:pl-6 [&_li]:mb-1.5 [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-4 [&>pre]:mt-0 [&>pre]:mb-5 [&>pre]:overflow-x-auto [&>pre]:border-l-4 [&>pre]:border-purple [&>pre]:bg-ink [&>pre]:px-[18px] [&>pre]:py-4 [&>pre]:font-mono [&>pre]:text-[.84rem] [&>pre]:leading-[1.7] [&>pre]:text-white [&_:not(pre)>code]:bg-fg/8 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[.92em] [&>hr]:my-10 [&>hr]:border-line";
// The opening paragraph reads a little larger.
const LEAD = "[&>p:first-child]:text-[clamp(1.2rem,1.9vw,1.42rem)] [&>p:first-child]:leading-[1.55]";

export function StoryBody({ blocks, lang }: { blocks: StoryBlock[]; lang: "en" | "zh" }) {
  return (
    <article lang={htmlLang(lang)} className="max-w-[66ch]">
      {blocks.map((b, i) =>
        b.kind === "html" ? (
          <div key={i} className={`${PROSE} ${i === 0 ? LEAD : ""}`} dangerouslySetInnerHTML={{ __html: b.html }} />
        ) : (
          <figure key={i} className="mx-0 my-8">
            <Image src={b.src} alt="" width={b.width} height={b.height} sizes="(min-width: 1000px) 720px, 100vw" className="block h-auto w-full" />
            {b.alt && <figcaption className="mt-2.5 text-[.92rem] text-mut">{b.alt}</figcaption>}
          </figure>
        ),
      )}
    </article>
  );
}
