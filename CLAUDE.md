# kevinmeneses.com — Project Notes

Personal site + blog for Kevin Meneses (SaaS content/technical writer). Monorepo:
`web/` (Next.js frontend), `cms/` (Strapi backend), `scripts/` (Medium import tool).

## Live URLs

- **Site**: https://kevinmeneses.com (also proxies to `/es` or `/en`)
- **CMS admin**: https://kevin-personal-website-cms.onrender.com/admin
- **GitHub**: https://github.com/Kevinelectronics/web (public repo)

## Stack & where each piece is hosted

| Piece | Service | Plan | Notes |
|---|---|---|---|
| Frontend (`web/`) | Vercel, project **"web"** under team `kevinelectronics-projects` | Hobby | Root Directory = `web` |
| CMS (`cms/`) | Render, service `kevin-personal-website-cms` | Starter (~$7/mo) | No persistent disk (see below) |
| Database | Neon Postgres, project `kevin-personal-website-cms` | Free | org `Kevin Meneses` |
| Media uploads | Cloudinary, cloud name `f8d8xtx1` | Free | Strapi's local disk doesn't survive Render redeploys |
| Analytics | Google Analytics 4, `G-YC8R1FQRGQ` | — | Rendered as a raw `<script>` snippet in `layout.tsx`, not `@next/third-parties` — that package injects client-side only, which Google's own install checker doesn't detect in the raw HTML |
| Domain DNS | Cloudflare (**DNS only** — proxy must stay OFF, orange cloud OFF) | — | A record `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com` |
| Search Console | Verified via `web/public/google3df7e1c70705edc5.html` | — | |

Credentials for all of the above live in the respective dashboards / a password
manager — nothing sensitive is in this repo. `cms/.env` and `scripts/.env` hold
local secrets and are gitignored.

## Gotchas that will bite you again

- **Vercel CLI must run from the repo root**, not from `web/`. Root Directory is
  set to `web` in the Vercel project settings, so running `vercel` from inside
  `web/` double-appends the path (`.../web/web`, fails). Fix once per fresh
  clone: `mkdir .vercel && cp web/.vercel/project.json .vercel/project.json`,
  then always deploy from the repo root: `vercel --prod`.
- **Pin the Vercel CLI to `vercel@55.0.0` if a fresh `npx vercel` misbehaves** —
  a newer version (56.x) was seen creating a stray duplicate project instead of
  deploying to "web" when run without an existing link. There's a leftover
  empty project called `personal-website` under the same team from this bug —
  safe to delete from the Vercel dashboard, never got a domain attached.
