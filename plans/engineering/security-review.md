---
title: Engineering — Security review of public surface
status: done
category: engineering
effort: M
last-updated: 2026-11-01
---

## Context

Looking Glass has one server-side entry point: `POST /api/submit` (see
`src/app/api/submit/route.ts`). Everything else is static. But "one
entry point" is exactly the place abuse concentrates, and the site will
be publicly linked from coalescencelabs.app. Do a one-time review
before traffic shows up.

Deliverable is a research file + a follow-up engineering plan (or
commits) for any high-severity findings. This plan covers the review
only — not the fixes.

## Goal

Produce `research/security-review.md` covering the submission pipeline,
client-side surface, and build/deploy configuration.

## Approach

### 1. Submission pipeline (`src/app/api/submit/route.ts`)

- **Honeypot efficacy** — assess: a named `website` field in a
  `position:absolute` off-screen container. Rate modern bot evasion
  (likely low signal). Should we add a second layer (timestamp-based,
  JS-required)?
- **Rate limiting** — current impl is in-memory per serverless instance.
  On Vercel that resets per cold start and varies across edge regions.
  Evaluate whether Upstash Redis is warranted, or if the existing cap is
  good-enough for site scale.
- **Input validation** — `idea` capped at 4000 chars, `name/email/kind`
  at 200. Check for: control characters, null bytes, header-injection
  attempts in the subject line, multipart boundary smuggling.
- **HTML escaping** — `escapeHtml` is hand-rolled. Verify it covers the
  OWASP cheat-sheet characters. Consider whether to drop the HTML body
  entirely and send text-only.
- **Reply-to handling** — the email field becomes `replyTo`. Check what
  Resend does with malformed values; consider validating against an RFC
  5321-ish shape before passing it.
- **Environment** — `RESEND_API_KEY`, `SUBMIT_TO_EMAIL`, `SUBMIT_FROM_EMAIL`.
  Confirm none are exposed via `NEXT_PUBLIC_*`. Confirm Vercel project
  settings don't accidentally expose preview deployments.

### 2. Client surface

- **CSP** — no explicit `Content-Security-Policy` header yet. Assess
  whether to add one via `next.config.ts` headers. At minimum consider
  `frame-ancestors` and `object-src 'none'`.
- **Other security headers** — `X-Content-Type-Options`,
  `Referrer-Policy`, `Strict-Transport-Security`, `X-Frame-Options`.
- **Third-party resources** — the site loads Google Fonts (`next/font`
  self-hosts; verify). Confirm no other third-party scripts.
- **External links** — audit every `target="_blank"` for
  `rel="noreferrer"` (spot-check: it's already consistent, but confirm).

### 3. Build/deploy configuration

- **Vercel project settings** — branch protection, preview deployment
  password (or not), environment-variable scoping (production vs
  preview).
- **`.env.local`** — confirm `.gitignore` excludes it; confirm no secrets
  committed historically (`git log -p .env.local` — should 404).
- **Dependencies** — run `bun outdated` and `bun audit` (or equivalent).
  Flag any known-vulnerable packages.

## Files

**Create:**
- `research/security-review.md`

## Acceptance

- [x] Every checklist item above addressed in the research file with
      either "ok" or a finding.
- [x] Findings ranked by severity; each has a recommended fix with file
      paths.
- [x] Any critical-severity finding gets a follow-up plan created under
      `plans/engineering/`.

## References

- OWASP Cheatsheet Series — https://cheatsheetseries.owasp.org/
- MDN: Security on the web — https://developer.mozilla.org/docs/Web/Security
- Vercel security docs — https://vercel.com/docs/security
- Resend API reference — https://resend.com/docs/api-reference

## Closing

Shipped as `research/security-review.md` (full public-surface review,
reconciled with develop’s incremental IP-logging notes and the landed
`stripHeaderControls` fix). Follow-ups for CSP/headers and IP
minimization remain recommendations in that file — not blockers for
closing this review-only plan.
