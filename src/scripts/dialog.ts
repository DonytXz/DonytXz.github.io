export function initializeAuditDialog() {
  const dialog =
    document.querySelector<HTMLDialogElement>('#lighthouse-dialog');
  const iframe = document.querySelector<HTMLIFrameElement>('#audit-iframe');
  const open = document.querySelector<HTMLButtonElement>('#open-audit-btn');
  const close = document.querySelector<HTMLButtonElement>('#close-audit-btn');
  if (!dialog || !open) return;

  open.addEventListener('click', () => {
    if (typeof dialog.showModal !== 'function') {
      window.open(
        '/lighthouse-report.report.html',
        '_blank',
        'noopener,noreferrer',
      );
      return;
    }
    if (iframe && !iframe.hasAttribute('src'))
      iframe.src = '/lighthouse-report.report.html';
    dialog.showModal();
  });
  close?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (
      event.clientX < left ||
      event.clientX > right ||
      event.clientY < top ||
      event.clientY > bottom
    )
      dialog.close();
  });
}
