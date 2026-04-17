"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// Original short transcript — a planning conversation about a trip to Kyoto.
// Written for this page; nothing scraped from another source.
type Turn = { role: "user" | "assistant"; text: string };

const TRANSCRIPT: Turn[] = [
  { role: "user", text: "I want to plan a ten-day trip to Kyoto in November." },
  {
    role: "assistant",
    text:
      "Lovely. November is the tail end of the autumn leaves. Do you want to focus on temples, food, crafts, or a mix?",
  },
  { role: "user", text: "A mix, but temples first. I'd like to be outdoors when I can." },
  {
    role: "assistant",
    text:
      "Then let's anchor the first three days in east Kyoto — Kiyomizu-dera, the Philosopher's Path, and up toward Ginkaku-ji. Mornings are quieter and the light is better.",
  },
  { role: "user", text: "Are there any tea houses you'd recommend along the Philosopher's Path?" },
  {
    role: "assistant",
    text:
      "Yes — a small place called Café Gospel has a courtyard view, and Yojiya Cafe near Nanzen-ji is good for a mid-walk stop. Both open late morning.",
  },
  { role: "user", text: "Okay, add those. What about the west side — Arashiyama?" },
  {
    role: "assistant",
    text:
      "Give Arashiyama its own day. The bamboo grove is best just after sunrise; after that, cross to Tenryu-ji, then the boat on the Hozu river if the weather holds.",
  },
  { role: "user", text: "I might want to take a day trip to Nara for the deer." },
  {
    role: "assistant",
    text:
      "Easy from Kyoto — about 45 minutes on the JR Nara line. I'd pair the deer park with Todai-ji in the morning and Kasuga-taisha in the afternoon.",
  },
  { role: "user", text: "I keep forgetting — what was that café near the Philosopher's Path?" },
  {
    role: "assistant",
    text: "",
    // assistant's reply is filled in at render time depending on whether the earlier message is still in context
  },
];

const WINDOW_TOKENS = 320; // small enough that the essay ends up pushing older turns out
const TOKENS_PER_CHAR = 0.25;

function tokensOf(text: string) {
  return Math.ceil(text.length * TOKENS_PER_CHAR);
}

export function ChatFallout() {
  const turns = useMemo(
    () =>
      TRANSCRIPT.map((t) => ({
        ...t,
        tokens: tokensOf(t.text),
      })),
    [],
  );
  const [shown, setShown] = useState(2);
  const [auto, setAuto] = useState(false);

  const step = useCallback(() => {
    setShown((s) => Math.min(s + 1, turns.length));
  }, [turns.length]);

  const reset = useCallback(() => {
    setAuto(false);
    setShown(2);
  }, []);

  const autoActive = auto && shown < turns.length;

  useEffect(() => {
    if (!autoActive) return;
    const id = window.setTimeout(step, 1400);
    return () => window.clearTimeout(id);
  }, [autoActive, shown, step]);

  // Compute which turns are currently "in window":
  // walk from the newest shown turn backwards, summing tokens, mark turns as
  // in-window until we exceed WINDOW_TOKENS.
  const inWindow = new Array<boolean>(turns.length).fill(false);
  let running = 0;
  for (let i = shown - 1; i >= 0; i--) {
    running += turns[i].tokens || 1;
    if (running <= WINDOW_TOKENS) {
      inWindow[i] = true;
    } else {
      break;
    }
  }

  const usedTokens = Math.min(
    WINDOW_TOKENS,
    turns.slice(0, shown).reduce((sum, t, i) => sum + (inWindow[i] ? t.tokens : 0), 0),
  );
  const pct = (usedTokens / WINDOW_TOKENS) * 100;

  // Decide the assistant's final reply. If the mention of the café is still in window,
  // it can answer. Otherwise, it cannot remember.
  const lastTurnIndex = turns.length - 1;
  const cafeReferenceIndex = 5; // the turn where the café is named
  const canRemember = inWindow[cafeReferenceIndex];
  const finalReply = canRemember
    ? "Café Gospel — in the courtyard, just off the path."
    : "I'm sorry — that part of our conversation isn't in my window any more. Could you remind me?";
  const renderedTurns = turns.map((t, i) =>
    i === lastTurnIndex ? { ...t, text: finalReply, tokens: tokensOf(finalReply) } : t,
  );

  return (
    <div
      className="border border-line p-5 md:p-8"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="type-mono-sm">Simulated chat</span>
          <p className="font-serif text-[1.1rem] leading-snug text-bone mt-1">
            A deliberately small window.{" "}
            <span className="text-bone-3">
              {WINDOW_TOKENS.toLocaleString()} tokens — about a page of dialogue.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={step}
            disabled={shown >= turns.length}
            className="type-mono-sm border border-line bg-glass px-3 py-1.5 text-bone-3 transition-colors hover:border-accent hover:text-accent disabled:border-dim disabled:text-dim disabled:cursor-not-allowed"
          >
            Next turn →
          </button>
          <button
            type="button"
            onClick={() => setAuto((v) => !v)}
            disabled={shown >= turns.length}
            className="type-mono-sm border border-line bg-glass px-3 py-1.5 text-bone-3 transition-colors hover:border-accent hover:text-accent disabled:border-dim disabled:text-dim disabled:cursor-not-allowed"
          >
            {autoActive ? "Pause" : "Auto-play"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="type-mono-sm border border-line bg-glass px-3 py-1.5 text-bone-3 transition-colors hover:border-accent hover:text-accent"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Budget meter */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="type-mono-sm">Window usage</span>
          <span className="type-mono-sm text-bone">
            {usedTokens} / {WINDOW_TOKENS} tok
          </span>
        </div>
        <div
          className="mt-2 h-[4px] w-full"
          style={{ background: "var(--color-line)" }}
        >
          <div
            className="h-full"
            style={{
              width: `${pct}%`,
              background:
                pct > 90
                  ? "var(--color-accent)"
                  : "linear-gradient(90deg, rgba(236,232,222,0.35), var(--color-bone-2))",
              transition: "width 380ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </div>

      {/* Transcript */}
      <ul className="mt-6 flex flex-col gap-3">
        {renderedTurns.slice(0, shown).map((t, i) => {
          const alive = inWindow[i];
          const isUser = t.role === "user";
          return (
            <li
              key={i}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[82%] border px-4 py-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: isUser
                    ? "rgba(228,199,138,0.06)"
                    : "rgba(236,232,222,0.03)",
                  borderColor: isUser
                    ? "rgba(228,199,138,0.25)"
                    : "var(--color-line-2)",
                  opacity: alive ? 1 : 0.18,
                  filter: alive ? "none" : "blur(2px)",
                  transform: alive ? "none" : "translateX(-8px)",
                }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="type-mono-sm">
                    {isUser ? "You" : "Assistant"}
                  </span>
                  {!alive && (
                    <span className="type-mono-sm text-dim">
                      out of window
                    </span>
                  )}
                </div>
                <p className="font-serif text-[1.05rem] leading-relaxed text-bone mt-1">
                  {t.text}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 type-mono-sm text-bone-3 max-w-2xl">
        The assistant only sees what&rsquo;s inside its window. When the
        conversation outgrows the budget, earlier turns fall out. Walk to the
        end and watch what happens when the model is asked about something
        that&rsquo;s no longer there.
      </p>
    </div>
  );
}
