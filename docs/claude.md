# Connect QTIS to Claude

Use the hosted connector. You do not need to download or run an MCP server.

1. Open **Customize → Connectors** in Claude. Choose **+ Add → Add custom connector**.
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
7. In a Claude chat, open **+ → Connectors** and enable QTIS Patients & Clients.

For a Team or Enterprise workspace, an authorized workspace owner may need to add
the custom web connector first in **Organization settings → Connectors**. Members
then connect individually with their own QTIS accounts.

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

The JSON in [examples/claude-connector.json](../examples/claude-connector.json) is a
readable settings reference, not an import file for Claude Desktop's local server configuration.

[Anthropic's custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
describes the current interface and workspace requirements.

[Troubleshooting →](troubleshooting.md)
