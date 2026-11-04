# Contributing

Keep the public registry, connector guides, and published tool contracts consistent.
Use the published QTIS URLs in connection instructions and document the correct
practice permissions for each workflow.

Run `npm run check`, `npm test`, and `npm run smoke` before proposing changes.
The smoke check uses public metadata and must never read or change patient data.

Use invented identifiers only in isolated unit tests. Keep all private data,
credentials, deployment configuration, and production request logs out of commits.
Follow [SECURITY.md](SECURITY.md) for private reports.
