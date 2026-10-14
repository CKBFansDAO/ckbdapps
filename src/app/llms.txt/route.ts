import { categoryLabel, groupLabel, pick } from "@/lib/content/derive";
import { loadProjects } from "@/lib/content/load";
import { taxonomy } from "@/lib/content/schema";
import { REPO_URL, SITE_URL } from "@/lib/site";

/** A small machine-readable index of the site (llmstxt.org format). Prerendered at build time. */
export function GET() {
  const projects = loadProjects();
  const lines = [
    "# CKBdapps",
    "",
    "> The directory for the Nervos CKB ecosystem: wallets, apps, assets, infrastructure and ecosystem partners, in English and Chinese.",
    "",
    `Every project is one Markdown file in ${REPO_URL} (content/projects/<slug>.md). Pages exist under /en and /zh.`,
    "",
    "## Data",
    "",
    `- [All projects as JSON](${SITE_URL}/projects.json): fields, group, links and page URLs`,
    `- [CKB halving](${SITE_URL}/en/halving): live countdown and the base issuance schedule`,
    `- [CKB stats](${SITE_URL}/en/stats): price history, hash rate, on-chain occupancy and the supply split`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
  ];
  for (const g of taxonomy.groups) {
    const inGroup = projects.filter((p) => p.group === g.id);
    if (!inGroup.length) continue;
    lines.push("", `## ${groupLabel(g.id, "en")}`, "");
    for (const p of inGroup) {
      const cats = p.categories.map((c) => categoryLabel(c, "en")).join(", ");
      lines.push(`- [${p.name}](${SITE_URL}/en/projects/${p.slug}): ${pick(p.tagline, "en")} (${cats})`);
    }
  }
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
