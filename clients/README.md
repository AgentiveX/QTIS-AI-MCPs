# JavaScript reference client

The client uses native `fetch` in Node.js 22 or later. It is an integration
example for applications that already complete QTIS OAuth, store credentials
securely, rotate refresh tokens, and obtain approval for writes. Claude users
should use the [hosted connector setup](../docs/claude.md).

```js
import { QtisPatientClient } from './reference-client.mjs';

// Obtain this through your application's OAuth flow and secure token store.
const accessToken = await yourTokenStore.getAccessToken();
const qtis = new QtisPatientClient({ accessToken });
await qtis.initialize();
const tools = await qtis.listTools();
const practices = await qtis.callTool('list_tenants');
// Render the response securely in your application; do not log patient data.
```

Read-only is the default. `allowWrites: true` allows approved write calls,
but does not grant OAuth scope or QTIS role permissions. The caller must obtain
approval for the exact arguments before setting `confirmed: true`, generate a
random request key, and preserve it on uncertain retries. The server validates
permissions regardless of this local setting.

The client sends credentials only to the fixed QTIS Patients endpoint and
rejects redirects. It does not retry writes automatically. Application code must
handle consent, refresh serialization, pagination, and error recovery.
