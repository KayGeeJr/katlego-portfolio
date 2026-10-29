"use client";

import { useEffect, useState } from "react";
import { getPrefs, setPrefsAnimated, usePrefs } from "@/lib/prefs";
import { tick } from "@/lib/sound";

export function toggleNegative(origin?: { x: number; y: number }) {
  const on = !getPrefs().negative;
  tick(on ? 0.1 : 0.9, 0.07);
  setPrefsAnimated({ negative: on }, origin);
}

/** Easter egg: press N anywhere (outside form fields) to flip the site into its photographic negative. */
export default function NegativeMode() {
  const { negative } = usePrefs();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "n" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable=true]")) return;
      toggleNegative();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    setMsg(negative ? "Negative mode on. Press N to develop the print." : "");
  }, [negative]);
  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">{msg}</p>
      {negative && (
        <button
          type="button"
          onClick={(e) => toggleNegative({ x: e.clientX, y: e.clientY })}
          className="fixed bottom-5 left-1/2 z-[55] -translate-x-1/2 rounded-full border border-line-strong bg-bg px-4 py-2 text-[0.875rem]"
        >
          Negative mode — press N or tap to exit
        </button>
      )}
    </>
  );
}
