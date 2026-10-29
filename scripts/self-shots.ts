/**
 * Screenshot this site (the static export in ./out) at desktop + mobile for visual review.
 *
 *   npm run build && npm run shots -- --tag phase2 [--sections top,intro] [--routes /,/projects] [--browser webkit]
 *
 * Output: shots/<tag>/<browser>-<viewport>-<route>-<section>.png
 */
import { chromium, firefox, webkit, type BrowserType } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (n: string, d?: string) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : d;
};
const tag = opt("tag", "latest")!;
const routes = opt("routes", "/")!.split(",");
const sections = opt("sections")?.split(",");
const browserName = opt("browser", "chromium")!;
const full = argv.includes("--full");
const PORT = Number(opt("port", "3100"));
const out = path.resolve(__dirname, "..", "shots", tag);

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: browserName !== "firefox", hasTouch: true },
} as const;

async function waitFor(url: string, ms = 20000) {
  const t = Date.now();
  while (Date.now() - t < ms) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error("server did not start");
}

async function main() {
  await fs.mkdir(out, { recursive: true });
  const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["serve@14", "out", "-l", String(PORT), "--no-clipboard"], { stdio: "ignore", cwd: path.resolve(__dirname, "..") });
  try {
    await waitFor(`http://localhost:${PORT}/`);
    const types: Record<string, BrowserType> = { chromium, firefox, webkit };
    const browser = await types[browserName].launch(browserName === "chromium" ? { args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"] } : {});
    const errors: string[] = [];
    for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
      const ctx = await browser.newContext({ ...vp });
      // (string form: tsx would otherwise inject helpers the page doesn't have)
      // containers report 2 cores, which trips the low-power CSS fallback; --webgl forces the shader
      await ctx.addInitScript(
        `try { sessionStorage.setItem("kn-intro", "1"); } catch (e) {}` +
          (argv.includes("--webgl") ? `Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });` : ""),
      );
      for (const route of routes) {
        const page = await ctx.newPage();
        page.on("console", (m) => m.type() === "error" && errors.push(`[${vpName} ${route}] ${m.text()}`));
        page.on("pageerror", (e) => errors.push(`[${vpName} ${route}] pageerror ${e.message}`));
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(argv.includes("--webgl") ? 5000 : 2500);
        const slug = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
        if (full) {
          await page.screenshot({ path: path.join(out, `${browserName}-${vpName}-${slug}-full.png`), fullPage: true });
        }
        const ids = sections ?? (await page.$$eval("main section[id], footer[id]", (els) => els.map((e) => e.id)));
        for (const id of ids) {
          await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const y = el.getBoundingClientRect().top + scrollY;
            const w = window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } };
            if (w.__lenis) w.__lenis.scrollTo(y, { immediate: true, force: true });
            else window.scrollTo(0, y);
          }, id);
          await page.waitForTimeout(1400);
          await page.screenshot({ path: path.join(out, `${browserName}-${vpName}-${slug}-${id}.png`) });
        }
        await page.close();
      }
      await ctx.close();
    }
    await browser.close();
    await fs.writeFile(path.join(out, `${browserName}-console.txt`), errors.join("\n") || "no console errors");
    console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
    console.log(`shots → ${out}`);
  } finally {
    server.kill();
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
