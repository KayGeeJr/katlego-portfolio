/**
 * Import ready-made mockup screenshots (e.g. browser + phone composites) for projects.
 *
 *   1. Drop images into ./shots-in/<slug>.png (or .jpg/.webp). The slug must exist in src/data/projects.ts.
 *   2. npm run import-shots                 # all files in shots-in/
 *      npm run import-shots -- --crop-top 0.16   # fraction of height to trim off the top (default 0.162,
 *                                                # which removes the caption band on the 3200×2100 mockups)
 *
 * Writes AVIF + WebP (720/1280/1920w) and a blur placeholder to public/projects/<slug>/,
 * and records the frame as "mockup" in src/data/captures.json (the site prefers it over captures).
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { projects } from "../src/data/projects";

const ROOT = path.resolve(__dirname, "..");
const IN = path.join(ROOT, "shots-in");
const MANIFEST = path.join(ROOT, "src", "data", "captures.json");
const argv = process.argv.slice(2);
const i = argv.indexOf("--crop-top");
const cropTop = i >= 0 ? Number(argv[i + 1]) : 0.162;
const cropBottom = 0.019;

async function main() {
  const files = (await fs.readdir(IN)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  let manifest: Record<string, any> = {};
  try { manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8")); } catch {}

  for (const f of files) {
    const slug = f.replace(/\.(png|jpe?g|webp)$/i, "");
    if (!projects.some((p) => p.slug === slug)) {
      console.warn(`skip ${f}: no project with slug "${slug}"`);
      continue;
    }
    const src = path.join(IN, f);
    const meta = await sharp(src).metadata();
    const W = meta.width!, H = meta.height!;
    const top = Math.round(H * cropTop);
    const height = H - top - Math.round(H * cropBottom);
    const base = sharp(src).extract({ left: 0, top, width: W, height });
    const buf = await base.png().toBuffer();
    const out = path.join(ROOT, "public", "projects", slug);
    await fs.rm(out, { recursive: true, force: true });
    await fs.mkdir(out, { recursive: true });
    const sources = [];
    for (const w of [720, 1280, 1920].filter((w) => w <= W)) {
      await sharp(buf).resize(w).avif({ quality: 55, effort: 6 }).toFile(path.join(out, `mockup-${w}.avif`));
      await sharp(buf).resize(w).webp({ quality: 78 }).toFile(path.join(out, `mockup-${w}.webp`));
      sources.push({ avif: `/projects/${slug}/mockup-${w}.avif`, webp: `/projects/${slug}/mockup-${w}.webp`, w });
    }
    const blur = (await sharp(buf).resize(24).webp({ quality: 40 }).toBuffer()).toString("base64");
    const { dominant } = await sharp(buf).stats();
    const frame = { key: "mockup", label: "Desktop and mobile", width: W, height, sources, blur: `data:image/webp;base64,${blur}`, score: 100 };
    const prev = manifest[slug] ?? {};
    manifest[slug] = {
      slug,
      url: projects.find((p) => p.slug === slug)!.url,
      status: "ok",
      checkedAt: new Date().toISOString(),
      colors: prev.colors?.length ? prev.colors : ["#" + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("")],
      fonts: prev.fonts ?? [],
      tech: prev.tech ?? [],
      ...prev,
      frames: [frame, ...(prev.frames ?? []).filter((fr: { key: string }) => fr.key !== "mockup")],
      chosen: ["mockup", ...(prev.chosen ?? []).filter((k: string) => k !== "mockup")],
      status_: undefined,
    };
    manifest[slug].status = "ok";
    delete manifest[slug].status_;
    delete manifest[slug].error;
    console.log(`✓ ${slug}  ${W}×${height} → ${sources.length} sizes`);
  }
  const ordered = Object.fromEntries(projects.filter((p) => manifest[p.slug]).map((p) => [p.slug, manifest[p.slug]]));
  await fs.writeFile(MANIFEST, JSON.stringify(ordered, null, 2) + "\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
