# Audit report

Run: 2026-11-02T08:25:00.926Z — static export served locally, Lighthouse 2 run(s) per page (best kept).

## Lighthouse

| Route | Form factor | Perf | A11y | Best practices | SEO | LCP / CLS / TBT |
|---|---|---|---|---|---|---|
| / | desktop | 98 | 100 | 100 | 100 | 0.3 s / 0 / 30 ms |
| / | mobile | 87 | 100 | 100 | 100 | 1.0 s / 0 / 520 ms |
| /cv | desktop | 100 | 100 | 100 | 100 | 0.3 s / 0 / 10 ms |
| /cv | mobile | 96 | 100 | 100 | 100 | 1.0 s / 0 / 220 ms |

## axe-core (WCAG 2.1 A/AA + best practice)

| Route | Theme | Violations | Rules |
|---|---|---|---|
| / | dark | 0 | — |
| /cv | dark | 0 | — |
| / | light | 0 | — |
| /cv | light | 0 | — |
## Notes

- Measured in a 2-core sandbox; mobile performance on `/` swings between about 85 and 92 between runs because of hydration TBT. LCP ~1 s, CLS ~0. Re-check on PageSpeed Insights after deploying.
