"use client";

import { useEffect, useMemo, useRef } from "react";
import { journey } from "@/data/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import SectionHead from "@/components/ui/SectionHead";

const W = 1000;
const H = 380;
const B = { lonMin: 27.55, lonMax: 31.45, latMax: -25.15, latMin: -26.45 };
const kx = W / (B.lonMax - B.lonMin);
const ky = kx / Math.cos((26 * Math.PI) / 180); // keep the map roughly conformal at this latitude
const project = (lon: number, lat: number) => [(lon - B.lonMin) * kx, (B.latMax - lat) * ky * 0.9 + 30] as const;

function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

const fmt = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(2)}° ${v < 0 ? neg : pos}`;

// label placement for the crowded Gauteng cluster
const labelPos: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  Nelspruit: { dx: 0, dy: -22, anchor: "middle" },
  Pretoria: { dx: 18, dy: -14, anchor: "start" },
  Sandton: { dx: -16, dy: 30, anchor: "end" },
  "Kempton Park": { dx: 18, dy: 30, anchor: "start" },
};

export default function Journey() {
  const root = useRef<HTMLElement>(null);
  const pts = useMemo(() => journey.map((s) => project(s.lon, s.lat)), []);
  const legs = useMemo(
    () =>
      pts.slice(1).map((p, i) => {
        const a = pts[i];
        const mx = (a[0] + p[0]) / 2, my = (a[1] + p[1]) / 2;
        const dx = p[0] - a[0], dy = p[1] - a[1];
        const len = Math.hypot(dx, dy);
        const lift = Math.min(90, len * 0.35);
        const c = [mx + (dy / len) * lift, my - (dx / len) * lift * (dx < 0 ? -1 : 1)];
        return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
      }),
    [pts],
  );
  const distances = journey.slice(1).map((s, i) => km(journey[i], s));
  const total = distances.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const paths = el.querySelectorAll<SVGPathElement>(".leg");
    const stops = el.querySelectorAll<SVGGElement>(".stop");
    if (prefersReducedMotion()) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set(stops, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(stops, { opacity: 0.25 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el.querySelector("svg"), start: "top 75%", end: "bottom 40%", scrub: 0.6 } });
      tl.to(stops[0], { opacity: 1, duration: 0.2 });
      paths.forEach((p, i) => {
        tl.to(p, { strokeDashoffset: 0, duration: 1, ease: "none" }).to(stops[i + 1], { opacity: 1, duration: 0.2 }, "<0.85");
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const lonTicks = [28, 28.5, 29, 29.5, 30, 30.5, 31];
  const latTicks = [-25.5, -26];

  return (
    <section ref={root} id="journey" aria-labelledby="journey-title" className="section border-t border-line">
      <div className="wrap">
        <SectionHead tag="Journey" id="journey-title" title="Lowveld to Highveld.">
          Four places, about {total} km as the crow flies, and every one of them taught me something I still use.
        </SectionHead>

        <figure className="relative -mx-[var(--gutter)] overflow-x-auto border-y border-line bg-bg-sunk sm:mx-0 sm:overflow-hidden sm:border" tabIndex={0} aria-label="Journey map (scrolls sideways on small screens)">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[720px] sm:min-w-0" role="img" aria-labelledby="journey-map-desc">
            <desc id="journey-map-desc">
              A map tracing a path from Nelspruit in Mpumalanga west to Pretoria, then south to Sandton and east to Kempton Park in Gauteng.
            </desc>
            {/* graticule */}
            <g stroke="var(--line)" strokeWidth="1">
              {lonTicks.map((l) => {
                const [x] = project(l, -25);
                return <line key={l} x1={x} x2={x} y1={0} y2={H} />;
              })}
              {latTicks.map((l) => {
                const [, y] = project(28, l);
                return <line key={l} x1={0} x2={W} y1={y} y2={y} />;
              })}
            </g>
            <g className="t-data" fill="var(--fg-muted)" fontSize="11">
              {lonTicks.filter((l) => Number.isInteger(l)).map((l) => {
                const [x] = project(l, -25);
                return <text key={l} x={x + 6} y={H - 10}>{l}° E</text>;
              })}
              {latTicks.map((l) => {
                const [, y] = project(28, l);
                return <text key={l} x={W - 10} y={y - 6} textAnchor="end">{Math.abs(l).toFixed(1)}° S</text>;
              })}
              <text x={14} y={22}>Gauteng</text>
              <text x={W - 14} y={22} textAnchor="end">Mpumalanga</text>
            </g>
            {/* legs */}
            <g fill="none" strokeLinecap="round">
              {legs.map((d, i) => (
                <path key={`b${i}`} d={d} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2 6" />
              ))}
              {legs.map((d, i) => (
                <path key={i} d={d} className="leg" pathLength={1} stroke={i === legs.length - 1 ? "var(--accent)" : "var(--dusk)"} strokeWidth="2.5" />
              ))}
            </g>
            {/* distance labels */}
            <g className="t-data" fontSize="11" fill="var(--fg-muted)">
              {legs.map((_, i) => {
                const a = pts[i], b = pts[i + 1];
                if (distances[i] < 30) return null;
                return (
                  <text key={i} x={(a[0] + b[0]) / 2} y={(a[1] + b[1]) / 2 - (i === 0 ? 46 : 0) + (i === 1 ? 0 : 0)} textAnchor="middle" dx={i === 1 ? -34 : 0}>
                    {distances[i]} km
                  </text>
                );
              })}
            </g>
            {/* stops */}
            {journey.map((s, i) => {
              const [x, y] = pts[i];
              const lp = labelPos[s.place];
              return (
                <g key={s.place} className="stop">
                  <rect x={x - 7} y={y - 7} width="14" height="14" transform={`rotate(45 ${x} ${y})`} fill="var(--bg)" stroke={i === journey.length - 1 ? "var(--accent)" : "var(--ochre)"} strokeWidth="2" />
                  <rect x={x - 2.5} y={y - 2.5} width="5" height="5" transform={`rotate(45 ${x} ${y})`} fill={i === journey.length - 1 ? "var(--accent)" : "var(--ochre)"} />
                  <text x={x + lp.dx} y={y + lp.dy} textAnchor={lp.anchor} fill="var(--fg)" fontSize="15" fontWeight="600" style={{ fontFamily: "var(--font-hanken)" }}>
                    {i + 1}. {s.place}
                  </text>
                </g>
              );
            })}
          </svg>
        </figure>

        <ol className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((s, i) => (
            <li key={s.place} className="bg-bg"><div className="flex h-full flex-col gap-2 p-6" data-reveal data-reveal-delay={i * 80}>
              <span className="t-data text-ochre">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="t-h3">{s.place}</h3>
              <p className="t-data text-muted">
                {fmt(s.lat, "N", "S")}, {fmt(s.lon, "E", "W")}
              </p>
              <p className="text-[0.9375rem]">{s.note}</p>
              {s.years && <p className="mt-auto pt-2 text-[0.875rem] text-muted">{s.years}</p>}
            </div></li>
          ))}
        </ol>
      </div>
    </section>
  );
}
