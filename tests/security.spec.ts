import { expect, test } from '@playwright/test';

test('CSP permits the portfolio and its interactive Lighthouse report without violations', async ({
  page,
}) => {
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      document.documentElement.dataset.cspViolation = `${event.effectiveDirective}: ${event.blockedURI}`;
    });
  });
  await page.goto('/');
  // Browser-based audit/crawler tools can still read same-origin resources.
  expect(
    await page.evaluate(async () => (await fetch('/favicon.svg')).status),
  ).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('data-js', 'true');
  await page.locator('#lang-toggle').click();
  await page.locator('#theme-toggle').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('#open-audit-btn').click();
  const report = page.frameLocator('#audit-iframe');
  await expect(report.locator('.lh-report')).toBeVisible();
  await expect(report.locator('#performance')).toBeVisible();
  await report.locator('.lh-audit details').first().locator('summary').click();
  await expect(report.locator('.lh-audit details').first()).toHaveAttribute(
    'open',
    '',
  );
  await expect(page.locator('html')).not.toHaveAttribute('data-csp-violation');
  await expect(report.locator('html')).not.toHaveAttribute(
    'data-csp-violation',
  );
});

for (const path of ['/', '/lighthouse-report.report.html']) {
  test(`${path}: CSP blocks injected inline scripts, handlers, external connections, and base URLs`, async ({
    page,
  }) => {
    await page.goto(path);
    const policyPrecedesResources = await page
      .locator('head')
      .evaluate((head) => {
        const policy = head.querySelector(
          'meta[http-equiv="content-security-policy"]',
        );
        return (
          !!policy &&
          [...head.querySelectorAll('script, style, link')].every(
            (resource) =>
              !!(
                policy.compareDocumentPosition(resource) &
                Node.DOCUMENT_POSITION_FOLLOWING
              ),
          )
        );
      });
    expect(policyPrecedesResources).toBe(true);
    const result = await page.evaluate(async () => {
      const violations = new Set<string>();
      const expected = [
        'script-src-elem',
        'script-src-attr',
        'connect-src',
        'base-uri',
      ];
      const blocked = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(new Error(`Missing CSP violations: ${[...violations]}`)),
          5000,
        );
        document.addEventListener('securitypolicyviolation', (event) => {
          violations.add(event.effectiveDirective);
          if (expected.every((directive) => violations.has(directive))) {
            clearTimeout(timeout);
            resolve();
          }
        });
      });
      // evaluate installs the probe; actual script/handler execution is left
      // to the browser so this checks enforcement rather than policy strings.
      const script = document.createElement('script');
      script.textContent =
        'document.documentElement.dataset.injectedScript = "executed"';
      document.head.append(script);
      const button = document.createElement('button');
      button.setAttribute(
        'onclick',
        'document.documentElement.dataset.injectedHandler = "executed"',
      );
      document.body.append(button);
      button.click();
      const base = document.createElement('base');
      base.href = 'https://csp-probe.invalid/';
      document.head.append(base);
      const connectionBlocked = await fetch(
        'https://csp-probe.invalid/connection',
      ).then(
        () => false,
        () => true,
      );
      await blocked;
      return {
        scriptRan: document.documentElement.hasAttribute(
          'data-injected-script',
        ),
        handlerRan: document.documentElement.hasAttribute(
          'data-injected-handler',
        ),
        baseURI: document.baseURI,
        connectionBlocked,
      };
    });
    expect(result.scriptRan).toBe(false);
    expect(result.handlerRan).toBe(false);
    expect(result.connectionBlocked).toBe(true);
    expect(result.baseURI).toBe(page.url());
  });
}
