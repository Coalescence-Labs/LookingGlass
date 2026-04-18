---
title: Concept — How a 3D renderer sees (in levels)
status: not-started
category: concept
effort: L
series: "III — Everyday machines"
last-updated: 2026-04-17
---

## Context

A 3D renderer is the machinery every game, film, and Blender scene
leans on — and it's almost entirely invisible to the people who rely on
it. The piece should explain raytracing from first principles, then
progressively unlock layers until the reader has a real mental model of
what Cycles (Blender's path tracer) and Eevee (its rasteriser) are
actually doing.

The piece takes a format none of the other Looking Glass concepts use:
a **levelled progression**. Each level adds one capability to a shared
running scene. The reader sees the same image improve as concepts
stack.

This piece has a real reference implementation to point at:
[Alex Joshua's Dynamic-Renderer](https://github.com/Alexjoshua14/Dynamic-Renderer)
— the author's own raytracer. Cite specific commits or tags as
"here's what level N looks like in a real codebase" so readers who want
to get their hands dirty have somewhere concrete to go.

## Goal

Ship `/rendering` as a Concept in Series III, structured as five
unlockable levels that take the reader from "ray through a pinhole" to
"how Cycles scales to production," with a single live interactive scene
that visibly improves as levels unlock.

## The five levels

1. **Cameras and rays.** The pinhole camera model. Parametric rays,
   ray-sphere and ray-plane intersection. Why a renderer starts with
   backwards tracing (from the eye, not from the light). Output: flat
   silhouettes.
2. **Light and shadow.** Lambertian diffuse, Phong specular, shadow
   rays. Ambient as a fudge. What "direct lighting" means. Output: a
   matte, recognisable 3D scene with hard shadows.
3. **Mirrors and glass.** Recursive reflection, Snell's law for
   refraction, Fresnel term, total internal reflection. Whitted-style
   raytracing (1980). Output: chrome and glass surfaces that look
   right.
4. **Paths and global illumination.** Monte Carlo path tracing, the
   rendering equation, BRDFs, importance sampling, variance and why
   path tracers are noisy. Output: soft bounces, colour bleed, the
   look we associate with "photorealistic."
5. **Blender scale.** Acceleration (BVH), denoising, adaptive sampling,
   the rasteriser/path-tracer split (Eevee vs Cycles), GPU ray cores.
   Where Dynamic-Renderer's architecture diverges from production
   engines and why that's fine for a learning implementation. Output:
   an understanding of *why* Blender feels the way it does.

Each level ends with a "try it" card that links to the corresponding
branch, tag, or commit in Dynamic-Renderer (coordinate with Alex on
naming — ideally `levels/01-rays`, `levels/02-lighting`, etc.).

## Goal shape

The piece reads as one article, not five mini-articles. The prose
between levels is tight — each level is one scrollable § with:

- A short editorial opener (≤ 4 sentences).
- A visual: the live scene in its "just unlocked this level" state.
- 2–4 short prose paragraphs covering the mechanism.
- A mini equation card where the math clarifies (e.g. Snell, the
  rendering equation).
- A "try it" card pointing at Dynamic-Renderer.

## Approach

1. **Research.** Write `research/rendering.md`:
   - PBRT (Pharr, Jakob, Humphreys) — the canonical reference.
   - Peter Shirley's *Ray Tracing in One Weekend* trilogy — the
     pedagogical shape we're borrowing most directly.
   - Whitted, "An Improved Illumination Model for Shaded Display"
     (1980).
   - Kajiya, "The Rendering Equation" (1986).
   - Blender's Cycles + Eevee docs and source pointers.
   - Read Dynamic-Renderer; document how its architecture maps to each
     level.

2. **Data.** `src/lib/rendering.ts`:
   - `LEVELS: Level[]` — each with `{ id, name, blurb, featureFlags,
     equationLatex?, repoRef }`.
   - Feature flags drive what the live demo renders at each level:
     `{ raysCast, diffuse, specular, shadows, mirror, refraction,
     pathTrace, bvh }`.

3. **Visuals.**
   - **`LiveScene`** (client) — a small canvas-based raytracer that
     renders a fixed scene (a sphere on a plane, a mirror, a glass
     ball). Level state → feature flags → which code paths run.
     Keep it small (≤ 400×300) for perf; render on a worker thread if
     it stutters. Uses `@react-three/fiber` only if genuinely easier;
     pure Canvas 2D is probably fine for the scale.
   - **`LevelStepper`** — sticky vertical rail on desktop / sticky top
     bar on mobile. Advances level on scroll-into-view of each §.
     Clicking a level jumps the scene state directly.
   - **`RayDiagram`** — per-level 2D SVG illustrations (pinhole model,
     shadow ray, reflection, path-trace splay). First-party SVG, no
     scraped textbook figures.
   - **`LevelComparison`** — at the end, a strip showing the same
     scene at each level for a before/after.

4. **Page structure.**
   - `PageHeader` — kicker "On images," title something like "How a
     renderer sees."
   - **Short answer** — one paragraph; raytracing defined in terms of
     simulating light backwards from the eye.
   - **§ 01 — Cameras and rays** through **§ 05 — Blender scale** —
     one level per §.
   - **§ VI — Credits and a real codebase.** Link to Dynamic-Renderer,
     explain how to run it, what to read first in its source. Cite
     Alex as the author; cite PBRT / Shirley as the intellectual
     lineage.
   - Sources & notes.

5. **Performance budget.** The live scene must not block main-thread
   scroll. If canvas raytracing stalls on low-end mobile, downgrade to
   pre-rendered PNG frames per level and swap on level change.

6. **Labeling.** Mathematics shown on the page is notation, not proof.
   Link PBRT for derivations rather than reproducing them. Keep the
   piece readable for someone who last touched linear algebra in
   college.

## Files

**Create:**
- `research/rendering.md`
- `src/lib/rendering.ts` — levels, feature flags, scene definition.
- `src/components/rendering/LiveScene.tsx`
- `src/components/rendering/LevelStepper.tsx`
- `src/components/rendering/RayDiagram.tsx`
- `src/components/rendering/LevelComparison.tsx`
- `src/app/rendering/page.tsx`

**Modify:**
- `src/lib/concepts.ts` — add concept entry (Series III).

## Acceptance

- [ ] `bun run lint` and `bun run build` both clean.
- [ ] Live scene renders at all five levels without stalling desktop
      Chrome, Safari, Firefox; degrades gracefully on mobile.
- [ ] Level state drives the scene; a user who jumps to Level 4 sees
      path-traced output, not Level 1 output.
- [ ] Every equation on the page has alt-text describing it for
      screen readers.
- [ ] Each level has a working link to a named commit/branch/tag in
      Dynamic-Renderer (coordinate with Alex; do not link to `main` if
      it drifts).
- [ ] Dynamic-Renderer is credited as the author's own work; PBRT and
      Shirley credited as intellectual lineage.
- [ ] All diagrams first-party SVG. No textbook figures lifted.
- [ ] Reduced-motion skips the auto-advance on scroll; user can still
      step levels manually.

## Cross-references

- Thematic sibling to `plans/concepts/adaptive-music.md` — both
  about systems that only become themselves at runtime.
- A future piece on **shaders** (fragment/vertex programs as tiny
  programs on the GPU) would branch naturally from Level 5.

## References

### Canonical
- Pharr, Jakob, Humphreys — *Physically Based Rendering: From Theory
  to Implementation*. https://pbr-book.org/
- Peter Shirley — *Ray Tracing in One Weekend* series.
  https://raytracing.github.io/
- Whitted, "An Improved Illumination Model for Shaded Display" (1980).
- Kajiya, "The Rendering Equation" — SIGGRAPH 1986.

### Production engines
- Blender Cycles documentation —
  https://docs.blender.org/manual/en/latest/render/cycles/
- Blender Eevee documentation —
  https://docs.blender.org/manual/en/latest/render/eevee/

### Reference implementation
- Alex Joshua, *Dynamic-Renderer* —
  https://github.com/Alexjoshua14/Dynamic-Renderer

### Internal
- `src/components/motion/Reveal.tsx` — motion pattern.
- `src/app/one-million-tokens/page.tsx` — page rhythm.
- `package.json` — `@react-three/fiber` and `three` already installed
  if needed.
