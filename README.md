# Katlego Nkuna: two sites, one codebase

**Highveld to Interface.** Same look and feel, two audiences:

| | **CV site** (`NEXT_PUBLIC_VARIANT=cv`, default) | **Studio site** (`NEXT_PUBLIC_VARIANT=studio`) |
|---|---|---|
| For | Recruiters and employers | Private clients |
| Sections | Hero, About, Journey, What I do, AI-native workflow, Stack, Experience, Impact, Live sites, **Fintech case studies (NDA)**, Lab, Education, Contact | Hero, About, **Live sites first**, Services, How we'll work, Lab, **Quote form** |
| Extras | `/cv` printable resume + PDF download, LinkedIn, indexed by search engines | No CV, no bank or fintech detail, `noindex` by default |

On both sites, every project card opens the **live site directly** in the same tab, so the browser's Back button returns to the work section. There are no in-between detail pages.

Built with Next.js (static export), TypeScript, Tailwind CSS 4, GSAP + Lenis and an OGL/GLSL hero.

- Things that need your input: [`TODO.md`](TODO.md)
- Design rationale: [`docs/design-rationale.md`](docs/design-rationale.md)
- Audits: [`audit/report-cv.md`](audit/report-cv.md), [`audit/report-studio.md`](audit/report-studio.md)

## Run it

Requires Node 20+ (22 recommended).

```bash
npm install
npm run dev              # CV site at http://localhost:3000
npm run dev:studio       # Studio site at http://localhost:3000

npm run build:both       # → out-cv/ and out-studio/
npm run start:cv         # serve out-cv on :3000
npm run start:studio     # serve out-studio on :3001
```

## Deploy (two Netlify sites from one repo)

Create **two** Netlify sites that point at this same repository. `netlify.toml` already sets the build command (`npm run build`) and publish folder (`out`). The only difference is the environment variables, set per site in *Site configuration → Environment variables*:

| Netlify site | `NEXT_PUBLIC_VARIANT` | `NEXT_PUBLIC_SITE_URL` |
|---|---|---|
| CV | `cv` | `https://your-cv-domain` |
| Studio | `studio` | `https://your-studio-domain` |

Optional: `NEXT_PUBLIC_STUDIO_INDEX=1` lets search engines index the studio site.

The studio quote form uses **Netlify Forms** (it's detected automatically from the static HTML; enable notifications under *Forms*). On another host it falls back to opening a pre-filled email.

Prefer Vercel? Create two projects with the same env vars and framework "Next.js".

## Update the sites

- **Projects (both sites):** `src/data/projects.ts`, one entry per site. The order in the file is the order on the page.
- **Project images:** drop a screenshot at `shots-in/<slug>.png`, then run `npm run import-shots`. It trims the caption band from the 3200×2100 mockups and encodes AVIF + WebP (720/1280/1920w) plus a blur placeholder. `--crop-top 0` keeps the whole image. You can also capture live sites with `npm run capture -- --only <slug>` (see below).
- **CV content:** `src/data/site.ts`. Every fact there comes from the CV, so keep it that way.
- **Studio copy:** `src/data/studio.ts` (hero, about, services, process, contact).
- **OG images:** `npm run build:cv && npm run og`, then rebuild. This writes `og.png` for the CV site and `og-studio.png` for the studio.

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
npm run build:both
npm run audit -- --dir out-cv --report report-cv.md          # Lighthouse desktop+mobile and axe (dark + light)
npm run audit -- --dir out-studio --routes / --report report-studio.md
npm run shots -- --dir out-studio --tag review               # screenshots of every home section, desktop + mobile
npm run shots -- --dir out-cv --browser webkit               # after `npx playwright install webkit`
npm run og                                                   # favicons + both 1200×630 OG covers (a real frame of the shader)
```

## Structure

```
src/
  app/                 routes: /, /cv (CV site only), 404, sitemap, robots
  components/
    chrome/            header, preloader, cursor, magnetic, Lenis, scroll FX, transitions, negative mode
    hero/              shader.ts (GLSL), ShaderCanvas (OGL), CSS fallback, lazy loader
    sections/          home page sections (mostly server components)
    lab/               Lab shell + client experiments
    work/              project media (captures or generated covers), pin, hover video
    ui/                SectionHead, SplitHeading, Pattern, Marquee
  data/                projects.ts (all sites), site.ts (CV content), studio.ts (client copy), captures.json (generated)
  lib/variant.ts       which site is being built (cv | studio)
  lib/                 motion tokens, gsap setup, pattern generator, prefs, sound
scripts/               build.mjs, import-shots.ts, capture.ts, self-shots.ts, audit.mjs, og.ts
```

## Accessibility and motion

- Skip link, landmarks, semantic headings, visible ultramarine focus rings, keyboard-operable workflow tabs (arrow keys, Home, End), `aria-live` feedback.
- `prefers-reduced-motion`: no smooth scroll, no text splitting, a still shader frame, no marquee, no preloader.
- Touch devices: native scroll, no custom cursor, no preloader, swipeable work strip and map.
- Low-power devices (save-data, < 4 cores, < 3 GB RAM): a CSS sky instead of WebGL.
- Sound is off by default; the toggle synthesises soft UI ticks with Web Audio (no audio files).
- Easter egg: press **N**.
