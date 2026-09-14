export function initializeMetrics() {
  const widget = document.querySelector('.system-specs');
  const sidebar = document.querySelector('.header-bottom');
  const footer = document.querySelector('.site-footer');
  if (widget && sidebar && footer) {
    // Match the CSS rail breakpoint. Move the single instance so its measurements,
    // report listeners, and accessible reading order survive viewport changes.
    // Static HTML already places it before the footer for mobile and no-JS use.
    const desktop = window.matchMedia('(min-width: 64rem)');
    const placeWidget = () => {
      if (desktop.matches) sidebar.append(widget);
      else footer.before(widget);
    };
    placeWidget();
    desktop.addEventListener('change', placeWidget);
  }

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
  }

  // Snapshot initial load once; opening the optional report must not inflate page metrics.
  if (document.readyState === 'complete') measureInitialPage();
  else window.addEventListener('load', measureInitialPage, { once: true });
}
