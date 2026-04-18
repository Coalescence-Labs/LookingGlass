---
topic: Security review of public surface (submit API, client, deploy)
plan: plans/engineering/security-review.md
date: 2026-04-18
agent: cursor
status: draft
---

## Summary

The app’s attack surface is small: one JSON `POST` handler (`src/app/api/submit/route.ts`), static pages, and fonts loaded via `next/font/google` (bundled at build time). `bun audit` reported no known vulnerable dependencies. Gaps worth fixing soon: no global security/CSP headers; in-memory rate limiting is best-effort on serverless; the honeypot is weak against modern bots; and **`kind` is concatenated into the outbound email `subject` without stripping control characters**, which can be an email header-injection class of bug unless Resend normalizes newlines (treat as **high** until verified). No secrets are referenced via `NEXT_PUBLIC_*` in application source. External `target="_blank"` links consistently use `rel="noreferrer"`. **No findings were classified as critical** after this pass, so no separate follow-up engineering plan file was added under `plans/engineering/`.

## Method

- Read `src/app/api/submit/route.ts`, `src/components/about/SubmissionForm.tsx`, `src/app/layout.tsx`, `next.config.ts`, `.gitignore`.
- `rg 'NEXT_PUBLIC' src` — no matches in `src/`.
- `rg 'target="_blank"' src -A1` — every hit includes `rel="noreferrer"` on the next line.
- `git log -p -- .env.local` — no output (path not in history).
- `bun outdated` and `bun audit` (Bun 1.3.12) from repo root on branch `plan/security-review`.
- Vercel project dashboard settings were **not** inspected (no dashboard access); recommendations are checklist-style for operators.

## Findings

Ranked highest to lowest severity.

### 1. High — Possible email header injection via `kind` in `subject`

**Description:** `kind` comes from user JSON, is capped at 200 characters with `asString`, but is **not** stripped of CR/LF or other SMTP-header control characters. It is interpolated directly into `subject`:

```138:139:src/app/api/submit/route.ts
  const subjectKind = kind ? ` · ${kind}` : "";
  const subject = `Looking Glass · new idea${subjectKind}`;
```

If the outbound provider passes `Subject` through to SMTP without normalizing newlines, attackers could try header-smuggling patterns (e.g. injecting additional header lines). **Resend’s behavior should be confirmed** in their docs or with a controlled test in a non-production project.

**Recommended fix:** Strip or reject `\r`, `\n`, and other C0 control characters (except tab if you allow it) from `kind`, `name`, and any future user-influenced mail metadata; optionally cap `subject` to a single line after normalization. Prefer a small shared sanitizer used before any email send.

**Files:** `src/app/api/submit/route.ts` (and any future mail helpers under `src/lib/` if extracted).

### 2. Medium — No Content-Security-Policy or hardening headers

**Description:** `next.config.ts` only sets `allowedDevOrigins`. There is no `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, or `X-Frame-Options` / `frame-ancestors` from application config. Next/Vercel may add some defaults, but the app does not define an explicit policy.

**Recommended fix:** Add `headers()` in `next.config.ts` (or middleware) with a tight CSP for script/style/img/font/connect, plus `frame-ancestors 'none'` (or `'self'` if embedding is needed), `object-src 'none'`, `base-uri 'self'`, and complementary headers (`Referrer-Policy`, `X-Content-Type-Options: nosniff`, HSTS on the apex host). Tune `connect-src` if analytics or APIs are added later.

**Files:** `next.config.ts`; optionally `src/middleware.ts` if you need per-route headers.

### 3. Medium — Rate limiting is per-instance and ephemeral

**Description:** Rate limits use an in-memory `Map` keyed by IP (`RATE_LIMIT_MAX` per `RATE_LIMIT_WINDOW_MS`). On Vercel/serverless, memory does not survive cold starts, and concurrent instances do not share state, so caps are probabilistic, not global.

**Recommended fix:** For current low traffic, **ok as a speed bump**. If abuse becomes measurable, add Upstash Redis (or Vercel KV) sliding-window limits keyed by IP + optional fingerprint, or an edge firewall rule / WAF in front of `/api/submit`.

**Files:** `src/app/api/submit/route.ts` (or a dedicated `src/lib/rate-limit.ts`).

### 4. Low — Honeypot alone is weak signal

**Description:** Hidden `website` field (`SubmissionForm.tsx`) returns fake success when non-empty. Sophisticated bots often ignore or fill such fields; signal is **low** for targeted abuse.

**Recommended fix:** Keep honeypot as cheap default. Optionally add time-on-page minimum, proof-of-work, or Turnstile/hCaptcha **only if** spam volume justifies UX cost.

**Files:** `src/components/about/SubmissionForm.tsx`, `src/app/api/submit/route.ts`.

### 5. Low — `replyTo` and `from` not shape-validated

**Description:** `replyTo` is set from the optional `email` string (trimmed, length-capped) without RFC 5322-style validation. Malformed values are likely rejected or ignored by Resend, but the app does not pre-validate. `SUBMIT_FROM_EMAIL` is trusted env input; misconfiguration could produce odd `From` headers.

**Recommended fix:** Validate `email` with a conservative regex or library before `resend.emails.send`; reject addresses with spaces, angle brackets, or multiple `@`. Document expected `SUBMIT_FROM_EMAIL` format in README or internal runbook.

**Files:** `src/app/api/submit/route.ts`.

### 6. Low — Hand-rolled `escapeHtml` omits `/` and backticks

**Description:** `escapeHtml` encodes `&`, `<`, `>`, `"`, `'`. OWASP XSS Prevention Cheat Sheet also discusses `/` in some attribute contexts. Here values are placed in HTML **text nodes** and a `mailto:` **href** after escaping; **risk is low** for typical XSS. Backticks are not escaped (relevant mainly in old quirky parsers).

