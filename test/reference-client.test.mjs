import test from 'node:test';
import assert from 'node:assert/strict';
import { QtisPatientClient, PATIENT_ENDPOINT } from '../clients/reference-client.mjs';
const token = 'isolated-unit-test-token';
const success = result => async (url, init) => {
  assert.equal(url, PATIENT_ENDPOINT);
  assert.equal(init.redirect, 'error');
  assert.equal(init.headers.Authorization, `Bearer ${token}`);
  const request = JSON.parse(init.body);
  if (request.method === 'notifications/initialized') return new Response(null, {status:202});
  return Response.json({ jsonrpc: '2.0', id: request.id, result });
};
test('initializes the authenticated JSON transport', async () => {
  const client = new QtisPatientClient({ accessToken: token, fetchImpl: success({ protocolVersion: '2025-06-18' }) });
  assert.equal((await client.initialize()).protocolVersion, '2025-06-18');
});
test('read-only client blocks writes before making a network request', () => {
  const client = new QtisPatientClient({ accessToken: token, fetchImpl: () => { throw new Error('must not call'); } });
  for (const tool of ['create_patient','update_patient','archive_patient']) {
    assert.throws(() => client.callTool(tool, { confirmed: true, requestKey: 'unit-key-1234' }), /read-only/);
  }
});
test('write-enabled client still requires approval and request key', async () => {
  const client = new QtisPatientClient({ accessToken: token, allowWrites: true, fetchImpl: success({ structuredContent: { replayed: false } }) });
  assert.throws(() => client.callTool('update_patient', {}), /approved write/);
  assert.equal((await client.callTool('update_patient', { confirmed: true, requestKey: 'unit-key-1234' })).structuredContent.replayed, false);
});
test('unknown tools are rejected', () => {
  const client = new QtisPatientClient({ accessToken: token });
  assert.throws(() => client.callTool('erase_all_records'), /Unknown patient tool/);
});
test('HTTP and tool failures never count as success or expose private payloads', async () => {
  for (const fetchImpl of [async () => new Response('private-server-detail', {status:403}), success({isError:true,structuredContent:{error:{message:'private-server-detail'}}}), async () => {throw new Error(token);}]) {
    const client = new QtisPatientClient({accessToken:token,fetchImpl});
    await assert.rejects(client.listTools(), error => !error.message.includes(token) && !error.message.includes('private-server-detail'));
  }
});
test('unmatched replies and invalid protocols are rejected', async () => {
  const badReply = new QtisPatientClient({accessToken:token,fetchImpl:async()=>Response.json({jsonrpc:'2.0',id:900,result:{}})});
  await assert.rejects(badReply.listTools(), /Unmatched/);
  const badProtocol = new QtisPatientClient({accessToken:token,fetchImpl:success({protocolVersion:'unexpected'})});
  await assert.rejects(badProtocol.initialize(), /Unsupported/);
});
