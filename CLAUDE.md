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
│  └─ home.yaml                   # featured slugs, community picks, grants
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
│  │  ├─ home/      # Hero (cell-grid canvas), CategoryMarquee, HalvingStrip, Spotlight, EcoMap
│  │  ├─ explore/   # Toolbar, FilterChips, ProjectList (list + grid)
│  │  ├─ project/   # ProjectHero, About, Contracts, Audits, Signals, SourceFile, Similar
│  │  └─ halving/   # Countdown, TipSummary, EraProgress, Schedule, Explainer
│  ├─ lib/
│  │  ├─ content/   # schema.ts, load.ts, derive.ts (groups, similar projects, staleness)
│  │  ├─ github.ts  # reads src/data/github-signals.json (no network)
│  │  ├─ github-source.ts  # batched GraphQL fetch + merge, used only by scripts/snapshot-github.ts
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
  github: z.string().regex(/^[\w.-]+\/[\w.-]+$/).optional(),   // "owner/repo"; enables auto signals (read from the committed snapshot)
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

### home.yaml

`home.yaml`: `featured: [slug]`, `community_picks: [slug]`, `grants: [{ title, amount, project, status }]`. Slugs in `home.yaml` must exist; validation fails otherwise. The prototype's Spark Granted card hardcodes "700 USDT / Quantum Purse" from legacy data: move it into `grants`.

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

**Home**: hero (headline with `CKB` in a Slot, search with suggestions, quick category chips, three stats) -> category marquee (purple band) -> halving strip ("CKB halves in N days") -> Spotlight (featured tiles, community tiles, Spark Granted + two EmptySlots) -> Ecosystem map.
- Positioning: **Map = overview and entry point** (every project is one cell, grouped; clicking a group goes to Explore with that filter). **Explore = the searchable directory.** **Home = curated layer.** Do not make the map a second list.

**Explore**: sticky toolbar (filter input, group tabs with counts, community-only toggle, list/grid), category chips, paged list (30 per page + "Show more"), empty state with a clear action. A persistent **risk notice bar** sits under the page title (not dismissible; `role="note"`; `ex_risk` in the message files; replace the placeholder wording with the legacy `/ecosystem` risk text, confirm with owner). This page replaces legacy `/ecosystem`; no watch-list/favorites feature.

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

UI strings in `src/messages/{en,zh}.json`; keys mirror the prototype's `I18N` object. Project content is never in the message files. Dates and numbers via `Intl` with the current locale. The Halving page keeps the original's EN and ZH explanatory text (translate the legacy `halving_en_US.md` / zh equivalent into the explainer cards; do not invent claims).

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
4. **Home**: hero grid, marquee, strip, spotlight, map. Accept: matches prototype at 1280 and 390 widths.
5. **Halving**: RPC logic, live countdown, all states, tests. Accept: numbers match the legacy site for the current epoch (compare before switching DNS).
6. **Hardening**: OG images, sitemap, `llms.txt`, redirects from legacy URLs, CI (validate, build, e2e), scheduled rebuild via Netlify build hook for GitHub signals, Lighthouse checks.

At the end of each step, run the build, take screenshots at 1280 and 390 into `design/screenshots/`, and compare against the prototype before moving on.

## Migration script (`scripts/migrate-legacy.ts`)

Inputs (from CKBFansDAO/ckbdapps `master`): `public/dappList/dapps_list.json`, `public/dappList/<slug>/config.json`, `public/dappDetails/<slug>.json`, `public/homeSections.json`.
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

---

## Addendum v4 — Stats page and legacy parity

### Project page source panel
Show **front matter only** (never the Markdown body); some projects have no About section.
Signals panel: render only signals that really exist (link-check generated file, optional git first-commit date); hide the panel when empty.
Open decision (owner): which field represents a private-repo project instead of a `github` line.

