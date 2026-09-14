# Portfolio redesign

## Sources and direction

- Primary: [Brittany Chiang](https://brittanychiang.com/).
- Secondary: [Samir Hassen's portfolio](https://github.com/shassen14/portfolio_website), inspected at `b5735bf62629fc55bc43b4726fb20ed39aa842dc`.
- Evidence: Firecrawl page/branding capture, browser-computed styles at desktop and tablet widths, and the secondary repository's menu, experience, and theme source.
- Approved direction: navy/teal, subtle transitions, compact sidebar performance metrics.
- Stack: native Astro components, CSS custom properties, small TypeScript enhancements.

## Reference screenshot

![Brittany Chiang desktop reference](./.firecrawl/brittany-desktop.png)

The screenshot is a local, git-ignored research artifact. The primary source URL above is the durable reference. Reference photography, personal copy, and brand assets are not portfolio assets.

## Design summary

A quiet, editorial portfolio: a sticky identity rail and a generous reading column. Strong name typography, restrained uppercase navigation, fine rules, and teal accents establish hierarchy. Experience has understated surfaces rather than heavy boxes. The published sections are About, Experience, and Contact, in natural document order. At the user's request, Projects is temporarily commented out and Skills/Education are removed from the page and navigation.

## Tokens

| Role                  | Light     | Dark      |
| --------------------- | --------- | --------- |
| Background            | `#faf7f0` | `#0f172a` |
| Headings              | `#0f172a` | `#e2e8f0` |
| Body / secondary text | `#475569` | `#94a3b8` |
| Accent                | `#0f766e` | `#5eead4` |
| Accent hover          | `#115e59` | `#99f6e4` |
| Border                | `#dbe4ec` | `#25334b` |

Dark background, heading, body, and teal values were confirmed in the primary reference's computed styles. Light colors and the following layout measures are adaptations for this portfolio, not extracted reference values.

- Use the existing system sans-serif stack; monospace only for small metadata.
- Name: fluid 40–56px, tight tracking and line-height. Body: 16px with 1.75 line-height.
- Outer shell: up to 1200px; desktop rail approximately 36%, reading column approximately 56%, separated by generous space.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Section spacing: 80–112px. Card padding: 20–24px. Small radius: 8px; controls: pill-shaped.
- At widths below 1024px, use one column. On short desktop screens the rail returns to normal flow so every utility remains reachable.

## Components and page patterns

- Identity: existing name and bilingual subtitle; one responsive set of preference controls.
- Navigation: three real hash links (About, Experience, Contact) with decorative line indicators and an enhanced current-section state.
- Social links: derive LinkedIn and GitHub destinations and labels from `src/data/contact.ts`; email remains in Contact.
- Metrics: “Under the hood” / “Tras bambalinas”, a compact desktop sidebar aside and a mobile block immediately before the footer. Move a single instance at the 1024px rail breakpoint; static/no-JS HTML places it before the footer. Retain actual measurements and dated report access.
- Experience: exact role/company/metadata/bullet text, three featured roles, five behind native `details`.
- Projects: import and render temporarily commented out in `src/pages/index.astro`; excluded from navigation. Existing component and content remain available for restoration.
- Skills and Education: removed from the published page and navigation.
- Footer: existing bilingual build statement, aligned with the reading column.
- Native audit dialog: lazy iframe, keyboard close, focus return, and no-JS report link.

## Interaction rules

- State transitions: approximately 160–200ms; no pointer-following glow.
- Hover and focus emphasize the target, without dimming readable sibling content.
- Keep all content visible before scripts initialize. Navigation remains native anchor navigation.
- Track heading positions, not a percentage of entire section visibility. Recalculate after scroll, resize, language changes, and disclosure toggles.
- Apply `aria-current="location"` to exactly one current navigation link after enhancement.
- Respect reduced motion. English/light are the static defaults, including with dark OS preferences or blocked storage. Preserve pre-paint restoration of explicitly saved preferences.
- Print as a single-column CV in the active language, including all eight roles; hide utilities and restore disclosure state afterward.

## Content contract and build instructions

1. Keep published anchors in order: `about`, `experience`, `contact`. Projects stays commented out; Skills and Education stay absent unless requested again.
2. Preserve authored content modules, translations, role grouping, and original destinations. Do not parse opaque experience metadata into inferred dates.
3. Keep published sections as direct children of `main`, the identity text hook, and role hooks for the historical content comparison. Tests deliberately exclude the user-removed sections and assert their absence.
4. Extend the existing CSS tokens rather than adding a second styling system.
5. Use local assets and system fonts. Refresh performance claims only from a new production-preview audit.
6. Verify EN/ES × light/dark, desktop/mobile/tablet, keyboard, direct hashes, long expanded sections, no-JS, blocked storage, reduced motion, and print.

## Rerun inputs

- workflow: `firecrawl-website-design-clone`
- source_url: `https://brittanychiang.com/`
- target_stack: `Astro`
- output: `DESIGN.md`
