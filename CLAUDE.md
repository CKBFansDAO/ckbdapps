# CKBdapps (rewrite)

The directory site for the Nervos CKB ecosystem, replacing the CRA app at https://github.com/CKBFansDAO/ckbdapps (ckbdapps.com).

**Visual and behavioural reference: `design/ckbdapps-v3.html`.** Open it in a browser. It is a single-file prototype with four views (Home, Explore, Project detail, Halving) and an EN/中文 toggle. Reproduce its look and behaviour. Where this file and the prototype disagree on a *design* detail, the prototype wins. Where they disagree on *architecture or data*, this file wins (the prototype is hash-routed, single-file, and uses mock data).

## Stack (decided, do not swap)

- Next.js (App Router) + TypeScript (strict), static generation for every content page
- Tailwind CSS v4 for layout and utilities; design tokens live in `src/styles/tokens.css` as CSS variables; the slot/plug motif is plain CSS in `src/styles/slot.css`
- `next-intl` with `/en` and `/zh` route prefixes
- Content: Markdown with front matter in `content/`, parsed with `gray-matter`, validated with `zod`
- Fonts via `next/font`: Archivo (variable, with the `wdth` axis), JetBrains Mono, Noto Sans SC (subset it)
- Live chain data (halving page only): CKB JSON-RPC from the browser with `@tanstack/react-query`. Use `@ckb-ccc/core` for RPC/types if it fits; do not add lumos
- pnpm, ESLint (or Biome), Playwright for smoke tests, deployed on Netlify

Not allowed: redux, react-query v3, lumos, d3/recharts, framer-motion, a second state library, a CSS-in-JS library, any UI kit (shadcn, MUI, etc.). The design is custom; a kit will flatten it.

## Commands

```
pnpm dev                 # local dev
pnpm build               # validate content, then next build
pnpm validate:content    # zod + taxonomy checks, fails on any error
pnpm check:links         # HEAD every external URL in content (CI weekly, not on every PR)
pnpm migrate:legacy      # one-off: legacy JSON -> content/projects/*.md
pnpm test:e2e            # Playwright smoke tests
```

## Directory structure

```
.
├─ CLAUDE.md
├─ design/
│  ├─ ckbdapps-v3.html            # reference prototype (do not edit, do not ship)
│  └─ screenshots/                # add per-phase screenshots here for review
├─ content/
│  ├─ projects/<slug>.md          # one file per project (see Content model)
│  ├─ taxonomy.yaml               # categories, groups, aliases
│  ├─ home.yaml                   # featured slugs, community picks, grants
│  └─ events.yaml
├─ public/
│  ├─ logos/<slug>.webp           # square, <=256px; missing logo falls back to the identicon
│  └─ brand/                      # logo + favicon (the logo must not change)
├─ src/
│  ├─ app/
│  │  ├─ [locale]/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx                          # Home
│  │  │  ├─ explore/page.tsx
│  │  │  ├─ projects/[slug]/page.tsx
│  │  │  ├─ projects/[slug]/opengraph-image.tsx
│  │  │  └─ halving/page.tsx
│  │  ├─ llms.txt/route.ts                    # machine-readable index of the site
│  │  ├─ projects.json/route.ts               # all projects as JSON
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  ├─ components/
│  │  ├─ ui/        # Slot, SlotButton, SlotSearch, FramedAvatar, EmptySlot, Identicon, Tile
│  │  ├─ home/      # Hero (cell-grid canvas), CategoryMarquee, HalvingStrip, Spotlight, EcoMap, Events
│  │  ├─ explore/   # Toolbar, FilterChips, ProjectList (list + grid)
│  │  ├─ project/   # ProjectHero, About, Contracts, Audits, Signals, SourceFile, Similar
│  │  └─ halving/   # Countdown, TipSummary, EraProgress, Schedule, Explainer
│  ├─ lib/
│  │  ├─ content/   # schema.ts, load.ts, derive.ts (groups, similar projects, staleness)
│  │  ├─ github.ts  # build-time repo signals
│  │  ├─ halving.ts # pure functions, unit tested
│  │  └─ ckb-rpc.ts
│  ├─ i18n/         # routing.ts, request.ts
│  ├─ messages/     # en.json, zh.json (UI strings only, never project content)
│  └─ styles/       # tokens.css, slot.css, globals.css
├─ scripts/         # migrate-legacy.ts, validate-content.ts, check-links.ts
├─ tests/e2e/
└─ .github/workflows/ci.yml
```

