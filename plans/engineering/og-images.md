---
title: Engineering — Per-page Open Graph images
status: not-started
category: engineering
effort: M
last-updated: 2026-04-17
---

## Context

Looking Glass currently has no `og:image`. Shared links on Slack,
Twitter/X, Bluesky, iMessage render as the default browser-title-only
card — which for a visual, typographic site is a meaningful quality
signal lost.

Next 16 supports `opengraph-image.tsx` as a file-convention route that
generates images at build time using the Vercel OG Image library (JSX
→ PNG). That's the right tool. One image per route.

## Context constraint

These are **images on the open web**. Keep the same "original only"
rule: no scraped photography, no third-party fonts without a license.
Instrument Serif and Geist (the site's fonts) are OFL / open — both
usable in OG image generation.

## Goal

Every live page has a distinctive, branded OG image. Readers sharing a
concept link see a card that reflects the piece.

## Approach

1. **Root default.** Add `src/app/opengraph-image.tsx` — a generic card:
   "Looking Glass — a field guide to things worth understanding."
2. **Per-page cards.** For each concept + the About page, add an
   `opengraph-image.tsx` in the route's directory that renders:
   - Top-left: "Looking Glass"
   - Centre: the concept title in serif, at display size.
   - Bottom-left: the kicker (e.g. "On scale").
   - Bottom-right: the series label.
   - Subtle gold accent strip. Match the site's colour tokens exactly.
3. **Type loading.** Load Instrument Serif + Geist Mono TTFs from the
   filesystem (check `node_modules/@fontsource-variable/*` or download
   to `public/fonts/` for this purpose). Next's ImageResponse needs
   actual font data, not CSS.
4. **Test.** Use the Next.js OG Image debugger locally: visit each
   route's `opengraph-image` endpoint in the browser and verify the
   PNG looks correct at 1200×630.
5. **Metadata.** No `metadata.openGraph.images` array change needed —
   Next 16 auto-discovers `opengraph-image.tsx`. Verify the `<meta>`
   tag in view-source after build.

## Files

**Create:**
- `public/fonts/InstrumentSerif-Regular.ttf`
- `public/fonts/GeistMono-Regular.ttf`
- `src/app/opengraph-image.tsx` — site default.
- `src/app/about/opengraph-image.tsx`
- `src/app/one-million-tokens/opengraph-image.tsx`
- `src/app/model-comparison/opengraph-image.tsx`
- `src/app/context-window/opengraph-image.tsx`

## Acceptance

- [ ] `bun run build` completes without warnings about OG image
      generation.
- [ ] Visiting `/<route>/opengraph-image` returns a 1200×630 PNG.
- [ ] Rendered text legible at a phone-sized Slack preview.
- [ ] Viewing source of each page shows a populated
      `<meta property="og:image">` pointing at the generated asset.
- [ ] No third-party photography or scraped assets.

## References

- Next 16 OG image conventions —
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` (relevant files).
- Vercel OG Image library — https://vercel.com/docs/functions/og-image-generation
- Internal: `src/app/globals.css` for colour tokens.
