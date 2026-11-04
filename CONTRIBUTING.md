# Contributing

Keep the public registry, hosted availability, and tool contracts consistent.
Only publish an endpoint when the connector is available for that documented
audience. Planned connectors belong in the directory without endpoint URLs.

Run `npm run check`, `npm test`, and `npm run smoke` before proposing changes.
The smoke check uses public metadata and must never read or change patient data.

Use invented identifiers only in isolated unit tests. Keep all private data,
credentials, deployment configuration, and production request logs out of commits.
Follow [SECURITY.md](SECURITY.md) for private reports.
