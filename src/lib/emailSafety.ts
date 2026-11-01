/**
 * Escape text for HTML email bodies. Without this, anything the visitor types
 * (including script tags) is interpreted as HTML in many mail clients — stored
 * XSS in your inbox when you open the message.
 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip ASCII control chars (incl. CR/LF) for SMTP header fields — avoids header injection. */
export function stripHeaderControls(s: string): string {
  return s.replace(/[\x00-\x1f\x7f]/g, "");
}
