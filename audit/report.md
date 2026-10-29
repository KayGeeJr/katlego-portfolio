# Audit report

Run: 2026-10-29T21:01:48.717Z — static export served locally, Lighthouse 3 run(s) per page (best kept).

## Lighthouse

| Route | Form factor | Perf | A11y | Best practices | SEO | LCP / CLS / TBT |
|---|---|---|---|---|---|---|
| / | desktop | 98 | 100 | 100 | 100 | 0.3 s / 0 / 20 ms |
| / | mobile | 89 | 100 | 100 | 100 | 1.0 s / 0.001 / 430 ms |
| /projects | desktop | 100 | 100 | 100 | 100 | 0.3 s / 0 / 0 ms |
| /projects | mobile | 99 | 100 | 100 | 100 | 0.9 s / 0 / 120 ms |
| /project/mb-communications | desktop | 100 | 100 | 100 | 100 | 0.2 s / 0 / 0 ms |
| /project/mb-communications | mobile | 99 | 100 | 100 | 100 | 0.8 s / 0 / 110 ms |
| /cv | desktop | 100 | 100 | 100 | 100 | 0.3 s / 0 / 10 ms |
| /cv | mobile | 97 | 100 | 100 | 100 | 0.9 s / 0 / 190 ms |

## axe-core (WCAG 2.1 A/AA + best practice)

| Route | Theme | Violations | Rules |
|---|---|---|---|
| / | dark | 0 | — |
| /projects | dark | 0 | — |
| /project/mb-communications | dark | 0 | — |
| /cv | dark | 0 | — |
| / | light | 0 | — |
| /projects | light | 0 | — |
| /project/mb-communications | light | 0 | — |
| /cv | light | 0 | — |
## Notes

- Measured in a 2-core cloud sandbox (Lighthouse benchmark index around 1 650–1 900) with Lighthouse's default mobile throttling (4× CPU, slow 4G). Home-page mobile performance moved between **85 and 92** across runs. The swing comes from Total Blocking Time during hydration; LCP (~1.0 s) and CLS (~0) were stable. Re-check on PageSpeed Insights once deployed.
- WebGL runs under SwiftShader here, so the low-power heuristic (< 4 cores) serves the CSS dusk during these runs. Real devices with 4+ cores get the shader, loaded after idle.
- Accessibility, Best Practices and SEO scored 100 on every audited page, and axe-core reported 0 violations in both the dark and light themes.
