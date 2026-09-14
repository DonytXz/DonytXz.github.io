// Emitted before paint and hashed at build time by BaseLayout.astro.
// Light is the default; only an explicitly saved preference overrides it.
document.documentElement.dataset.js = 'true';
try {
  if (localStorage.getItem('theme') === 'dark')
    document.documentElement.dataset.theme = 'dark';
  if (localStorage.getItem('lang') === 'es')
    document.documentElement.lang = 'es';
} catch {
  /* English and light mode remain usable without storage. */
}
