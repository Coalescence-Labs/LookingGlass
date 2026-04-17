"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function LensShader() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame(({ clock, size }) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = clock.getElapsedTime();
    mat.current.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        fragmentShader={frag}
        vertexShader={vert}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // 2D simplex-ish noise (cheap)
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // simple fbm
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float r = length(p);
    float t = uTime * 0.06;

    // refractive caustic-like warps
    vec2 q = vec2(fbm(p * 2.0 + t), fbm(p * 2.0 - t + 17.3));
    float caustic = fbm(p * 3.2 + q * 1.5 + t);
    caustic = smoothstep(0.2, 0.9, caustic);

    // warm accent color (bone-to-accent)
    vec3 bone = vec3(0.925, 0.910, 0.870);
    vec3 accent = vec3(0.894, 0.780, 0.541);
    vec3 col = mix(bone * 0.4, accent, caustic);

    // soft radial vignette, strong center glow
    float glow = smoothstep(0.95, 0.0, r);
    col *= glow;

    // very soft overall alpha
    float alpha = glow * (0.18 + 0.22 * caustic);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function GlassLens({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <LensShader />
      </Canvas>
    </div>
  );
}
