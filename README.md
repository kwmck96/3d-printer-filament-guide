# Filament Field Guide

A reference app for 3D printing: print settings and printer requirements for 19 common filaments, troubleshooting for 20 common print problems, and a side-by-side filament comparison.

React + Vite, no other runtime dependencies. All content is static data, so it deploys as a plain static site.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # validates the data, then builds to dist/
npm run validate   # data checks only
```

## Deploying to Vercel

Import the repo; Vercel detects Vite automatically (build `npm run build`, output `dist`). Routing is hash-based (`#/filaments/petg`), so no rewrite rules are needed.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/data/filaments.js` | Every filament: temperatures, requirements, settings, strengths, weaknesses, common problems, alternatives, compare ratings, sources |
| `src/data/problems.js` | Every print problem: causes, tiered fix steps, most/least prone filaments, per-filament advice, photo-guide links |
| `src/data/glossary.js` | Generic setting names → PrusaSlicer / OrcaSlicer / Cura names. `unintuitive: true` adds the asterisk and footnote |
| `src/lib/compat.js` | "My printer" compatibility rules and presets |
| `src/components/` | UI: list pages, compare page, heat ruler, printer panel |
| `scripts/validate-data.mjs` | Cross-reference checks (runs before every build) |

### Editing content

- **Temperatures**: `min`/`max` is the overlap of the cited manufacturers' ranges; `sweet` is an editorial starting point and must sit inside the range (the validator checks).
- **Links between pages**: filaments reference problems by `id`, and problems reference filaments by `id`. The validator fails the build if an id doesn't exist.
- **Slicer footnotes**: give a settings row or fix step a `key` that exists in `glossary.js`. If that entry has `unintuitive: true`, the asterisk and footnote appear automatically.
- **Compare ratings** (`ratings` on each filament) are relative 1–5 judgments, not measurements. The UI says so.

## Maintenance

- Problem photos are **external links** (Prusa Knowledge Base, Simplify3D, All3DP, 3DPrinterly, Polymaker Wiki) in the `G` object at the top of `src/data/problems.js`. Check them periodically for dead links.
- Filament sources are in the `S` object at the top of `src/data/filaments.js`.
- Slicer setting names were written against PrusaSlicer 2.x, OrcaSlicer 2.x and Cura 5.x and can drift between releases.
- Settings (unit, printer profile) are stored in the viewer's browser via `localStorage`.