- **Render web services have no persistent disk by default** (disk is a
  separate paid add-on, not included by bumping the compute plan). Anything
  written to local disk (Strapi's default upload provider) disappears on the
  next deploy. Fixed by switching Strapi's upload provider to Cloudinary
  (`cms/config/plugins.ts`) — don't revert that without adding a persistent
  disk or another external storage provider instead.
- **The CMS was on Render's Free plan until 2026-08-01**, which spins the
  service down after ~15 min of inactivity — the next request pays a 30-60s+
  cold-start penalty (measured once at 64s on `/articles`). Upgraded to
  **Starter** to fix it at the root; confirmed back down to ~2.7s afterward.
  A GitHub Actions cron (`keep-strapi-awake.yml`) used to ping the CMS every
  10 min as a workaround — removed once Starter made it unnecessary. If the
  CMS ever gets moved back to Free, that workaround (or an equivalent) should
  come back too. `web/src/lib/strapi.ts` also has an 8s `AbortSignal.timeout`
  on CMS fetches and `articles`/`articles/[slug]` have `loading.tsx` skeletons
  — both defensive since the plan upgrade, kept in case Render has a bad day.
- **Render doesn't auto-deploy on git push** — no GitHub App is installed on
  the (public) repo, so pushing to `main` does not trigger a CMS deploy by
  itself. Trigger manually: `POST https://api.render.com/v1/services/<id>/deploys`
  with the Render API key, or click "Manual Deploy" in the dashboard.
- **Vercel *does* auto-deploy on git push** (git integration is connected),
  but only builds successfully because Root Directory is set correctly — don't
  unset it.
- **Medium's page HTML is non-deterministic between requests** — the same URL
  fetched twice can differ in whether topic tags or the "subscribe to this
  author" interstitial appear in the DOM. The import script
  (`scripts/import-medium.mjs`) handles the interstitial via a text-based
  regex (DOM removal wasn't reliable enough), and retries a few times for
  topic tags — but if an import comes back with empty tags or you spot
  leftover Medium chrome in the body, just re-run the import command again.
- **Medium injects non-breaking spaces (U+00A0)** in text nodes — invisible
  in previews/diffs but breaks plain-string matching. The import script
  normalizes them to regular spaces before any text-based cleanup.

## Content workflow

### Importing a Medium article

```bash
cd scripts
node import-medium.mjs https://medium.com/@you/your-post-slug
```

- Saves a local copy to `scripts/imports/<slug>.md` (gitignored).
- If `scripts/.env` has `STRAPI_URL` + `STRAPI_API_TOKEN` set (it does), also
  creates a **draft** Article in Strapi automatically — locale `en` by
  default, review and hit Publish in the admin.
- Auto-creates/reuses Tag entries from Medium's own topic tags on the post.
- Auto-uploads the post's `og:image` as the Article's cover image.
- Sets `sourceUrl` to the original Medium link.
- Re-running the same URL/file **updates** the existing draft (matched by
  slug) instead of failing on a duplicate-slug error or creating a second
  Article — safe to re-run after a fix or a flaky Medium fetch.

### Always add a Spanish translation

The site is bilingual (`es` default, `en`) but Medium imports only land in
`en`. **Every imported article needs an `es` localization pushed too** —
this isn't automated (translation needs a human/Claude pass, not a script),
so after importing: translate the saved `scripts/imports/<slug>.md` into
natural (non-literal) Spanish — including the title and a Spanish slug — as
a new file (convention: `<slug>.es.md`, same frontmatter shape), then push
it as a linked locale of the *same* document:

```bash
node push-translation.mjs <documentId> es ./imports/<slug>.es.md
```

This creates the `es` version as a true Strapi i18n localization of the
same document (shared `documentId`, locale switcher in the admin), not a
separate Article. `coverImage` carries over automatically since it isn't a
localized field, but **tags don't auto-carry** despite also not being
localized — the script explicitly copies tag IDs from the `en` locale
(pass a 4th arg to override the source locale) to avoid a silently
untagged translation.

### Why syndicated articles get a cross-domain canonical

Articles with `sourceUrl` set (i.e., anything imported from Medium) render
`<link rel="canonical">` pointing at the **original Medium URL**, not the
local page, and are **excluded from `sitemap.xml`**. This was a deliberate
choice (confirmed with Kevin) to avoid Google flagging duplicate content
between kevinmeneses.com and Medium — Medium published first and has more
authority, so the local copy defers to it rather than competing. If you ever
want the local copy to rank instead, the standard approach is to publish
originals on kevinmeneses.com first and use Medium's own "Import a story"
feature (which sets Medium's canonical back to the original) — not something
this pipeline does today.

### Contact form → Strapi `Lead`

`web/src/components/ContactForm.tsx` posts to `POST /api/leads`. The `Lead`
content-type (`cms/src/api/lead/`) is **write-only from the public API** — the
route only exposes `create` (`routes/lead.ts` uses `only: ["create"]`), so
even a leaked permission misconfiguration can't be used to read other
people's submissions. Includes a honeypot field (`website`) for basic spam
filtering. Read submissions in Strapi admin → Content Manager → Lead.

## SEO status (as of the last redesign)

- `sitemap.xml` / `robots.txt` implemented (`web/src/app/sitemap.ts`,
  `robots.ts`).
- Per-page metadata (title/description/canonical/hreflang) on home, articles
  list, and article detail pages.
- JSON-LD: Person + ProfessionalService (root layout), Article +
  BreadcrumbList (article pages, only for non-syndicated content).
- Default OG/Twitter image is the profile photo.

## Service landing pages

Four keyword-targeted landings at `/<locale>/<slug>`, one dynamic route
(`web/src/app/[locale]/[service]/page.tsx`). Slugs are localized per language
in `web/src/content/services.ts`; copy lives in `messages/*.json` under
`services.<id>`. The locale switcher keeps the path as-is, so the page
redirects `/en/<es-slug>` to the right slug. Slugs/titles were chosen with
OpenSEO keyword data (2026-10-22): EN `saas copywriter` (40/mo, CPC $47),
`linkedin ghostwriter` (260/mo), `technical writing services` (140/mo);
Spanish volumes are near zero, so ES pages are mainly for conversion.
`youtube content creation` (1.6k/mo) is informational/creator intent — the
YouTube landing isn't expected to rank for it.

## Known gaps / not done yet

- The 3 additional case studies (Nutrient, Zernio, Snowball Analytics) use
  generic, illustrative problem/solution copy (explicitly approved as
  placeholder-style content, not verified client quotes/numbers) — the EODHD
  case study is the only one with a real client quote and a real revenue
  figure (+€25,000).
