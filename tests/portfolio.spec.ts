import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

// The immutable, pre-migration source protects the published CV copy. The user
// approved new project cards; Skills/Education remain removed from the page.
const original = execFileSync(
  'git',
  ['show', '012e171df759f1d7649836577bfd4f2b3835218e:index.html'],
  { encoding: 'utf8' },
);

test('preserves the published CV content in both languages', async ({
  page,
}) => {
  await page.goto('/');
  const comparison = await page.evaluate((source) => {
    const old = new DOMParser().parseFromString(source, 'text/html');
    const text = (element: Element, lang: string) => {
      const clone = element.cloneNode(true) as Element;
      clone
        .querySelectorAll(
          `[data-lang]:not([data-lang="${lang}"]), svg, noscript`,
        )
        .forEach((node) => node.remove());
      const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
      const parts: string[] = [];
      while (walker.nextNode())
        parts.push(walker.currentNode.textContent ?? '');
      return parts.join(' ').replace(/\s+/g, ' ').trim();
    };
    const selectors = [
      '.header-identity',
      '#experience',
      '#contact',
      '#about > div[data-lang="en"] > p:first-child',
      '#about > div[data-lang="es"] > p:first-child',
    ];
    return ['en', 'es'].flatMap((lang) =>
      selectors.map((selector) => ({
        label: `${lang}: ${selector}`,
        expected: text(old.querySelector(selector)!, lang),
        actual: text(document.querySelector(selector)!, lang),
      })),
    );
  }, original);
  for (const { label, actual, expected } of comparison)
    expect(actual, label).toBe(expected);
  expect(
    await page
      .locator('main > section')
      .evaluateAll((nodes) => nodes.map((node) => node.id)),
  ).toEqual(['about', 'experience', 'projects', 'contact']);
  await expect(page.locator('.role')).toHaveCount(8);
  await expect(page.locator('#skills, #education')).toHaveCount(0);
  await expect(page.locator('#projects .project')).toHaveCount(3);
});

