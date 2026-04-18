---
title: Engineering — Structured logging for /api/submit
status: not-started
category: engineering
effort: S
last-updated: 2026-04-17
---

## Context

`src/app/api/submit/route.ts` currently logs via `console.error` with
loose string formatting. That's enough for catching crashes in the
Vercel dashboard, but:

- We can't filter submission attempts from Resend failures from rate-
  limit hits.
- We can't correlate a failed submission with a user's claim that "I
  sent you something and never heard back."
- A future on-call who isn't the maintainer can't triage blind.

The fix is structured JSON logging with a small set of well-named events
and consistent shape. Vercel's runtime captures stdout JSON and makes it
filterable.

## Goal

Every log line from the submission pipeline is a single JSON object
with: `event`, `level`, `requestId`, `ip`, and event-specific fields.
Nothing sensitive (idea text, email address) is logged.

## Approach

1. **Logger module.** `src/lib/log.ts` — a minimal JSON logger. No
   dependency. Accepts `event: string, fields: Record<string, unknown>,
   level?: "info" | "warn" | "error"`. Emits `{ ts, level, event,
   ...fields }` to `console.log` / `console.error` as appropriate.
2. **Request ID.** Derive at the top of `POST`: use
   `crypto.randomUUID()`. Thread through every log line in the request.
3. **Events to log.** Each with its defined fields:
   - `submit.received` — `{ requestId, ip, ideaLength, hasEmail,
     hasName, kind }`. No idea content; no email address.
   - `submit.honeypot` — `{ requestId, ip }` (at `warn`).
   - `submit.rate_limited` — `{ requestId, ip }` (at `warn`).
   - `submit.validation_failed` — `{ requestId, reason }` (at `warn`).
   - `submit.resend_error` — `{ requestId, resendMessage }` (at `error`).
   - `submit.sent` — `{ requestId, resendId }` (at `info`).
4. **Config check.** On first handler invocation with missing
   `RESEND_API_KEY`, log `submit.misconfigured` once per cold start (at
   `error`).
5. **Privacy.** `ip` is logged because it's already used for rate
   limiting; document in the security research file whether to hash it
   before logging (defer to security review).

## Files

**Create:**
- `src/lib/log.ts`

**Modify:**
- `src/app/api/submit/route.ts` — replace all `console.error` with the
  logger.

## Acceptance

- [ ] Every log line is valid JSON on one line.
- [ ] No `idea`, `name`, or `email` value ever appears in logs.
- [ ] Happy-path submission produces exactly two logs: `submit.received`
      and `submit.sent`.
- [ ] Unit/sanity test with `curl` covers each event path; confirm the
      event fires (check Vercel logs or `bun run dev` terminal).
- [ ] `bun run build` clean.

## References

- Vercel runtime logging —
  https://vercel.com/docs/observability/runtime-logs
- Structured logging best practices — any recent "JSON logs" guide.
- Internal: `src/app/api/submit/route.ts`.
