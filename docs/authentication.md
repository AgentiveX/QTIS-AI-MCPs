# Authentication and permissions

The public endpoint requires OAuth. Public documentation does not grant access to records.

| Resource | URL |
| --- | --- |
| MCP resource / audience | `https://platform.qtis.ai/mcp/patients` |
| Resource metadata | `https://platform.qtis.ai/.well-known/oauth-protected-resource/mcp/patients` |
| Issuer | `https://platform.qtis.ai/oauth/patients` |
| Authorization metadata | `https://platform.qtis.ai/.well-known/oauth-authorization-server/oauth/patients` |
| Registration | `https://platform.qtis.ai/oauth/patients/register` |
| Token exchange | `https://platform.qtis.ai/oauth/patients/token` |
| Revocation | `https://platform.qtis.ai/oauth/patients/revoke` |

Use Authorization Code with **PKCE S256**, an exact registered callback, and
explicit QTIS consent. Discover the authorization URL from issuer metadata.
Your AI System registers its own OAuth client automatically; staff do not need a shared
client secret. A password is entered only into QTIS sign-in, never into a prompt
or GitHub issue.

| Scope | Capability |
| --- | --- |
| `patients:read` | Five profile discovery and read tools |
| `patients:write` | Three approved create/update/archive tools |
| `offline_access` | Continued access through rotating refresh tokens |

Scopes do not replace QTIS permissions. Each request checks the current staff
account and record access. Data operations require an active practice membership
or a valid active elevated grant, an active or trialing practice, an active parent
organization, and the necessary patient permissions. Pending invitations do not
grant patient access. Inactive or deleted accounts, accounts awaiting a password
change, and changed identity bindings cannot continue using their old connection.

Access tokens expire after five minutes. Refresh tokens rotate, expire after
30 days absolute or seven days idle, and must be stored securely by the client.
Serialize refresh operations and retain the newest refresh token. Reuse of a
spent refresh token revokes the connection. Patient tokens cannot be used for
the Calendar resource.

## Building another client

Use issuer metadata and dynamic client registration. Bind authorization to the
patient resource, verify OAuth state, use PKCE, and keep tokens out of logs and
URLs. The dependency-free [reference client](../clients/reference-client.mjs)
shows JSON MCP calls **after your application has completed OAuth**. It does not
implement login, token storage, or refresh management.

Disconnect by revoking the refresh token and removing stored credentials.
See the [hosted protocol documentation](https://platform.qtis.ai/connectors/patients/docs)
for current limits and response details.