for (const lang of ['en', 'es'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${lang}/${theme}: preferences persist and layout fits`, async ({
      page,
    }, testInfo) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
      await expect(page.locator('body')).toHaveCSS(
        'background-color',
        'rgb(250, 247, 240)',
      );
      if (lang === 'es') await page.locator('#lang-toggle').click();
      await page.locator('#theme-toggle').click();
      if (theme === 'light') await page.locator('#theme-toggle').click();
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
        theme,
      );
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('#theme-toggle')).toHaveAttribute(
        'aria-pressed',
        String(theme === 'dark'),
      );
      await expect(page.locator('body')).toHaveCSS(
        'background-color',
        theme === 'dark' ? 'rgb(15, 23, 42)' : 'rgb(250, 247, 240)',
      );
      for (const section of await page.locator('main > section').all())
        await section.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath(`${lang}-${theme}.png`),
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
}

test('keyboard skip link and native career disclosure work', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const summary = page.locator('summary');
  await expect(page.locator('.detailed-experience')).not.toBeVisible();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.detailed-experience')).toBeVisible();
  await expect(page.locator('.detailed-experience .role')).toHaveCount(5);
  await page.keyboard.press('Enter');
  await expect(page.locator('.detailed-experience')).not.toBeVisible();
});

for (const lang of ['en', 'es'] as const) {
  test(`${lang}: project dates, local screenshots, and destinations work`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#projects');
    await expect(
      page.locator('.site-nav [aria-current="location"]'),
    ).toHaveAttribute('href', '#projects');
    if (lang === 'es') {
      // The mobile language control is above the section; clicking it scrolls up.
      await page.locator('#lang-toggle').click();
      await page.locator('.site-nav a[href="#projects"]').click();
      await expect(
        page.locator('.site-nav [aria-current="location"]'),
      ).toHaveAttribute('href', '#projects');
    }
    const cards = page.locator('#projects .project');
    await expect(cards).toHaveCount(3);
    const expected = [
      {
        title: 'Trámites Digitales Guadalajara',
        employer: 'SONETASOT',
        href: 'https://tramitesdigitales.guadalajara.gob.mx/inicio',
      },
      {
        title: 'Espacios Escénicos Jalisco',
        employer: 'SONETASOT',
        href: 'https://espaciosescenicos.jalisco.gob.mx/',
      },
      {
        title: 'PBH Abogados',
        employer: 'Sharptech',
        href: 'https://app.pbhabogados.com/',
      },
    ];
    for (const [index, project] of expected.entries()) {
      const card = cards.nth(index);
      await expect(
        card.getByRole('heading', { name: project.title }),
      ).toBeVisible();
      await expect(card.locator('.project-meta')).toContainText(
        project.employer,
      );
      await expect(card.locator('.project-meta')).not.toContainText(
        /\b\d{4}\b/,
      );
      await expect(card.locator('.project-site')).toHaveAttribute(
        'href',
        project.href,
      );
      const image = card.getByRole('img');
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveCount(1);
      await expect(image).toHaveAttribute(
        'alt',
        index === 1
          ? /Espacios Escénicos/
          : lang === 'en'
            ? /homepage/
            : /Inicio/,
      );
      await expect(image).toHaveAttribute('loading', 'lazy');
      await expect(image).toHaveAttribute('srcset', /320w.*640w.*960w/);
      await expect
        .poll(() =>
          image.evaluate((node) => (node as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
      expect(
        new URL(
          await image.evaluate((node) => (node as HTMLImageElement).currentSrc),
        ).origin,
      ).toBe('http://127.0.0.1:4322');
      await card.screenshot({
        path: testInfo.outputPath(`project-${index}.png`),
      });
    }
    await expect(cards.first().locator('.project-tech')).toHaveText(
      'Angular · PHP · Laravel · PostgreSQL · REST APIs · Jest',
    );
    await expect(cards.nth(1).locator('figcaption:visible')).toContainText(
      lang === 'en'
        ? 'Archive screenshot from 2022'
        : 'Captura de archivo de 2022',
    );
    await expect(
      page.locator('#projects a[href*="web.archive.org"]'),
    ).toHaveCount(0);
    await expect(cards.nth(1).locator('.project-links a')).toHaveCount(1);
    await expect(page.locator('.project-screenshot')).toHaveCount(0);
    const trigger = cards.first().locator('.project-gallery-trigger:visible');
    await expect(trigger.locator('.project-image-count')).toHaveText(
      lang === 'en' ? '2 images' : '2 imágenes',
    );
    await trigger.focus();
    await page.keyboard.press('Enter');
    const gallery = page.getByRole('dialog', { name: expected[0].title });
    await expect(gallery).toBeVisible();
    await expect(gallery.locator('[data-gallery-close]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(gallery.locator('[data-gallery-previous]')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(gallery.locator('[data-gallery-next]')).toBeFocused();
    expect(
      await gallery.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.left >= 0 &&
          rect.right <= innerWidth &&
          rect.top >= 0 &&
          rect.bottom <= innerHeight
        );
      }),
    ).toBe(true);
    const galleryImage = gallery.locator('img');
    const firstSource = await galleryImage.getAttribute('src');
    await expect(gallery.locator('#gallery-position')).toHaveText(
      lang === 'en' ? 'Image 1 of 2' : 'Imagen 1 de 2',
    );
    await gallery.locator('[data-gallery-next]').click();
    await expect(galleryImage).not.toHaveAttribute('src', firstSource!);
    await expect(gallery.locator('figcaption')).toContainText('2022');
    await expect(gallery.locator('figcaption')).toContainText(
      lang === 'en' ? 'undergraduate thesis' : 'tesina',
    );
    await expect
      .poll(() =>
        galleryImage.evaluate(
          (node) => (node as HTMLImageElement).naturalWidth,
        ),
      )
      .toBeGreaterThan(0);
    await expect(gallery.locator('#gallery-position')).toHaveText(
      lang === 'en' ? 'Image 2 of 2' : 'Imagen 2 de 2',
    );
    await gallery.screenshot({ path: testInfo.outputPath('gallery.png') });
    await page.keyboard.press('ArrowRight');
    await expect(galleryImage).toHaveAttribute('src', firstSource!);
    await gallery.locator('[data-gallery-previous]').click();
    await expect(galleryImage).not.toHaveAttribute('src', firstSource!);
    await page.keyboard.press('ArrowLeft');
    await expect(galleryImage).toHaveAttribute('src', firstSource!);
    await page.keyboard.press('Escape');
    await expect(gallery).not.toBeVisible();
    await expect(trigger).toBeFocused();
    const single = cards.nth(2).locator('.project-gallery-trigger:visible');
    await expect(single.locator('.project-image-count')).toHaveCount(0);
    await single.click();
    const singleGallery = page.getByRole('dialog', { name: expected[2].title });
    await expect(singleGallery).toBeVisible();
    await expect(singleGallery.locator('.gallery-navigation')).toBeHidden();
    await singleGallery.locator('[data-gallery-close]').click();
    const moreLink = page.locator('.projects-more a');
    await expect(moreLink).toBeVisible();
    await expect(moreLink).toHaveAttribute('href', '/proyects');
    await expect(moreLink).toContainText(
      lang === 'en' ? 'View more' : 'Ver más',
    );
  });
}

test('projects grid page displays all 5 projects without dates and links back', async ({
  page,
}) => {
  await page.goto('/proyects');
  const cards = page.locator('.projects-grid .project');
  await expect(cards).toHaveCount(5);

  const expectedProjects = [
    {
      title: 'Trámites Digitales Guadalajara',
      href: 'https://tramitesdigitales.guadalajara.gob.mx/inicio',
    },
    {
      title: 'Espacios Escénicos Jalisco',
      href: 'https://espaciosescenicos.jalisco.gob.mx/',
    },
    {
      title: 'PBH Abogados',
      href: 'https://app.pbhabogados.com/',
    },
    {
      title: 'Pracofi',
      href: 'https://donatoalvarez.dev/pracofi/',
      repoHref: 'https://github.com/DonytXz/pracofi',
    },
    {
      title: 'NATOS',
      href: 'https://donatoalvarez.dev/NATOS/',
      repoHref: 'https://github.com/DonytXz/NATOS',
    },
  ];

  for (const [index, expected] of expectedProjects.entries()) {
    const card = cards.nth(index);
    await expect(
      card.getByRole('heading', { name: expected.title }),
    ).toBeVisible();
    await expect(card.locator('.project-site')).toHaveAttribute(
      'href',
      expected.href,
    );
    await expect(card.locator('.project-meta')).not.toContainText(/\b\d{4}\b/);
    if ('repoHref' in expected && expected.repoHref) {
      await expect(card.locator('.project-repo')).toHaveAttribute(
        'href',
        expected.repoHref,
      );
    }
  }

  // Spot 4: Pracofi has both website and GitHub links
  await expect(cards.nth(3).locator('.project-site')).toHaveAttribute(
    'href',
    'https://donatoalvarez.dev/pracofi/',
  );
  await expect(cards.nth(3).locator('.project-repo')).toHaveAttribute(
    'href',
    'https://github.com/DonytXz/pracofi',
  );
  // Spot 5: NATOS has both website and GitHub links
  await expect(cards.nth(4).locator('.project-site')).toHaveAttribute(
    'href',
    'https://donatoalvarez.dev/NATOS/',
  );
  await expect(cards.nth(4).locator('.project-repo')).toHaveAttribute(
    'href',
    'https://github.com/DonytXz/NATOS',
  );

  // Back link returns to home page
  const backLink = page.locator('.back-link');
  await expect(backLink).toBeVisible();
  await backLink.click();
  await expect(page).toHaveURL(/\/$/);
});

test('/projects route also loads the projects page', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.projects-grid .project')).toHaveCount(5);
});

test('report loads on demand, closes with Escape, and leaves initial metrics stable', async ({
  page,
}) => {
  const reports: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('lighthouse-report'))
      reports.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('#request-count')).not.toHaveText('—');
  const initial = await page.locator('#request-count').innerText();
  expect(reports).toHaveLength(0);
  const reportResponse = page.waitForResponse((response) =>
    response.url().endsWith('/lighthouse-report.report.html'),
  );
  await page.locator('#open-audit-btn').click();
  expect((await reportResponse).status()).toBe(200);
  await expect(page.locator('#lighthouse-dialog')).toBeVisible();
  await expect.poll(() => reports.length).toBe(1);
  await page.locator('#close-audit-btn').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#lighthouse-dialog')).not.toBeVisible();
  await expect(page.locator('#open-audit-btn')).toBeFocused();
  await page.locator('#lang-toggle').click();
  await expect(page.locator('#request-count')).toHaveText(initial);
  await page.locator('#open-audit-btn').click();
  await page.locator('#close-audit-btn').click();
  await expect(page.locator('#lighthouse-dialog')).not.toBeVisible();
  expect(reports).toHaveLength(1);
});

test('preferences work when browser storage is blocked', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#theme-toggle')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(errors).toEqual([]);
});

test('core CV and disclosure work without JavaScript', async ({
  browser,
  viewport,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    viewport,
  });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4322/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(250, 247, 240)',
    );
    await expect(page.locator('h1')).toHaveText('Donato Alvarez');
    await expect(page.locator('.nav-controls')).not.toBeVisible();
    await expect(page.locator('.reading-column > .system-specs')).toHaveCount(
      1,
    );
    await page.locator('summary').click();
    await expect(page.locator('.detailed-experience')).toBeVisible();
    await expect(
      page.locator('#contact a[href="mailto:me@donatoalvarez.dev"]'),
    ).toBeVisible();
    await page.locator('.site-nav a[href="#contact"]').click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact-heading')).toBeInViewport();
    await expect(page.locator('.site-nav [aria-current]')).toHaveCount(0);
    await page.locator('.site-nav a[href="#projects"]').click();
    await expect(page.locator('#projects-heading')).toBeInViewport();
    await expect(page.locator('.project-site')).toHaveCount(3);
    await expect(
      page.locator('.project').first().locator('img:visible'),
    ).toBeVisible();
    await page.locator('.project-gallery-trigger:visible').first().click();
    await expect(page).toHaveURL(/\.png$/);
    await expect
      .poll(() =>
        page
          .locator('img')
          .evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  } finally {
    await context.close();
  }
});

for (const lang of ['en', 'es'] as const) {
  test(`${lang}: printing exposes the full CV and restores disclosure state`, async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    if (lang === 'es') await page.locator('#lang-toggle').click();
    await page.locator('#theme-toggle').click();
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(255, 255, 255)',
    );
    await expect(page.locator('.site-nav')).not.toBeVisible();
    await expect(page.locator('.nav-controls')).not.toBeVisible();
    await expect(page.locator('.header-bottom')).not.toBeVisible();
    await expect(page.locator('.system-specs')).not.toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('.project-figure:visible')).toHaveCount(0);
    await expect(page.locator('.project-gallery:visible')).toHaveCount(0);
    await expect(page.locator('.project-site:visible')).toHaveCount(3);
    expect(
      await page
        .locator('.project-site')
        .first()
        .evaluate((link) => getComputedStyle(link, '::after').content),
    ).toContain('https://tramitesdigitales.guadalajara.gob.mx/inicio');
    await expect(
      page.locator('.detailed-experience .role').last(),
    ).toBeVisible();
    await page.pdf({ path: testInfo.outputPath('cv.pdf'), format: 'A4' });
    await page.emulateMedia({ media: 'screen' });
    await expect(page.locator('.experience-expand')).not.toHaveAttribute(
      'open',
      '',
    );
    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(15, 23, 42)',
    );
    await page.locator('summary').click();
    await page.pdf();
    await expect(page.locator('.experience-expand')).toHaveAttribute(
      'open',
      '',
    );
  });
}

test('published navigation and contact destinations are preserved', async ({
  page,
}) => {
  await page.goto('/');
  const comparison = await page.evaluate((source) => {
    const old = new DOMParser().parseFromString(source, 'text/html');
    const publishedAnchors = ['#about', '#experience', '#projects', '#contact'];
    return ['.site-nav a', '#contact a'].map((selector) => ({
      selector,
      expected: Array.from(old.querySelectorAll(selector), (link) =>
        link.getAttribute('href'),
      ).filter(
        (href) =>
          selector !== '.site-nav a' || publishedAnchors.includes(href ?? ''),
      ),
      actual: Array.from(document.querySelectorAll(selector), (link) =>
        link.getAttribute('href'),
      ),
    }));
  }, original);
  for (const { selector, actual, expected } of comparison)
    expect(actual, selector).toEqual(expected);
});

test('active navigation handles direct hashes, long translated sections, and history', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#experience');
  const active = page.locator('.site-nav [aria-current="location"]');
  await expect(active).toHaveAttribute('href', '#experience');
  await page.locator('summary').click();
  await page.locator('#lang-toggle').click();
  await page.locator('.site-nav a[href="#experience"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await page.evaluate(() => {
    const section = document.getElementById('experience')!;
    scrollTo(0, scrollY + section.getBoundingClientRect().top + innerHeight);
  });
  await expect(active).toHaveAttribute('href', '#experience');
  await page.locator('summary').click();
  for (const id of ['about', 'experience', 'projects', 'contact']) {
    await page.locator(`.site-nav a[href="#${id}"]`).click();
    await expect(active).toHaveAttribute('href', `#${id}`);
    await expect(active).toHaveCount(1);
    await expect(page.locator(`#${id}-heading`)).toBeInViewport();
  }
  await page.goBack();
  await expect(page).toHaveURL(/#projects$/);
  await expect(active).toHaveAttribute('href', '#projects');
  await page.reload();
  await expect(active).toHaveAttribute('href', '#projects');
});

