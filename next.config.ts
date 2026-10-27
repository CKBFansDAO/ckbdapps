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
    { source: "/statistics", destination: "/stats", permanent: true },
    ...slugs.map((s) => ({ source: `/${s}`, destination: `/projects/${s}`, permanent: true })),
    ...Object.entries(renamed).map(([from, to]) => ({ source: `/${from}`, destination: `/projects/${to}`, permanent: true })),
  ];
}

// Applied in two places from this one list: `redirects()` below, and src/proxy.ts via LEGACY_REDIRECTS.
// On Netlify the proxy runs first and would prefix the locale (/ecosystem -> /en/ecosystem, a 404)
// before these redirects are reached, so the proxy checks the list itself.
const LEGACY = legacyRedirects();

const nextConfig: NextConfig = {
  // `next dev` refuses its HMR socket to any host but localhost, and without it the page never hydrates:
  // opened from a phone at the laptop's LAN address, every button and client-side link is dead.
  // Allow private networks and mDNS names so the dev server can be tested on real devices.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*", "*.local"],
  env: { LEGACY_REDIRECTS: JSON.stringify(Object.fromEntries(LEGACY.map((r) => [r.source, r.destination]))) },
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
    return LEGACY;
  },
};

export default createNextIntlPlugin()(nextConfig);
