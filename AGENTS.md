# Portfolio project guidance

## Product contract

- This is the faithful Astro migration of Donato Alvarez's existing bilingual CV-style portfolio.
- Preserve the six section IDs, CV facts, translations, existing links, and featured/expanded role grouping unless the user requests content changes.
- Content lives in `src/data/`; presentation lives in native `.astro` components. Prefer static HTML and small TypeScript modules for browser interactions.
- Preserve accessible landmarks, keyboard behavior, native disclosures/dialogs, light/dark modes, EN/ES switching, blocked-storage handling, and print behavior.
- Use the existing CSS custom properties in `src/styles/global.css`. The future redesign should reuse the content model.
- Technical and performance claims must match the current implementation and measured reports.

## Development and verification

- Use Node 24 and npm. Commit a consistent lockfile only when a commit is requested.
- `npm run dev`: loopback development server on port 4321. Astro manages it in the background; inspect with `npm run astro -- dev status` and stop with `npm run astro -- dev stop`.
- `npm run check`, `npm run format:check`, `npm run build` validate changes.
- `npm run preview`: production preview on port 4322. Use production preview for browser and performance verification.
- `npm run test:e2e`: desktop/mobile browser regression suite. Install Chromium with `npx playwright install chromium` if needed.
- The migration-content test references original commit `012e171df759f1d7649836577bfd4f2b3835218e`; meaningful CV edits require deliberately updating the content contract.
- `npm run audit` requires the production preview. It generates reports and audit metadata; rebuild afterward.

## MCP usage

- Use `astro-runtime` to inspect actual config, routes, server address, and module information rather than guessing about runtime behavior.
- Use `astro-docs` or Context7 for current Astro documentation, especially version-specific behavior.
- `npm run verify:mcp` checks real runtime and documentation tool calls.
- Validate project OpenCode configuration with `npm run check:config`. Do not copy credentials from global configuration into this repository.
- OpenCode loads configuration on startup. Tell the user to quit and restart it from this project after MCP configuration changes.

## Publishing

- Work on feature branches and deliver changes through PRs; production is `main` only. The original 2026 vanilla site is preserved on `archive/vanilla-portfolio-2026`.
- Do not push, merge, deploy, or change remote Pages settings unless explicitly requested.
- Preserve both the push-branch filter and job-level `main` conditions in the deployment workflow, including manual-dispatch protection.
- CI has no Pages-write permission or deployment job.
- The pre-migration Pages source was legacy `main` at `/`. The Astro release switches Pages Source to GitHub Actions, coordinated with merging to `main`; preserve the custom domain and HTTPS.