test('Spanish layouts fit narrow, tablet, and short desktop screens', async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('.social-links a:visible')).toHaveCount(3);
  await expect(page.locator('.social-links a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('#contact a[href^="mailto:"]')).toHaveCount(1);
  await expect(page.locator('.system-specs strong')).toHaveText(
    /^tras bambalinas$/i,
    { useInnerText: true },
  );
  const initialRequests = await page.locator('#request-count').innerText();
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 768, height: 1024 },
    { width: 1024, height: 700 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => scrollTo(0, 0));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('#lang-toggle')).toHaveCount(1);
    await expect(page.locator('#theme-toggle')).toHaveCount(1);
    await expect(page.locator('#lang-toggle')).toBeInViewport();
    await expect(page.locator('#theme-toggle')).toBeInViewport();
    await expect(page.locator('.site-header')).toHaveCSS(
      'position',
      viewport.width === 1440 ? 'sticky' : 'static',
    );
    await expect(page.locator('.system-specs')).toHaveCount(1);
    await expect(page.locator('#open-audit-btn')).toHaveCount(1);
    await expect(page.locator('#request-count')).toHaveText(initialRequests);
    if (viewport.width < 1024) {
      await expect
        .poll(() =>
          page.locator('.system-specs').evaluate((widget) => {
            const rect = widget.getBoundingClientRect();
            const main = document
              .querySelector('main')!
              .getBoundingClientRect();
            const footer = document
              .querySelector('.site-footer')!
              .getBoundingClientRect();
            return rect.top >= main.bottom && rect.bottom <= footer.top;
          }),
        )
        .toBe(true);
    } else {
      await expect(page.locator('.site-header .system-specs')).toHaveCount(1);
    }
    await page.screenshot({
      path: testInfo.outputPath(`es-dark-${viewport.width}.png`),
      fullPage: true,
    });
  }
  await page.evaluate(() => scrollTo(0, 1500));
  await expect(page.locator('#theme-toggle')).toBeInViewport();
  await expect(page.locator('#open-audit-btn')).toBeInViewport();
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await expect(page.locator('.nav-indicator').first()).toHaveCSS(
    'transition-duration',
    '0s',
  );
  // Crossing back to mobile preserves the existing report listener and focus return.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.reading-column > .system-specs')).toHaveCount(1);
  await page.locator('#open-audit-btn').click();
  await expect(page.locator('#lighthouse-dialog')).toBeVisible();
  await page.locator('#close-audit-btn').click();
  await expect(page.locator('#open-audit-btn')).toBeFocused();
  await expect(page.locator('#request-count')).toHaveText(initialRequests);
});

