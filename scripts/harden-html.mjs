import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

function insertHeadMetadata(html, metadata) {
  assert.equal(
    (html.match(/<head>/g) ?? []).length,
    1,
    'Unexpected document head',
  );
  // Keep charset first and within the first 1024 bytes; CSP must precede resources.
  return html.replace(
    /<head>(?:\s*<meta charset="[^"]+"\s*\/?>)?/i,
    (opening) => `${opening}\n${metadata}`,
  );
}

// Astro emits its generated CSP at the end of this layout's head. Move the
// generated policy ahead of the pre-paint script and favicon, without rebuilding
// or duplicating its directive/hash logic.
const portfolioPath = new URL('../dist/index.html', import.meta.url);
const portfolio = (await readFile(portfolioPath, 'utf8')).replace(
  /\r\n?/g,
  '\n',
);
const policies =
  portfolio.match(
    /<meta http-equiv="content-security-policy" content="[^"]*">/g,
  ) ?? [];
assert.equal(policies.length, 1, 'Expected one Astro-generated portfolio CSP');
await writeFile(
  portfolioPath,
  insertHeadMetadata(portfolio.replace(policies[0], ''), policies[0]),
);
console.log('Positioned portfolio CSP before scripts and resources.');

// Files copied from public/ do not receive Astro's page CSP. Apply a separate
// policy to this trusted, generated Lighthouse document in the build output.
const path = new URL('../dist/lighthouse-report.report.html', import.meta.url);
const html = (await readFile(path, 'utf8')).replace(/\r\n?/g, '\n');
assert(
  !/http-equiv=["']content-security-policy/i.test(html),
  'Report already has a CSP',
);

// Lighthouse escapes HTML in its serialized data. This deliberately handles
// its generated inline-script format, not arbitrary user-supplied HTML.
const scripts = [
  ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi),
];
assert(
  scripts.length > 0,
  'Report has no scripts; review the generator output',
);
const hashes = scripts.map(([, attributes, source]) => {
  assert.equal(
    attributes.trim(),
    '',
    'Review unexpected report script attributes',
  );
  return `'sha256-${createHash('sha256').update(source).digest('base64')}'`;
});
const policy = [
  "default-src 'none'",
  `script-src ${[...new Set(hashes)].join(' ')}`,
  "script-src-attr 'none'",
  // The report renderer creates styles and style attributes at runtime.
  // Only this document needs inline styles; executable code remains hashed.
  "style-src 'unsafe-inline'",
  'img-src data: blob:',
  "base-uri 'none'",
  "object-src 'none'",
  "form-action 'none'",
  "connect-src 'none'",
  "frame-src 'none'",
].join('; ');
const metadata = `<meta http-equiv="content-security-policy" content="${policy}">\n<meta name="referrer" content="strict-origin-when-cross-origin">`;
await writeFile(path, insertHeadMetadata(html, metadata));
console.log(
  `Hardened Lighthouse report (${hashes.length} approved inline scripts).`,
);
