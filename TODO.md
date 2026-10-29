# TODO: needs your input

Search the code for `TODO(confirm)` too. Those markers are stripped from the public site automatically but stay in `src/data/projects.ts` until you fix them.

## Blocking before launch

- [ ] **Run the screenshot capture on your PC.** The cloud workspace's network allowlist blocked your project domains, so every project currently shows generated cover art.
  ```bash
  npx playwright install chromium   # first time only
  npm run capture                   # ~5–8 min for all 12, plus 5 hover videos
  ```
  Then open `captures/contact-sheet.html` and check every frame. Re-run any project with `npm run capture -- --only <slug>`. Commit `public/projects/**` and `src/data/captures.json`.
- [ ] **Production domain.** Set `NEXT_PUBLIC_SITE_URL` (Netlify/Vercel env var) or edit `site.url` in `src/data/site.ts`. It's used for canonical URLs, OG, sitemap and JSON-LD. Currently `https://katlegonkuna.netlify.app` (placeholder).
- [ ] **Breathe (`breathe--hb.netlify.app`) doesn't resolve.** Also tried `breathe-hb`, `breathehb` and `breathe-health`. `name--site.netlify.app` is Netlify's *branch deploy* format, so the production URL is probably different. Send the right URL, update `url`, set `hidden: false`, and write its tagline, summary and highlights.

## Project facts to confirm (`src/data/projects.ts`)

| Project | What to confirm |
|---|---|
| All 12 | Your **role** (currently "Design & build") and **year** |
| MB Communications | Stack (a `next-size-adjust` meta tag hints at Next.js but isn't conclusive). Is it the same company as your 2019–20 internship? |
| The Royal Affair | Renders client-side, so only metadata was readable: write 2–3 real highlights after capture |
| ANTI | Storefront (e-commerce) or brand/enquiry site? |
| Tadaa! | Real client or concept? Note: its `og:image` points at `localhost:3000` on the live site |
| Rooted In Culture | Only the title was readable: tagline, summary and highlights after capture |
| Solar Republic, Khula, Codeline Academy, Mokala Reserve | Described as concept builds (they read like fictional brands). Correct me if any is a real client |
| Naked Kitchen & Coffee Bar | Client-rendered: highlights after capture. Real café client? |
| Coffee Canony | "Canony" spelled as in the site title. Should it be "Canopy"? |
| Stacks | Only Next.js + Netlify were confirmed (tadaa, solar-republic, mokala). `npm run capture` writes detected tech clues to `captures/report.md` |

## Personal details

- [ ] **Phone number:** not on the CV, so it's not on the site. Add it to `site.ts` and the contact footer if you want it.
- [ ] **Journey:** I kept the order you gave (Nelspruit → Pretoria → Sandton → Kempton Park) with CV facts per stop. Your Kempton Park internship (2019) predates Nelspruit (2020–23). Is Nelspruit where you grew up? If so, its note could say that.
- [ ] **Headshot:** none is used (no stock photos, by design). Add a self-hosted photo if you'd like one in About.
- [ ] **Source link:** if the repo goes public, add a "View source" link in the Lab's "taken apart" list.

## Could not be done in the cloud workspace

- [ ] **WebKit and Firefox testing.** Only Chromium is installed there and browser downloads are blocked. On your PC:
  ```bash
  npx playwright install webkit firefox
  npm run build && npm run shots -- --browser webkit --tag safari && npm run shots -- --browser firefox --tag firefox
  ```
- [ ] **Lighthouse on real hardware:** after deploy, run PageSpeed Insights on the live URL (the local scores came from a 2-core sandbox; see `audit/report.md`).