test('production assets are local, error-free, and MCP is dev-only', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4322')
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('#request-count')).toHaveText(/\d+ \(0 ext\)/);
  // Exercise lazy screenshot requests as well as the initial page assets.
  for (const img of await page.locator('.project img:visible').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate((node) => (node as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  await expect(page.locator('#page-size')).toHaveText(/\d+\.\d+KB/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://donatoalvarez.dev/',
  );
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
  expect((await request.get('/__mcp/sse')).status()).toBe(404);
  expect((await request.get('/CNAME')).status()).toBe(200);
  expect((await request.get('/favicon.svg')).status()).toBe(200);
});

test('social links include LinkedIn, GitHub, and language-aligned CV', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.social-links a:visible')).toHaveCount(3);
  await expect(
    page
      .locator('.social-links a:visible')
      .evaluateAll((links) =>
        links.map((l) => (l as HTMLElement).innerText.trim()),
      ),
  ).resolves.toEqual(['LinkedIn', 'CV', 'GitHub']);
  const cvEn = page.locator('.social-links [data-lang="en"] a');
  const cvEs = page.locator('.social-links [data-lang="es"] a');
  await expect(cvEn).toBeVisible();
  await expect(cvEs).not.toBeVisible();
  await expect(cvEn).toHaveAttribute(
    'href',
    'https://drive.google.com/file/d/1SRp4-2t0IhTNaXhjRZsta13z31zSUGr_/view?usp=sharing',
  );
  await expect(cvEn).toHaveAttribute('target', '_blank');
  await expect(cvEn).toHaveAttribute('rel', 'noopener noreferrer');

  // Switch to Spanish
  await page.locator('#lang-toggle').click();
  await expect(page.locator('.social-links a:visible')).toHaveCount(3);
  await expect(
    page
      .locator('.social-links a:visible')
      .evaluateAll((links) =>
        links.map((l) => (l as HTMLElement).innerText.trim()),
      ),
  ).resolves.toEqual(['LinkedIn', 'CV', 'GitHub']);
  await expect(cvEn).not.toBeVisible();
  await expect(cvEs).toBeVisible();
  await expect(cvEs).toHaveAttribute(
    'href',
    'https://drive.google.com/file/d/19RqPzVqYeVGDIDOHLwEoAZ-DIE1VL3wd/view?usp=sharing',
  );
  await expect(cvEs).toHaveAttribute('target', '_blank');
  await expect(cvEs).toHaveAttribute('rel', 'noopener noreferrer');

  // Switch back to English
  await page.locator('#lang-toggle').click();
  await expect(cvEn).toBeVisible();
  await expect(cvEs).not.toBeVisible();
});

test('header badges section is rendered with local images and Credly links', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.locator('.header-badges-heading [data-lang="en"]'),
  ).toHaveText('Badges');
  await expect(
    page.locator('.header-badges-heading [data-lang="es"]'),
  ).toHaveText('Insignias');
  const badgeLinks = page.locator('.header-badges .badge-link');
  await expect(badgeLinks).toHaveCount(9);
  for (const link of await badgeLinks.all()) {
    await expect(link).toHaveAttribute(
      'href',
      /^https:\/\/www\.credly\.com\/badges\//,
    );
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    const img = link.locator('img');
    await expect(img).toHaveAttribute('src', /^\/badges\/[a-f0-9-]+\.png$/);
    const naturalWidth = await img.evaluate(
      (el: HTMLImageElement) => el.naturalWidth,
    );
    expect(naturalWidth).toBeGreaterThan(0);
  }
});
