"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isLowPower } from "@/lib/motion";

const ShaderCanvas = dynamic(() => import("./ShaderCanvas"), { ssr: false });

/** Loads WebGL only after the page is idle, and never on low-power devices (the CSS dusk stays). */
export default function LazyShader(props: React.ComponentProps<typeof ShaderCanvas>) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (isLowPower()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setGo(true), { timeout: 1800 });
      return () => (window as unknown as { cancelIdleCallback: (n: number) => void }).cancelIdleCallback(id);
    }
    const t = setTimeout(() => setGo(true), 700);
    return () => clearTimeout(t);
  }, []);
  return go ? <ShaderCanvas {...props} /> : null;
}
