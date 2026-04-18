---
title: Engineering — Sitemap and robots.txt
status: done
category: engineering
effort: S
last-updated: 2026-04-18
---

## Context

Once the site is on its custom domain, search crawlers need two things
to index it properly: a `robots.txt` with the sitemap URL, and a
`sitemap.xml` enumerating every public route. Next 16 generates both via
file conventions (`robots.ts` and `sitemap.ts`) — no manual XML writing.

This is also the right time to decide what should **not** be indexed:
the submission API route, any preview deployments, future drafts. The
`/api/submit` route is already dynamic so it won't appear in a static
sitemap, but `robots.txt` should disallow `/api/*` to be explicit.

## Goal

Google / Bing / DuckDuckGo can crawl every concept page + the About
page, discover the sitemap automatically, and skip the API surface.

## Approach

1. **Sitemap.** Create `src/app/sitemap.ts` returning the concepts list
   (from `src/lib/concepts.ts`, filtered to `status: "live"`) plus `/`,
   `/about`. Each entry: `{ url, lastModified, changeFrequency, priority }`.
   Use the deployment's base URL from `metadataBase` or an env var
   (`NEXT_PUBLIC_SITE_URL`).
2. **Robots.** Create `src/app/robots.ts`:
   - `Allow: /`
   - `Disallow: /api/*`
   - `Sitemap: <base>/sitemap.xml`
3. **Base URL.** Ensure `NEXT_PUBLIC_SITE_URL` (or
   `metadata.metadataBase` in `layout.tsx`) is authoritative for the
   production domain `https://lookingglass.coalescencelabs.app`. Both
   sitemap and robots read from the same source.
4. **Verify.** After deploy: `curl https://lookingglass.coalescencelabs.app/sitemap.xml`
   and `curl .../robots.txt`; submit to Google Search Console.

## Files

**Create:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/lib/site.ts` — shared `getSiteUrl()` for sitemap, robots, and `metadataBase`.

**Modify (if needed):**
- `src/app/layout.tsx` — wired `metadataBase` / Open Graph URL to `getSiteUrl()`.

## Acceptance

- [x] `bun run build` emits `sitemap.xml` and `robots.txt` as static
      assets.
- [x] Sitemap lists exactly the live concept pages, `/`, and `/about`.
- [x] Robots disallows `/api/*`.
- [x] Sitemap URL uses the production domain, not `localhost`.
- [ ] Search Console can fetch both without error.

## References

- Next 16 sitemap —
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` (when available) or the official docs.
- Next 16 robots — same folder.
- Internal: `src/lib/concepts.ts`, `src/app/layout.tsx`.