**Recommended fix:** **Ok for current usage.** If you expand HTML templates or mix user data into attributes/URLs, consider `import { escapeHtml }` from a maintained utility or send **text-only** mail and drop HTML to reduce parser variance.

**Files:** `src/app/api/submit/route.ts`.

### 7. Informational — Multipart boundary smuggling

**Description:** Request body is JSON (`req.json()`), not `multipart/form-data`. **N/A — ok.**

**Files:** `src/app/api/submit/route.ts`.

### 8. Informational — Control / null bytes in text fields

**Description:** `asString` does not strip `\0` or other C0 controls from `idea`, `name`, or `email`. HTML path uses `escapeHtml`; plaintext mail includes raw idea text. Odd bytes could confuse mail clients but are not a typical web XSS vector in this handler.

**Recommended fix:** Optional normalization (strip `\0`, collapse excessive control chars) for cleaner operator experience.

**Files:** `src/app/api/submit/route.ts`.

## Approach checklist (plan § Approach)

Each item: **ok** or cross-reference to a finding above.

| Item | Result |
|------|--------|
| Honeypot efficacy | **Finding 4** (low) — keep; optional stronger layers if needed |
| Rate limiting | **Finding 3** (medium) — ok for scale; Redis/WAF if abuse grows |
| Input validation (length, control chars, header injection, multipart) | **Finding 1** (high, `kind`/`subject`), **Finding 8** (informational); multipart **ok** |
| HTML escaping | **Finding 6** (low) — ok for current embedding |
| Reply-to handling | **Finding 5** (low) |
| Environment / `NEXT_PUBLIC_*` / preview exposure | **ok** in source (no `NEXT_PUBLIC_*` in `src/`); Vercel preview hardening is **operator checklist** (see Recommendations) |
| CSP | **Finding 2** (medium) |
| Other security headers | **Finding 2** (medium) |
| Third-party resources / fonts | **ok** — `next/font/google` in `layout.tsx` self-hosts font files at build time; no extra third-party script tags found in reviewed layout/nav |
| External links `rel` on `target="_blank"` | **ok** — all audited occurrences include `rel="noreferrer"` |
| Vercel project settings | **Operator checklist** (no dashboard access) — see Recommendations |
| `.gitignore` / `.env.local` history | **ok** — `.gitignore` includes `.env*` and `.env*.local`; `git log -p -- .env.local` empty |
| Dependencies (`bun outdated` / `bun audit`) | **ok** — audit clean; outdated: patch-level `react`/`react-dom`, dev-only bumps listed in Method |

## Sources

- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
- MDN: Security on the web — https://developer.mozilla.org/docs/Web/Security
- Vercel security — https://vercel.com/docs/security
- Resend API reference — https://resend.com/docs/api-reference
- Internal: `src/app/api/submit/route.ts`, `src/components/about/SubmissionForm.tsx`, `src/app/layout.tsx`, `next.config.ts`, `.gitignore`

## Recommendations

1. **Sanitize mail metadata** — Strip `\r`/`\n` (and optionally other controls) from `kind` before building `subject`; validate `email` before `replyTo`. (`src/app/api/submit/route.ts`)
2. **Add security headers + CSP** — Configure in `next.config.ts` with `frame-ancestors`, `object-src 'none'`, and policies aligned to current script/style sources. (`next.config.ts`)
3. **Vercel (manual)** — Enable preview protection or scoped env vars if previews must not receive production `RESEND_API_KEY`; confirm branch protection on `main`/`develop`; restrict who can trigger deployments. (Vercel dashboard / docs)
4. **Monitor abuse** — Log patterns for `/api/submit` (already partially instrumented via `log`); revisit Redis rate limits if volume spikes. (`src/app/api/submit/route.ts`, observability stack)

## Open questions

- Does Resend strip CR/LF from API-provided `subject` and `replyTo` before SMTP? Confirm with provider behavior or support.
- Will the site ever embed third-party iframes or analytics scripts? If yes, CSP `connect-src` / `script-src` will need explicit allowances.
