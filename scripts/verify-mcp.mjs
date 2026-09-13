import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const runtime = new Client({ name: 'portfolio-mcp-check', version: '1.0.0' });
try {
  await runtime.connect(
    new SSEClientTransport(new URL('http://127.0.0.1:4321/__mcp/sse')),
    { timeout: 15000 },
  );
  const { tools } = await runtime.listTools();
  console.log('Runtime tools:', tools.map(({ name }) => name).join(', '));
  for (const name of [
    'get-astro-config',
    'list-astro-routes',
    'get-astro-server-address',
  ]) {
    assert(
      tools.some((tool) => tool.name === name),
      `Missing ${name}`,
    );
    const result = await runtime.callTool({ name, arguments: {} }, undefined, {
      timeout: 15000,
    });
    assert(!result.isError, `${name} returned an error`);
    const text = result.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
    const value = JSON.parse(text);
    if (name === 'get-astro-config') {
      assert.equal(value.site, 'https://donatoalvarez.dev');
      assert.equal(value.output, 'static');
      console.log(name, { site: value.site, output: value.output });
    } else if (name === 'list-astro-routes') {
      assert(
        value.some(
          (route) =>
            route.component?.includes('index.astro') ||
            route.entrypoint?.includes('index.astro'),
        ),
      );
      console.log(name, `${value.length} routes`);
    } else {
      assert.equal(value.port, 4321);
      console.log(name, value);
    }
  }
} finally {
  await runtime.close();
}

const docs = new Client({ name: 'portfolio-docs-check', version: '1.0.0' });
try {
  await docs.connect(
    new StreamableHTTPClientTransport(
      new URL('https://mcp.docs.astro.build/mcp'),
    ),
    { timeout: 30000 },
  );
  const { tools } = await docs.listTools();
  assert(tools.some(({ name }) => name === 'search_astro_docs'));
  const result = await docs.callTool(
    {
      name: 'search_astro_docs',
      arguments: { query: 'Astro static output site configuration' },
    },
    undefined,
    { timeout: 30000 },
  );
  assert(!result.isError);
  assert(
    result.content.some((item) => item.type === 'text' && item.text.length > 0),
  );
  console.log('Official Astro Docs: search_astro_docs passed');
} finally {
  await docs.close();
}
