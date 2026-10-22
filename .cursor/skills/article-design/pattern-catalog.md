# Pattern catalog

Vocabulary for section design. When speccing a section, name the pattern by
ID (e.g. `P-SLIDER-LOG`) so implementers know what to build.

---

## Layout patterns

### L-SHORT-ANSWER

Two-column short answer immediately after `PageHeader`.

**Structure**

```
Reveal
  grid md:grid-cols-[1.3fr_1fr] border-t border-line pt-12 md:pt-16
    Left:  type-mono-sm label → type-display-m with italic text-accent spans
    Right: 1–2 stat blocks, type-mono-sm labels, type-numeral or BigNumber, rule divider
```

**Live ref:** all three concept pages, first section after header.

**Use when:** the article has a single sentence that reframes the topic.

---

### L-SECTION-CHROME

Standard § header row.

```
flex items-end justify-between border-b border-line pb-6
  Left:  type-mono-sm "§ N" + type-heading title
  Right: type-mono-sm context label (date, "Interactive", model count, …)
```

**Live ref:** every § in Concepts 01–03.

---

### L-PROSE-GRID

Asymmetric two-column explainer (no interactive).

```
grid md:grid-cols-[0.9fr_1.4fr]
  Left:  type-display-m heading (sometimes with italic accent)
  Right: type-body paragraphs in flex flex-col gap-6 max-w-xl
```

**Live ref:** Concept 01, "what a token is" section.

**Use when:** one strong heading anchors several paragraphs of mechanism.

---

### L-STAT-TABLE

Bordered list of comparable quantities.

**Component:** `StatRow` with `StatRowItem[]`.

**Live ref:** Concept 01 § I and § II.

**Use when:** the reader needs to scan many equivalents (tokens, durations,
sizes) with editorial equivalents in serif and numbers in `type-numeral`.

---

### L-CARD-GRID

Responsive card grid for entities with metadata.

```
grid gap-5 md:grid-cols-2 xl:grid-cols-3
  Reveal per card with stagger delay={i * 0.06}
```

**Live ref:** Concept 02 ModelCard sections.

**Use when:** comparing multiple named items (models, stages, machine types).

---

## Interactive patterns

### P-SLIDER-LOG

Log-scale slider driving live derived stats.

**Behaviour:** slider 0..1000 maps to `10^min..10^max`; displayed values
animate with `motion.span` + `useReducedMotion`; preset buttons snap slider.

**Data:** constants in `src/lib/`, derived values computed client-side.

**Live ref:** `TokenScale` in Concept 01.

**Use when:** the topic spans orders of magnitude (time, scale, tokens, distance).

**Spec must include:** min/max, presets, derived columns, format functions.

---

### P-SLIDER-LINEAR

Linear slider with direct mapping.

Same chrome as P-SLIDER-LOG but linear scale. Use for bounded physical ranges
(pressure, temperature, window size in tokens).

**Live ref:** ViewportDemo band height slider (Concept 03).

---

### P-VIEWPORT

Scrollable content with a fixed "window" band showing what's visible.

**Behaviour:** user scrolls long content; a highlighted band marks the
visible region; live counter updates; optional size control.

**Live ref:** `ViewportDemo` (Concept 03).

**Use when:** teaching sliding windows, visibility, partial observation.

**Spec must include:** content source (original prose length), measurement
method (chars → tokens), band min/max, scroll container a11y.

---

### P-SIMULATION-STEP

Stepped narrative the user advances (or auto-plays).

**Behaviour:** discrete steps reveal state; final step shows consequence;
reset + optional auto-advance.

**Live ref:** `ChatFallout` (Concept 03).

**Use when:** teaching accumulation, overflow, causality over time.

**Spec must include:** step count, transcript/content (original), token budget
logic, what changes on the final step.

---

### P-COMPARISON-STRIP

Horizontal or vertical comparison of named items on one axis.

**Live ref:** `ModelComparisonStrip` (Concept 03).

**Use when:** ranking or comparing 4–10 items on one dimension (context
window, luminosity, price tier).

---

### P-SCATTER-CHART

CSS-positioned chart with log axes and hover/tap tooltips.

