import { writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';

const url = 'http://127.0.0.1:4322/';
const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
if (!response.ok)
  throw new Error(
    'Start the production preview with npm run preview before auditing.',
  );

// Let Playwright own Chrome's lifecycle and temporary profile (including Windows cleanup).
const probe = createServer();
await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
const address = probe.address();
if (!address || typeof address === 'string')
  throw new Error('Could not allocate a Chrome debugging port.');
const port = address.port;
await new Promise((resolve, reject) =>
  probe.close((error) => (error ? reject(error) : resolve())),
);
const browser = await chromium.launch({
  args: [`--remote-debugging-port=${port}`],
});
let report;
try {
  const result = await lighthouse(url, {
    port,
    output: ['html', 'json'],
    logLevel: 'error',
  });
  if (!result || result.lhr.runtimeError)
    throw new Error(
      JSON.stringify(result?.lhr.runtimeError ?? 'No report returned'),
    );
  if (!Array.isArray(result.report))
    throw new Error('Expected HTML and JSON Lighthouse reports.');
  await Promise.all([
    writeFile('public/lighthouse-report.report.html', result.report[0]),
    writeFile('public/lighthouse-report.report.json', result.report[1]),
  ]);
  report = result.lhr;
} finally {
  await browser.close();
}
const summary = {
  url: report.finalDisplayedUrl,
  date: report.fetchTime,
  formFactor: report.configSettings.formFactor,
  scores: Object.fromEntries(
    Object.entries(report.categories).map(([name, category]) => [
      name,
      category.score === null ? null : Math.round(category.score * 100),
    ]),
  ),
};
await writeFile('src/data/audit.json', `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
console.log(
  'Reports saved. Rebuild to include the refreshed report and its metadata in dist/.',
);
