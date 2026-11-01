---
title: Concept — How a feed sees you
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-18
---

## Context

Social-feed apps are the most-used interactive systems on earth, and
their inner workings are the most carefully-packaged as "magic." The
piece demystifies exactly what a feed measures about its user — from
the explicit signals (like, comment, share, follow) to the implicit
ones (dwell time, scroll velocity, pause-on-face, rewatches, mute state,
swipe direction, hover on a profile) — and how those signals become
the ranker that decides what you see next.

The piece must be **neutral-descriptive**, not a polemic. The objective
function is engagement; describing what that optimisation looks like
implemented is inherently illuminating. Moralising is not the point.

Primary-source bar is especially high here because a lot of public
discourse on this subject is rumour or second-hand. Cite Meta's DLRM
paper, YouTube's Covington et al. (2016), TikTok material from the
leaked 2022 NYT reporting plus TikTok's own public statements, Twitter/X's
2023 algorithm open-sourcing, and any published information from
platform transparency reports.

## Goal

Ship `/engagement-signals` (title: *"How a feed sees you"*) as a
Concept in Series III. Centerpiece is a running **Signal Ledger** — a
list that accumulates as the reader scrolls through a mocked feed,
showing in real time which signals the app would have captured. The
invisible made visible.

## Approach

1. **Research.** Write `research/engagement-signals.md`. Include a
   signal catalogue (explicit, implicit, off-app), a pipeline diagram
   (client → event bus → feature store → ranker), and an app-by-app
   weighting table with citations. For anything not primary-sourced,
   mark it explicitly as inference.

2. **Data.** `src/lib/engagement-signals.ts`:
   - `SIGNALS: Signal[]` — each with `{ id, label, kind (explicit |
     implicit | off-app), description, citation }`.
   - `FEED_CARDS: FeedCard[]` — 5–8 mocked feed posts (original copy +
     placeholder imagery we generate, not scraped).
   - `APP_WEIGHTS: AppWeight[]` — per-platform dominant signals with
     citations.
   - `PIPELINE: PipelineStage[]` — client / transport / storage /
     ranker / response, each with a one-line summary.

3. **Visuals.**
   - **`FeedMock`** — scrollable feed of the mock cards. Instrument
     every interaction that maps to a real signal: enter-viewport
     (dwell start), leave-viewport (dwell end), pause >1.5s (extended
     dwell), hover/tap on the profile, tap the caption to expand,
     scroll velocity between cards, rewatch detection on video cards
     (not really video — simulate with a countdown).
   - **`SignalLedger`** — sticky side panel (desktop) or bottom
     drawer (mobile) that accumulates a row per captured signal with
     a short label and a timestamp. Clear button resets.
   - **`RankerPipeline`** — boxes-and-arrows SVG; state-driven
     highlight follows a single signal through the pipeline.
   - **`AppWeightings`** — small bar chart per app showing the signal
     mix their published work or leaked internals describe.