## Content model

One file per project: `content/projects/<slug>.md`, front matter plus an optional Markdown body (the About text). **The goal is low maintenance: a team should be able to add a project with 5 lines.** Do not add fields without asking.

```ts
// src/lib/content/schema.ts
const L10n = z.union([z.string(), z.object({ en: z.string().optional(), zh: z.string().optional() })]); // one language is enough

export const Project = z.object({
  name: z.string(),
  url: z.string().url(),
  tagline: L10n,                              // one sentence
  categories: z.array(z.enum(CATEGORY_IDS)).min(1), // from taxonomy.yaml only
  community: z.boolean().default(false),      // replaces the old "Community-Driven" category
  links: z.object({ x: z.string(), telegram: z.string(), discord: z.string(), docs: z.string().url() }).partial().optional(),
  github: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),   // "owner/repo"; enables auto signals
  contracts: z.array(z.object({ name: z.string(), code_hash: z.string().regex(/^0x[0-9a-f]{64}$/), hash_type: z.enum(['type', 'data', 'data1', 'data2']) })).optional(),
  audits: z.array(z.object({ label: z.string(), date: z.string(), url: z.string().url() })).optional(),
  verified: z.string().date(),                // bump when the team confirms the page is current
});
```

Rules:
- The slug is the filename: lowercase, `[a-z0-9-]` only. Never derive anything from the original casing.
- Everything else on a project page is **derived**, never hand-written: group, tags, similar projects, GitHub signals (license, last commit, stars), website status, "listed since", staleness. Do not reintroduce highlights, FAQ, transparency checklists, or colour classes in data.
- Stale rule: `verified` older than 365 days shows the stale notice on the page (see the "Out of date" preview in the prototype). Never hide the page.
- A project with no logo gets the deterministic identicon from the prototype (`icon(slug)`: mirrored 5x5 grid seeded by an FNV hash of the slug). Port it to `Identicon.tsx` exactly.

### taxonomy.yaml

Controlled list of category ids, each with `en` and `zh` labels, plus the group mapping. The prototype's grouping, in priority order (first match wins): **wallets > apps > assets > infra > eco**. A project with no matching category falls into `eco`. Sets in the prototype:

- wallets: Wallet, Hardware Wallet, Extension, Multi-Sig
- apps: DEX, DeFi, Marketplace, Stablecoin, Payment, Bridges, Intent-centric, Nervos DAO
- assets: DOBs, NFT, DID
- infra: Protocol, Explorer, Tools, Infrastructure, Security & Audit, RGB++, Fiber, AW

Legacy cleanup to apply in the migration (confirm the two marked ones with the site owner before finalising):
- `Protocols` -> `Protocol`
- `Tools & Infrastructure` -> `Infrastructure` (confirm)
- `Community-Driven` -> `community: true`, removed from categories
- `AW` -> keep as-is until the owner says what it stands for (confirm)

### home.yaml and events.yaml

`home.yaml`: `featured: [slug]`, `community_picks: [slug]`, `grants: [{ title, amount, project, status }]`. `events.yaml`: `[{ date, type, url, title: L10n }]`. Slugs in `home.yaml` must exist; validation fails otherwise. The prototype's Spark Granted card hardcodes "700 USDT / Quantum Purse" from legacy data: move it into `grants`.

## Routes and rendering

| Route | Rendering | Notes |
|---|---|---|
| `/{locale}` | static | Home |
| `/{locale}/explore` | static shell + client filtering | Filters live in the URL query: `?q=&group=&cat=&community=1&view=grid`. Shareable and crawlable defaults |
| `/{locale}/projects/{slug}` | static, `generateStaticParams` | One real URL per project. Title, description, OG image, JSON-LD (`SoftwareApplication` or `Organization`) |
| `/{locale}/halving` | static shell + client live data | Countdown and tip data fetched in the browser |
| `/llms.txt`, `/projects.json`, `/sitemap.xml` | static | AI and crawler discoverability (suggested addition, keep it small) |

