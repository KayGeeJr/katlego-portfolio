/**
 * "Highveld dusk" — the hero shader.
 *
 * A dusk sky over a low ridge, built from domain-warped fBm bands. The colour
 * ramp is quantised with a 4×4 Bayer matrix, so the gradient breaks into
 * printed-looking dither steps. Around the cursor a lens opens onto a stepped
 * diamond lattice — an abstract nod to Ndebele and Sotho wall geometry — and
 * pulls the sky towards it.
 *
 * Shared by the hero and the Lab's shader playground.
 */

export const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const fragment = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // 0..1, smoothed
uniform float uHover;     // 0..1 lens strength
uniform float uWarp;      // 0..2 heat-haze amount
uniform float uGrain;     // 0..1
uniform float uDensity;   // lattice scale
uniform float uLevels;    // colour quantisation levels
uniform float uScroll;    // 0..1 hero scroll progress — the sun sets as you scroll

varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}

float bayer4(vec2 fc) {
  vec2 p = mod(floor(fc), 4.0);
  float i = p.x + p.y * 4.0;
  // 4x4 Bayer matrix, flattened
  float b =
    i < 1.0 ? 0.0 : i < 2.0 ? 8.0 : i < 3.0 ? 2.0 : i < 4.0 ? 10.0 :
    i < 5.0 ? 12.0 : i < 6.0 ? 4.0 : i < 7.0 ? 14.0 : i < 8.0 ? 6.0 :
    i < 9.0 ? 3.0 : i < 10.0 ? 11.0 : i < 11.0 ? 1.0 : i < 12.0 ? 9.0 :
    i < 13.0 ? 15.0 : i < 14.0 ? 7.0 : i < 15.0 ? 13.0 : 5.0;
  return b / 16.0 - 0.5;
}

// palette
const vec3 INK    = vec3(0.086, 0.071, 0.055);
const vec3 NIGHT  = vec3(0.118, 0.082, 0.137);
const vec3 EARTH  = vec3(0.643, 0.278, 0.165);
const vec3 DUSK   = vec3(0.910, 0.412, 0.173);
const vec3 OCHRE  = vec3(0.851, 0.643, 0.255);
const vec3 BONE   = vec3(0.937, 0.902, 0.847);
const vec3 JAC    = vec3(0.608, 0.490, 1.0);

vec3 sky(float t) {
  // t: 0 at the horizon -> 1 at the zenith
  vec3 c = mix(OCHRE, DUSK, smoothstep(0.0, 0.12, t));
  c = mix(c, EARTH, smoothstep(0.12, 0.42, t));
  c = mix(c, NIGHT, smoothstep(0.36, 0.85, t));
  return c;
}

// Stepped diamond lattice: concentric diamonds built from stair-steps (no smooth diagonals),
// drawn as the boundaries between quantised Manhattan levels.
float lattice(vec2 p, float density) {
  vec2 g = p * density;
  vec2 a = abs(fract(g) - 0.5) * 2.0;     // 0 at the cell centre, 1 at its edge
  const float n = 7.0;                     // steps per half-cell
  vec2 q = a * n;
  vec2 i = floor(q);
  vec2 f = fract(q);
  float L = i.x + i.y;                     // quantised Manhattan level
  float ring = (1.0 - step(0.5, mod(L, 3.0))) * step(0.5, L) * step(L, n);
  float w = 0.16;
  float e = max(1.0 - smoothstep(0.0, w, f.x), 1.0 - smoothstep(0.0, w, f.y)) * ring;
  float frame = 1.0 - smoothstep(0.015, 0.035, min(1.0 - a.x, 1.0 - a.y));
  return max(e, frame * 0.3);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
  vec2 m = vec2((uMouse.x - 0.5) * aspect, uMouse.y - 0.5);

  float t = uTime;
  float dm = length(p - m);
  float lens = smoothstep(0.42, 0.0, dm) * uHover;

  // heat-haze domain warp, pulled towards the cursor
  vec2 q = vec2(fbm(p * 1.7 + vec2(0.0, t * 0.045)), fbm(p * 1.7 + vec2(5.2, -t * 0.038)));
  vec2 w = p + uWarp * 0.32 * (q - 0.5) - (p - m) * lens * 0.22;

  // the ridge — a low Highveld horizon
  float ridge = -0.03 + 0.03 * sin(w.x * 1.6 + 1.1) + 0.05 * fbm(vec2(p.x * 2.4 + 3.0, 1.7)) + uScroll * 0.08;
  float sunY = ridge + 0.07 - uScroll * 0.2;
  float tt = clamp((w.y - ridge) / (0.62 - uScroll * 0.2), 0.0, 1.0);
  tt += 0.07 * (fbm(vec2(w.x * 2.2 + t * 0.02, w.y * 9.0)) - 0.5); // horizontal cloud bands
  vec3 col = sky(clamp(tt, 0.0, 1.0));

  // the sun: a soft disc sitting on the ridge
  float sun = smoothstep(0.13, 0.0, length((p - vec2(0.3 * aspect, sunY)) * vec2(1.0, 1.15)));
  col = mix(col, mix(OCHRE, BONE, 0.35), sun * 0.9);

  // land below the ridge
  float land = smoothstep(0.004, -0.004, p.y - ridge);
  vec3 ground = mix(INK, EARTH * 0.35, smoothstep(-0.5, 0.0, p.y) * 0.5);
  float rim = smoothstep(0.035, 0.0, abs(p.y - ridge)) * (1.0 - land * 0.4);
  col = mix(col, ground, land);
  col += DUSK * rim * 0.25;

  // lattice: faint over the land, lit up by the cursor lens
  float lat = lattice(p + vec2(0.0, t * 0.006), uDensity);
  float latMask = land * 0.07 + lens * 0.6;
  vec3 latCol = mix(OCHRE, JAC, smoothstep(0.08, 0.32, dm));
  col = mix(col, latCol, lat * latMask);

  // ordered dither + quantisation
  float b = bayer4(fc);
  col = floor(col * uLevels + b + 0.5) / uLevels;

  // film grain
  float g = hash(fc + fract(t * 7.0) * 100.0) - 0.5;
  col += g * 0.08 * uGrain;

  // vignette
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * 0.55;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export type ShaderParams = { warp: number; grain: number; density: number; levels: number };
export const defaultParams: ShaderParams = { warp: 0.9, grain: 0.7, density: 4.5, levels: 20 };