### Stats page (`/{locale}/stats`; legacy `/statistics` redirects here)
Design reference: `design/ckbdapps-v4.html`, `#stats`. Mock data in the prototype; real data from the API.
- API base `https://api.ckbdapps.com/api/v1/nervos_explorers/` — endpoints `market_data`, `daily_price`, `daily_avg_hash_rate`, `daily_occupied_ckb`. Fetch server-side at build/ISR (revalidate hourly); fall back to a cached snapshot on failure and say so in the UI.
- KPIs: total_supply, circulating_supply, Nervos DAO = `nervos_dao.total_deposit * 1e-8`, tradable = circulating − DAO. Supply bar: tradable / DAO / not-yet-circulating.
- Hash rate values are multiplied by 1000 (legacy behaviour).
- Occupied CKB chart subtracts the Satoshi gift cell constant 5,040,000,000; the gift series is a legend toggle, hidden by default.
- One shared range for all charts: presets 7D/1M/6M/1Y/ALL (last N points) plus a brush. No per-chart filters.
- Hash chart has 8 "Miner release" markers (2020-03-06, 2020-03-31, 2020-10-19, 2021-01-08, 2021-08-07, 2021-12-02, 2022-03-02, 2023-01-05). Legacy name/description fields look offset by one row — **confirm with owner before shipping labels**.
- Header value shows latest value; hide the "change in range" when the base is ~0 (absurd %).
- A11y: crosshair snaps to X with one tooltip for all series, arrow-key navigation, "View as table", legend for ≥2 series. zh uses 亿/万 units.

### Legacy parity decisions (settled)
- `/ecosystem` is now Explore. Drop the watch-list/favorites toggle; keep the risk notice bar (see Explore).
- `/events` and everything event-related is **removed** (maintenance cost): no page, nav item, home section, data file, or validation. Redirect legacy `/events` to `/`.
- Legacy `/halving` and `/statistics` redirect to the new routes; `/ecosystem` redirects to `/{locale}/explore`. Legacy project detail was a modal; the new one is a route.

---

## UI quality gate (applies to every page before it is called done)

The owner judges taste. Your job is to hand over pages with no objective defects, and to never change a deliberate design decision on your own. Locked: logo, primary `#733dff`, ink `#1c1c23`, the slot-and-plug motif, hard edges. Do **not** "soften" the design (no extra rounded corners, soft shadows, gray-tinted palettes, or generic card styling).

### Procedure per page
1. Compare against `design/ckbdapps-v5.html` at **1280, 768 and 390** px, in **EN and ZH**. Take screenshots (Playwright) and look at them; do not review from code alone.
2. Run the objective checks below. Fix every failure.
3. Anything that is a taste question (spacing feel, emphasis, copy tone) is **not fixed silently**: list it in the page's report as an option with a recommendation.
4. Put the screenshots and a short report in the PR: what was fixed, what is left for the owner, what could not be verified (real data, real devices, screen readers).

### Objective checks (pass/fail)
- No console errors or hydration warnings. No failed network requests except known external ones.
- No horizontal scroll at 390 px. No clipped, overlapping or wrapped-badly text (axis labels, numbers, countdown, nav).
- Text contrast >= 4.5:1 (>= 3:1 for large text and UI components). **Check every theme scope** (`.on-dark`, `.on-paper`) and every nested widget: a component dropped into a light section inherits the wrong text color easily. (Lesson: the stats "View as table" was white text on a light background.)
- Every interactive element is reachable by keyboard, has a **visible focus ring**, and has an accessible name. Charts: arrow-key navigation and a table alternative.
- Touch targets >= 40 px for primary controls (language switch, nav, filters, buttons); never below 24 px.
- Exactly one visible `<h1>` per page; heading levels do not skip; landmarks `nav`, `main`, `footer` present; `<html lang>` follows the locale; decorative elements are `aria-hidden`.
- `prefers-reduced-motion` is honored. Any motion that is not a response to a user action is limited to one orchestrated moment per page.
- No placeholder or filler copy, no "TBD", no untranslated strings in ZH. Action names are consistent ("Add a project" is always called that).
- Empty, loading and error states exist and say what to do next. Data failures show a cached snapshot and say so.
- Charts follow the dataviz rules already in this file: one shared range, legend for >= 2 series, tooltip snapped to X, no absurd derived values (hide "+157832%"), and no reserved status colors used as decoration.
- Performance: no layout shift from fonts (`next/font`), images sized, no unused client JS on static pages.

### Automate it
Add (ask the owner before installing, per the dependency rule) `@axe-core/playwright`. Create `e2e/quality.spec.ts` that, for every route in both locales at 1280 and 390 px: fails on console errors, fails on horizontal scroll, runs axe (fail on `serious` and `critical`), tabs through the first 40 focus stops and fails if one has no visible focus style, and asserts one `h1`. Run it in CI. A page is not done until this passes.

