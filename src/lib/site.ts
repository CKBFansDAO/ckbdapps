import { routing } from "@/i18n/routing";

// Override for previews and CI (Lighthouse checks the canonical URL against the host it tests).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ckbdapps.com";
export const REPO_URL = "https://github.com/CKBFansDAO/ckbdapps";
export const REPO_BRANCH = "main";
/** CKB Pulse: live GitHub activity of CKB builders, including projects not (yet) in this directory. */
export const PULSE_URL = "https://pulse-lab.lusocryptolabs.com/";

export const projectFilePath = (slug: string) => `content/projects/${slug}.md`;
export const editUrl = (slug: string) => `${REPO_URL}/edit/${REPO_BRANCH}/${projectFilePath(slug)}`;

/** Canonical URL plus one alternate per language, for a path without the locale prefix ("" for Home). */
export const alternates = (locale: string, path: string) => ({
  canonical: `/${locale}${path}`,
  languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
});
