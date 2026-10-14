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
