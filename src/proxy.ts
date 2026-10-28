import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

// Old ckbdapps.com URLs, path -> target, built from content in next.config.ts and inlined at build time.
// Checked before the locale is added: hosts that run the proxy ahead of next.config redirects (Netlify)
// would otherwise send /ecosystem to /en/ecosystem. The target then gets its locale on the next request.
const LEGACY: Record<string, string> = JSON.parse(process.env.LEGACY_REDIRECTS ?? '{}');

export default function proxy(req: NextRequest) {
  const target = LEGACY[req.nextUrl.pathname];
  if (target) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 308);
  }
  return intl(req);
}

export const config = {
  // Everything except Next internals and files with an extension (favicon, /llms.txt, /projects.json)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
