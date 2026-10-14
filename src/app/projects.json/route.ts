import { loadProjects } from "@/lib/content/load";
import { SITE_URL } from "@/lib/site";

/** Every listed project as JSON: the project file fields plus derived ones. Prerendered at build time. */
export function GET() {
  const projects = loadProjects().map(({ slug, name, url, tagline, categories, community, links, github, contracts, audits, verified, group, logo }) => ({
    slug,
    name,
    url,
    tagline,
    categories,
    group,
    community,
    links,
    github,
    contracts,
    audits,
    verified,
    logo: logo && `${SITE_URL}${logo}`,
    page: { en: `${SITE_URL}/en/projects/${slug}`, zh: `${SITE_URL}/zh/projects/${slug}` },
  }));
  return Response.json({ source: SITE_URL, count: projects.length, projects });
}
