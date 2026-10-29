# Katlego Nkuna: portfolio

**Highveld to Interface.** A one-page portfolio with project detail pages, built with Next.js (static export), TypeScript, Tailwind CSS 4, GSAP + Lenis and an OGL/GLSL hero.

- Design rationale: [`docs/design-rationale.md`](docs/design-rationale.md)
- Things that need your input: [`TODO.md`](TODO.md)
- Latest audit: [`audit/report.md`](audit/report.md)
- Awwwards pack: [`docs/awwwards-pack.md`](docs/awwwards-pack.md)

## Run it

Requires Node 20+ (22 recommended).

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static export → ./out
npm start              # serve ./out on :3000
```

## Deploy

The build is a fully static site in `out/`.

- **Netlify:** connect the repo. `netlify.toml` already sets `npm run build` → `out`, cache headers and a `/resume → /cv` redirect. Or drag the `out/` folder onto app.netlify.com/drop.
- **Vercel:** import the repo, framework "Next.js", no settings needed.
- Set the env var `NEXT_PUBLIC_SITE_URL=https://your-domain` so canonical URLs, OG tags, the sitemap and JSON-LD point at the real domain.

## Update projects

Everything about projects lives in **one file: `src/data/projects.ts`**.

1. Add or edit an entry (`slug`, `name`, `url`, `group: "client" | "concept"`, `tagline`, `summary`, `highlights`, `role`, `stack`, `palette`, `motif`; `video: true` records a hover preview; `hidden: true` keeps it off the site).
2. Capture it:
   ```bash
   npx playwright install chromium        # first time on a machine
   npm run capture -- --only <slug>       # or `npm run capture` for all
   ```
3. Review `captures/contact-sheet.html` (also `.png` and `report.md`): URL status, title, meta description, detected fonts, colours, tech clues, and which 3 frames were chosen.
4. `npm run build`. Pages, the work strip, the index, the sitemap and next-project links all update automatically.

Bio, skills, experience, case studies and education are in `src/data/site.ts`. Every fact there comes from the CV, so keep it that way.

### The capture script (`scripts/capture.ts`)

For every project it:
- shoots **desktop 1440×900** and **mobile 390×844 @2x**: hero viewport, a scrolled frame and the full page
- waits for network idle, fonts and running animations, dismisses cookie/consent overlays (clicks only inside dialogs and banners, never site nav), scrolls the whole page to trigger lazy loading and reveals, then returns to the top
- scores each frame and **retakes blank ones**, then picks the best 3 (desktop hero, mobile hero, and the stronger of scrolled/full)
- extracts title, meta description, fonts in use, dominant colours (k-means) and tech clues (headers, generator tag, Next/Nuxt/Angular/Vue/Vite/WordPress/Shopify/Webflow/Framer/GSAP/Lenis/Three markers)
- encodes **AVIF + WebP** at 1× and 2× widths with a base64 blur placeholder into `public/projects/<slug>/`
- records a ~8 s scroll-through for projects with `video: true` and encodes **MP4 (H.264) + WebM (VP9)** with a poster, using `ffmpeg-static`
- merges results into `src/data/captures.json`, keeping the last good capture if a run fails

Flags: `--only a,b` · `--no-video` · `--headed` · `--concurrency 2` · `--map slug=http://localhost:4000` (point a slug at another URL for testing).

## Quality tooling

```bash
npm run build
npm run audit                     # Lighthouse desktop+mobile and axe (dark + light) → audit/report.md
npm run shots -- --tag review     # screenshots of every home section, desktop + mobile → shots/review
npm run shots -- --routes /,/projects,/cv --full --browser webkit   # after `npx playwright install webkit`
npm run og                        # regenerate favicons + the 1200×630 OG cover (a real frame of the shader)
```

## Structure

```
src/
  app/                 routes: /, /projects, /project/[slug], /cv, 404, sitemap, robots
  components/
    chrome/            header, preloader, cursor, magnetic, Lenis, scroll FX, transitions, negative mode
    hero/              shader.ts (GLSL), ShaderCanvas (OGL), CSS fallback, lazy loader
    sections/          home page sections (mostly server components)
    lab/               Lab shell + client experiments
    work/              project media (captures or generated covers), pin, hover video
    ui/                SectionHead, SplitHeading, Pattern, Marquee
  data/                projects.ts (single source for projects), site.ts (CV content), captures.json (generated)
  lib/                 motion tokens, gsap setup, pattern generator, prefs, sound
scripts/               capture.ts, self-shots.ts, audit.mjs, og.ts
```

## Accessibility and motion

- Skip link, landmarks, semantic headings, visible jacaranda focus rings, keyboard-operable workflow tabs (arrow keys, Home, End), `aria-live` feedback.
- `prefers-reduced-motion`: no smooth scroll, no text splitting, a still shader frame, no marquee, no preloader.
- Touch devices: native scroll, no custom cursor, no preloader, swipeable work strip and map.
- Low-power devices (save-data, < 4 cores, < 3 GB RAM): CSS dusk instead of WebGL.
- Sound is off by default; the toggle synthesises soft UI ticks with Web Audio (no audio files).
- Easter egg: press **N**.