4. **Page structure.**
   - `PageHeader` — kicker "On attention," title "How a feed sees you."
   - **Short answer.** One paragraph: "You are the corpus. Everything
     you do in an app is a signal; signals rank the feed; the feed's
     objective is engagement."
   - **§ I — The signals.** Explicit + implicit, demonstrated with
     `FeedMock` + `SignalLedger`.
   - **§ II — Where they go.** `RankerPipeline`. Client event → event
     bus (Kafka-ish) → feature store (Feast-ish) → DLRM-style ranker →
     ordered feed. Cite Meta's DLRM paper.
   - **§ III — How different feeds weight them.** `AppWeightings`.
     TikTok on dwell + rewatch; Instagram on the social graph;
     Twitter/X on engagement velocity; YouTube on watch-time.
   - **§ IV — Off-app signals.** IDFA/AAID, location SDKs, Meta Pixel
     and co., shared attribution networks (AppsFlyer, Adjust, Branch),
     cross-app device graphs. Anchor in Apple's ATT disclosures and
     Google Play Services documentation.
   - **§ V — What it's optimising for.** Engagement as objective
     function. Stated objectives ("meaningful interactions") vs
     inferred ones (session length, ad-load, creator retention). Avoid
     editorialising — let the comparison do the work.
   - **§ VI — What you can see and what you can't.** Platform
     transparency tools (Instagram's "Why you're seeing this"),
     ATT/Android dashboards, Jumbo-style third-party audit tools, and
     the gap that remains.
   - Sources & notes.

5. **Content discipline.**
   - All mock feed content is original. No scraped posts, no reused
     influencer language, no real usernames.
   - Any diagram is first-party SVG. No leaked internal docs reproduced
     verbatim — only cited.
   - Every "what TikTok does" claim is tied to a source; anything
     inferred is flagged as such.

## Files

**Create:**
- `research/engagement-signals.md`
- `src/lib/engagement-signals.ts`
- `src/components/engagement/FeedMock.tsx`
- `src/components/engagement/SignalLedger.tsx`
- `src/components/engagement/RankerPipeline.tsx`
- `src/components/engagement/AppWeightings.tsx`
- `src/app/engagement-signals/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry (Series III).

## Acceptance

- [ ] `bun run lint` and `bun run build` both clean.
- [ ] FeedMock captures at least six distinct signal types as the
      reader scrolls (viewport enter, extended dwell, profile hover,
      caption expand, scroll velocity bucket, rewatch).
- [ ] SignalLedger updates in real time and is clearable.
- [ ] Every app-weighting claim in § III cites a primary source.
- [ ] § IV treats off-app tracking accurately — no hyperbole, but no
      downplaying either.
- [ ] § V distinguishes stated and inferred objectives explicitly.
- [ ] Tone is neutral-descriptive throughout; a reader can't tell if
      the author likes or dislikes these systems.
- [ ] Mock feed content is original; no scraped posts, usernames, or
      influencer prose.
- [ ] Page remains readable with JavaScript disabled (core prose +
      static diagrams present).
- [ ] Reduced-motion disables scroll-triggered ledger animations but
      keeps the ledger itself functional.
- [ ] Mobile-responsive; the ledger becomes a bottom drawer at ≤ 768px.

## Cross-references

- Thematic sibling to `plans/concepts/attention-mechanism.md` — both
  about what an algorithm notices and ignores, on different time
  scales.
- A natural precursor to a future piece on **recommender systems as
  infrastructure** — the economic-and-social-choice layer above the
  mechanical one this piece covers.

## References

### Primary
- Naumov et al., "Deep Learning Recommendation Model for
  Personalization and Recommendation Systems" (DLRM, 2019) —
  arxiv.org/abs/1906.00091
- Covington, Adams, Sargin, "Deep Neural Networks for YouTube
  Recommendations" (RecSys 2016).
- Twitter/X algorithm open-source (2023) —
  https://github.com/twitter/the-algorithm
- Meta AI Research blog — https://ai.meta.com/research/
- Apple App Tracking Transparency —
  https://developer.apple.com/documentation/apptrackingtransparency
- Google Play SDK index —
  https://developers.google.com/android/guides

### Reporting and audits
- New York Times, "How TikTok Reads Your Mind" (Dec 2022) — referenced
  for leaked internal heuristics; cite carefully and triangulate with
  TikTok's own statements.
- FTC 6(b) report on data practices of social media and video services
  (2024 or latest available).

### Academic
- Gray, Kou, Battles, Hoggatt, Toombs, "The Dark (Patterns) Side of
  UX Design" (CHI 2018).
- Zuboff, *The Age of Surveillance Capitalism* (2019) — cited for
  framework, not as primary technical source.

### Internal
- `src/components/motion/Reveal.tsx` — motion pattern.
- `src/app/context-window/page.tsx` — page rhythm reference.
