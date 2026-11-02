/**
 * Build one variant of the site into a static folder.
 *
 *   node scripts/build.mjs            # variant from NEXT_PUBLIC_VARIANT (default "cv") → out/
 *   node scripts/build.mjs cv --to out-cv
 *   node scripts/build.mjs studio --to out-studio
 *
 * After `next build`, removes what doesn't belong to the variant:
 *   studio → no resume page, no CV PDF, studio OG image only
 *   cv     → no studio OG image
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const variant = (args[0] && !args[0].startsWith("--") ? args[0] : process.env.NEXT_PUBLIC_VARIANT) === "studio" ? "studio" : "cv";
const toIdx = args.indexOf("--to");
const to = toIdx >= 0 ? args[toIdx + 1] : null;

console.log(`\n▲ Building the ${variant.toUpperCase()} site${to ? ` → ${to}/` : ""}\n`);
const res = spawnSync(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build"], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_VARIANT: variant },
  shell: process.platform === "win32",
});
if (res.status !== 0) process.exit(res.status ?? 1);

const out = path.join(root, "out");
const rm = (p) => fs.rmSync(path.join(out, p), { recursive: true, force: true });
if (variant === "studio") {
  ["cv.html", "cv.txt", "cv", "katlego-nkuna-cv.pdf", "og.png"].forEach(rm);
  // the studio's 404 page should not mention a CV either; nothing else references it
} else {
  rm("og-studio.png");
}

if (to) {
  const dest = path.join(root, to);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.renameSync(out, dest);
}
console.log(`\n✓ ${variant} site ready in ${to ?? "out"}/`);
