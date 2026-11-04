/**
 * "Highveld sky" — the hero shader.
 *
 * A sky over a low ridge, built from domain-warped fBm bands, in the muted-earth
 * palette: a soft afternoon in light mode, dusk in dark mode (uDay). The colour
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
uniform float uDay;       // 0 = dark theme palette, 1 = light theme palette

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

// palettes (bright earth): N_ = dark theme, D_ = light theme. Mirrors the --hero-* tokens.
const vec3 N_ZENITH  = vec3(0.110, 0.094, 0.106);
const vec3 N_UPPER   = vec3(0.557, 0.247, 0.149);
const vec3 N_BAND    = vec3(0.851, 0.392, 0.227);
const vec3 N_HORIZON = vec3(0.910, 0.690, 0.290);
const vec3 N_LAND    = vec3(0.082, 0.075, 0.059);
const vec3 N_LAND2   = vec3(0.298, 0.137, 0.078);
const vec3 N_RIM     = vec3(0.851, 0.392, 0.227);
const vec3 N_SUN     = vec3(0.957, 0.937, 0.902);
const vec3 N_LAT     = vec3(0.910, 0.690, 0.290);
const vec3 N_LENS    = vec3(0.545, 0.612, 1.0);

const vec3 D_ZENITH  = vec3(0.969, 0.949, 0.914);
const vec3 D_UPPER   = vec3(0.663, 0.804, 0.698);
const vec3 D_BAND    = vec3(0.925, 0.506, 0.333);
const vec3 D_HORIZON = vec3(0.961, 0.761, 0.353);
const vec3 D_LAND    = vec3(0.965, 0.941, 0.898);
const vec3 D_LAND2   = vec3(0.902, 0.824, 0.682);
const vec3 D_RIM     = vec3(0.761, 0.314, 0.169);
const vec3 D_SUN     = vec3(1.0, 0.965, 0.875);
const vec3 D_LAT     = vec3(0.761, 0.314, 0.169);
const vec3 D_LENS    = vec3(0.165, 0.251, 0.816);

// resolved per frame from uDay
vec3 ZENITH, UPPER, BAND, HORIZON, LAND, LAND2, RIM, SUN, LAT, LENS;

vec3 sky(float t) {
  // t: 0 at the horizon -> 1 at the zenith
  vec3 c = mix(HORIZON, BAND, smoothstep(0.0, 0.12, t));
  c = mix(c, UPPER, smoothstep(0.12, 0.42, t));
  c = mix(c, ZENITH, smoothstep(0.36, 0.85, t));
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
  ZENITH = mix(N_ZENITH, D_ZENITH, uDay);
  UPPER = mix(N_UPPER, D_UPPER, uDay);
  BAND = mix(N_BAND, D_BAND, uDay);
  HORIZON = mix(N_HORIZON, D_HORIZON, uDay);
  LAND = mix(N_LAND, D_LAND, uDay);
  LAND2 = mix(N_LAND2, D_LAND2, uDay);
  RIM = mix(N_RIM, D_RIM, uDay);
  SUN = mix(N_SUN, D_SUN, uDay);
  LAT = mix(N_LAT, D_LAT, uDay);
  LENS = mix(N_LENS, D_LENS, uDay);

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
  col = mix(col, mix(HORIZON, SUN, 0.35), sun * 0.9);

  // land below the ridge
  float land = smoothstep(0.004, -0.004, p.y - ridge);
  vec3 ground = mix(LAND, LAND2, smoothstep(-0.5, 0.0, p.y) * 0.5);
  float rim = smoothstep(0.035, 0.0, abs(p.y - ridge)) * (1.0 - land * 0.4);
  col = mix(col, ground, land);
  col = mix(col, RIM, rim * 0.3);

  // lattice: faint over the land, lit up by the cursor lens
  float lat = lattice(p + vec2(0.0, t * 0.006), uDensity);
  float latMask = land * 0.07 + lens * 0.6;
  vec3 latCol = mix(LAT, LENS, smoothstep(0.08, 0.32, dm));
  col = mix(col, latCol, lat * latMask);

  // ordered dither + quantisation
  float b = bayer4(fc);
  col = floor(col * uLevels + b + 0.5) / uLevels;

  // film grain
  float g = hash(fc + fract(t * 7.0) * 100.0) - 0.5;
  col += g * 0.08 * uGrain;

  // vignette
  vec2 v = vUv - 0.5;
  col *= 1.0 - dot(v, v) * mix(0.55, 0.18, uDay);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export type ShaderParams = { warp: number; grain: number; density: number; levels: number };
export const defaultParams: ShaderParams = { warp: 0.9, grain: 0.7, density: 4.5, levels: 20 };