**Behaviour:** dots positioned by transform/percent; gridlines; staggered
entrance via IntersectionObserver (not whileInView on dots if above fold).

**Live ref:** `PriceChart` (Concept 02).

**Use when:** two numeric dimensions per item, wide dynamic range.

**Spec must include:** axis ranges, log vs linear, hover content, colour coding.

---

### P-TASK-PICKER

Selection UI that filters or reveals recommendations.

**Behaviour:** tabs or buttons select a task/category; panel updates with
curated picks and rationale.

**Live ref:** `TaskPicker` (Concept 02).

**Use when:** the article's payoff is "which one should I use?" or equivalent
decision guidance.

---

### P-HEATMAP

Grid of weights with hover/touch highlighting.

**Use when:** attention matrices, correlation, routing tables.

**Spec must include:** row/column labels, colour scale, keyboard/touch path,
precomputed JSON path, no runtime inference.

**Planned ref:** `plans/concepts/attention-mechanism.md`.

---

### P-LEVEL-UNLOCK

Single scene that gains capabilities as the reader unlocks levels.

**Behaviour:** level selector; scene re-renders with new feature; earlier levels
remain comprehensible.

**Live ref:** none live yet — specified in `plans/concepts/rendering-levels.md`.

**Use when:** the topic is naturally cumulative (renderer, protocol stack).

**Spec must include:** level list, what visually changes per level, shared scene
state, unlock UI pattern.

---

### P-TIMELINE

Log or linear timeline with a "you are here" marker.

**Use when:** evolution over time (stellar stages, protocol history).

**Spec must include:** axis scale (log Gyr vs linear), stage boundaries,
current-position marker, mobile collapse strategy.

**Planned ref:** `plans/concepts/solar-life-cycle.md`.

---

### P-DIAGRAM-CUTAWAY

First-party SVG/CSS cross-section with labelled parts.

**Use when:** physical mechanisms (espresso machine, engine).

**Spec must include:** layers, labels, hover or step-through, no third-party
diagrams.

---

## Motion patterns

### M-REVEAL

Default scroll entrance. Wrapper only — no Motion import.

```tsx
<Reveal delay={0.08}>…</Reveal>
```

Above-the-fold: Reveal triggers on mount (built into component).

---

### M-SPLIT-TITLE

Word stagger on H1 only — handled by `PageHeader` / `SplitWords`. Do not
use elsewhere.

---

### M-COUNT-UP

Animated numeral on first view.

**Component:** `BigNumber` with `useInView`.

**Use for:** hero stats, one or two per page max.

---

### M-VALUE-PULSE

Short opacity/y transition when a derived value changes.

```tsx
<motion.span key={roundedValue} initial={…} animate={…} transition={{ duration: 0.25, ease: easeExpo }} />
```

**Use for:** slider-driven outputs. Always gate with `useReducedMotion`.

---

### M-DECOR-STAGGER

`whileInView` entrance for purely decorative, `aria-hidden` elements.

**Live ref:** `BookSpines`.

**Never use for:** text, controls, data the reader needs immediately.

---

## Reusable components

| Component | Path | Use |
|-----------|------|-----|
| `PageHeader` | `src/components/site/PageHeader.tsx` | Every page |
| `Reveal` | `src/components/motion/Reveal.tsx` | Section entrances |
| `SplitWords` | `src/components/motion/SplitWords.tsx` | Via PageHeader |
| `BigNumber` | `src/components/stats/BigNumber.tsx` | Animated hero stats |
| `StatRow` | `src/components/stats/StatRow.tsx` | Comparison tables |
| `SourceOutboundLink` | `src/components/site/SourceOutboundLink.tsx` | External citations |

Import easings from `src/lib/motion.ts` (`easeExpo`, `fadeUp`, `stagger`).

---

## Anti-patterns (do not spec)

- Generic hero image with no teaching function
- Motion on every paragraph (noise, performance, a11y)
- `whileInView` on above-the-fold content (hydration flash)
- Runtime API inference on the page
- Third-party diagram embeds
- New colour or type utilities outside `globals.css`
- Dev-server-dependent demos in the design spec
