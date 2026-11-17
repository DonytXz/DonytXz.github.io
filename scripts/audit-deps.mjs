import { spawnSync } from 'node:child_process';

const ACCEPTED_ADVISORIES = new Map([
  [
    'https://github.com/advisories/GHSA-fc5q-39xc-vjpf',
    'picomatch <=4.0.7 ReDoS: no upstream patch yet; build/dev-only in static Astro site',
  ],
]);

const result = spawnSync('npm', ['audit', '--audit-level=high', '--json'], {
  encoding: 'utf8',
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error(
    result.stderr || result.stdout || 'Failed to parse npm audit output.',
  );
  process.exit(result.status ?? 1);
}

if (report.error) {
  console.error('npm audit error:', report.error.summary ?? report.error);
  process.exit(1);
}

const blockedSeverities = new Set(['high', 'critical']);
const observedAccepted = new Set();
const unaccepted = new Map();

for (const vuln of Object.values(report.vulnerabilities ?? {})) {
  for (const via of vuln.via ?? []) {
    if (
      typeof via === 'object' &&
      via !== null &&
      blockedSeverities.has(via.severity)
    ) {
      if (ACCEPTED_ADVISORIES.has(via.url)) {
        observedAccepted.add(via.url);
      } else {
        unaccepted.set(via.url ?? `${via.name}:${via.title}`, via);
      }
    }
  }
}

for (const [url, reason] of ACCEPTED_ADVISORIES) {
  if (observedAccepted.has(url)) {
    console.log(`Accepted advisory (${url}): ${reason}`);
  } else {
    console.log(
      `Accepted advisory (${url}) is no longer present and can be removed.`,
    );
  }
}

if (
  result.status !== 0 &&
  observedAccepted.size === 0 &&
  unaccepted.size === 0
) {
  console.error(
    `npm audit exited with status ${result.status} without recognized advisories.`,
  );
  process.exit(result.status ?? 1);
}

if (unaccepted.size > 0) {
  console.error('\nUnaccepted high/critical advisories found:');
  for (const via of unaccepted.values()) {
    console.error(`- [${via.severity}] ${via.name}: ${via.title} (${via.url})`);
  }
  process.exit(1);
}

console.log(
  'Dependency audit passed with no unaccepted high/critical advisories.',
);
