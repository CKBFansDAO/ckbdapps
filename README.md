# CKBdapps

The directory of projects in the Nervos CKB ecosystem: wallets, apps, assets and identity, infrastructure and ecosystem partners, in English and Chinese. Maintained by CKBFans DAO.

This repository is the rewrite that replaces the current site at [ckbdapps.com](https://ckbdapps.com). Besides the directory it has a live CKB halving countdown and a CKB stats page.

## Add or update a project

Every project is one small Markdown file in [`content/projects/`](content/projects/). To add yours, open a pull request with a new file. The site's **Add a project** page (`/en/submit`, `/zh/submit`) walks through it and opens GitHub with the file already filled in.

The smallest valid file:

```yaml
---
name: Your Project
url: https://your-project.example
tagline: One sentence on what it does.
categories: [Wallet]
verified: 2026-10-28
listed: 2026-10-28
---
```

- Name the file after the project in lowercase letters, digits and dashes (`your-project.md`); that is its URL.
- `categories` take ids from [`content/taxonomy.yaml`](content/taxonomy.yaml).
- `verified` is the day the page was last confirmed as current; after a year the page shows an "out of date" notice. `listed` is the day it joined, and drives "Newly listed" on the home page.
- Optional: `links` (x, telegram, discord, docs), `github: owner/repo` (shows public GitHub activity), `community: true` (an independent builder, see below), `contracts`, `audits`, a logo at `public/logos/<file name>.webp` (square, at most 256 px), and an About text in Markdown after the closing `---`.

**Independent builders** (`community: true`): built and run by an individual or a small independent team, not by a foundation or one of its affiliates, and not by a company with outside investment. Declare it in your pull request; maintainers check it in review.

To update a listed project, open its page on the site and use **Edit on GitHub**. Every pull request is checked automatically (`pnpm validate:content`) and reviewed by a maintainer.

## Data sources and credits

| What | Where it comes from |
| --- | --- |
| Projects | The files in `content/projects/`, added and updated by pull request |
| Halving countdown, epochs, blocks | A public CKB node over JSON-RPC (`mainnet.ckb.dev`), read in the browser |
| Stats (supply, price, hash rate, occupied CKB) | The CKBdapps backend API, refreshed hourly; a committed snapshot is shown if it is down |
| Project activity (commits, releases, stars) | The CKBdapps backend, which collects public GitHub data for projects with a `github` line |
| "More projects in the making" | [CKB Pulse](https://pulse-lab.lusocryptolabs.com/) by [LusoCryptoLabs](https://github.com/LusoCryptoLabs/ckb-pulse) (MIT): live GitHub activity of everyone building on CKB |

Thanks to LusoCryptoLabs for building CKB Pulse and making it open source.

The directory is also available as data: `/projects.json` (every project with its fields), `/llms.txt` (a short index for AI tools) and `/sitemap.xml`.

## Development

Requirements: Node.js 22 and pnpm (the version is pinned in `package.json`; `corepack enable` picks it up).

```bash
pnpm install
pnpm dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm build` | Validate content, then build the site |
| `pnpm validate:content` | Check every project file and the taxonomy; fails on any error |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests: halving and chart maths, home picks, activity parsing, number formats, the submit template |
| `pnpm test:e2e` | Playwright smoke and quality tests against a production build (run `pnpm build` first) |
| `pnpm check:links` | Request every external URL in the content; runs weekly in CI |
| `pnpm snapshot:stats` | Refresh the committed stats snapshot shown when the API is down |

Environment variables (all optional):

| Variable | Use |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata, the sitemap and share images (default `https://ckbdapps.com`) |
| `ACTIVITY_API_URL` | Base URL of the backend that serves project activity, to point a preview at a staging backend |

Stack: Next.js (App Router, static generation) with TypeScript, Tailwind CSS v4, `next-intl` for `/en` and `/zh`, and content as Markdown validated with zod. Design and engineering rules for contributors are in [`CLAUDE.md`](CLAUDE.md).

## Deployment

The site runs on Netlify with its Next.js runtime: build command `pnpm build`, publish directory `.next`, Node 22. A draft deploy from a local checkout:

```bash
netlify deploy
```

Pull requests and pushes to `main` run the checks in [`.github/workflows/ci.yml`](.github/workflows/ci.yml): content validation, lint, typecheck, unit tests, build and the end-to-end tests.
