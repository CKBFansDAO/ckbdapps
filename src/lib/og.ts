import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";

/** The brand logo as a data URL for OG images. Cached so the images prerender at build time. */
export async function brandLogoDataUrl(): Promise<string> {
  "use cache";
  cacheLife("max");
  const png = await readFile(path.join(process.cwd(), "public/brand/logo.png"));
  return `data:image/png;base64,${png.toString("base64")}`;
}

/**
 * Noto Sans SC (900) cut down to the characters in `text`, as base64, for OG images with Chinese text: the font
 * bundled with next/og has no CJK glyphs. Fetched once at build time from Google Fonts (TrueType, which Satori
 * reads); undefined if that fails, and the caller falls back to English.
 */
export async function cjkFontBase64(text: string): Promise<string | undefined> {
  "use cache";
  cacheLife("max");
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@900&text=${encodeURIComponent(text)}`)).text();
    const url = /src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/.exec(css)?.[1];
    if (!url) return undefined;
    const res = await fetch(url);
    return res.ok ? Buffer.from(await res.arrayBuffer()).toString("base64") : undefined;
  } catch {
    return undefined;
  }
}
