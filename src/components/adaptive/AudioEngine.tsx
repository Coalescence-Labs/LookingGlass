"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  SCENES,
  STEMS,
  TRANSITIONS,
  captionFor,
  sceneFor,
  stemGains,
  type Drivers,
} from "@/lib/adaptive-music";
import { AdaptiveEngine } from "./audio-engine";
import { ParameterDrivers } from "./ParameterDrivers";
import { StateTree } from "./StateTree";

const MUTE_KEY = "lg-adaptive-muted";

export function AudioEngine() {
  const reduce = useReducedMotion() ?? false;

  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [drivers, setDrivers] = useState<Drivers>({
    tension: 0.4,
    combat: 0,
    discovery: 0.35,
  });
  const [beat, setBeat] = useState(-1);

  const engineRef = useRef<AdaptiveEngine | null>(null);

  // Tear the engine down on unmount.
  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  // Push driver changes to a running engine.
  useEffect(() => {
    if (started) engineRef.current?.setDrivers(drivers);
  }, [drivers, started]);

  const handleStart = useCallback(() => {
    if (engineRef.current) return;
    // Honour the persisted mute preference (persists across reveals).
    let initialMuted = muted;
    try {
      initialMuted = window.localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      // localStorage unavailable — keep current value
    }
    if (initialMuted !== muted) setMuted(initialMuted);
    // Create + resume inside this click so browsers allow audio (claim C-13).
    const engine = new AdaptiveEngine({ onBeat: (n) => setBeat(n % 4) });
    engineRef.current = engine;
    engine.setMuted(initialMuted);
    engine.start();
    engine.setDrivers(drivers);
    setStarted(true);
  }, [drivers, muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      engineRef.current?.setMuted(next);
      try {
        window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        // ignore persistence failure
      }
      return next;
    });
  }, []);

  const fireStinger = useCallback(() => {
    engineRef.current?.fireStinger();
  }, []);

  const gains = stemGains(drivers);
  const scene = sceneFor(drivers);
  const caption = captionFor(scene, gains);

  return (
    <section
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
      aria-label="Adaptive music mixing board"
    >
      {/* Top bar: controls + scene + beat */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {!started ? (
            <button
              type="button"
              onClick={handleStart}
              className="type-mono-sm border border-accent bg-accent-soft px-4 py-2 text-bone transition-colors hover:bg-[rgba(228,199,138,0.22)]"
              aria-label="Start audio"
            >
              ▶ Start audio
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={muted}
              aria-label={muted ? "Unmute audio" : "Mute audio"}
              className="type-mono-sm border border-line bg-glass px-4 py-2 text-bone-3 transition-colors hover:border-accent hover:text-accent"
            >
              {muted ? "🔇 Muted" : "🔊 Sound on"}
            </button>
          )}
          <button
            type="button"
            onClick={fireStinger}
            disabled={!started}
            className="type-mono-sm border border-line bg-glass px-4 py-2 text-bone-3 transition-colors hover:border-accent hover:text-accent disabled:border-dim disabled:text-dim disabled:cursor-not-allowed"
            aria-label="Fire a stinger accent"
          >
            ✦ Stinger
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="type-mono-sm">Scene</span>
            <div className="font-serif text-[1.15rem] text-accent leading-none">
              {scene.label}
            </div>
          </div>
          <div className="flex items-center gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => {
              const on = started && beat === i;
              return (
                <span
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: on ? "var(--color-accent)" : "var(--color-line-2)",
                    transform: on && !reduce ? "scale(1.5)" : "scale(1)",
                    transition: reduce ? "none" : "transform 120ms ease, background 120ms ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {!started && (
        <p className="mt-4 type-mono-sm text-bone-3">
          Audio is off. Nothing plays until you press start — then drive the
          parameters and listen.
        </p>
      )}

      {/* Drivers + state tree */}
      <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <ParameterDrivers drivers={drivers} onChange={setDrivers} />
        <div className="flex flex-col justify-center">
          <StateTree
            scenes={SCENES}
            transitions={TRANSITIONS}
            activeId={scene.id}
            reducedMotion={reduce}
          />
        </div>
      </div>

      {/* Stem rack */}
      <div className="mt-8 border-t border-line pt-6">
        <span className="type-mono-sm">The stems</span>
        <ul className="mt-4 flex flex-col gap-4">
          {STEMS.map((stem) => {
            const g = gains[stem.id];
            const on = g > 0.15;
            return (
              <li key={stem.id} className="grid grid-cols-[auto_1fr] items-center gap-4 md:grid-cols-[5rem_1fr_auto]">
                <span className="font-serif text-[1.05rem] text-bone">
                  {stem.label}
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-[3px] w-full max-w-[18rem]"
                    style={{ background: "var(--color-line)" }}
                  >
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.round(g * 100)}%`,
                        background: on
                          ? "var(--color-accent)"
                          : "var(--color-line-2)",
                        transition: reduce ? "none" : "width 220ms cubic-bezier(0.22,1,0.36,1), background 220ms ease",
                      }}
                    />
                  </div>
                </div>
                <span
                  className="type-mono-sm col-span-2 md:col-span-1"
                  style={{ color: on ? "var(--color-accent)" : "var(--color-muted)" }}
                >
                  {on ? "on" : "off"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Live caption — keeps the page usable muted */}
      <p className="mt-6 type-body text-bone-2" aria-live="polite">
        {caption}
      </p>
    </section>
  );
}
