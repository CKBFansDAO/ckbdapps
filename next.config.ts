import { readdirSync, readFileSync } from "node:fs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Old ckbdapps.com URLs. The old site had five routes and opened projects in an overlay, but its catch-all
// route served any /<path_name>, so /<old-slug> links exist in the wild: send them to the project page.
// Unprefixed targets then get the visitor's locale from the i18n proxy.
function legacyRedirects() {
  const slugs = readdirSync("content/projects")
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.slice(0, -3));
  const renamed: Record<string, string> = JSON.parse(readFileSync("content/redirects.json", "utf8"));
  return [
    { source: "/ecosystem", destination: "/explore", permanent: true },
    { source: "/events", destination: "/", permanent: true },
    { source: "/statistics", destination: "/", permanent: true },
    ...slugs.map((s) => ({ source: `/${s}`, destination: `/projects/${s}`, permanent: true })),
    ...Object.entries(renamed).map(([from, to]) => ({ source: `/${from}`, destination: `/projects/${to}`, permanent: true })),
  ];
}

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return legacyRedirects();
  },
};

export default createNextIntlPlugin()(nextConfig);
