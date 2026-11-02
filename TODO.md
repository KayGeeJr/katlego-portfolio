# TODO: needs your input

## Before launch

- [ ] **Create two Netlify sites from this repo** (see README → Deploy):
  - CV site: env `NEXT_PUBLIC_VARIANT=cv`, `NEXT_PUBLIC_SITE_URL=https://<your-cv-domain>`
  - Studio site: env `NEXT_PUBLIC_VARIANT=studio`, `NEXT_PUBLIC_SITE_URL=https://<your-studio-domain>`
- [ ] **Studio quote form:** after the first studio deploy, check Netlify → Forms shows a form called `quote`, and turn on email notifications. On a host other than Netlify, the form falls back to opening a pre-filled email.
- [ ] **Studio visibility:** the studio site is `noindex` (private, shared by link). For it to show up on Google, set `NEXT_PUBLIC_STUDIO_INDEX=1` on that Netlify site.

## Content to confirm

- [ ] **Groups:** Luxe Era is listed under *Client & brand sites*, and Breathe JHB, Solar Republic, Khula, Codeline Academy and Mokala Reserve under *Product & concept builds*. Move any that are real clients (`group` in `src/data/projects.ts`).
- [ ] **Studio copy** (`src/data/studio.ts`): the services, process and reply time ("a couple of working days") are written as offers. Adjust them to what you actually provide (e.g. do you handle domains and hosting?).
- [ ] **WhatsApp / phone** for the studio contact: send the number and I'll add a WhatsApp button.
- [ ] **Journey (CV site):** the order is Nelspruit → Pretoria → Sandton → Kempton Park. Is Nelspruit where you grew up?
- [ ] **Tadaa!, Rooted In Culture, Naked Kitchen, Coffee Canony:** dropped because there were no screenshots. To bring one back, add it to `projects.ts`, drop `shots-in/<slug>.png` and run `npm run import-shots`.

## Testing to do on your PC

- [ ] Safari/WebKit and Firefox screenshots (couldn't be installed in the cloud workspace):
  ```bash
  npx playwright install webkit firefox
  npm run build:both
  npm run shots -- --dir out-studio --browser webkit --tag safari-studio
  npm run shots -- --dir out-cv --browser firefox --tag firefox-cv
  ```
- [ ] PageSpeed Insights on both live URLs.
