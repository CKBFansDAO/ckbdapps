import { ImageResponse } from "next/og";
import { getProject } from "@/lib/content/load";
import { padIssue, storyText } from "@/lib/content/story-derive";
import { getStory, loadStories } from "@/lib/content/stories";
import { brandLogoDataUrl, cjkFontBase64 } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CKBdapps Builder Story";

export function generateStaticParams() {
  const slugs = loadStories().map((s) => s.slug);
  return (slugs.length ? slugs : ["_"]).map((slug) => ({ slug }));
}

// Brand colours from tokens.css (Satori cannot read CSS variables).
const PAGE = "#121218";
const PURPLE = "#733dff";
const MUT = "#a3a2b3";

/**
 * Share card: the whole card is one slot (white bracket, purple plug); title and "No. 04 // name // project" on the
 * left, the story's cover (its issue number in a smaller slot) on the right. Chinese pages use the Chinese title.
 */
export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const s = getStory(slug);
  const brand = await brandLogoDataUrl();
  if (!s) return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: PAGE }} />, size);

  let text = storyText(s, locale);
  const project = getProject(s.project)?.name ?? s.project;
  const no = padIssue(s.no);
  const series = (zh: boolean) => (zh ? "建设者故事" : "Builder Stories");
  const issue = (zh: boolean) => (zh ? `第 ${no} 期` : `No. ${no}`);
  let fonts: { name: string; data: ArrayBuffer; weight: 900 }[] | undefined;
  if (text.lang === "zh") {
    const b64 = await cjkFontBase64(`CKBdapps${series(true)}${text.title}${issue(true)}${s.person.name}${project}/0123456789 `);
    if (b64) {
      const buf = Buffer.from(b64, "base64");
      fonts = [{ name: "Noto Sans SC", data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), weight: 900 }];
    } else text = storyText(s, "en");
  }
  const zh = text.lang === "zh";
  const titleSize = text.title.length > (zh ? 7 : 34) ? (zh ? 64 : 62) : zh ? 80 : 78;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: PAGE, color: "white", position: "relative", fontFamily: fonts ? "Noto Sans SC" : undefined }}>
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 64,
            bottom: 64,
            right: 120,
            display: "flex",
            alignItems: "center",
            gap: 56,
            padding: "44px 52px",
            borderLeft: "16px solid white",
            borderTop: "16px solid white",
            borderBottom: "16px solid white",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
              <img src={brand} width={40} height={40} alt="" style={{ borderRadius: 8 }} />
              CKBdapps
              <span style={{ color: MUT }}>{series(zh)}</span>
            </div>
            <div style={{ display: "flex", fontSize: titleSize, lineHeight: zh ? 1.18 : 1.04, letterSpacing: zh ? 0 : -1.5 }}>{text.title}</div>
            <div style={{ display: "flex", fontSize: 26, color: MUT }}>
              <span style={{ color: "white" }}>{issue(zh)}</span>
              <span style={{ margin: "0 12px" }}>{"//"}</span>
              <span style={{ color: "white" }}>{s.person.name}</span>
              <span style={{ margin: "0 12px" }}>{"//"}</span>
              {project}
            </div>
          </div>
          <div style={{ display: "flex", position: "relative", alignItems: "center", justifyContent: "center", width: 220, height: 220, marginRight: 34, borderLeft: "12px solid white", borderTop: "12px solid white", borderBottom: "12px solid white", fontSize: 104, letterSpacing: -4 }}>
            {no}
            <div style={{ position: "absolute", right: -34, top: -12, bottom: -12, width: 34, background: PURPLE }} />
          </div>
          <div style={{ position: "absolute", right: -56, top: -16, bottom: -16, width: 56, background: PURPLE }} />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
