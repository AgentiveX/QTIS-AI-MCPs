# Connection troubleshooting

| Symptom | Check |
| --- | --- |
| Authentication does not start | Use the exact Patients URL and **Register automatically**. Leave fixed headers and manual OAuth credentials blank. |
| Connector missing in a workspace | Ask an authorized AI System workspace owner to add/enable the custom connector. |
| Sign-in succeeds but no practices appear | Confirm an active QTIS staff account, accepted practice membership, and patient read permission with your administrator. |
| Write tools are missing | Reconnect and choose manage access. QTIS create/update permissions are also required. |
| A patient cannot be found | Confirm the practice and search spelling. Normal search excludes archives; explicitly list archived profiles when intended. |
| An archived record cannot be changed | Restore it in QTIS before editing. MCP cannot restore it. |
| A connection expired or was revoked | Reconnect through your AI System. Completing any required QTIS password change may be necessary. |
| A request was interrupted during a write | Retry the same approved arguments and request key. Inspect current state before approving a different operation. |
| New tool options are missing | Refresh or reconnect the AI System connector to load current schemas. |

For support, share the approximate time, application, tool name, and safe error
code. Do not include patient information, account passwords, access tokens,
refresh tokens, or private request payloads in public issues.

[Contact QTIS](https://platform.qtis.ai/connectors/patients/support)
