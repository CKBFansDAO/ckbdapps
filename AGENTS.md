<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project notes

- Project rules and build order: `CLAUDE.md`. Design reference: `design/ckbdapps-v3.html`. `legacy/` is a read-only copy of the old site (gitignored, excluded from lint/tsc/Tailwind).
- Checks: `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm validate:content`, `pnpm build` (runs validation first).
- Re-run the migration: clone the old repo (`git clone --filter=blob:none --no-checkout https://github.com/CKBFansDAO/ckbdapps-legacy.git /tmp/ckbdapps-legacy-git`), then `pnpm migrate:legacy --git /tmp/ckbdapps-legacy-git`. It overwrites `content/projects`, `home.yaml`, `events.yaml`, `redirects.json`, `public/logos`.
- Scripts run through `tsx` as CommonJS: no top-level `await`; the `@/` alias works.
