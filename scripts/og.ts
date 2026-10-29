/**
 * Generates the favicon set and the 1200×630 Open Graph cover.
 * The OG cover is a real frame of the hero shader, rendered from the built site.
 *
 *   npm run build && npm run og
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const PUB = path.join(ROOT, "public");
const PORT = 3111;

/** Minimal ICO writer that embeds PNGs (supported by every modern browser). */
function ico(pngs: { size: number; buf: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(pngs.length, 4);
  const dir = Buffer.alloc(16 * pngs.length);
  let offset = 6 + dir.length;
  pngs.forEach((p, i) => {
    const o = i * 16;
    dir.writeUInt8(p.size >= 256 ? 0 : p.size, o); dir.writeUInt8(p.size >= 256 ? 0 : p.size, o + 1);
    dir.writeUInt8(0, o + 2); dir.writeUInt8(0, o + 3); dir.writeUInt16LE(1, o + 4); dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(p.buf.length, o + 8); dir.writeUInt32LE(offset, o + 12);
    offset += p.buf.length;
  });
  return Buffer.concat([header, dir, ...pngs.map((p) => p.buf)]);
}

async function icons() {
  const svg = await fs.readFile(path.join(PUB, "icon.svg"));
  const png = (s: number) => sharp(svg, { density: 600 }).resize(s, s).png().toBuffer();
  await fs.writeFile(path.join(PUB, "favicon.ico"), ico([{ size: 16, buf: await png(16) }, { size: 32, buf: await png(32) }, { size: 48, buf: await png(48) }]));
  await fs.writeFile(path.join(PUB, "apple-touch-icon.png"), await png(180));
  await fs.writeFile(path.join(PUB, "icon-192.png"), await png(192));
  await fs.writeFile(path.join(PUB, "icon-512.png"), await png(512));
  // maskable: monogram inside the safe zone on a full-bleed ink square
  const inner = await sharp(svg, { density: 600 }).resize(340, 340).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: "#16120e" } }).composite([{ input: inner, gravity: "center" }]).png().toFile(path.join(PUB, "icon-512-maskable.png"));
}

async function og() {
  const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["serve@14", "out", "-l", String(PORT), "--no-clipboard"], { cwd: ROOT, stdio: "ignore" });
  try {
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
    const browser = await chromium.launch({ args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"] });
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    // string form (tsx helpers); containers report 2 cores, which would trip the low-power fallback
    await page.addInitScript(`try { sessionStorage.setItem("kn-intro", "1"); } catch (e) {} Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });`);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(6000);
    await page.addStyleTag({ content: `header, .hero-copy, [aria-hidden].fixed, .skip-link { display: none !important; } html { scrollbar-gutter: auto !important; overflow: hidden !important; }` });
    await page.evaluate(() => {
      const hero = document.getElementById("top")!;
      const o = document.createElement("div");
      o.style.cssText = "position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;justify-content:flex-end;padding:56px 64px;color:#efe6d8;font-family:var(--font-hanken)";
      o.innerHTML = `
        <div style="position:absolute;top:52px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:var(--font-jetbrains);font-size:20px;opacity:.9"><span>26.10° S, 28.23° E</span><span>Kempton Park, Gauteng</span></div>
        <div style="font-family:var(--font-unbounded);font-weight:700;font-size:118px;line-height:.88;letter-spacing:-.035em;text-transform:uppercase">Katlego<br>Nkuna</div>
        <div style="margin-top:26px;padding-top:18px;border-top:1px solid rgba(239,230,216,.25);display:flex;justify-content:space-between;font-size:26px"><span>Software Developer — frontend, fintech, AI-native</span><span style="color:#d9a441">Highveld to Interface</span></div>`;
      hero.appendChild(o);
    });
    await page.waitForTimeout(400);
    const buf = await page.screenshot({ type: "png" });
    await sharp(buf).png({ compressionLevel: 9, palette: false }).toFile(path.join(PUB, "og.png"));
    await browser.close();
  } finally {
    server.kill();
  }
}

(async () => {
  await icons();
  await og();
  console.log("icons + og.png written to public/");
})().catch((e) => { console.error(e); process.exit(1); });
