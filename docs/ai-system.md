# Connect QTIS to your AI System

Use an AI System that supports remote MCP, OAuth, and automatic client registration.
The connector is hosted by QTIS; no local server installation is required.

1. Open your **AI System** connector settings and add a **custom remote MCP connector**.
2. Set the name to **QTIS Patients & Clients** and the remote MCP URL to:

   ```text
   https://platform.qtis.ai/mcp/patients
   ```

3. Continue to authentication. Choose **Sign in now**.
4. Under **OAuth client**, select **Register automatically**. This connector uses
   dynamic client registration. Leave manual client credentials and request headers blank.
5. Finish adding the connector and sign in with your own **QTIS staff account**.
6. Choose **Read only** or **Manage patients & clients**, review the consent, and
   select **Allow and return**.
7. Enable **QTIS Patients & Clients** in your AI System conversation.

For a shared workspace, an authorized workspace administrator may need to enable
custom connectors first. Each team member then connects using their own QTIS account.

## First request

> Use the QTIS Patients & Clients connector to list the practices I can access.
> Do not create or change any records.

Then name the practice you want to use:

> Show up to five active patients in my selected practice with their names,
> case file numbers, and statuses. Do not create or change any records.

If multiple practices or matching patients appear, select the intended one before
continuing. Manage access adds write tools only when your QTIS role also permits them.

## Connection settings at a glance

| Setting | Value |
| --- | --- |
| Transport | Remote MCP / Streamable HTTP |
| Authentication | Sign in now / OAuth |
| OAuth client | Register automatically |
| Manual client ID / secret | Leave blank |
| Fixed request headers | Leave blank |
| Account | Your own active QTIS staff account |

The JSON in [examples/ai-system-connector.json](../examples/ai-system-connector.json) is a
readable settings reference for the remote connection.

[QTIS connection documentation](https://platform.qtis.ai/connectors/patients/docs)
describes authentication, permissions, and the published tool contracts.

[Troubleshooting →](troubleshooting.md)
