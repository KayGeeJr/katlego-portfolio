"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { vertex, fragment, defaultParams, type ShaderParams } from "./shader";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  params?: Partial<ShaderParams>;
  /** live-tweakable params (Lab) — read every frame */
  paramsRef?: React.RefObject<ShaderParams>;
  /** element whose pointer movement drives the lens (defaults to the canvas parent) */
  trackRef?: React.RefObject<HTMLElement | null>;
  /** 0..1 scroll progress source */
  scrollRef?: React.RefObject<number>;
  maxDpr?: number;
  className?: string;
  onReady?: () => void;
};

/**
 * OGL full-screen triangle running the Highveld shader.
 * - Pauses when off-screen or the tab is hidden.
 * - Adapts resolution if frames run slow (drops to 0.5× scale).
 * - prefers-reduced-motion: renders a single still frame and reacts to nothing.
 */
export default function ShaderCanvas({ params, paramsRef, trackRef, scrollRef, maxDpr = 1.5, className, onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const p = { ...defaultParams, ...params };

    let scale = 1;
    const dpr = () => Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: dpr(), alpha: false, antialias: false, depth: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the CSS fallback underneath stays visible
    }
    const gl = renderer.gl;
    gl.canvas.setAttribute("aria-hidden", "true");
    gl.canvas.style.cssText = "width:100%;height:100%;display:block;opacity:0;transition:opacity 1.2s cubic-bezier(.16,1,.3,1)";
    el.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 12.0 },
        uMouse: { value: [0.68, 0.42] },
        uHover: { value: 0 },
        uWarp: { value: p.warp },
        uGrain: { value: p.grain },
        uDensity: { value: p.density },
        uLevels: { value: p.levels },
        uScroll: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.dpr = dpr();
      const r = el.getBoundingClientRect();
      renderer.setSize(Math.max(1, r.width), Math.max(1, r.height));
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // pointer → smoothed lens
    const target = { x: 0.68, y: 0.42, hover: reduce ? 0 : 0.55 };
    const cur = { x: target.x, y: target.y, hover: 0 };
    const tracker = trackRef?.current ?? el.parentElement ?? el;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
      target.hover = 1;
    };
    const onLeave = () => (target.hover = 0.55);
    if (!reduce) {
      tracker.addEventListener("pointermove", onMove, { passive: true });
      tracker.addEventListener("pointerleave", onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    let slow = 0;
    let frames = 0;
    let shown = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // adaptive quality: if we're consistently under ~45fps, render at half resolution
      if (dt > 0.022) slow++;
      if (++frames === 90 && slow > 45 && scale > 0.5) {
        scale = 0.5;
        resize();
      }

      const k = 1 - Math.pow(0.001, dt); // frame-rate independent smoothing
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      cur.hover += (target.hover - cur.hover) * k * 0.6;

      const live = paramsRef?.current;
      const u = program.uniforms;
      u.uTime.value += dt;
      u.uMouse.value = [cur.x, cur.y];
      u.uHover.value = cur.hover;
      u.uScroll.value = scrollRef?.current ?? 0;
      if (live) {
        u.uWarp.value = live.warp;
        u.uGrain.value = live.grain;
        u.uDensity.value = live.density;
        u.uLevels.value = live.levels;
      }
      renderer.render({ scene: mesh });
      if (!shown) {
        shown = true;
        gl.canvas.style.opacity = "1";
        onReady?.();
      }
    };

    if (reduce) {
      program.uniforms.uHover.value = 0;
      renderer.render({ scene: mesh });
      gl.canvas.style.opacity = "1";
      onReady?.();
      // keep a still frame in sync with size changes
      const ro2 = new ResizeObserver(() => renderer.render({ scene: mesh }));
      ro2.observe(el);
      return () => {
        ro.disconnect();
        ro2.disconnect();
        io.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        gl.canvas.remove();
      };
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      tracker.removeEventListener("pointermove", onMove);
      tracker.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className={className} />;
}
