# Audit report

Run: 2026-11-02T08:26:15.167Z — static export served locally, Lighthouse 2 run(s) per page (best kept).

## Lighthouse

| Route | Form factor | Perf | A11y | Best practices | SEO | LCP / CLS / TBT |
|---|---|---|---|---|---|---|
| / | desktop | 100 | 100 | 100 | 69 | 0.3 s / 0 / 0 ms |
| / | mobile | 84 | 100 | 100 | 69 | 0.9 s / 0 / 620 ms |

## axe-core (WCAG 2.1 A/AA + best practice)

| Route | Theme | Violations | Rules |
|---|---|---|---|
| / | dark | 0 | — |
| / | light | 0 | — |
## Notes

- SEO shows 69 **on purpose**: the studio profile is `noindex` (private, shared by link). Building with `NEXT_PUBLIC_STUDIO_INDEX=1` makes it indexable, and SEO returns to 100.
- Measured in a 2-core sandbox; mobile performance swings by about ±5 between runs because of hydration TBT. LCP ~1 s, CLS ~0.
