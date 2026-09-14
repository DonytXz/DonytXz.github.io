import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

// The immutable, pre-migration source protects the published CV copy. The user
// disabled Projects and removed Skills/Education from the page in September 2026.
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
  ).toEqual(['about', 'experience', 'contact']);
  await expect(page.locator('.role')).toHaveCount(8);
  await expect(
    page.locator('#projects, #skills, #education, .project'),
  ).toHaveCount(0);
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
  await expect(page.locator('dialog')).toBeVisible();
  await expect.poll(() => reports.length).toBe(1);
  await page.locator('#close-audit-btn').focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.locator('#open-audit-btn')).toBeFocused();
  await page.locator('#lang-toggle').click();
  await expect(page.locator('#request-count')).toHaveText(initial);
  await page.locator('#open-audit-btn').click();
  await page.locator('#close-audit-btn').click();
  await expect(page.locator('dialog')).not.toBeVisible();
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
    const publishedAnchors = ['#about', '#experience', '#contact'];
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
  for (const id of ['about', 'experience', 'contact']) {
    await page.locator(`.site-nav a[href="#${id}"]`).click();
    await expect(active).toHaveAttribute('href', `#${id}`);
    await expect(active).toHaveCount(1);
    await expect(page.locator(`#${id}-heading`)).toBeInViewport();
  }
  await page.goBack();
  await expect(page).toHaveURL(/#experience$/);
  await expect(active).toHaveAttribute('href', '#experience');
  await page.reload();
  await expect(active).toHaveAttribute('href', '#experience');
});

test('Spanish layouts fit narrow, tablet, and short desktop screens', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('.social-links a')).toHaveCount(2);
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
  await expect(page.locator('dialog')).toBeVisible();
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
