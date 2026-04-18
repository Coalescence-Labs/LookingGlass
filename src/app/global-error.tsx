"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

// Catches errors that occur in the root layout itself. Must define its own
// <html> and <body> because it replaces the root layout when active. No
// access to global CSS variables/fonts here — style inline with safe fallbacks.

export default function GlobalError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error("[looking-glass] global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#09090B",
          color: "#ECE8DE",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 560, width: "100%" }}>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6D6860",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 32,
                height: 1,
                background: "rgba(236, 232, 222, 0.16)",
                display: "inline-block",
              }}
            />
            <span>Critical error</span>
          </div>

          <h1
            style={{
              fontFamily: "ui-serif, Georgia, serif",
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              marginTop: 32,
              fontWeight: 400,
            }}
          >
            Looking Glass cracked.
          </h1>

          <p
            style={{
              marginTop: 24,
              fontSize: "1.125rem",
              lineHeight: 1.55,
              color: "#CFC9BC",
              maxWidth: "36rem",
            }}
          >
            Something broke at the frame itself. Reload the page, or try again
            in a moment. If this persists, we&rsquo;d appreciate a report.
          </p>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                padding: "12px 20px",
                border: "1px solid rgba(236, 232, 222, 0.16)",
                background: "rgba(236, 232, 222, 0.04)",
                color: "#ECE8DE",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="mailto:coalescencelabs@gmail.com?subject=Looking%20Glass%20%E2%80%94%20global%20error"
              style={{
                color: "#A29C8D",
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Report it →
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#3A362F",
              }}
            >
              Reference · {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
