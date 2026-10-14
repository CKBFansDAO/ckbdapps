import { ImageResponse } from "next/og";
import { brandLogoDataUrl } from "@/lib/og";
import { identiconCells } from "@/components/ui/Identicon";
import { categoryLabel, groupLabel, pick } from "@/lib/content/derive";
import { getProject, loadProjects } from "@/lib/content/load";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CKBdapps project";

export function generateStaticParams() {
  return loadProjects().map((p) => ({ slug: p.slug }));
}

// Brand colours from tokens.css (Satori cannot read CSS variables).
const PAGE = "#121218";
const PURPLE = "#733dff";
const PURPLE_HI = "#9068ff";
const MUT = "#a3a2b3";
const BODY = "#e4e3ee"; // tagline: a touch brighter than --mut-d for small-type legibility

/**
 * Shared image for a project page: the slot motif (white bracket, purple plug) around the project's identicon.
 * Text is English: the bundled OG font has no CJK glyphs.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  const brand = await brandLogoDataUrl();
  const name = p?.name ?? "CKBdapps";
  const tagline = p ? pick(p.tagline, "en") : "";
  const meta = p ? [groupLabel(p.group, "en"), ...p.categories.map((c) => categoryLabel(c, "en"))].join("  ·  ") : "";
  const cell = 36;

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: PAGE, color: "white", padding: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30 }}>
          <img src={brand} width={48} height={48} alt="" style={{ borderRadius: 10 }} />
          CKBdapps
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 72, marginTop: 56, flex: 1 }}>
          <div style={{ display: "flex", position: "relative", width: 236, height: 236, border: "18px solid white", borderRight: "0", marginRight: 40 }}>
            {identiconCells(slug).map(([x, y]) => (
              <div
                key={`${x}-${y}`}
                style={{ position: "absolute", left: 18 + x * cell, top: 18 + y * cell, width: cell - 4, height: cell - 4, background: PURPLE_HI }}
              />
            ))}
            <div style={{ position: "absolute", right: -40, top: -18, bottom: -18, width: 40, background: PURPLE }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: name.length > 16 ? 72 : 96, lineHeight: 1, letterSpacing: -2 }}>{name}</div>
            {tagline && (
              <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.35, color: BODY, maxHeight: 122, overflow: "hidden" }}>
                {tagline}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: MUT }}>{meta}</div>
      </div>
    ),
    size,
  );
}
