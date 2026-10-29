/**
 * scripts/capture.ts — screenshot, record and analyse every project in src/data/projects.ts.
 *
 *   npm run capture                       # all projects
 *   npm run capture -- --only khula-stokvel,tadaa-icecream
 *   npm run capture -- --no-video         # skip hover-preview videos
 *   npm run capture -- --headed           # watch it work
 *   npm run capture -- --map tadaa-icecream=http://localhost:4000   # point a slug at another URL (testing)
 *
 * Output
 *   public/projects/<slug>/<shot>-<w>.avif|webp   optimised frames (+ blur placeholder in the manifest)
 *   public/projects/<slug>/preview.mp4|webm|poster.webp   hover video (projects with `video: true`)
 *   src/data/captures.json                        manifest the site reads (merged, per slug)
 *   captures/contact-sheet.html + .png + report.md   review sheet: status, title, colours, chosen frames
 *
 * First run on a new machine:  npx playwright install chromium
 */
import { chromium, type Browser, type BrowserContext, type Page, type Response } from "playwright";
import sharp from "sharp";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { projects, type Project } from "../src/data/projects";

const run = promisify(execFile);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public", "projects");
const RAW_DIR = path.join(ROOT, "captures", "raw");
const MANIFEST = path.join(ROOT, "src", "data", "captures.json");

// ── CLI ────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);
const opt = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const only = opt("only")?.split(",").map((s) => s.trim());
const urlMap = Object.fromEntries(
  (opt("map") ?? "").split(",").filter(Boolean).map((pair) => pair.split("=") as [string, string]),
);
const WITH_VIDEO = !flag("no-video");
const HEADED = flag("headed");
const CONCURRENCY = Number(opt("concurrency") ?? 2);

// ── Types (mirrored in src/lib/captures.ts) ───────────────────────────────────
type Frame = {
  key: string;
  label: string;
  width: number;
  height: number;
  sources: { avif: string; webp: string; w: number }[];
  blur: string;
  score: number;
  flagged?: string;
};
type CaptureEntry = {
  slug: string;
  url: string;
  finalUrl?: string;
  status: "ok" | "failed";
  httpStatus?: number;
  error?: string;
  checkedAt: string;
  title?: string;
  description?: string;
  colors: string[];
  fonts: string[];
  tech: string[];
  frames: Frame[];
  chosen: string[];
  video?: { mp4: string; webm: string; poster: string };
};

// ── Viewports ─────────────────────────────────────────────────────────────────
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } as const;
const MOBILE = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
} as const;
const MAX_FULL_HEIGHT = 9000; // css px — keeps full-page shots sane

// ── Page preparation ──────────────────────────────────────────────────────────
const CONSENT_CSS = `
  #onetrust-consent-sdk, #CybotCookiebotDialog, .cc-window, .cookie-banner, .cookie-consent,
  [id*="cookie" i][class*="banner" i], [class*="cookie" i][class*="banner" i], [class*="consent" i][role="dialog"],
  [id*="consent" i][role="dialog"], .klaviyo-form, .needsclick[role="dialog"], #hs-eu-cookie-confirmation,
  .grecaptcha-badge, #tidio-chat, #crisp-chatbox, .intercom-lightweight-app, iframe[title*="chat" i]
  { display: none !important; visibility: hidden !important; }
  html { scroll-behavior: auto !important; }
  ::-webkit-scrollbar { display: none; }
`;

async function dismissOverlays(page: Page) {
  const labels = /^(accept( all)?|agree|i agree|allow all|got it|ok(ay)?|continue|close|dismiss|no thanks|×|✕)$/i;
  for (let pass = 0; pass < 2; pass++) {
    const buttons = await page.$$("button, [role=button], a.btn, a.button");
    for (const b of buttons) {
      try {
        const text = ((await b.innerText({ timeout: 300 })) || (await b.getAttribute("aria-label")) || "").trim();
        if (!labels.test(text)) continue;
        // only click things that live inside a dialog/banner/popup, never site nav
        const inOverlay = await b.evaluate((el) =>
          !!el.closest('[role="dialog"],[aria-modal="true"],[class*="cookie" i],[class*="consent" i],[class*="popup" i],[class*="modal" i],[class*="banner" i],[id*="cookie" i],[id*="popup" i]'),
        );
        if (inOverlay && (await b.isVisible())) await b.click({ timeout: 800 }).catch(() => {});
      } catch {}
    }
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);
  }
  await page.addStyleTag({ content: CONSENT_CSS }).catch(() => {});
}

