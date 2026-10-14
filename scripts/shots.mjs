// Temporary screenshot helper: system Chrome via playwright channel.
// usage: node scripts/shots.mjs <outdir> <path...>  (paths like /en, /en/explore)
import { chromium } from "@playwright/test";
const [outdir, ...paths] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
for (const w of [1280, 768, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
  for (const p of paths) {
    await page.goto(`http://localhost:3300${p}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
    const name = `${p.replace(/^\//, "").replace(/\//g, "-")}-${w}.png`;
    await page.screenshot({ path: `${outdir}/${name}`, fullPage: true });
    console.log(name);
  }
  await page.close();
}
await browser.close();
