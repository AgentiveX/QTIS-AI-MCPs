import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const origin = 'https://platform.qtis.ai';
const get = async path => {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(20000), redirect: 'error' });
  assert.equal(response.status, 200, `GET ${path}`);
  return response;
};
const resource = await (await get('/.well-known/oauth-protected-resource/mcp/patients')).json();
assert.equal(resource.resource, origin + '/mcp/patients');
assert.ok(resource.authorization_servers.includes(origin + '/oauth/patients'));
const issuer = await (await get('/.well-known/oauth-authorization-server/oauth/patients')).json();
assert.equal(issuer.issuer, origin + '/oauth/patients');
assert.ok(issuer.code_challenge_methods_supported.includes('S256'));
assert.equal(issuer.registration_endpoint, origin + '/oauth/patients/register');
const schemas = await (await get('/connectors/patients/tools.json')).json();
const local = JSON.parse(await readFile(new URL('../connectors/patients/tools.json', import.meta.url), 'utf8'));
assert.deepEqual(schemas, local, 'Published patient tool schemas have changed; update the snapshot.');
const protectedResponse = await fetch(origin + '/mcp/patients', {
  method: 'POST', signal: AbortSignal.timeout(20000), redirect: 'error',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'qtis-public-metadata-check', version: '1.1.0' } } }),
});
assert.equal(protectedResponse.status, 401, 'MCP endpoint must require authentication');
assert.match(protectedResponse.headers.get('WWW-Authenticate') || '', /oauth-protected-resource/);
console.log('Public checks passed: OAuth discovery, PKCE, registration metadata, tool schemas, and authentication boundary. No patient data accessed.');