### Review passes
After finishing a page, run these in order and keep the output in the PR:
1. `design-critique` (hierarchy, consistency, usability findings, rated by severity).
2. `accessibility-review` (WCAG 2.1 AA table, contrast and keyboard sections).
3. A fresh review with no knowledge of your reasoning: give a second agent only the screenshots, the page code and the locked constraints above, and ask for P0/P1/P2 findings. Fix P0 and clear P1; report the rest.
Skip any "elevation" or "make it look more polished" skill that imposes a generic palette or token set (Tailwind grays, uniform radii, soft shadows): it conflicts with the locked brand.

---

## Styling rules (Tailwind-first, no copied prototype CSS)

The prototype HTML is a **visual reference only, never a code source**. Do not copy its CSS, its class names (`.st-hero`, `.kpis`, `.chart`, `.lg`, `.tt`, `.risk`, ...), or its structure. Re-express every component with Tailwind utilities and tokens. "Class names mirror the prototype so they are easy to compare" is not an acceptable reason to keep a global class.

1. **Utilities in the component.** Style components with Tailwind classes in the TSX, co-located with the markup. No page-level or component-level global stylesheets (no `stats.css`, `risk.css`, ...).
2. **Only these CSS files exist:** `tokens.css` (`@theme` tokens, `@custom-variant`s, keyframes registered in `@theme`), `slot.css` (the shared slot-and-plug motif only, because it relies on pseudo-elements), `globals.css` (reset, base, `@font-face`). A new rule in these needs a one-line comment saying why utilities cannot express it. Anything else needs the owner's approval.
3. **Tokens generate utilities.** Declare colors, fonts, spacing steps and animations in `@theme` so they become `bg-purple`, `text-mut-p`, `stroke-purple-deep`, `animate-rise`. No hex or `rgba()` literals in TSX or CSS outside `tokens.css`; use opacity modifiers (`bg-purple/30`). No JS color constants like `const PC = "var(--purple-deep)"`: pass class names, or use `currentColor` with a `text-*` class.
4. **`style={{}}` only for dynamic numbers** (positions, percentages). Set them as CSS variables inline and let the class consume them (`style={{ "--x": pct }}` + `left-[calc(var(--x)*1%)]`).
5. **Mobile-first responsive.** `grid-cols-2 md:grid-cols-4`, never `max-width` media queries. Locale tweaks use a `zh` custom variant (`@custom-variant zh (&:where(:lang(zh-CN), :lang(zh-CN) *))`) and `zh:leading-[1.08]`, not `html[lang=...]` selectors.
6. **Repetition becomes a component, not `@apply`.** If the same JSX block appears twice or more (for example the three chart sections), extract a component with typed props. Variants go through a small typed map. `@apply` is banned outside base styles. Ask before adding `clsx`, `tailwind-merge`, `cva` or `prettier-plugin-tailwindcss`.
7. **SVG:** put classes on the SVG elements themselves (`<text className="fill-mut-p font-mono text-[11px]">`), not descendant selectors from a parent class. Use arbitrary properties where needed (`[vector-effect:non-scaling-stroke]`).
8. **Arbitrary values** (`[...]`, `clamp()`, `calc()`) are fine for one-offs. If the same one appears 3+ times, promote it to a token.
9. **Structure:** one concern per file, roughly 150 lines as a guideline. Data and state logic (hooks, `lib/`) stay out of presentation components. Chart math (scales, ticks, sparkline path, window clamping) lives in `lib/` with unit tests. No god components.
10. **Refactors must not change the look.** Before and after screenshots at 1280 and 390, EN and ZH, must match; the UI quality gate must still pass.

Acceptance for any page: no class name that exists only in a CSS file, no hex or rgba literal outside `tokens.css`, and no duplicated JSX blocks.

---

## GitHub signals (snapshot, not build-time fetch)

The site build must never call the GitHub API (rate limits grow with the number of projects, and a failed call must not blank a page).
- `.github/workflows/github-signals.yml` runs daily and on demand: `pnpm snapshot:github` sends one batched GraphQL request per 50 repos and writes `src/data/github-signals.json` (`fetchedAt` plus license, last commit, stars per `owner/repo`). It commits only when a signal changed; that commit triggers the normal Netlify deploy.
- A repo GitHub does not answer for (renamed, deleted, private) keeps its last good entry. An API-level failure (auth, rate limit, 5xx) exits non-zero and leaves the file untouched.
- `src/lib/github.ts` only reads that file. No entry means the Signals panel is hidden, as before.
- The workflow uses the built-in `GITHUB_TOKEN` (public repos need no extra secret). Run locally with a read-only token in `GITHUB_TOKEN`.
