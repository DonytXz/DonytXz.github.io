export function initializeMetrics() {
  function measureInitialPage() {
    const navigation = performance.getEntriesByType('navigation')[0] as
      PerformanceNavigationTiming | undefined;
    const resources = (
      performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    ).filter(({ name }) =>
      ['http:', 'https:'].includes(new URL(name).protocol),
    );
    const external = resources.filter(
      ({ name }) => new URL(name).origin !== location.origin,
    ).length;
    // Decoded response-body bytes, not compressed transfer sizes. Never substitute guessed bytes.
    const sizeKnown =
      !!navigation?.decodedBodySize &&
      resources.every((resource) => resource.decodedBodySize > 0);
    const bytes =
      (navigation?.decodedBodySize ?? 0) +
      resources.reduce(
        (total, resource) => total + resource.decodedBodySize,
        0,
      );
    const size = document.querySelector<HTMLElement>('#page-size');
    if (size) {
      size.textContent = sizeKnown ? `${(bytes / 1024).toFixed(1)}KB` : '—';
      size.title = sizeKnown
        ? 'Initial document and resources: decoded response-body bytes'
        : 'Response sizes are unavailable in this browser';
    }
    const requests = document.querySelector('#request-count');
    if (requests)
      requests.textContent = `${resources.length + 1} (${external} ext)`;
    const symbol = document.querySelector('#ext-requests-symbol');
    if (symbol) symbol.textContent = external === 0 ? '✓' : '×';
    const en = document.querySelector('#ext-requests-note [data-lang="en"]');
    const es = document.querySelector('#ext-requests-note [data-lang="es"]');
    if (en) en.textContent = `${external} external requests`;
    if (es) es.textContent = `${external} solicitudes externas`;
  }

  // Snapshot initial load once; opening the optional report must not inflate page metrics.
  if (document.readyState === 'complete') measureInitialPage();
  else window.addEventListener('load', measureInitialPage, { once: true });
}
