import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';

// The immutable, pre-migration source is the content contract for this baseline.
const original = execFileSync(
  'git',
  ['show', '012e171df759f1d7649836577bfd4f2b3835218e:index.html'],
  { encoding: 'utf8' },
);

test('preserves the original CV content in both languages', async ({
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
      '#skills',
      '#education',
      '#contact',
      '#about > div[data-lang="en"] > p:first-child',
      '#about > div[data-lang="es"] > p:first-child',
      '#projects .project:nth-of-type(1)',
      '#projects .project:nth-of-type(2)',
      '#projects .project:nth-of-type(3)',
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
  ).toEqual([
    'about',
    'experience',
    'projects',
    'skills',
    'education',
    'contact',
  ]);
  await expect(page.locator('.role')).toHaveCount(8);
  await expect(page.locator('.project')).toHaveCount(4);
});

for (const lang of ['en', 'es'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${lang}/${theme}: preferences persist and layout fits`, async ({
      page,
    }, testInfo) => {
      await page.goto('/');
      if (lang === 'es') await page.locator('#lang-toggle').click();
      if (theme === 'dark') await page.locator('#theme-toggle').click();
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('#theme-toggle')).toHaveAttribute(
        'aria-pressed',
        String(theme === 'dark'),
      );
      await expect(page.locator('body')).toHaveCSS(
        'background-color',
        theme === 'dark' ? 'rgb(15, 23, 42)' : 'rgb(248, 250, 252)',
      );
      for (const section of await page.locator('main > section').all())
        await section.scrollIntoViewIfNeeded();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      // Force offscreen painting only for the screenshot; preserve the production optimization.
      await page.addStyleTag({
        content: '.content section { content-visibility: visible !important; }',
      });
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
  await page.goto('/');
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('#theme-toggle')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(errors).toEqual([]);
});

test('core CV and disclosure work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4322/');
    await expect(page.locator('h1')).toHaveText('Donato Alvarez');
    await expect(page.locator('.nav-controls')).not.toBeVisible();
    await page.locator('summary').click();
    await expect(page.locator('.detailed-experience')).toBeVisible();
    await expect(
      page.locator('a[href="mailto:me@donatoalvarez.dev"]'),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test('printing exposes the full CV and restores disclosure state', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await page.locator('#theme-toggle').click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
  await expect(page.locator('.site-nav')).not.toBeVisible();
  await expect(page.locator('.detailed-experience .role').last()).toBeVisible();
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
