"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "motion/react";
import {
  DEMO_FREQ_HZ,
  resultantAmplitude,
  sampleWave,
} from "@/lib/anc";

function pathFromSamples(samples: number[], w: number, h: number, mid: number) {
  const amp = h * 0.28;
  return samples
    .map((v, i) => {
      const x = (i / (samples.length - 1)) * w;
      const y = mid - v * amp;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function WaveSuperposition() {
  const reduce = useReducedMotion() ?? false;
  const labelId = useId();
  const [phaseDeg, setPhaseDeg] = useState(180);
  const [antiGain, setAntiGain] = useState(1);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(true);

  const ctxRef = useRef<AudioContext | null>(null);
  const noiseOscRef = useRef<OscillatorNode | null>(null);
  const antiOscRef = useRef<OscillatorNode | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const antiGainNodeRef = useRef<GainNode | null>(null);
  const delayRef = useRef<DelayNode | null>(null);

  const phaseRad = (phaseDeg * Math.PI) / 180;
  const residual = resultantAmplitude(phaseRad, antiGain);
  const samples = useMemo(
    () => sampleWave(phaseRad, antiGain, 160),
    [phaseRad, antiGain],
  );

  const stopAudio = useCallback(() => {
    try {
      noiseOscRef.current?.stop();
      antiOscRef.current?.stop();
    } catch {
      // already stopped
    }
    noiseOscRef.current = null;
    antiOscRef.current = null;
    void ctxRef.current?.close();
    ctxRef.current = null;
    masterRef.current = null;
    antiGainNodeRef.current = null;
    delayRef.current = null;
    setStarted(false);
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const startAudio = useCallback(async () => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);

    const noise = ctx.createOscillator();
    noise.type = "sine";
    noise.frequency.value = DEMO_FREQ_HZ;
    noise.connect(master);

    const delay = ctx.createDelay(1);
    delay.delayTime.value = (phaseDeg / 360) * (1 / DEMO_FREQ_HZ);

    const antiGainNode = ctx.createGain();
    antiGainNode.gain.value = antiGain;

    const anti = ctx.createOscillator();
    anti.type = "sine";
    anti.frequency.value = DEMO_FREQ_HZ;
    anti.connect(delay);
    delay.connect(antiGainNode);
    antiGainNode.connect(master);

    noise.start();
    anti.start();

    ctxRef.current = ctx;
    noiseOscRef.current = noise;
    antiOscRef.current = anti;
    masterRef.current = master;
    antiGainNodeRef.current = antiGainNode;
    delayRef.current = delay;
    setStarted(true);
    setMuted(false);
  }, [antiGain, phaseDeg]);

  useEffect(() => {
    if (!started || !masterRef.current) return;
    masterRef.current.gain.value = muted ? 0 : 0.08;
  }, [muted, started]);

  useEffect(() => {
    if (!started) return;
    if (antiGainNodeRef.current) {
      antiGainNodeRef.current.gain.value = antiGain;
    }
    if (delayRef.current) {
      delayRef.current.delayTime.value =
        (phaseDeg / 360) * (1 / DEMO_FREQ_HZ);
    }
  }, [phaseDeg, antiGain, started]);

  const w = 640;
  const h = 200;
  const mid = h / 2;

  return (
    <div
      className="border border-line p-6 md:p-10"
      style={{ background: "rgba(15, 15, 18, 0.6)" }}
      aria-labelledby={labelId}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 id={labelId} className="type-mono-sm text-bone">
          Superposition studio · {DEMO_FREQ_HZ} Hz
        </h3>
        <div className="flex flex-wrap gap-3">
          {!started ? (
            <button
              type="button"
              onClick={() => void startAudio()}
              className="type-mono-sm border border-accent bg-accent-soft px-4 py-2 text-bone transition-colors hover:bg-[rgba(228,199,138,0.22)]"
            >
              Enable tone
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="type-mono-sm border border-line-2 px-4 py-2 text-bone-2 transition-colors hover:border-accent hover:text-bone"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={stopAudio}
                className="type-mono-sm border border-line-2 px-4 py-2 text-bone-2 transition-colors hover:border-accent hover:text-bone"
              >
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 type-mono-sm text-bone-3">
        Residual amplitude ≈ {residual.toFixed(2)} (0 is a perfect null). Gold =
        noise · grey = delayed copy · bright = sum. Near 180° the bright trace
        flattens.
      </p>

      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-6 w-full"
        role="img"
        aria-label={`Waveforms at ${phaseDeg} degrees phase. Residual ${residual.toFixed(2)}.`}
      >
        <line
          x1={0}
          x2={w}
          y1={mid}
          y2={mid}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
        <path
          d={pathFromSamples(samples.noise, w, h, mid)}
          fill="none"
          stroke="var(--accent, #e4c78a)"
          strokeWidth={1.5}
          opacity={0.85}
        />
        <path
          d={pathFromSamples(samples.anti, w, h, mid)}
          fill="none"
          stroke="rgba(180,180,190,0.7)"
          strokeWidth={1.5}
        />
        <path
          d={pathFromSamples(samples.sum, w, h, mid)}
          fill="none"
          stroke="rgba(245,245,240,0.95)"
          strokeWidth={2}
        />
      </svg>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-3">
          <span className="type-mono-sm">
            Phase · {phaseDeg}°
            {Math.abs(phaseDeg - 180) < 3 ? " · near null" : ""}
          </span>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={phaseDeg}
            onChange={(e) => setPhaseDeg(Number(e.target.value))}
            className="w-full accent-[var(--accent,#e4c78a)]"
            aria-valuetext={`${phaseDeg} degrees`}
          />
        </label>
        <label className="flex flex-col gap-3">
          <span className="type-mono-sm">
            Anti-noise gain · {antiGain.toFixed(2)}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={antiGain}
            onChange={(e) => setAntiGain(Number(e.target.value))}
            className="w-full accent-[var(--accent,#e4c78a)]"
          />
        </label>
      </div>

      {reduce && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[0, 180].map((deg) => {
            const s = sampleWave((deg * Math.PI) / 180, 1, 80);
            return (
              <div key={deg} className="border border-line p-3">
                <span className="type-mono-sm">{deg}° snapshot</span>
                <svg viewBox="0 0 320 80" className="mt-2 w-full">
                  <path
                    d={pathFromSamples(s.sum, 320, 80, 40)}
                    fill="none"
                    stroke="rgba(245,245,240,0.9)"
                    strokeWidth={1.5}
                  />
                </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
