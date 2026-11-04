"use client";
/** Tiny persisted UI preferences (theme, sound, negative mode). Storage is best-effort. */
import { useSyncExternalStore } from "react";

type Prefs = { theme: "dark" | "light"; sound: boolean; negative: boolean };
const KEY = "kn-prefs";
const listeners = new Set<() => void>();
let state: Prefs = { theme: "light", sound: false, negative: false };
let hydrated = false;

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    state = { ...state, theme: saved.theme === "dark" ? "dark" : "light", sound: false, negative: false };
  } catch {}
  state.theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function getPrefs() {
  load();
  return state;
}

export function setPrefs(patch: Partial<Prefs>) {
  load();
  state = { ...state, ...patch };
  const root = document.documentElement;
  root.dataset.theme = state.theme;
  if (state.negative) root.setAttribute("data-negative", "");
  else root.removeAttribute("data-negative");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", state.theme === "light" ? "#faf6ef" : "#15130f");
  try {
    localStorage.setItem(KEY, JSON.stringify({ theme: state.theme }));
  } catch {}
  listeners.forEach((l) => l());
}

/** Animate a preference change with a circular View Transition from the pointer, when supported. */
export function setPrefsAnimated(patch: Partial<Prefs>, origin?: { x: number; y: number }) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) return setPrefs(patch);
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const t = doc.startViewTransition(() => setPrefs(patch));
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}

export function usePrefs() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getPrefs,
    () => state,
  );
}
