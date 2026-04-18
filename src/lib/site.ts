const DEFAULT_SITE_URL = "https://lookingglass.coalescencelabs.app";

/**
 * Canonical site origin for metadata, sitemap, and robots.
 * Set `NEXT_PUBLIC_SITE_URL` in preview or alternate deployments.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv?.trim()) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_SITE_URL;
}
