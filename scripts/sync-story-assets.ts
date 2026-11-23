/**
 * Copies the pictures of each Builder Story (content/stories/<slug>/*.webp) to public/stories/<slug>/, so a story's
 * Markdown can point to files next to itself (which GitHub shows) and the site can serve them. public/stories is
 * generated: git ignores it and every run replaces it. Runs before `pnpm dev` and `pnpm build`.
 *   tsx scripts/sync-story-assets.ts
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { STORIES_DIR } from "@/lib/content/stories";

const OUT = path.join(process.cwd(), "public", "stories");
rmSync(OUT, { recursive: true, force: true });
let n = 0;
if (existsSync(STORIES_DIR)) {
  for (const d of readdirSync(STORIES_DIR, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    for (const f of readdirSync(path.join(STORIES_DIR, d.name)).filter((f) => f.endsWith(".webp"))) {
      mkdirSync(path.join(OUT, d.name), { recursive: true });
      copyFileSync(path.join(STORIES_DIR, d.name, f), path.join(OUT, d.name, f));
      n++;
    }
  }
}
console.log(`Story pictures: ${n} copied to public/stories.`);
