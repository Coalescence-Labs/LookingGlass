import { track as vercelTrack } from "@vercel/analytics";
import type { BeforeSendEvent } from "@vercel/analytics";

/**
 * True when the reader has asked not to be tallied (Do Not Track or
 * Global Privacy Control). Matches what we enforce in `beforeSend` and
 * custom-event helpers.
 */
export function readerDeclinedTracking(): boolean {
  if (typeof window === "undefined") return false;
  const dnt = navigator.doNotTrack;
  if (dnt === "1" || dnt === "yes") return true;
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
  return Boolean(gpc);
}

export function analyticsBeforeSend(
  event: BeforeSendEvent,
): BeforeSendEvent | null {
  if (readerDeclinedTracking()) return null;
  return event;
}

export function trackSubmissionSent(): void {
  if (typeof window === "undefined") return;
  if (readerDeclinedTracking()) return;
  vercelTrack("submission_sent");
}

export function trackOutboundClick(destUrl: string): void {
  if (typeof window === "undefined") return;
  if (readerDeclinedTracking()) return;
  let host: string;
  try {
    const u = new URL(destUrl, window.location.href);
    if (u.protocol !== "http:" && u.protocol !== "https:") return;
    if (u.origin === window.location.origin) return;
    host = u.hostname;
  } catch {
    return;
  }
  vercelTrack("outbound_click", { host });
}
