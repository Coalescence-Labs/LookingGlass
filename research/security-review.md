---
topic: Security review of public surface (submit API, client, deploy)
plan: plans/engineering/security-review.md
date: 2026-04-18
agent: cursor
status: draft
---

## Summary

The app’s attack surface is small: one JSON `POST` handler (`src/app/api/submit/route.ts`), static pages, and fonts loaded via `next/font/google` (bundled at build time). `bun audit` reported no known vulnerable dependencies at review time. Gaps worth fixing soon: no global security/CSP headers; in-memory rate limiting is best-effort on serverless; the honeypot is weak against modern bots. **Email header injection via `kind` in `subject` was the highest finding at review time; that sanitization has since landed** via `stripHeaderControls` in `src/lib/emailSafety.ts` (used for `kind` / `replyTo`). No secrets are referenced via `NEXT_PUBLIC_*` in application source. External `target="_blank"` links consistently use `rel="noreferrer"`. Structured logs on `/api/submit` include raw client IPs — retention minimization remains an open privacy question. **No findings were classified as critical** after this pass, so no separate follow-up engineering plan file was added under `plans/engineering/`.

## Method

- Read `src/app/api/submit/route.ts`, `src/components/about/SubmissionForm.tsx`, `src/app/layout.tsx`, `next.config.ts`, `.gitignore`.
- `rg 'NEXT_PUBLIC' src` — no matches in `src/` at review time (later `NEXT_PUBLIC_SITE_URL` may exist for sitemap; confirm still non-secret).
- `rg 'target="_blank"' src -A1` — every hit includes `rel="noreferrer"` on the next line.
- `git log -p -- .env.local` — no output (path not in history).
- `bun outdated` and `bun audit` (Bun 1.3.12) from repo root on branch `plan/security-review`.
- Code review of `src/lib/log.ts` for structured logging / IP retention (merged incremental notes from develop).
- Vercel project dashboard settings were **not** inspected (no dashboard access); recommendations are checklist-style for operators.
- Reconciled against `develop` after merge (2026-11-01): confirmed `stripHeaderControls` is applied on submit subject/`replyTo` paths.

## Findings

Ranked highest to lowest severity.

### 1. High — Possible email header injection via `kind` in `subject` — **addressed on develop**

**Description (at review):** `kind` came from user JSON, capped at 200 characters with `asString`, but was **not** stripped of CR/LF or other SMTP-header control characters before interpolation into `subject`.

**Status:** Fixed on `develop` via `stripHeaderControls` from `src/lib/emailSafety.ts`, applied to `kind` (subject) and email (`replyTo`) in `src/app/api/submit/route.ts`. Keep treating mail metadata as untrusted; extend the sanitizer if new fields are added.

**Files:** `src/app/api/submit/route.ts`, `src/lib/emailSafety.ts`.

### 2. Medium — No Content-Security-Policy or hardening headers

**Description:** `next.config.ts` primarily sets `allowedDevOrigins`. There is no explicit `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, or `X-Frame-Options` / `frame-ancestors` from application config. Next/Vercel may add some defaults, but the app does not define an explicit policy.

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

**Description:** `replyTo` is set from the optional `email` string (trimmed, length-capped, now control-stripped) without RFC 5322-style validation. Malformed values are likely rejected or ignored by Resend, but the app does not pre-validate. `SUBMIT_FROM_EMAIL` is trusted env input; misconfiguration could produce odd `From` headers.

**Recommended fix:** Validate `email` with a conservative regex or library before `resend.emails.send`; reject addresses with spaces, angle brackets, or multiple `@`. Document expected `SUBMIT_FROM_EMAIL` format in README or internal runbook.

**Files:** `src/app/api/submit/route.ts`.

### 6. Low — Hand-rolled HTML escaping / mail body construction

**Description:** Escaping encodes `&`, `<`, `>`, `"`, `'`. OWASP XSS Prevention Cheat Sheet also discusses `/` in some attribute contexts. Values are placed in HTML **text nodes** and a `mailto:` **href** after escaping; **risk is low** for typical XSS. Backticks are not escaped (relevant mainly in old quirky parsers). Confirm current helper (`escapeHtml` in `emailSafety` or equivalent) stays shared.

**Recommended fix:** **Ok for current usage.** If you expand HTML templates or mix user data into attributes/URLs, prefer a maintained utility or send **text-only** mail and drop HTML to reduce parser variance.

**Files:** `src/app/api/submit/route.ts`, `src/lib/emailSafety.ts`.

