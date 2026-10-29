import raw from "@/data/captures.json";

export type Frame = {
  key: string;
  label: string;
  width: number;
  height: number;
  sources: { avif: string; webp: string; w: number }[];
  blur: string;
  score: number;
  flagged?: string;
};

export type Capture = {
  slug: string;
  url: string;
  status: "ok" | "failed";
  title?: string;
  description?: string;
  colors: string[];
  fonts: string[];
  tech: string[];
  frames: Frame[];
  chosen: string[];
  video?: { mp4: string; webm: string; poster: string };
};

const captures = raw as unknown as Record<string, Capture>;

export function getCapture(slug: string): Capture | undefined {
  const c = captures[slug];
  return c && c.status === "ok" && c.frames.length ? c : undefined;
}

export function getFrame(slug: string, key: string) {
  return getCapture(slug)?.frames.find((f) => f.key === key);
}

/** The best desktop frame for covers/cards. */
export function coverFrame(slug: string) {
  const c = getCapture(slug);
  if (!c) return undefined;
  return c.frames.find((f) => f.key === "desktop-hero") ?? c.frames.find((f) => f.key === c.chosen[0]);
}
