/** Enhance real hash links without taking over scrolling, focus, or history. */
export function initializeNavigation() {
  const main = document.querySelector('main');
  const entries = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.site-nav .section-link'),
  ).flatMap((link) => {
    const section = document.getElementById(link.hash.slice(1));
    const heading = section?.querySelector('h2');
    return heading ? [{ link, heading }] : [];
  });
  if (!main || !entries.length) return;

  let frame = 0;
  let current: HTMLAnchorElement | undefined;

  function update() {
    frame = 0;
    // Whole-section visibility thresholds fail for a long, expanded career.
    const readingLine = Math.min(160, window.innerHeight * 0.22);
    let active = entries[0].link;
    for (const { link, heading } of entries) {
      if (heading.getBoundingClientRect().top <= readingLine) active = link;
    }
    // Short final sections cannot always reach the reading line.
    if (
      window.scrollY > 0 &&
      window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
    ) {
      active = entries[entries.length - 1].link;
    }
    if (active === current) return;
    current?.removeAttribute('aria-current');
    active.setAttribute('aria-current', 'location');
    current = active;
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', schedule);
  main.addEventListener('toggle', schedule, { capture: true });

  // Language changes affect both text height and the mobile header's position.
  new MutationObserver(schedule).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang', 'data-theme'],
  });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(main);
    const header = document.querySelector('.site-header');
    if (header) observer.observe(header);
  }
  schedule();
}
