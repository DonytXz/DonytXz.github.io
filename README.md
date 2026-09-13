# Donato Alvarez — Astro Portfolio

A bilingual, text-first software engineering portfolio built with Astro and strict TypeScript. Astro produces static HTML, optimized CSS, and a small browser script for preferences, performance metrics, printing, and the audit dialog.

## Migration baseline

This baseline preserves the structure and CV content of [donatoalvarez.dev](https://donatoalvarez.dev/) at original revision `012e171df759f1d7649836577bfd4f2b3835218e`:

- About, Experience, Projects, Skills, Education, and Contact anchors.
- Three featured roles and five additional roles in a native disclosure.
- English/Spanish switching, light/dark themes, and persisted preferences.
- Original system fonts, design tokens, responsive layout, and CV printing.
- Initial-load performance metrics and an on-demand Lighthouse report.

The About text, self-referential project, metadata, and footer describe the Astro implementation. The original vanilla site is preserved on [`archive/vanilla-portfolio-2026`](https://github.com/DonytXz/DonytXz.github.io/tree/archive/vanilla-portfolio-2026) at the original revision above. The earlier CRA portfolio remains on `archive/cra-portfolio-2021`. Content is separate from presentation to support the next redesign phase.

## Local development

Use Node 24 (the framework requires Node >=22.12.0) and npm.

```sh
npm ci
npm run dev
```

Development: **http://127.0.0.1:4321/**. The port is fixed for the MCP connection; an occupied port fails instead of silently selecting a different one.

Astro 7 manages development and preview servers in the background. Use these commands to inspect or stop them:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run astro -- preview status
npm run astro -- preview stop
```

## Production preview and checks

```sh
npm run format:check
npm run check
npm run build
npm run preview
```

Production preview: **http://127.0.0.1:4322/**. Build output is `dist/`. Measure production output rather than the development server, which includes HMR, development modules, and MCP tooling.

```sh
npx playwright install chromium
npm run test:e2e
```

The browser suite checks original CV content, desktop/mobile language/theme combinations, persistence, blocked storage, no-JavaScript behavior, keyboard navigation, disclosures, printing, lazy report loading, and local production assets. Screenshots and PDFs are saved to ignored `test-results/`; the browser report is in `playwright-report/`.

The migration-content test reads the immutable original commit with `git show`. CI fetches full history for this reason. If intentionally updating CV content later, update that test's baseline alongside the content change.

## Astro MCP in OpenCode

Project-local `opencode.json` enables:

| Server          | Endpoint                           | Purpose                                                                                   |
| --------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `astro-runtime` | `http://127.0.0.1:4321/__mcp/sse`  | Runtime configuration, routes, server address, Vite modules, integrations, and changelogs |
| `astro-docs`    | `https://mcp.docs.astro.build/mcp` | Official Astro documentation search                                                       |

`astro-runtime` overrides the disabled global entry for this repository. It is provided by the community `astro-mcp` integration, whose server hooks run only during development. Its current transport is legacy SSE; the official documentation server uses Streamable HTTP.

1. Run `npm run dev` from this repository.
2. **Quit and restart OpenCode from this repository directory** so it loads the project configuration.
3. Use the `astro-runtime` tools to inspect the running project and `astro-docs` for framework guidance.

```sh
npm run check:config
npm run verify:mcp
```

`check:config` validates against the published OpenCode schema and requires network access. `verify:mcp` performs real MCP handshakes, validates the site's configuration and route, checks port 4321, and queries the official documentation tool. The runtime check requires the dev server to be running. The verification script does not enable tools in an already-open OpenCode session; restart is still required.

## GitHub Pages and release behavior

**The migration is delivered through an `astro-migration` pull request. Production publishing is main-only through GitHub Actions.**

GitHub's authenticated Pages API was inspected during migration setup. It reported:

```json
{
  "build_type": "legacy",
  "source": { "branch": "main", "path": "/" },
  "cname": "donatoalvarez.dev",
  "https_enforced": true
}
```

The latest three pre-migration Pages deployments also referenced `main`. The Astro release switches the publishing source from this original branch-based setting to GitHub Actions while retaining the custom domain and HTTPS.

- `.github/workflows/ci.yml` checks `main`, `astro-migration`, and pull requests to `main`. It has read-only repository permission and no deployment job.
- `.github/workflows/deploy.yml` triggers on pushes to **main** or manual dispatch. **Both build and deploy jobs additionally require `github.ref == 'refs/heads/main'` and the original repository.** A manual dispatch on `astro-migration` skips both jobs.
- Only the deployment job receives Pages-write and OIDC permissions.

### Release procedure

The original site published raw files from `main`. Astro requires a build, so the migration release follows these steps:

1. In **Settings → Pages → Build and deployment**, switch Source to **GitHub Actions**.
2. Merge the reviewed Astro changes into `main`.
3. Verify the main-branch deployment and the custom domain. Optionally restrict the `github-pages` environment to `main` as an additional repository-level rule.

The deployment configuration uses `site: 'https://donatoalvarez.dev'`, root-level URLs, and `public/CNAME`. Keep the custom domain when changing the publishing source.

## Lighthouse reports

With a fresh production build and the preview server running:

```sh
npm run audit
npm run build
```

The audit uses Playwright-managed Chromium, writes `public/lighthouse-report.report.html` and `.json`, and derives `src/data/audit.json` from the measured result. Rebuilding includes these generated assets and metadata in the static output.

The report is explicitly labeled as a **production-preview audit**, with its audited URL and date. It does not claim to measure the deployed domain. The widget displays the measured performance score; the full report contains all categories. Re-run after meaningful changes and audit the deployed site after release.

The page-weight widget reports decoded response-body bytes for the initial document and resources, not compressed transfer sizes. It shows `—` if timing data is unavailable. Opening the optional report does not change the initial-load snapshot.

## Structure

```text
src/pages/index.astro          Single portfolio route
src/layouts/BaseLayout.astro   Metadata, document shell, preference initialization
src/components/               Header, footer, controls, reusable markup
src/components/sections/      The six portfolio sections
src/data/                     Typed bilingual content and audit metadata
src/scripts/                  Small browser behavior modules
src/styles/global.css         Original design tokens, layout, print, accessibility
public/                       Domain, favicon, generated audit reports
scripts/                      Config/MCP verification and Lighthouse runner
tests/                        Production browser checks
.github/workflows/            Read-only CI and main-only deployment
```

## References

- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Astro 7 behavior changes](https://docs.astro.build/en/guides/upgrade-to/v7/)
- [Community runtime MCP](https://github.com/morinokami/astro-mcp)
- [Official Astro Docs MCP](https://github.com/withastro/docs-mcp)