async function settle(page: Page) {
  await page.evaluate(() => (document as any).fonts?.ready).catch(() => {});
  // let entrance animations finish
  await page.waitForTimeout(1200);
  await page
    .evaluate(
      () =>
        new Promise<void>((res) => {
          const anims = (document.getAnimations?.() ?? []).filter((a) => a.playState === "running");
          const finite = anims.filter((a) => {
            const t = a.effect?.getComputedTiming?.();
            return t && Number.isFinite(t.endTime as number) && (t.endTime as number) < 8000;
          });
          Promise.race([Promise.all(finite.map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 2500))]).then(() => res());
        }),
    )
    .catch(() => {});
}

/** Scroll the whole page in steps to fire lazy-loading + reveal animations, then return to top. */
async function warmUp(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.6));
    const max = Math.min(document.documentElement.scrollHeight, 20000);
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
  });
  // wait for any images revealed during the scroll
  await page
    .evaluate(() =>
      Promise.race([
        Promise.all(Array.from(document.images).filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
        new Promise((r) => setTimeout(r, 4000)),
      ]),
    )
    .catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(800);
}

/** tsx/esbuild injects a `__name` helper into functions; give pages a no-op so page.evaluate closures run. */
const NAME_SHIM = "globalThis.__name = globalThis.__name || ((f) => f);";
async function newCtx(browser: Browser, options: Parameters<Browser["newContext"]>[0]) {
  const ctx = await browser.newContext(options);
  await ctx.addInitScript(NAME_SHIM);
  return ctx;
}

async function open(ctx: BrowserContext, url: string): Promise<{ page: Page; res: Response | null }> {
  const page = await ctx.newPage();
  let res: Response | null = null;
  try {
    res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    res = await page.goto(url, { waitUntil: "load", timeout: 45000 });
  }
  await dismissOverlays(page);
  await settle(page);
  return { page, res };
}