### 7. Informational — Multipart boundary smuggling

**Description:** Request body is JSON (`req.json()`), not `multipart/form-data`. **N/A — ok.**

**Files:** `src/app/api/submit/route.ts`.

### 8. Informational — Control / null bytes in text fields

**Description:** Length-capping helpers may not strip `\0` or other C0 controls from `idea` / `name`. HTML path uses escaping; plaintext mail includes idea text. Odd bytes could confuse mail clients but are not a typical web XSS vector in this handler.

**Recommended fix:** Optional normalization (strip `\0`, collapse excessive control chars) for cleaner operator experience.

**Files:** `src/app/api/submit/route.ts`.

### 9. Informational — Raw IP addresses in structured submit logs

**Description:** `POST /api/submit` emits JSON logs that include `ip` (from `X-Forwarded-For` / `X-Real-IP`) on events so operators can correlate abuse with rate limiting. The same header data already drives in-memory rate limiting.

**Recommended fix:** Decide after reviewing Vercel log retention and compliance posture whether to hash, truncate (for example to /24), or otherwise minimize IP retention in log sinks.

**Files:** `src/lib/log.ts`, `src/app/api/submit/route.ts`.

## Approach checklist (plan § Approach)

Each item: **ok** or cross-reference to a finding above.

| Item | Result |
|------|--------|
| Honeypot efficacy | **Finding 4** (low) — keep; optional stronger layers if needed |
| Rate limiting | **Finding 3** (medium) — ok for scale; Redis/WAF if abuse grows |
| Input validation (length, control chars, header injection, multipart) | **Finding 1** addressed; **Finding 8** informational; multipart **ok** |
| HTML escaping | **Finding 6** (low) — ok for current embedding |
| Reply-to handling | **Finding 5** (low) |
| Environment / `NEXT_PUBLIC_*` / preview exposure | **ok** for secrets in source; Vercel preview hardening is **operator checklist** (see Recommendations) |
| CSP | **Finding 2** (medium) |
| Other security headers | **Finding 2** (medium) |
| Third-party resources / fonts | **ok** — `next/font/google` in `layout.tsx` self-hosts font files at build time; no extra third-party script tags found in reviewed layout/nav |
| External links `rel` on `target="_blank"` | **ok** — all audited occurrences include `rel="noreferrer"` |
| Vercel project settings | **Operator checklist** (no dashboard access) — see Recommendations |
| `.gitignore` / `.env.local` history | **ok** — `.gitignore` includes `.env*` and `.env*.local`; `git log -p -- .env.local` empty |
| Dependencies (`bun outdated` / `bun audit`) | **ok** at review — re-run on merge |
| Structured logging / IP retention | **Finding 9** |

## Sources

- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
- MDN: Security on the web — https://developer.mozilla.org/docs/Web/Security
- Vercel security — https://vercel.com/docs/security
- Resend API reference — https://resend.com/docs/api-reference
- Internal: `src/app/api/submit/route.ts`, `src/lib/emailSafety.ts`, `src/lib/log.ts`, `src/components/about/SubmissionForm.tsx`, `src/app/layout.tsx`, `next.config.ts`, `.gitignore`
- `plans/engineering/structured-logging.md`

## Recommendations

1. **Mail metadata** — Keep `stripHeaderControls` on all user-influenced subject/`replyTo` fields; add shape validation for email. (`src/app/api/submit/route.ts`, `src/lib/emailSafety.ts`)
2. **Add security headers + CSP** — Configure in `next.config.ts` with `frame-ancestors`, `object-src 'none'`, and policies aligned to current script/style sources. (`next.config.ts`)
3. **Vercel (manual)** — Enable preview protection or scoped env vars if previews must not receive production `RESEND_API_KEY`; confirm branch protection on `main`/`develop`; restrict who can trigger deployments. (Vercel dashboard / docs)
4. **Monitor abuse** — Log patterns for `/api/submit` (already instrumented via `log`); revisit Redis rate limits if volume spikes; decide IP minimization (**Finding 9**).

## Open questions

- Does Resend strip CR/LF from API-provided `subject` and `replyTo` before SMTP? Confirm with provider behavior or support (defense-in-depth still warranted even with local sanitization).
- Will the site ever embed third-party iframes or analytics scripts? If yes, CSP `connect-src` / `script-src` will need explicit allowances.
- **IP in structured logs** — Hash, truncate, or drop raw IPs given Vercel log retention and compliance posture?
