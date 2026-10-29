"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Desktop-only enhancements are code-split so touch devices never download or run them.
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });

export default function FinePointerOnly() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    (w.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200)))(() => setFine(true));
  }, []);
  return fine ? (
    <>
      <Cursor />
      <SmoothScroll />
    </>
  ) : null;
}
