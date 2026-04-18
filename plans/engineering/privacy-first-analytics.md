---
title: Engineering — Privacy-respecting analytics
status: in-progress
category: engineering
effort: S
last-updated: 2026-04-18
---

## Context

Looking Glass has zero analytics right now. The maintainer has no
visibility into traffic, what pieces get read, or where readers land.
Useful signal to have — but this site's voice commits to treating the
reader as an adult. That rules out surveillance-shape tooling (GA4,
Facebook Pixel, Hotjar).

The right answer is a cookieless, anonymous pageview counter that
respects `Do Not Track` and `Sec-GPC` headers. Two candidates:

- **Vercel Web Analytics** — zero-config on this stack, cookieless,
  anonymised IPs, on the Vercel Pro tier (ask whether this is already
  covered). Likely lightest touch.
- **Plausible** (self-hosted or plausible.io) — open-source, explicit
  GDPR posture, requires a small script include and DNS setup.

## Goal

Add pageview + outbound-link analytics with no cookies, no cross-site
identifiers, and no PII collection. The reader should be able to
opt out via standard browser signals.

## Approach

1. **Decide the vendor.** Start by checking whether Vercel Web Analytics
   is already covered by the project's plan. If yes, default to it. If
   no, use plausible.io (hosted) with a ~$9/mo plan.
2. **Instrument.**
   - **Vercel path:** install `@vercel/analytics`, wrap the app in
     `<Analytics />` inside `src/app/layout.tsx`.
   - **Plausible path:** add the script tag to `src/app/layout.tsx`
     (before `</body>`) with `data-domain=lookingglass.coalescencelabs.app`
     and `data-exclude-links=true` if we want manual outbound tracking.
3. **Event instrumentation.** Minimal. Two events only:
   - `submission_sent` on successful form submission
     (`src/components/about/SubmissionForm.tsx`).
   - `outbound_click` on external-source links in concept pages.
4. **Document.** Add a "Privacy" section to the About page's § II
   explaining what's collected and what isn't.
5. **Verify opt-out.** Set `Do Not Track` or `Sec-GPC` headers in
   devtools and confirm the script doesn't fire (Plausible honours
   these by default; Vercel's behaviour should be verified).

## Files

**Modify:**
- `src/app/layout.tsx` — analytics import + mount.
- `src/components/about/SubmissionForm.tsx` — `submission_sent` event.
- `src/app/about/page.tsx` — add "Privacy" paragraph in § II (or a new
  § "What we count").

**Create (if instrumenting custom events):**
- `src/lib/analytics.ts` — thin wrapper around `plausible()` or
  `track()` with a no-op fallback for local dev.

## Acceptance

- [x] No cookies set by the analytics library (check DevTools ›
      Application › Cookies).
- [x] `Sec-GPC: 1` request header opts out of tracking.
- [x] Outbound click and submission events fire once, not on every
      re-render.
- [x] About page explains what's collected.
- [x] `bun run build` clean.

## References

- Vercel Analytics — https://vercel.com/docs/analytics
- Plausible — https://plausible.io/docs
- Global Privacy Control — https://globalprivacycontrol.org/
