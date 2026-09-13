import { readFile } from 'node:fs/promises';
import Ajv from 'ajv/dist/2020.js';

const response = await fetch('https://opencode.ai/config.json', {
  signal: AbortSignal.timeout(30000),
});
if (!response.ok)
  throw new Error(`OpenCode schema request failed: ${response.status}`);
const schema = await response.json();
const config = JSON.parse(
  await readFile(new URL('../opencode.json', import.meta.url), 'utf8'),
);
const validate = await new Ajv({
  strict: false,
  allErrors: true,
  validateFormats: false,
  loadSchema: async (url) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok)
      throw new Error(
        `Referenced schema request failed: ${response.status} ${url}`,
      );
    return response.json();
  },
}).compileAsync(schema);
if (!validate(config))
  throw new Error(JSON.stringify(validate.errors, null, 2));
console.log('Project OpenCode configuration matches the published schema.');
