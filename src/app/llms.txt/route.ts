import { categoryLabel, groupLabel, pick } from "@/lib/content/derive";
import { getProject, loadProjects, loadProofs } from "@/lib/content/load";
import { loadStories } from "@/lib/content/stories";
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
    `- [Builder Stories](${SITE_URL}/en/stories): once a month, someone building on CKB in their own words ([RSS](${SITE_URL}/en/stories/feed.xml))`,
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
  const proofs = loadProofs();
  if (proofs.length) {
    lines.push("", "## Proofs on testnet", "", "Open-source projects that run on CKB testnet only, not in the directory.", "");
    for (const p of proofs) lines.push(`- [${p.name}](${SITE_URL}/en/projects/${p.slug}): ${pick(p.tagline, "en")} (code: https://github.com/${p.github})`);
  }
  const stories = loadStories();
  if (stories.length) {
    lines.push("", "## Builder Stories", "", `Each story is plain Markdown in ${REPO_URL} (content/stories/<slug>/en.md, optional zh.md).`, "");
    for (const s of stories) lines.push(`- [${s.title}](${SITE_URL}/en/stories/${s.slug}): ${s.person.name} / ${getProject(s.project)!.name}. ${s.dek}`);
  }
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
