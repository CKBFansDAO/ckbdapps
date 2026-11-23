import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cacheLife } from "next/cache";
import { STORIES_DIR } from "./content/stories";
import { webpSize } from "./webp";

export type ImageSizes = Record<string, { width: number; height: number }>;

/**
 * Width and height of each WebP picture in a story's directory, for figures with explicit sizes. Cached: reading
 * binary files while prerendering counts as uncached I/O under Cache Components.
 */
export async function storyImageSizes(slug: string): Promise<ImageSizes> {
  "use cache";
  cacheLife("max");
  const dir = path.join(STORIES_DIR, slug);
  const out: ImageSizes = {};
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".webp"))) {
    const size = webpSize(readFileSync(path.join(dir, f)));
    if (size) out[f] = size;
  }
  return out;
}
