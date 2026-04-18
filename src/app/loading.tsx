export default function Loading() {
  return (
    <section className="shell flex min-h-[60vh] flex-col justify-center py-24">
      <div className="flex items-center gap-3 type-mono-sm">
        <span
          className="inline-block h-px w-8 bg-line-2"
          style={{ animation: "lg-pulse 1.6s ease-in-out infinite" }}
        />
        <span className="text-bone-3">Loading…</span>
      </div>

      <h1
        className="mt-10 type-display-m text-bone max-w-3xl"
        style={{
          opacity: 0.4,
          animation: "lg-pulse 1.8s ease-in-out infinite",
        }}
      >
        Turning the page.
      </h1>

      <style>{`
        @keyframes lg-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="lg-pulse"] { animation: none !important; opacity: 0.7 !important; }
        }
      `}</style>
    </section>
  );
}
