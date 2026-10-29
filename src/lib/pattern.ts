/**
 * Stepped-geometry pattern generator.
 *
 * Abstract line motifs on a square grid — staircases, nested frames, stepped
 * diamonds, chevrons, ladders — in the spirit of the bold, hard-edged geometry
 * of Ndebele and Sotho (litema) wall work, without reproducing any specific
 * design. Used by dividers, the preloader and the Lab's pattern generator.
 */

export type Shape = { d: string; tone: Tone; fill?: boolean };
export type Tone = "fg" | "ochre" | "dusk" | "earth" | "accent";

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const poly = (pts: [number, number][], close = false) =>
  "M" + pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join("L") + (close ? "Z" : "");

type Motif = (x: number, y: number, s: number, rand: () => number) => Shape[];

const motifs: Record<string, Motif> = {
  steps: (x, y, s, rand) => {
    const n = 3 + Math.floor(rand() * 2);
    const st = s / (n * 2);
    const pts: [number, number][] = [[x, y + s]];
    for (let i = 0; i < n; i++) pts.push([x + st * (2 * i), y + s - st * 2 * i], [x + st * (2 * i + 1), y + s - st * 2 * i]);
    pts.push([x + s / 2, y + st]);
    for (let i = n - 1; i >= 0; i--) pts.push([x + s - st * (2 * i + 1), y + s - st * 2 * i], [x + s - st * 2 * i, y + s - st * 2 * i]);
    return [{ d: poly(pts), tone: "ochre" }];
  },
  frame: (x, y, s, rand) => {
    const inset = s * 0.16;
    const out: Shape[] = [
      { d: poly([[x + inset, y + inset], [x + s - inset, y + inset], [x + s - inset, y + s - inset], [x + inset, y + s - inset]], true), tone: "fg" },
      { d: poly([[x + inset * 2.2, y + inset * 2.2], [x + s - inset * 2.2, y + inset * 2.2], [x + s - inset * 2.2, y + s - inset * 2.2], [x + inset * 2.2, y + s - inset * 2.2]], true), tone: "dusk" },
    ];
    if (rand() > 0.5) out.push({ d: poly([[x + s / 2 - inset * 0.6, y + s / 2 - inset * 0.6], [x + s / 2 + inset * 0.6, y + s / 2 - inset * 0.6], [x + s / 2 + inset * 0.6, y + s / 2 + inset * 0.6], [x + s / 2 - inset * 0.6, y + s / 2 + inset * 0.6]], true), tone: "ochre", fill: true });
    return out;
  },
  diamond: (x, y, s) => {
    const c = [x + s / 2, y + s / 2] as const;
    const step = s / 8;
    const ring = (rad: number): [number, number][] => {
      const pts: [number, number][] = [];
      const n = Math.round(rad / step);
      // stepped (Manhattan) diamond
      for (let i = 0; i < n; i++) pts.push([c[0] + i * step, c[1] - rad + i * step], [c[0] + (i + 1) * step, c[1] - rad + i * step]);
      for (let i = 0; i < n; i++) pts.push([c[0] + rad - i * step, c[1] + i * step], [c[0] + rad - i * step, c[1] + (i + 1) * step]);
      for (let i = 0; i < n; i++) pts.push([c[0] - i * step, c[1] + rad - i * step], [c[0] - (i + 1) * step, c[1] + rad - i * step]);
      for (let i = 0; i < n; i++) pts.push([c[0] - rad + i * step, c[1] - i * step], [c[0] - rad + i * step, c[1] - (i + 1) * step]);
      return pts;
    };
    return [
      { d: poly(ring(s * 0.375), true), tone: "fg" },
      { d: poly(ring(s * 0.125), true), tone: "accent", fill: true },
    ];
  },
  chevron: (x, y, s) => {
    const a = s * 0.18;
    return [0, 1, 2].map((i) => ({
      d: poly([[x + a, y + a + i * a * 1.1], [x + s / 2, y + a * 2 + i * a * 1.1], [x + s - a, y + a + i * a * 1.1]]),
      tone: (i === 1 ? "dusk" : "fg") as Tone,
    }));
  },
  ladder: (x, y, s, rand) => {
    const l = x + s * 0.3, r = x + s * 0.7;
    const out: Shape[] = [{ d: poly([[l, y], [l, y + s]]), tone: "fg" }, { d: poly([[r, y], [r, y + s]]), tone: "fg" }];
    const rungs = 3 + Math.floor(rand() * 3);
    for (let i = 1; i <= rungs; i++) out.push({ d: poly([[l, y + (s / (rungs + 1)) * i], [r, y + (s / (rungs + 1)) * i]]), tone: "earth" });
    return out;
  },
  split: (x, y, s, rand) => {
    const flip = rand() > 0.5;
    return [
      { d: poly(flip ? [[x, y], [x + s, y], [x, y + s]] : [[x + s, y], [x + s, y + s], [x, y + s]], true), tone: rand() > 0.5 ? "earth" : "dusk", fill: true },
      { d: poly([[x, y], [x + s, y], [x + s, y + s], [x, y + s]], true), tone: "fg" },
    ];
  },
};

export const motifNames = Object.keys(motifs);

/** A strip (or grid) of motifs. Units are grid cells; render inside an SVG viewBox of cols×rows. */
export function generatePattern({ cols, rows = 1, seed = 7, allow = motifNames, gap = 0.12 }: { cols: number; rows?: number; seed?: number; allow?: string[]; gap?: number }) {
  const rand = rng(seed);
  const shapes: Shape[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const name = allow[Math.floor(rand() * allow.length)];
      shapes.push(...motifs[name](i + gap / 2, j + gap / 2, 1 - gap, rand));
    }
  }
  return shapes;
}

export const toneVar: Record<Tone, string> = {
  fg: "var(--fg)",
  ochre: "var(--ochre)",
  dusk: "var(--dusk)",
  earth: "var(--earth)",
  accent: "var(--accent)",
};
