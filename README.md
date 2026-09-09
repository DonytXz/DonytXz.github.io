# Donato Alvarez — Zero-Dependency Vanilla Portfolio

> A hyper-optimized, text-first developer portfolio. No frameworks. No bundlers. No npm. Pure semantic HTML5 & a single raw CSS stylesheet.

## Philosophy

This portfolio is a statement piece: it proves that mastery of web fundamentals and standards produces results that heavy frameworks cannot match. Every element is semantic, accessible, and fast.

### Constraints & Targets

| Constraint | Value |
|---|---|
| **Frontend Frameworks** | 0 |
| **NPM Packages / Bundlers** | 0 |
| **External Network Requests** | 0 |
| **CSS Files** | 1 (`style.css`) |
| **Build Step** | None (direct browser execution) |
| **Total Uncompressed Weight** | ~32KB (HTML + CSS + inline SVG) |
| **Lighthouse Target** | 100 / 100 / 100 / 100 |

## Features & Highlights

- **Dual-Mode Experience Section**: The short CV version (top 3 recent roles: Programming.com, TCS, Softtek) is displayed by default. An accessible native disclosure (`<details>` / `<summary>`) expands on demand to reveal the full career history (ConsultNet, SONETASOT, Sharptech, VR Life, Primal) with zero JavaScript required.
- **Updated Role Hierarchy**: Reflects the updated **Sr Full Stack Developer** title at ConsultNet per latest records.
- **Live System Specs Widget**: Reads browser `performance` navigation timings in real time to report actual bytes transferred and resource requests.
- **Native Semantic HTML5**: Full ARIA landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`), skip-to-content link, and strict `h1 → h2 → h3` hierarchy.
- **Zero-Dependency Styling**: CSS Custom Properties (design tokens), 3 responsive breakpoints (desktop, tablet, mobile), and a print stylesheet that automatically expands all roles for CV printouts.

## How to Run

```bash
# Direct local opening:
open index.html

# Or with a static local server (for full Performance API metrics):
python3 -m http.server 8000
# → Open http://localhost:8000
```

## Project Structure

```
portfolio/
├── index.html      # Semantic HTML5 page with real CV content & disclosure
├── style.css       # Single raw stylesheet (design tokens, layout, print)
├── favicon.svg     # SVG monogram icon (also inlined in index.html head)
└── README.md       # Project documentation
```

## License

MIT
