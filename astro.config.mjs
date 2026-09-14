import { defineConfig } from 'astro/config';
import mcp from 'astro-mcp';

export default defineConfig({
  site: 'https://donatoalvarez.dev',
  output: 'static',
  // Preserve spaces between the original portfolio's inline elements in Astro 7.
  compressHTML: true,
  // This portfolio has no Markdown code blocks requiring inline highlight styles.
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      scriptDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'none'", kind: 'attribute' },
        ],
      },
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "frame-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self'",
      ],
    },
  },
  integrations: [mcp()],
  server: { host: '127.0.0.1', port: 4321 },
  vite: { server: { strictPort: true } },
});
