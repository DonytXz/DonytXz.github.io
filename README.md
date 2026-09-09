# Zero-Dependency Vanilla Portfolio

> A hyper-optimized, text-first developer portfolio. No frameworks. No bundlers. No npm. Just HTML & CSS.

## Philosophy

This portfolio is a statement piece: it proves that mastery of web fundamentals produces results that no framework can match. Every line of code is intentional.

### Constraints

| Constraint | Value |
|---|---|
| **Frameworks** | 0 |
| **NPM Packages** | 0 |
| **External Requests** | 0 |
| **CSS Files** | 1 |
| **Build Step** | None |
| **Target Page Weight** | < 15KB |
| **Lighthouse Target** | 100 / 100 / 100 / 100 |

## How to Run

```bash
# That's it. Open the file.
open index.html
```

Or serve it locally:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Project Structure

```
portfolio/
├── index.html      # Single semantic HTML5 page
├── style.css       # Single raw CSS stylesheet
├── favicon.svg     # SVG favicon (also inlined in HTML)
└── README.md       # You are here
```

## Architecture Decisions

1. **System font stack** — `system-ui, -apple-system, 'Segoe UI'` eliminates font downloads entirely
2. **Inline SVG favicon** — embedded as a `data:` URI, zero additional HTTP requests
3. **CSS custom properties** — centralized design tokens without a preprocessor
4. **`content-visibility: auto`** — browser-native lazy rendering for below-fold sections
5. **Semantic HTML5** — proper landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`, `<section>`, `<article>`) for accessibility
6. **Skip-to-content link** — keyboard accessibility built in
7. **Print stylesheet** — graceful degradation for paper

## Performance

The "System Specs" widget in the header dynamically calculates the actual page transfer size and resource count using the Performance API — no external analytics needed.

## License

MIT
