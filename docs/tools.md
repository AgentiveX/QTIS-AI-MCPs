# Patients & Clients tool reference

[Machine-readable JSON schemas](../connectors/patients/tools.json) ·
[Current hosted schemas](https://platform.qtis.ai/connectors/patients/tools.json)

| Tool | Access | Purpose |
| --- | --- | --- |
| `list_tenants` | Read | Find authorized practices; follow pagination. |
| `get_patient_context` | Read | Find active locations in the selected practice. |
| `list_patients` | Read | List profiles, optionally filtered by current status. |
| `search_patients` | Read | Search by name, email, phone, or case file number. |
| `get_patient` | Read | Read one profile, including its current archive state. |
| `create_patient` | Manage | Create an approved profile with name and unique case file number. |
| `update_patient` | Manage | Update approved profile fields on an unarchived record. |
| `archive_patient` | Manage | Archive with approval while preserving history. |

IDs must come from QTIS responses. Do not invent practice, patient, or location
IDs. Disambiguate matching names and select a practice first.

Creation requires a name and case file number. Defaults are active status,
patient role, other source, derived initials, and the practice's default location.
Updates affect only supplied fields. `null` clears nullable contact/address
fields. `tags` replaces the complete tag list.

Shared profiles include names, initials, case file numbers, role/source/status,
tags, phone, email, address, and record timestamps. Clinical notes, images,
documents, birth dates, and billing records are excluded.

Lists return at most 50 rows per page. Search returns up to 20 candidates and a
`mayHaveMore` indicator. Do not treat a partial page as the entire practice.

Tool results include JSON text and `structuredContent`. Treat `isError: true`
as a failure. Never describe a write as saved without a successful response.
See [patient states](patient-states.md) for approval and retry semantics.
