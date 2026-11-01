#!/usr/bin/env bash
# Sanity curls for POST /api/submit — watch the dev server terminal for JSON log lines.
# Usage: in one shell `bun run dev`; in another `BASE_URL=http://127.0.0.1:3000 bash scripts/verify-submit-logs.sh`
set -euo pipefail

BASE="${BASE_URL:-http://127.0.0.1:3000}"
URL="$BASE/api/submit"
HDR=(-H "Content-Type: application/json" -H "X-Forwarded-For: 203.0.113.50")

echo "== submit.validation_failed (invalid JSON) — expect warn submit.validation_failed reason=invalid_json"
curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$URL" "${HDR[@]}" -d 'not-json' || true

echo "== submit.honeypot — expect warn submit.honeypot"
curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$URL" "${HDR[@]}" -d '{"website":"x"}' || true

echo "== submit.validation_failed (idea_required) — expect warn submit.validation_failed reason=idea_required"
curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$URL" "${HDR[@]}" -d '{"idea":""}' || true

echo "== submit.rate_limited — 6 posts with same X-Forwarded-For, empty idea (400) until 429; no email sent"
for i in 1 2 3 4 5 6; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" -X POST "$URL" "${HDR[@]}" \
    -d '{}' || echo "000")
  echo "  request $i -> $code"
done

echo "== submit.misconfigured — unset RESEND_API_KEY, restart dev once, POST valid body; expect one error submit.misconfigured per cold start"
echo "    (manual: env -u RESEND_API_KEY bun run dev, then curl with {\"idea\":\"x\"})"

if [[ "${SUBMIT_LIVE:-}" == "1" ]]; then
  echo "== Happy path (SUBMIT_LIVE=1) — expect info submit.received then submit.sent"
  curl -sS -o /dev/null -w "%{http_code}\n" -X POST "$URL" "${HDR[@]}" \
    -d '{"idea":"Structured logging curl check","kind":"curl","name":"","email":""}' || true
else
  echo "== Happy path skipped (set SUBMIT_LIVE=1 to send a real test message via Resend)"
fi

echo "Done. Confirm each event appears as one-line JSON in the server logs."
