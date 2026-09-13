import { defineConfig } from 'astro/config';
import mcp from 'astro-mcp';

export default defineConfig({
  site: 'https://donatoalvarez.dev',
  output: 'static',
  // Preserve spaces between the original portfolio's inline elements in Astro 7.
  compressHTML: true,
  integrations: [mcp()],
  server: { host: '127.0.0.1', port: 4321 },
  vite: { server: { strictPort: true } },
});
