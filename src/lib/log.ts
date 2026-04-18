export type LogLevel = "info" | "warn" | "error";

/**
 * Minimal JSON logger for serverless stdout (e.g. Vercel runtime logs).
 * One line per call; no dependencies. Callers must not pass sensitive fields.
 */
export function log(
  event: string,
  fields: Record<string, unknown>,
  level: LogLevel = "info",
): void {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...fields,
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
