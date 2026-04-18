---
title: Research — Accessibility audit
status: not-started
category: research
effort: M
last-updated: 2026-04-17
---

## Context

Looking Glass has never had a formal a11y pass. The design leans on low
contrast (bone on ink), gold accent, and animation-heavy reveals. That
can be beautiful and exclusionary at the same time. Before the site gets
meaningful traffic, do a proper audit and write down what's broken.

No code changes come out of this plan directly — the deliverable is a
research file. Separate engineering tickets will apply the findings.

## Goal

Produce `research/accessibility-audit.md` with a prioritised findings
list covering every live route: `/`, `/about`, `/one-million-tokens`,
`/model-comparison`, `/context-window`, plus edge pages (`error.tsx`,
`not-found.tsx`, `loading.tsx`, `global-error.tsx`).

## Approach

For each route, check:

1. **Contrast ratios** — use Chrome DevTools or axe-core. Every body-text
   colour pair must meet WCAG AA (4.5:1 for normal text, 3:1 for large).
2. **Keyboard navigation** — can you reach every interactive element with
   Tab? Is focus visible? Do skip-links exist on dense pages?
3. **Screen-reader labels** — run NVDA or VoiceOver over each page. Are
   all interactive components announced? Are decorative SVGs
   `aria-hidden`?
4. **Motion safety** — does `prefers-reduced-motion` actually collapse
   every animated element? (Check `ViewportDemo`, `PriceChart`,
   `ChatFallout`, `Reveal`, `SplitWords`, `GlassLens`.)
5. **Form a11y** — submission form: label association, error
   announcement, success announcement (`aria-live`).
6. **Heading order** — no jumped levels; each page has one `<h1>`.
7. **Colour-independent semantics** — nothing conveyed by gold alone.
8. **Audio/video** — placeholder for Concept on adaptive music when it
   lands (`plans/concepts/adaptive-music.md`).

Tools:
- `axe-core` via its CLI or browser extension.
- Lighthouse's a11y audit.
- Manual NVDA / VoiceOver pass.
- Keyboard-only navigation session.

## Files

**Create:**
- `research/accessibility-audit.md`

## Acceptance

- [ ] Every live route has its own subsection with findings.
- [ ] Each finding has severity (critical / high / medium / low) and a
      repo-relative file path for the fix.
- [ ] At least one open-questions item acknowledges what wasn't checked
      (e.g. third-party tools not tried, languages not tested).

## References

- WCAG 2.2 — https://www.w3.org/TR/WCAG22/
- MDN ARIA — https://developer.mozilla.org/docs/Web/Accessibility/ARIA
- axe-core rules — https://dequeuniversity.com/rules/axe/
