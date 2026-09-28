interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export function initializeProjectGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('#project-gallery');
  const image = document.querySelector<HTMLImageElement>('#gallery-image');
  const title = document.querySelector('#gallery-title');
  const caption = document.querySelector('#gallery-caption');
  const position = document.querySelector('#gallery-position');
  const navigation = document.querySelector<HTMLElement>('.gallery-navigation');
  if (
    !dialog ||
    !image ||
    !title ||
    !caption ||
    !position ||
    !navigation ||
    typeof dialog.showModal !== 'function'
  )
    return;

  let images: GalleryImage[] = [];
  let index = 0;
  let opener: HTMLAnchorElement | null = null;

  function showImage(next: number) {
    index = (next + images.length) % images.length;
    const current = images[index];
    if (!current || !image || !caption || !position) return;
    image.alt = current.alt;
    image.width = current.width;
    image.height = current.height;
    image.src = current.src;
    caption.textContent = current.caption;
    position.textContent =
      document.documentElement.lang === 'es'
        ? `Imagen ${index + 1} de ${images.length}`
        : `Image ${index + 1} of ${images.length}`;
  }

  document
    .querySelectorAll<HTMLAnchorElement>('.project-gallery-trigger')
    .forEach((trigger) => {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', 'project-gallery');
      trigger.addEventListener('click', (event) => {
        // Keep ordinary link behavior for modified clicks and without JavaScript.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        images = JSON.parse(
          trigger.dataset.galleryImages ?? '[]',
        ) as GalleryImage[];
        if (!images.length) return;
        opener = trigger;
        title.textContent = trigger.dataset.galleryTitle ?? '';
        navigation.hidden = images.length < 2;
        showImage(0);
        dialog.showModal();
      });
    });

  dialog
    .querySelector('[data-gallery-close]')
    ?.addEventListener('click', () => dialog.close());
  dialog
    .querySelector('[data-gallery-previous]')
    ?.addEventListener('click', () => showImage(index - 1));
  dialog
    .querySelector('[data-gallery-next]')
    ?.addEventListener('click', () => showImage(index + 1));
  dialog.addEventListener('keydown', (event) => {
    if (images.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key))
      return;
    event.preventDefault();
    showImage(index + (event.key === 'ArrowRight' ? 1 : -1));
  });
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
  dialog.addEventListener('close', () =>
    opener?.focus({ preventScroll: true }),
  );
  window.addEventListener('beforeprint', () => {
    if (dialog.open) dialog.close();
  });
}
