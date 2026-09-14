import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';

const canonical = 'https://donatoalvarez.dev/';
const minimumCertificateDays = 14;

function request(url, method) {
  return new Promise((resolve, reject) => {
    const transport = url.startsWith('https:') ? https : http;
    const req = transport.request(
      url,
      {
        method,
        agent: false,
        signal: AbortSignal.timeout(15000),
        headers: {
          'User-Agent': 'PortfolioAvailabilityCheck/1.0',
          'Accept-Encoding': 'identity',
        },
      },
      (response) => {
        try {
          // Normal TLS chain and hostname validation remains enabled.
          if (transport === https) {
            const certificate = response.socket.getPeerCertificate();
            const days =
              (Date.parse(certificate.valid_to) - Date.now()) / 86400000;
            assert(
              days > minimumCertificateDays,
              `${url}: TLS certificate expires in ${Math.floor(days)} days`,
            );
          }
          let body = '';
          let bytes = 0;
          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            bytes += Buffer.byteLength(chunk);
            if (bytes > 1024 * 1024) {
              req.destroy(
                new Error(`${url}: unexpected response larger than 1 MiB`),
              );
              return;
            }
            body += chunk;
          });
          response.on('error', reject);
          response.on('end', () =>
            resolve({
              status: response.statusCode,
              headers: response.headers,
              body,
            }),
          );
        } catch (error) {
          req.destroy(error);
          reject(error);
        }
      },
    );
    req.on('error', reject);
    req.end();
  });
}

try {
  const page = await request(canonical, 'GET');
  assert.equal(page.status, 200, `Homepage returned HTTP ${page.status}`);
  assert.match(page.headers['content-type'] ?? '', /^text\/html\b/i);
  assert.match(page.body, /Donato Alvarez/);
  for (const id of ['main', 'about', 'experience', 'contact']) {
    assert(page.body.includes(`id="${id}"`), `Missing expected ${id} content`);
  }
  console.log('Homepage content and TLS: OK');

  for (const url of [
    'http://donatoalvarez.dev/',
    'https://www.donatoalvarez.dev/',
  ]) {
    const response = await request(url, 'HEAD');
    assert(
      [301, 308].includes(response.status),
      `${url}: expected permanent redirect, received ${response.status}`,
    );
    assert.equal(
      response.headers.location,
      canonical,
      `${url}: unexpected redirect target`,
    );
    console.log(`${url} redirects to canonical HTTPS: OK`);
  }
} catch (error) {
  console.error('Availability check failed:', error.message);
  process.exitCode = 1;
}
