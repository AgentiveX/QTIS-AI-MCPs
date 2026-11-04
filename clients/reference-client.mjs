// HTTP calls after your application completes OAuth. Never hard-code tokens.
export const PATIENT_ENDPOINT = 'https://platform.qtis.ai/mcp/patients';
const READ_TOOLS = new Set(['list_tenants', 'get_patient_context', 'list_patients', 'search_patients', 'get_patient']);
const WRITE_TOOLS = new Set(['create_patient', 'update_patient', 'archive_patient']);

export class QtisPatientClient {
  #token;
  #fetch;
  #allowWrites;
  #sequence = 0;
  #protocol = '2025-06-18';

  constructor({ accessToken, allowWrites = false, fetchImpl = fetch }) {
    if (typeof accessToken !== 'string' || !accessToken.trim() || /\s/.test(accessToken)) {
      throw new Error('An OAuth access token is required.');
    }
    this.#token = accessToken;
    this.#fetch = fetchImpl;
    this.#allowWrites = allowWrites === true;
  }

  async #request(method, params) {
    const id = ++this.#sequence;
    let response;
    try {
      response = await this.#fetch(PATIENT_ENDPOINT, {
        method: 'POST',
        redirect: 'error',
        signal: AbortSignal.timeout(25000),
        headers: {
          Authorization: `Bearer ${this.#token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'MCP-Protocol-Version': this.#protocol,
        },
        body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
      });
    } catch {
      throw new Error('QTIS request did not complete. Preserve the original arguments and request key for an uncertain write.');
    }
    if (!response.ok) throw new Error(`QTIS HTTP ${response.status}. Check connection permissions before retrying.`);
    if (!response.headers.get('content-type')?.includes('application/json')) {
      throw new Error('Unexpected response format from QTIS.');
    }
    let payload;
    try { payload = await response.json(); } catch { throw new Error('Invalid JSON response from QTIS.'); }
    if (payload.jsonrpc !== '2.0' || payload.id !== id) throw new Error('Unmatched QTIS response.');
    if (payload.error) throw new Error(`QTIS RPC ${Number(payload.error.code) || -32603}.`);
    if (!payload.result || typeof payload.result !== 'object') throw new Error('Missing QTIS result.');
    if (payload.result.isError) {
      // Return no server-supplied message or profile payload in exception logs.
      throw new Error('QTIS tool reported an error. The operation must not be treated as completed.');
    }
    return payload.result;
  }

  async initialize() {
    const result = await this.#request('initialize', {
      protocolVersion: this.#protocol, capabilities: {},
      clientInfo: { name: 'qtis-public-reference-client', version: '1.1.0' },
    });
    if (!['2025-06-18', '2025-11-25'].includes(result.protocolVersion)) {
      throw new Error('Unsupported MCP protocol returned by QTIS.');
    }
    this.#protocol = result.protocolVersion;
    let notified;
    try {
      notified = await this.#fetch(PATIENT_ENDPOINT, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(25000),
        headers: {
          Authorization: `Bearer ${this.#token}`,
          'Content-Type': 'application/json', Accept: 'application/json, text/event-stream',
          'MCP-Protocol-Version': this.#protocol,
        },
        body: JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'}),
      });
    } catch { throw new Error('QTIS initialization notification did not complete.'); }
    if (notified.status !== 202 && notified.status !== 204) throw new Error('QTIS did not accept initialization.');
    return result;
  }

  listTools() { return this.#request('tools/list', {}); }

  callTool(name, args = {}) {
    if (!READ_TOOLS.has(name) && !WRITE_TOOLS.has(name)) throw new Error('Unknown patient tool.');
    if (WRITE_TOOLS.has(name)) {
      if (!this.#allowWrites) throw new Error('This client is read-only.');
      if (args.confirmed !== true || typeof args.requestKey !== 'string' || args.requestKey.length < 8 || args.requestKey.length > 128) {
        throw new Error('An approved write needs confirmed: true and its original random request key.');
      }
    }
    return this.#request('tools/call', { name, arguments: args });
  }
}
