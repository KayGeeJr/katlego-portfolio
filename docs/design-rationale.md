# Design rationale: Highveld to Interface

## The idea

Dusk on the Highveld: a low ridge, a wide sky going from ochre to night, and the jacarandas of Pretoria. The site reads that view through a screen. Everything comes from that one image: the warm palette, the hero shader, the stepped geometry and the journey map.

The memorable thing is the hero, a live dusk sky. Move the cursor across the land and a lens opens onto stepped-diamond linework. The rest of the site stays quiet and disciplined so the hero can carry the identity.

## Palette

| Token | Dark (default) | Light | Role |
|---|---|---|---|
| Ironstone ink | `#16120E` | Kalahari sand `#F1E7D6` | Background. Warm near-black, the colour of the ridge after sunset |
| Bone | `#EFE6D8` | `#1E1813` | Text |
| Ochre | `#D9A441` | `#7A4F08` | Data, indices, highlights (the horizon glow) |
| Highveld dusk | `#E8692C` | `#B2421A` | Lines and progress (the sky band above the glow) |
| Red earth | `#A4472A` | `#8F3A20` | Fills and the route curtain (Gauteng soil) |
| Jacaranda | `#9B7DFF` | `#5A3ED6` | **Interaction only**: focus, active, hover, selection, the final leg of the journey |

Why it works:
- Warm, not black and white. Ochre, dusk and earth are the actual colours of a Gauteng sunset and red soil, so the palette is regional rather than decorative.
- One electric accent. Jacaranda (Pretoria is the Jacaranda City, and UP is where the story starts) is the only cool hue, so anything violet means "you can act on this".
- Contrast: every text pairing passes WCAG AA in both themes (axe-core verified). Light-mode ochre was darkened from `#8C5C0C` to `#7A4F08` after the audit.
- The hero is always dusk. It stays dark in light mode on purpose. Light mode is daylight on paper, but the sky at the top of the page doesn't change.
- Negative mode (press **N**) inverts the whole page. Dusk becomes a blue noon and jacaranda turns green.

## Type

- **Unbounded** (display): a wide geometric face whose square-shouldered, stepped forms echo the hard-edged geometry in the motifs. Used large and tight (−3.5% tracking, 0.88 leading) for the name, section titles and numbers.
- **Hanken Grotesk** (body): a clean, slightly humanist grotesk that stays readable at 17px next to the very wide display face.
- **JetBrains Mono** (data only): coordinates, the clock, indices and stats. Only where numbers line up, and a nod to the JetBrains tools on the CV.

All fonts are self-hosted (Latin subset, variable) through `next/font/local`, with metric-adjusted fallbacks so they cause no layout shift.

Scale: fluid `clamp()` steps for display, h1, h2, h3, lead and body; body measure kept under 70ch.

## Geometry (the Ndebele and Sotho influence)

The motifs are staircases, nested frames, stepped diamonds, chevrons and ladders, built on a square grid with hard edges and no smooth diagonals. They take the visual logic of Ndebele wall painting and Sotho litema, bold outlines and stepped forms, without copying any specific design, symbol or colourway. They appear:
- in the hero shader, as the stepped-diamond lattice inside the cursor lens and faintly over the land
- as section dividers that draw themselves in
- in the preloader and the 404
- in the Lab's pattern generator, where visitors make and download their own
- as the generated project cover art

They're always outlines on a grid, never clip-art, and they never stand in for "Africa".

## Motion principles

1. **One easing family.** Expo-out `cubic-bezier(.16,1,.3,1)` for reveals, power3 in-out for curtains, sine for ambient loops. Mirrored in CSS custom properties and `src/lib/motion.ts`.
2. **One orchestrated moment.** The intro: stepped band draws in (desktop only, ≤ 2 s, once per session), the curtain lifts, and the name rises letter by letter.
3. **Everything else answers the visitor.** Cursor lens, magnetic buttons, the sun setting as you scroll, the journey drawing as you read, the workflow stepping when you click.
4. **Reduced motion is a first-class path.** No smooth scroll, no splitting, a still shader frame, every effect resolved to its end state.
5. **Performance budget.** WebGL loads after idle, never on low-power devices, pauses off-screen, and drops to half resolution if frames run slow. Scroll effects attach after idle, and sections hydrate in Suspense chunks.

## Layout

Left-aligned throughout. A 12-column grid: section labels sit in columns 1–3 and content in 4–12, so the left edge stays clean all the way down. Cards are only used where content really is a set (journey stops, case studies, lab experiments). They're joined with 1px lines rather than floating with shadows.

```
┌──────────────────────────────────────────────┐
│ KN Katlego Nkuna     Work Process Lab CV  ☼ ♪ │
│                                   26.10° S …  │
│            (live dusk shader)          ◐ sun  │
│ ~~~~~~~~~~~~~~~ ridge ~~~~~~~~~~~~~~~~~~~~~~~ │
│ KATLEGO                                       │
│ NKUNA                     lead paragraph      │
│ ───────────────────────────────────────────── │
│ Frontend, fintech & AI-native        Scroll │ │
└──────────────────────────────────────────────┘
```

## Sitemap

- `/`: Hero → About → marquee → Journey → What I do → AI-native workflow → Stack → Experience → Impact → Selected work (pinned horizontal strip) → Fintech case studies (NDA) → Lab → Education → Contact
- `/projects`: filterable index with cursor-following previews
- `/project/[slug]`: 11 detail pages (12th hidden until its URL is confirmed)
- `/cv`: printable HTML resume, plus `/katlego-nkuna-cv.pdf`
- custom 404, `sitemap.xml`, `robots.txt`, `manifest.webmanifest`
