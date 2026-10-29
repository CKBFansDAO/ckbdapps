import { notFound } from "next/navigation";

// Any path under a locale that no route matches (/en/no-such-page, and /xx/explore once the proxy has added
// the locale) gets the site's own not-found page instead of Next's bare default.
export default function CatchAll() {
  notFound();
}
