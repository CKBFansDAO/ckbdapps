// The CKBuilder project tracker keeps its list as one Markdown table in its README:
// | Name | Project | Repository | Test link | Development status |
// This module turns that table into typed rows. Cells are free text written by hand, so every field but the
// project name is optional and the status falls back to "other".

export const TRACKER_URL = "https://github.com/Nervos-Community-Catalyst/CKBuilder-projects";
export const TRACKER_README =
  "https://raw.githubusercontent.com/Nervos-Community-Catalyst/CKBuilder-projects/main/README.md";

/** Page order: funded first, then active work, then work that has stopped. */
export const STATUSES = ["grant", "ongoing", "feedback", "poc", "paused", "inactive", "other"] as const;
export type Status = (typeof STATUSES)[number];

const STATUS_TEXT: Record<string, Status> = {
  "dao grant": "grant",
  ongoing: "ongoing",
  "implementing feedback": "feedback",
  "poc complete": "poc",
  paused: "paused",
  inactive: "inactive",
};

export type Build = {
  /** Kebab-case name, unique in the list; seeds the identicon */
  id: string;
  name: string;
  /** The part after "Name:" or "Name - " in the tracker, when there is one */
  about?: string;
  builder: string;
  repo?: string;
  /** owner/repo when the repository link points at GitHub */
  github?: string;
  /** The hosted version ("Test link") */
  link?: string;
  status: Status;
};

const url = (cell: string) => cell.match(/\]\((https?:\/\/[^)\s]+)\)/)?.[1] ?? cell.match(/https?:\/\/\S+/)?.[0];

export function githubRepo(href: string | undefined): string | undefined {
  const m = href?.match(/^https?:\/\/github\.com\/([\w.-]+)\/([\w.-]+)/i);
  return m ? `${m[1]}/${m[2].replace(/\.git$/, "")}` : undefined;
}

const kebab = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Rows of the first table whose header starts with "Name"; throws when there is none. */
export function parseTracker(readme: string): Build[] {
  const lines = readme.split("\n").map((l) => l.trim());
  const head = lines.findIndex((l) => /^\|\s*Name\s*\|/i.test(l));
  if (head < 0) throw new Error("tracker: no project table");

  const out: Build[] = [];
  const seen = new Set<string>();
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
    const [builder = "", project = "", repoCell = "", linkCell = "", statusCell = ""] = line
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
    const [name, ...rest] = project.split(/:\s+|\s+-\s+/);
    if (!name) continue;

    let id = kebab(name) || "project";
    for (let n = 2; seen.has(id); n++) id = `${kebab(name)}-${n}`;
    seen.add(id);

    const repo = url(repoCell);
    const link = url(linkCell);
    out.push({
      id,
      name: name.trim(),
      ...(rest.length ? { about: rest.join(" - ").trim() } : {}),
      builder,
      ...(repo && repo !== link ? { repo } : {}),
      ...(githubRepo(repo) ? { github: githubRepo(repo) } : {}),
      ...(link ? { link } : {}),
      status: STATUS_TEXT[statusCell.toLowerCase().replace(/\s+/g, " ")] ?? "other",
    });
  }
  if (!out.length) throw new Error("tracker: empty project table");
  return out;
}