Old URLs: `/halving` redirects to `/en/halving`; legacy `/dapp/<slug>`-style paths must be checked against the old router and redirected (see the old repo's `src/App.js`).

Language: default from `Accept-Language`, persisted in a cookie, always reflected in the URL. Content fallback order for L10n fields: requested locale -> `en` -> `zh`.

## Design system (non-negotiable)

**Logo and primary colour do not change.** Brand: ink `#1c1c23`, purple `#733dff`, white. The logo is an open-right white bracket with a purple plug filling its mouth. That shape is the single motif of the site.

Tokens (`src/styles/tokens.css`, copy values from the prototype's `:root`):

```
--page #121218   --ink #1c1c23   --purple #733dff   --purple-hi #9068ff   --purple-deep #5a26e8
--paper #f3f2f7  --paper-ink #15151c  --white #fff
--mut-d #a3a2b3  --mut-p #5d5c6b  --line-d rgba(255,255,255,.14)  --line-p rgba(21,21,28,.16)
```

- One dark brand look. No light/dark switch. Dark sections use `.on-dark`, reading sections use `.on-paper`; each scopes `--bg --fg --mut --line --accent --surface`. Use these scopes, never raw hex in components.
- Type: Archivo with `wdth 125` weight 800 for display (`.wide`), `wdth 112` for sub-heads (`.semi`), body at `wdth 100`. JetBrains Mono for data (dates, hashes, epochs). Noto Sans SC for Chinese; in Chinese, disable negative letter-spacing and use weight 900 for display.
- **The slot motif.** Build these once as components and reuse them; do not invent new decorative shapes:
  - `Slot` (inline frame around a word, plug on the right), `SlotButton` (bracket with plug that grows on hover), `SlotSearch` (hero search where the plug is the submit button), `FramedAvatar`, `EmptySlot` (dashed plug = "this slot is open, add your project")
  - Plug grows on hover or focus; this is the interaction language
- Hero: the 64px cell-grid canvas with ambient lit cells, pointer glow and click ripples. Must pause when the tab is hidden or the route is not Home, and fully respect `prefers-reduced-motion` (static grid, no ripples).
- Motion: one entrance sequence on Home and Halving heroes, the era progress fill on the Halving page, hover plug growth. No scroll-triggered fade-ins, no per-card hover lifts.
- Avoid: gradients as decoration, rounded-card grids with soft shadows, emoji icons, all-caps eyebrow labels, new accent colours.

## Pages (what the prototype shows)

**Home**: hero (headline with `CKB` in a Slot, search with suggestions, quick category chips, three stats) -> category marquee (purple band) -> halving strip ("CKB halves in N days") -> Spotlight (featured tiles, community tiles, Spark Granted + two EmptySlots) -> Ecosystem map -> Events.
- Positioning: **Map = overview and entry point** (every project is one cell, grouped; clicking a group goes to Explore with that filter). **Explore = the searchable directory.** **Home = curated layer.** Do not make the map a second list.

**Explore**: sticky toolbar (filter input, group tabs with counts, community-only toggle, list/grid), category chips, paged list (30 per page + "Show more"), empty state with a clear action.

**Project detail**: dark hero (framed avatar, name, group and category pills, tagline, Visit button, secondary links, verified date or stale notice) -> paper body: About (if present), On CKB contracts table (if present), Audits (if present), Similar projects (3, derived) -> side column: Signals tiles (derived) and the "source file" panel with an Edit on GitHub button. **Sections render only if their data exists; a 5-line file must still give a complete page.** The "Design preview: Full / Minimal / Out of date" bar in the prototype is demo-only; do not build it.

**Halving**: hero (title, epoch and date line, d/h/m/s countdown with days in a Slot, Share on X) -> tip summary (current epoch + index, epochs to go, halving epoch, estimated date) + era progress bar (bracket with plug fill, dashed open slot at the right end) -> schedule list (11 rows, bar width proportional to daily reward, past / now / future states) -> explainer cards (what, why, how), inflation bars, block-reward parts.

## Halving logic (port from the legacy repo)

Source: `src/components/halving/*`, `src/hooks/useCKBHalving.jsx`, `src/utils/helper.js`, `public/markdown/halving_en_US.md` in CKBFansDAO/ckbdapps.
- `EPOCHS_PER_HALVING = 8760`; Nth halving at epoch `8760 * N`. Epoch is about 4 hours; 1800 blocks per epoch is used for block-reward display only.
- Real data: tip header over RPC (`https://mainnet.ckb.dev`), parse epoch from the header's packed `epoch` (length = bits 40..55, index = bits 24..39, number = bits 0..23). Estimate the halving time from the average epoch duration since a recent base epoch, as the legacy hook does. Keep that estimate logic; do not replace it with a fixed date.
- The prototype uses a **fixed target date (2027-11-17) and a mock tip**. Replace with the real RPC logic. Show the "latest block" cell again (the prototype swapped it for "epochs to go").
- Schedule table rows and numbers: take them from the legacy markdown table, store as typed data in `src/lib/halving.ts`, and unit-test the arithmetic (reward halves per era, era issuance halves).
- Add states the prototype lacks: loading skeleton, RPC failure with retry, "just halved" (within about 30 days after a halving, show the completed halving instead of a countdown).
- `<30 days` -> show hours as the primary unit; `<1 day` -> hours, minutes, seconds.

## i18n

UI strings in `src/messages/{en,zh}.json`; keys mirror the prototype's `I18N` object. Project and event content is never in the message files. Dates and numbers via `Intl` with the current locale. The Halving page keeps the original's EN and ZH explanatory text (translate the legacy `halving_en_US.md` / zh equivalent into the explainer cards; do not invent claims).

## Quality bar

- Responsive from 360px; no horizontal page scroll; touch targets >= 40px
- Keyboard: visible focus everywhere (purple outline), search suggestions operable with arrows and Enter, Escape closes
- Contrast AA on both `.on-dark` and `.on-paper`
- Lighthouse on Home, a project page and Halving: Performance >= 90, SEO and Accessibility >= 95
- Images: `next/image`, WebP/AVIF, explicit sizes; logos <= 256px
- No client-side fetch of content; project pages must contain full text in the static HTML
- No console errors; no unused dependencies

## Build order and acceptance

1. **Skeleton**: Next.js, Tailwind v4, i18n routing, tokens, fonts, `ui/` slot components with a page that shows each. Accept: matches the prototype's buttons, search bar, framed avatar and empty slot side by side.
2. **Content pipeline**: schema, taxonomy, loader, `validate:content`, `migrate:legacy` run against the legacy repo. Accept: all ~126 projects migrate; report lists every normalised category, slug case change, and project missing a detail file.
3. **Explore and Detail**: filters in URL, list and grid, project pages with all three states of data. Accept: a 5-line file and a full file both render complete pages; stale notice works.
4. **Home**: hero grid, marquee, strip, spotlight, map, events. Accept: matches prototype at 1280 and 390 widths.
5. **Halving**: RPC logic, live countdown, all states, tests. Accept: numbers match the legacy site for the current epoch (compare before switching DNS).
6. **Hardening**: OG images, sitemap, `llms.txt`, redirects from legacy URLs, CI (validate, build, e2e), scheduled rebuild via Netlify build hook for GitHub signals, Lighthouse checks.

At the end of each step, run the build, take screenshots at 1280 and 390 into `design/screenshots/`, and compare against the prototype before moving on.

## Migration script (`scripts/migrate-legacy.ts`)

Inputs (from CKBFansDAO/ckbdapps `master`): `public/dappList/dapps_list.json`, `public/dappList/<slug>/config.json`, `public/dappDetails/<slug>.json`, `public/dappList/event_list.json`, `public/homeSections.json`.
- Output `content/projects/<slug>.md` with only the schema fields above. Take `tagline` from the short description (`en`/`ch` or `en_US`/`zh_CN` keys; the legacy data uses both spellings), `links` from `socialLinks`/`links`, `url` from the website link.
- Drop: highlights, FAQ, transparency checklists, tag colour classes, related.
- Lowercase slugs; keep a `redirects.json` of old to new slugs.
- Projects with no website URL: fail loudly in the report rather than inventing one.
- Download and convert logos to `public/logos/<slug>.webp` (<=256px). Never copy the large hero images.
- Print a report: counts, normalised categories, missing logos, missing URLs, projects not in the list but with a detail file (known: catfusion, ickb, huehub, verix).
- Set `verified` to the migration date only for projects whose legacy detail file existed; for others use the legacy file's last commit date if available, otherwise leave the migration date and flag it in the report.

## Working rules

- Ask before adding a dependency, a field to the schema, a new colour or a new decorative shape.
- Prefer deleting code to adding configuration. No feature flags, no abstractions for a single use.
- Keep components small; the slot motif components are the shared vocabulary.
- Never commit secrets. The GitHub signals token is a read-only env var (`GITHUB_TOKEN`) set in Netlify and CI.
- Every user-visible string goes through `next-intl`. Every external link has `rel="noopener"`.
