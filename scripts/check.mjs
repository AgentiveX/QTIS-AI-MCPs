import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const registry = JSON.parse(await readFile(resolve(root, 'registry.json'), 'utf8'));
const schemas = JSON.parse(await readFile(resolve(root, 'connectors/patients/tools.json'), 'utf8'));
assert.equal(registry.version, 1);
assert.equal(new Set(registry.connectors.map(c => c.id)).size, registry.connectors.length);
for (const c of registry.connectors) {
  assert.match(c.id, /^[a-z-]+$/);
  assert.equal(c.status, 'available');
  assert.ok(c.name && c.description && c.capabilities.length);
  assert.equal(new URL(c.page).origin, 'https://platform.qtis.ai');
  if (c.endpoint) assert.equal(new URL(c.endpoint).origin, 'https://platform.qtis.ai');
  assert.ok((await stat(resolve(root, `connectors/${c.id}/README.md`))).isFile());
}
assert.equal(schemas.tools.length, 8);
for (const name of ['create_patient','update_patient','archive_patient']) {
  const tool = schemas.tools.find(t => t.name === name);
  assert.ok(tool.inputSchema.required.includes('confirmed'));
  assert.ok(tool.inputSchema.required.includes('requestKey'));
  assert.equal(tool.inputSchema.properties.confirmed.const, true);
}
async function checkMarkdown(directory) {
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await checkMarkdown(path);
    else if (entry.name.endsWith('.md')) {
      const markdown = await readFile(path, 'utf8');
      for (const [, link] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
        if (/^(https?:|mailto:|#)/.test(link)) continue;
        assert.ok((await stat(resolve(dirname(path), link.split('#')[0]))).isFile(), `Missing link in ${entry.name}: ${link}`);
      }
    }
  }
}
await checkMarkdown(root);
console.log(`Registry valid: ${registry.connectors.length} connectors, ${schemas.tools.length} patient tools, local Markdown links resolved.`);