// ── Analysis ──────────────────────────────────────────────────────────────────
async function extractMeta(page: Page, res: Response | null) {
  const headers = res ? await res.allHeaders().catch(() => ({} as Record<string, string>)) : {};
  const dom = await page.evaluate(() => {
    const meta = (sel: string) => document.querySelector<HTMLMetaElement>(sel)?.content || undefined;
    const fonts = new Set<string>();
    for (const sel of ["h1", "h2", "body", "button", "nav a"]) {
      const el = document.querySelector(sel);
      if (el) fonts.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim());
    }
    (document as any).fonts?.forEach?.((f: FontFace) => f.status === "loaded" && fonts.add(f.family.replace(/["']/g, "")));
    const html = document.documentElement.outerHTML.slice(0, 400000);
    const w = window as any;
    const clues: string[] = [];
    const has = (cond: unknown, name: string) => cond && clues.push(name);
    has(w.__NEXT_DATA__ || document.querySelector('script[src*="/_next/"]') || html.includes("/_next/"), "Next.js");
    has(w.__NUXT__ || html.includes("/_nuxt/"), "Nuxt");
    const ng = document.querySelector("[ng-version]")?.getAttribute("ng-version");
    has(ng, `Angular ${ng}`);
    has(document.querySelector("[data-v-app]") || /data-v-[a-f0-9]{6,}/.test(html), "Vue");
    has(w.React || document.querySelector("[data-reactroot]") || (document.getElementById("root") && !w.__NEXT_DATA__), "React (SPA)");
    has(document.querySelector('script[type="module"][src*="/assets/index-"]'), "Vite build");
    has(html.includes("wp-content") || html.includes("wp-includes"), "WordPress");
    has(w.Shopify || html.includes("cdn.shopify.com"), "Shopify");
    has(html.includes("wixstatic.com") || w.wixBiSession, "Wix");
    has(html.includes("squarespace.com"), "Squarespace");
    has(document.querySelector("html[data-wf-site]"), "Webflow");
    has(html.includes("framerusercontent.com"), "Framer");
    has(w.gsap, "GSAP");
    has(w.lenis || document.documentElement.classList.contains("lenis"), "Lenis");
    has(w.THREE || html.includes("three.module"), "Three.js");
    has(/class="[^"]*\b(?:px|py|mt|mb|flex|grid|text)-[0-9a-z]/.test(html) && /\b(?:sm|md|lg):/.test(html), "Tailwind (likely)");
    has(w.jQuery, "jQuery");
    has(w.gtag || w.dataLayer, "Google Analytics/Tag Manager");
    // page colours from the CSS itself
    const cssColors = new Set<string>();
    for (const sel of ["body", "header", "h1", "a", "button", "footer"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const cs = getComputedStyle(el);
      [cs.backgroundColor, cs.color].forEach((c) => c && !c.includes("rgba(0, 0, 0, 0)") && cssColors.add(c));
    }
    return {
      title: document.title || undefined,
      description: meta('meta[name="description"]') || meta('meta[property="og:description"]'),
      generator: meta('meta[name="generator"]'),
      fonts: [...fonts].filter(Boolean),
      clues,
      cssColors: [...cssColors],
    };
  });
  const tech = new Set(dom.clues);
  if (dom.generator) tech.add(`generator: ${dom.generator}`);
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  if (h["x-nf-request-id"] || (h.server ?? "").toLowerCase().includes("netlify")) tech.add("Netlify");
  if (h["x-vercel-id"]) tech.add("Vercel");
  if (h["cf-ray"]) tech.add("Cloudflare");
  if (h["x-powered-by"]) tech.add(`x-powered-by: ${h["x-powered-by"]}`);
  if (h.server && !/netlify/i.test(h.server)) tech.add(`server: ${h.server}`);
  return { ...dom, tech: [...tech] };
}

/** Dominant colours via a tiny k-means on a downsampled frame. */
async function dominantColors(file: string, k = 6): Promise<string[]> {
  const { data, info } = await sharp(file).resize(80, 50, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px: number[][] = [];
  for (let i = 0; i < data.length; i += info.channels) px.push([data[i], data[i + 1], data[i + 2]]);
  let centers = Array.from({ length: k }, (_, i) => px[Math.floor((i / k) * px.length)]);
  for (let iter = 0; iter < 10; iter++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of px) {
      let best = 0, bd = Infinity;
      centers.forEach((c, ci) => {
        const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
        if (d < bd) { bd = d; best = ci; }
      });
      const s = sums[best]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++;
    }
    centers = sums.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centers[i]));
    centers.forEach((c, i) => ((centers[i] as any).n = sums[i][3]));
  }
  return centers
    .sort((a: any, b: any) => b.n - a.n)
    .map((c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""))
    .filter((v, i, arr) => arr.indexOf(v) === i);
}

/** Quality score: penalise blank/flat frames. Returns 0..100. */
async function frameScore(file: string) {
  const s = await sharp(file).resize(320).stats();
  const dev = s.channels.slice(0, 3).reduce((a, c) => a + c.stdev, 0) / 3;
  const ent = s.entropy; // 0..8
  return { score: Math.round(Math.min(100, dev * 0.9 + ent * 6)), blank: dev < 5 && ent < 2 };
}

// ── Optimisation ──────────────────────────────────────────────────────────────
async function optimise(slug: string, key: string, rawFile: string, widths: number[]): Promise<Omit<Frame, "label" | "score">> {
  const outDir = path.join(PUBLIC_DIR, slug);
  await fs.mkdir(outDir, { recursive: true });
  const meta = await sharp(rawFile).metadata();
  const W = meta.width ?? widths[0];
  const H = meta.height ?? 0;
  const sources: Frame["sources"] = [];
  for (const w of widths.filter((w) => w <= W)) {
    const base = `${key}-${w}`;
    await sharp(rawFile).resize(w).avif({ quality: 52, effort: 5 }).toFile(path.join(outDir, `${base}.avif`));
    await sharp(rawFile).resize(w).webp({ quality: 74 }).toFile(path.join(outDir, `${base}.webp`));
    sources.push({ avif: `/projects/${slug}/${base}.avif`, webp: `/projects/${slug}/${base}.webp`, w });
  }
  const blurBuf = await sharp(rawFile).resize(24).webp({ quality: 40 }).toBuffer();
  return { key, width: W, height: H, sources, blur: `data:image/webp;base64,${blurBuf.toString("base64")}` };
}

// ── Video ─────────────────────────────────────────────────────────────────────
async function ffmpegPath(): Promise<string> {
  try {
    const p = (await import("ffmpeg-static")).default as unknown as string;
    if (p && existsSync(p)) return p;
  } catch {}
  return "ffmpeg";
}

async function recordVideo(browser: Browser, slug: string, url: string) {
  const dir = path.join(ROOT, "captures", "videos-raw", slug);
  await fs.rm(dir, { recursive: true, force: true });
  const size = { width: 1280, height: 800 };
  const ctx = await newCtx(browser, { viewport: size, recordVideo: { dir, size } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => page.goto(url, { waitUntil: "load" }));
    await dismissOverlays(page);
    await settle(page);
    const loadedAt = (Date.now() - t0) / 1000;
    // gentle scroll-through: ~7s of wheel steps
    for (let i = 0; i < 70; i++) {
      await page.mouse.wheel(0, 38);
      await page.waitForTimeout(100);
    }
    await page.waitForTimeout(600);
    const video = page.video();
    await ctx.close();
    const webmRaw = await video!.path();
    const out = path.join(PUBLIC_DIR, slug);
    await fs.mkdir(out, { recursive: true });
    const ff = await ffmpegPath();
    const start = Math.max(0, loadedAt - 0.2).toFixed(2);
    await run(ff, ["-y", "-ss", start, "-i", webmRaw, "-t", "8", "-an", "-vf", "scale=960:-2,fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(out, "preview.mp4")]);
    await run(ff, ["-y", "-ss", start, "-i", webmRaw, "-t", "8", "-an", "-vf", "scale=960:-2,fps=30", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", path.join(out, "preview.webm")]);
    const posterPng = path.join(dir, "poster.png");
    await run(ff, ["-y", "-ss", "0.3", "-i", path.join(out, "preview.mp4"), "-frames:v", "1", posterPng]);
    await sharp(posterPng).webp({ quality: 70 }).toFile(path.join(out, "preview-poster.webp"));
    return { mp4: `/projects/${slug}/preview.mp4`, webm: `/projects/${slug}/preview.webm`, poster: `/projects/${slug}/preview-poster.webp` };
  } catch (e) {
    await ctx.close().catch(() => {});
    console.warn(`  ! video failed for ${slug}: ${(e as Error).message}`);
    return undefined;
  }
}

// ── Per-project pipeline ──────────────────────────────────────────────────────
async function shoot(page: Page, file: string, opts: { full?: boolean; scrollY?: number }) {
  await page.evaluate((y) => window.scrollTo(0, y), opts.scrollY ?? 0);
  await page.waitForTimeout(opts.scrollY ? 1800 : 500);
  if (opts.full) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const vw = page.viewportSize()!.width;
    if (h > MAX_FULL_HEIGHT) {
      await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width: vw, height: MAX_FULL_HEIGHT } });
      return;
    }
  }
  await page.screenshot({ path: file, fullPage: !!opts.full });
}

async function captureProject(browser: Browser, p: Project): Promise<CaptureEntry> {
  const url = urlMap[p.slug] ?? p.url;
  const raw = path.join(RAW_DIR, p.slug);
  await fs.mkdir(raw, { recursive: true });
  const entry: CaptureEntry = { slug: p.slug, url: p.url, status: "failed", checkedAt: new Date().toISOString(), colors: [], fonts: [], tech: [], frames: [], chosen: [] };

  const plan = [
    { ctx: DESKTOP, shots: [
      { key: "desktop-hero", label: "Desktop · hero", opts: {}, widths: [720, 1440] },
      { key: "desktop-mid", label: "Desktop · scrolled", opts: { scrollY: 1.15 }, widths: [720, 1440] },
      { key: "desktop-full", label: "Desktop · full page", opts: { full: true }, widths: [720, 1440] },
    ] },
    { ctx: MOBILE, shots: [
      { key: "mobile-hero", label: "Mobile · hero", opts: {}, widths: [390, 780] },
      { key: "mobile-full", label: "Mobile · full page", opts: { full: true }, widths: [390, 780] },
    ] },
  ];

  try {
    for (const { ctx: ctxOpts, shots } of plan) {
      const ctx = await newCtx(browser, { ...ctxOpts, reducedMotion: "no-preference", colorScheme: "light", locale: "en-ZA", timezoneId: "Africa/Johannesburg" });
      let { page, res } = await open(ctx, url);
      if (ctxOpts === DESKTOP) {
        entry.httpStatus = res?.status();
        entry.finalUrl = page.url();
        if (res && res.status() >= 400) throw new Error(`HTTP ${res.status()}`);
        const meta = await extractMeta(page, res);
        Object.assign(entry, { title: meta.title, description: meta.description, fonts: meta.fonts, tech: meta.tech });
      }
      await warmUp(page);
      for (const s of shots) {
        const file = path.join(raw, `${s.key}.png`);
        const vh = page.viewportSize()!.height;
        const o = { full: (s.opts as any).full, scrollY: (s.opts as any).scrollY ? Math.round((s.opts as any).scrollY * vh) : 0 };
        await shoot(page, file, o);
        let q = await frameScore(file);
        if (q.blank) {
          // retake once: reload, wait longer
          console.log(`  ↻ ${p.slug}/${s.key} looked blank — retaking`);
          await page.close();
          ({ page } = await open(ctx, url));
          await page.waitForTimeout(3000);
          await warmUp(page);
          await shoot(page, file, o);
          q = await frameScore(file);
        }
        const frame = await optimise(p.slug, s.key, file, s.widths);
        entry.frames.push({ ...frame, label: s.label, score: q.score, flagged: q.blank ? "blank" : undefined });
        if (s.key === "desktop-hero") entry.colors = await dominantColors(file);
      }
      await ctx.close();
    }
    // choose the 3 best frames: desktop hero + mobile hero + the stronger of mid/full
    const usable = entry.frames.filter((f) => !f.flagged);
    const pick = (k: string) => usable.find((f) => f.key === k)?.key;
    const third = usable.filter((f) => ["desktop-mid", "desktop-full"].includes(f.key)).sort((a, b) => b.score - a.score)[0]?.key;
    entry.chosen = [pick("desktop-hero"), pick("mobile-hero"), third].filter(Boolean) as string[];
    entry.status = entry.frames.length && entry.chosen.length ? "ok" : "failed";
    if (WITH_VIDEO && p.video && entry.status === "ok") entry.video = await recordVideo(browser, p.slug, url);
  } catch (e) {
    entry.error = (e as Error).message.split("\n")[0];
    entry.status = "failed";
  }
  return entry;
}

// ── Contact sheet ─────────────────────────────────────────────────────────────
function contactSheetHtml(entries: CaptureEntry[]) {
  const esc = (s = "") => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const rel = (src: string) => "../public" + src;
  const rows = entries.map((e) => {
    const p = projects.find((x) => x.slug === e.slug)!;
    const thumbs = e.frames.map((f) => `<figure class="${e.chosen.includes(f.key) ? "chosen" : ""}${f.flagged ? " flagged" : ""}"><img src="${rel(f.sources[0].webp)}" alt=""><figcaption>${esc(f.label)} · ${f.score}${f.flagged ? " · " + f.flagged : ""}</figcaption></figure>`).join("");
    return `<section><header><h2>${esc(p.name)}</h2><a href="${esc(e.url)}">${esc(e.url)}</a>
      <p class="st ${e.status}">${e.status.toUpperCase()} ${e.httpStatus ?? ""} ${e.error ? "— " + esc(e.error) : ""}</p>
      <p><b>Title</b> ${esc(e.title)}</p><p><b>Meta</b> ${esc(e.description)}</p>
      <p><b>Fonts</b> ${esc(e.fonts.join(", "))}</p><p><b>Tech</b> ${esc(e.tech.join(", "))}</p>
      <p class="sw">${e.colors.map((c) => `<i style="background:${c}" title="${c}"></i>`).join("")}</p>
      <p><b>Video</b> ${e.video ? "yes" : "—"}</p></header><div class="frames">${thumbs}</div></section>`;
  }).join("");
  return `<!doctype html><meta charset="utf-8"><title>Capture contact sheet</title><style>
  body{font:14px/1.4 system-ui;background:#16120e;color:#efe6d8;margin:24px}section{display:grid;grid-template-columns:320px 1fr;gap:20px;border-top:1px solid #3a322a;padding:20px 0}
  h2{margin:0 0 4px;font-size:20px}a{color:#d9a441}.st.ok{color:#9be37c}.st.failed{color:#ff7b5c}p{margin:4px 0}.sw i{display:inline-block;width:22px;height:22px;margin-right:4px;border-radius:3px}
  .frames{display:flex;gap:10px;align-items:flex-start;overflow:hidden}figure{margin:0;max-width:220px;opacity:.55}figure img{width:100%;max-height:300px;object-fit:cover;object-position:top;border-radius:4px}
  figure.chosen{opacity:1;outline:2px solid #8e6bff;outline-offset:3px;border-radius:4px}figure.flagged{outline:2px dashed #ff7b5c}figcaption{font-size:12px;color:#b9ad9b}</style>
  <h1>Capture contact sheet — ${new Date().toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" })}</h1><p>Outlined = chosen frames. Dashed red = flagged blank.</p>${rows}`;
}

function reportMd(entries: CaptureEntry[]) {
  const lines = ["# Capture report", "", `Run: ${new Date().toISOString()}`, "", "| Project | URL | Status | Title | Chosen frames | Video |", "|---|---|---|---|---|---|"];
  for (const e of entries) {
    const p = projects.find((x) => x.slug === e.slug)!;
    lines.push(`| ${p.name} | ${e.url} | ${e.status}${e.httpStatus ? ` (${e.httpStatus})` : ""}${e.error ? ` — ${e.error}` : ""} | ${e.title ?? ""} | ${e.chosen.join(", ")} | ${e.video ? "yes" : "—"} |`);
  }
  lines.push("", "## Tech clues & colours", "");
  for (const e of entries) lines.push(`- **${e.slug}** — tech: ${e.tech.join(", ") || "—"}; fonts: ${e.fonts.join(", ") || "—"}; colours: ${e.colors.join(" ") || "—"}`);
  return lines.join("\n") + "\n";
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const targets = projects.filter((p) => !only || only.includes(p.slug));
  if (!targets.length) throw new Error(`No projects match --only ${only}`);
  await fs.mkdir(RAW_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: !HEADED });
  const results: CaptureEntry[] = [];
  const queue = [...targets];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length) {
        const p = queue.shift()!;
        console.log(`→ ${p.slug}  ${urlMap[p.slug] ?? p.url}`);
        const r = await captureProject(browser, p);
        console.log(`  ${r.status === "ok" ? "✓" : "✗"} ${p.slug} ${r.status}${r.error ? " — " + r.error : ""} · frames ${r.frames.length} · chosen ${r.chosen.join(", ")}${r.video ? " · video" : ""}`);
        results.push(r);
      }
    }),
  );
  await browser.close();

  // merge into the manifest
  let manifest: Record<string, CaptureEntry> = {};
  try { manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8")); } catch {}
  for (const r of results) {
    // keep the previous good capture if this run failed
    if (r.status === "failed" && manifest[r.slug]?.status === "ok") {
      manifest[r.slug] = { ...manifest[r.slug], error: r.error, checkedAt: r.checkedAt };
    } else manifest[r.slug] = r;
  }
  const ordered = Object.fromEntries(projects.filter((p) => manifest[p.slug]).map((p) => [p.slug, manifest[p.slug]]));
  await fs.writeFile(MANIFEST, JSON.stringify(ordered, null, 2) + "\n");

  const all = Object.values(ordered);
  const sheetDir = path.join(ROOT, "captures");
  await fs.writeFile(path.join(sheetDir, "contact-sheet.html"), contactSheetHtml(all));
  await fs.writeFile(path.join(sheetDir, "report.md"), reportMd(all));
  // render the contact sheet to a PNG for quick review
  const b2 = await chromium.launch();
  const pg = await b2.newPage({ viewport: { width: 1600, height: 1000 } });
  await pg.goto("file://" + path.join(sheetDir, "contact-sheet.html"));
  await pg.waitForTimeout(500);
  await pg.screenshot({ path: path.join(sheetDir, "contact-sheet.png"), fullPage: true });
  await b2.close();
  console.log(`\nManifest → src/data/captures.json\nContact sheet → captures/contact-sheet.html (+ .png, report.md)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
