"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  AVERAGES,
  AUDIO_TOKENS_PER_SEC,
  VIDEO_TOKENS_PER_SEC,
  formatDecimal,
  formatDuration,
  formatInt,
  formatTokens,
  tokensToWords,
  WORKS,
} from "@/lib/tokens";
import { easeExpo } from "@/lib/motion";

// Log-scale slider: map slider 0..1000 → tokens via exponential
const MIN_LOG = Math.log10(100); // 100
const MAX_LOG = Math.log10(10_000_000); // 10M

function sliderToTokens(v: number) {
  const logVal = MIN_LOG + (v / 1000) * (MAX_LOG - MIN_LOG);
  return Math.pow(10, logVal);
}
function tokensToSlider(t: number) {
  const logVal = Math.log10(t);
  return ((logVal - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 1000;
}

const PRESETS: { label: string; tokens: number }[] = [
  { label: "A tweet", tokens: AVERAGES.tweetTokens },
  { label: "A Wikipedia article", tokens: 930 },
  { label: "A TikTok", tokens: AVERAGES.tiktokSeconds * VIDEO_TOKENS_PER_SEC },
  { label: "A novel", tokens: Math.round(AVERAGES.novelWords / 0.75) },
  { label: "1M", tokens: 1_000_000 },
  { label: "10M", tokens: 10_000_000 },
];

export function TokenScale() {
  const reduce = useReducedMotion();
  const [slider, setSlider] = useState(() => tokensToSlider(1_000_000));
  const tokens = useMemo(() => sliderToTokens(slider), [slider]);

  const words = tokensToWords(tokens);
  const novels = words / AVERAGES.novelWords;
  const textbooks = words / AVERAGES.textbookWords;
  const pages = words / AVERAGES.paperbackPageWords;
  const wikiArticles = words / AVERAGES.wikipediaArticleWords;
  const tiktoks = tokens / (AVERAGES.tiktokSeconds * VIDEO_TOKENS_PER_SEC);
  const videoSec = tokens / VIDEO_TOKENS_PER_SEC;
  const audioSec = tokens / AUDIO_TOKENS_PER_SEC;
  const warAndPeace = tokens / (WORKS.warAndPeace.words / 0.75);

  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex items-baseline justify-between">
        <span className="type-mono-sm">Scale the number</span>
        <span className="type-mono-sm text-bone-3">Log scale · 100 → 10M</span>
      </div>

      <div className="mt-6 flex items-baseline gap-3">
        <motion.span
          key={Math.round(tokens / 100)}
          initial={reduce ? false : { opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: easeExpo }}
          className="type-display-l text-accent"
        >
          {formatTokens(tokens)}
        </motion.span>
        <span className="type-mono">tokens</span>
      </div>

      <input
        type="range"
        min={0}
        max={1000}
        step={1}
        value={slider}
        onChange={(e) => setSlider(parseFloat(e.target.value))}
        className="lg-range mt-4 w-full"
        aria-label="Token count"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setSlider(tokensToSlider(p.tokens))}
            className="type-mono-sm border border-line bg-glass px-3 py-1.5 text-bone-3 transition-colors hover:border-accent hover:text-accent"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <Equiv label="Words" value={formatInt(words)} unit="English words" />
        <Equiv label="Pages" value={formatDecimal(pages)} unit="paperback pages" />
        <Equiv label="Novels" value={formatDecimal(novels)} unit="avg novels (~90k words)" />
        <Equiv
          label="Textbooks"
          value={formatDecimal(textbooks)}
          unit="avg textbooks (~120k words)"
        />
        <Equiv
          label="Wiki articles"
          value={formatInt(wikiArticles)}
          unit="avg Wikipedia articles"
        />
        <Equiv
          label="War and Peace"
          value={formatDecimal(warAndPeace, 2)}
          unit="copies of Tolstoy's novel"
        />
        <Equiv
          label="Video"
          value={formatDuration(videoSec)}
          unit="of video, Gemini default"
        />
        <Equiv
          label="Audio"
          value={formatDuration(audioSec)}
          unit="of audio, Gemini default"
        />
        <Equiv
          label="TikToks"
          value={formatDecimal(tiktoks)}
          unit="avg 34-second clips"
        />
      </div>

      <style jsx>{`
        .lg-range {
          -webkit-appearance: none;
          appearance: none;
          height: 1px;
          background: var(--color-line-2);
          outline: none;
          cursor: pointer;
        }
        .lg-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 0 1px var(--color-accent), 0 0 20px rgba(228, 199, 138, 0.4);
          transition: transform 0.2s;
        }
        .lg-range::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .lg-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 2px solid var(--color-ink);
          box-shadow: 0 0 20px rgba(228, 199, 138, 0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function Equiv({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
      <div className="flex flex-col">
        <span className="type-mono-sm">{label}</span>
        <span className="font-sans text-sm text-bone-3">{unit}</span>
      </div>
      <motion.span
        key={value}
        initial={{ opacity: 0.3, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: easeExpo }}
        className="font-serif text-[1.35rem] tracking-[-0.02em] text-bone md:text-[1.6rem] text-right"
      >
        {value}
      </motion.span>
    </div>
  );
}
