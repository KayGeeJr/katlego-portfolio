"use client";

import { useEffect, useRef } from "react";

/** Plays a muted preview while its card (the closest link) is hovered or focused. */
export default function HoverVideo({ webm, mp4, poster }: { webm: string; mp4: string; poster: string }) {
  const v = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = v.current;
    const card = video?.closest("a");
    if (!video || !card || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const play = () => video.play().catch(() => {});
    const stop = () => video.pause();
    card.addEventListener("pointerenter", play);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focus", play);
    card.addEventListener("blur", stop);
    return () => {
      card.removeEventListener("pointerenter", play);
      card.removeEventListener("pointerleave", stop);
      card.removeEventListener("focus", play);
      card.removeEventListener("blur", stop);
    };
  }, []);
  return (
    <video ref={v} muted loop playsInline preload="none" poster={poster} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
