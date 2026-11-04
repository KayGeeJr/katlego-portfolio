# Awwwards submission pack

Images are in `docs/awwwards/` (taken from the CV site).

## Basics

- **Title:** Katlego Nkuna: Highveld to Interface
- **URL:** the CV site (production domain, see TODO.md). Submit the CV site, since the studio site is noindex.
- **Category:** Portfolio
- **Country:** South Africa
- **Credits:** Design & development by Katlego Nkuna
- **Technologies:** Next.js, TypeScript, Tailwind CSS, GSAP (ScrollTrigger, SplitText), Lenis, OGL / WebGL, GLSL, Playwright, Sharp
- **Colours:** `#FAF6EF` `#15120F` `#8A5800` `#2F6E47` `#C2502B` `#2A40D0`
- **Fonts:** Unbounded, Hanken Grotesk, JetBrains Mono
- **Tags:** portfolio, webgl, shader, dither, south africa, geometric, dark mode, kinetic typography, fintech, ai

## Short description (≤ 300 chars)

A developer portfolio set at dusk on the South African Highveld. A live GLSL sky with dithered bands, a cursor lens of stepped Ndebele-inspired geometry, a hand-drawn journey map, and a lab where visitors pull the site apart.

## Long description

The site is built around one image: the sun going down over a Gauteng ridge, read through a screen. The hero is a single fragment shader with domain-warped fBm bands, a 4×4 Bayer dither and a cursor lens that opens onto a stepped-diamond lattice drawn from the logic of Ndebele and Sotho wall geometry. As you scroll, the sun sets.

The rest stays quiet: a bright-earth palette (ochre, veld green and terracotta on cream) with ultramarine as the only interactive colour, a journey map from the Lowveld to the Highveld that draws as you read, an interactive "diagnose before I code" workflow, NDA-safe fintech case studies illustrated with code-drawn abstractions, and a Lab with the shader, the pattern generator, verlet cursor physics and a photographic-negative easter egg (press N).

Craft notes: static export, CSS fallback for low-power devices, WebGL loaded after idle and paused off-screen, reduced-motion path throughout, axe-core clean in both themes, 100 a11y/best-practices/SEO in Lighthouse.

## Images

| File | Use |
|---|---|
| `00-cover-1600x1200.jpg` | Submission thumbnail (hero with the lattice lens open) |
| `01`–`07` `*-desktop.jpg` | Section screenshots |
| `08-work-strip-desktop.jpg` | Live-site strip (cards open the real sites) |
| `10`–`12` `*-mobile.jpg` | Mobile set |

## Things to show the jury in a screen recording

1. The intro, then move the cursor over the land in the hero.
2. Scroll the journey map and the horizontal work strip.
3. Click "Run the loop" in the AI-native workflow.
4. Play in the Lab: drag the shader sliders, regenerate a pattern, pluck the rope.
5. Press **N**.
6. Switch theme with the sun toggle (circular View Transition).
