"use client";
/** Synthesised UI sound — no audio files. Off by default; enabled only by the sound toggle. */
import { getPrefs } from "./prefs";

let ctx: AudioContext | null = null;
function audio() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  return ctx;
}

/** A soft marimba-ish tick. `pitch` 0..1 maps across a pentatonic scale. */
export function tick(pitch = 0.5, gain = 0.05) {
  if (typeof window === "undefined" || !getPrefs().sound) return;
  const a = audio();
  const scale = [0, 2, 4, 7, 9, 12, 14];
  const note = scale[Math.min(scale.length - 1, Math.floor(pitch * scale.length))];
  const f = 440 * Math.pow(2, (note - 9) / 12);
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "sine";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, a.currentTime);
  g.gain.linearRampToValueAtTime(gain, a.currentTime + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.35);
  o.connect(g).connect(a.destination);
  o.start();
  o.stop(a.currentTime + 0.4);
}

export function resumeAudio() {
  if (typeof window !== "undefined") audio().resume();
}
