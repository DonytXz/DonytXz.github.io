export function initializePreferences() {
  const root = document.documentElement;
  const languageButton =
    document.querySelector<HTMLButtonElement>('#lang-toggle');
  const themeButton =
    document.querySelector<HTMLButtonElement>('#theme-toggle');

  function persist(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Preferences still work for this visit. */
    }
  }

  function updateLabels() {
    const spanish = root.lang === 'es';
    const dark = root.dataset.theme === 'dark';
    if (themeButton) {
      const label = dark
        ? spanish
          ? 'Cambiar a modo claro'
          : 'Switch to light mode'
        : spanish
          ? 'Cambiar a modo oscuro'
          : 'Switch to dark mode';
      themeButton.setAttribute('aria-label', label);
      themeButton.title = label;
      themeButton.setAttribute('aria-pressed', String(dark));
      themeButton.textContent = dark ? '[ ☀ Light ]' : '[ ◐ Dark ]';
    }
    if (languageButton) {
      const label = spanish
        ? 'Switch language to English (United States)'
        : 'Cambiar idioma a Español (México)';
      languageButton.setAttribute('aria-label', label);
      languageButton.title = label;
    }
    document
      .querySelector('.site-nav')
      ?.setAttribute(
        'aria-label',
        spanish ? 'Navegación principal' : 'Main navigation',
      );
    document
      .querySelector('.system-specs')
      ?.setAttribute(
        'aria-label',
        spanish
          ? 'Métricas de rendimiento de la página'
          : 'Page performance metrics',
      );
    document
      .querySelector('#close-audit-btn')
      ?.setAttribute(
        'aria-label',
        spanish ? 'Cerrar reporte de auditoría' : 'Close audit report',
      );
    document
      .querySelector('#audit-iframe')
      ?.setAttribute(
        'title',
        spanish
          ? 'Reporte de auditoría de Google Lighthouse'
          : 'Google Lighthouse Audit Report',
      );
  }

  languageButton?.addEventListener('click', () => {
    root.lang = root.lang === 'es' ? 'en' : 'es';
    persist('lang', root.lang);
    updateLabels();
  });
  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'dark') root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    persist('theme', nextTheme);
    updateLabels();
  });
  updateLabels();
}
