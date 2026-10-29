/**
 * Audit loop: Lighthouse (desktop + mobile) and axe-core on the static export.
 *
 * Plain ESM (not tsx): tsx rewrites functions Lighthouse serialises into the page.
 *
 *   npm run build && npm run audit [-- --routes /,/cv] [--runs 1]
 *
 * Writes audit/report.md and audit/*.json. Uses Playwright's Chromium for both.
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 ? argv[i + 1] : d;
};
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "audit");
const PORT = 3130;
const routes = opt("routes", "/,/projects,/project/mb-communications,/cv").split(",");
const runs = Number(opt("runs", "1"));
const BASE = `http://localhost:${PORT}`;


async function runLighthouse(url, formFactor, port) {
  const config =
    formFactor === "desktop"
      ? { extends: "lighthouse:default", settings: { formFactor: "desktop", screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0 } } }
      : { extends: "lighthouse:default" };
  const res = await lighthouse(url, { port, output: "json", logLevel: "error", onlyCategories: ["performance", "accessibility", "best-practices", "seo"] }, config);
  const lhr = res.lhr;
  const s = Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
  const failing = Object.values(lhr.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual")
    .map((a) => `${a.id} (${a.displayValue ?? a.score})`);
  const m = lhr.audits;
  const metrics = { LCP: m["largest-contentful-paint"]?.displayValue, CLS: m["cumulative-layout-shift"]?.displayValue, TBT: m["total-blocking-time"]?.displayValue, FCP: m["first-contentful-paint"]?.displayValue };
  return { scores: s, failing, metrics };
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["serve@14", "out", "-l", String(PORT), "--no-clipboard"], { cwd: ROOT, stdio: "ignore" });
  try {
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(BASE)).ok) break; } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
    const chromePath = chromium.executablePath();
    const chrome = await chromeLauncher.launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
    const rows = [];
    const all = {};
    for (const r of routes) {
      for (const ff of ["desktop", "mobile"]) {
        let best = null;
        for (let k = 0; k < runs; k++) {
          const res = await runLighthouse(BASE + r, ff, chrome.port);
          if (!best || res.scores.performance > best.scores.performance) best = res;
        }
        all[`${ff} ${r}`] = best;
        const s = best.scores;
        rows.push(`| ${r} | ${ff} | ${s.performance} | ${s.accessibility} | ${s["best-practices"]} | ${s.seo} | ${best.metrics.LCP} / ${best.metrics.CLS} / ${best.metrics.TBT} |`);
        console.log(`${ff.padEnd(7)} ${r.padEnd(30)} P${s.performance} A${s.accessibility} BP${s["best-practices"]} SEO${s.seo}  ${best.failing.slice(0, 6).join(", ")}`);
      }
    }
    await chrome.kill();

    // axe-core
    const browser = await chromium.launch();
    const axeRows = [];
    for (const theme of ["dark", "light"]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      await ctx.addInitScript(`try{sessionStorage.setItem("kn-intro","1");localStorage.setItem("kn-prefs",JSON.stringify({theme:"${theme}"}))}catch(e){}`);
      for (const r of routes) {
        const page = await ctx.newPage();
        await page.goto(BASE + r, { waitUntil: "networkidle" });
        // reveal everything so axe sees final colours
        await page.evaluate(async () => {
          document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
          for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(1500);
        const res = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
        all[`axe ${theme} ${r}`] = res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 5).map((n) => n.target.join(" ") + " :: " + n.failureSummary) }));
        axeRows.push(`| ${r} | ${theme} | ${res.violations.length} | ${res.violations.map((v) => `${v.id} (${v.nodes.length})`).join(", ") || "—"} |`);
        console.log(`axe ${theme} ${r}: ${res.violations.length} violations ${res.violations.map((v) => v.id).join(", ")}`);
        await page.close();
      }
      await ctx.close();
    }
    await browser.close();

    const md = [
      "# Audit report",
      "",
      `Run: ${new Date().toISOString()} — static export served locally, Lighthouse ${runs} run(s) per page (best kept).`,
      "",
      "## Lighthouse",
      "",
      "| Route | Form factor | Perf | A11y | Best practices | SEO | LCP / CLS / TBT |",
      "|---|---|---|---|---|---|---|",
      ...rows,
      "",
      "## axe-core (WCAG 2.1 A/AA + best practice)",
      "",
      "| Route | Theme | Violations | Rules |",
      "|---|---|---|---|",
      ...axeRows,
      "",
    ].join("\n");
    await fs.writeFile(path.join(OUT, "report.md"), md);
    await fs.writeFile(path.join(OUT, "details.json"), JSON.stringify(all, null, 2));
    console.log("\naudit/report.md written");
  } finally {
    server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
