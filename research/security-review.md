---
topic: Security review (incremental notes)
plan: plans/engineering/security-review.md
date: 2026-04-18
agent: cursor
status: draft
---

## Summary

Incremental security notes recorded before the full public-surface review ships. **Structured logging and IP addresses:** `POST /api/submit` emits JSON logs that include `ip` (from `X-Forwarded-For` / `X-Real-IP`) on every event so operators can correlate abuse with rate limiting. **Open:** whether to hash, truncate (for example to /24), or otherwise minimize IP retention in log sinks is deferred to the full review (`plans/engineering/security-review.md`).

## Method

Code review of `src/lib/log.ts` and `src/app/api/submit/route.ts` on 2026-04-18, per `plans/engineering/structured-logging.md` privacy note.

## Open questions

1. **IP in structured logs** — Raw IP is logged alongside `requestId`. Same header data already drives in-memory rate limiting. Decide after reviewing Vercel log retention and compliance posture whether to log a derived identifier instead.

## Sources

- `plans/engineering/structured-logging.md`
- `plans/engineering/security-review.md`
