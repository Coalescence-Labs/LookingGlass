// Pure, testable helpers for the /api/submit route.
// Kept dependency-free so they can be unit-tested without Next or Resend.

export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX = 5;
export const IDEA_MAX = 4000;
export const FIELD_MAX = 200;

/** Best-effort client IP from common proxy headers. */
export function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Coerce unknown input to a trimmed, length-capped string. */
export function asString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.slice(0, max).trim();
}

/**
 * Sliding-window rate limiter. The `store` and `now` are injected so callers
 * own the lifetime of the state and tests stay deterministic.
 */
export function rateLimited(
  ip: string,
  store: Map<string, number[]>,
  now: number = Date.now(),
): boolean {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const previous = store.get(ip)?.filter((t) => t > windowStart) ?? [];
  if (previous.length >= RATE_LIMIT_MAX) {
    store.set(ip, previous);
    return true;
  }
  previous.push(now);
  store.set(ip, previous);
  return false;
}
