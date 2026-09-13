import { initializePreferences } from './preferences';
import { initializeMetrics } from './metrics';
import { initializeAuditDialog } from './dialog';

initializePreferences();
initializeMetrics();
initializeAuditDialog();

// Older browsers need a script fallback to print closed native disclosures.
const openedForPrint = new Set<HTMLDetailsElement>();
window.addEventListener('beforeprint', () => {
  document
    .querySelectorAll<HTMLDetailsElement>('.experience-expand:not([open])')
    .forEach((details) => {
      openedForPrint.add(details);
      details.open = true;
    });
});
window.addEventListener('afterprint', () => {
  openedForPrint.forEach((details) => {
    details.open = false;
  });
  openedForPrint.clear();
});
