# Patient states and archival

The connector manages patient/client profiles in a selected practice.

| State | Default list | Search | Edit through MCP |
| --- | --- | --- | --- |
| `active` | Included | Included | With approval and permission |
| `consultation` | Included | Included | With approval and permission |
| `waitlist` | Included | Included | With approval and permission |
| `pre_op` | Included | Included | With approval and permission |
| `post_op` | Included | Included | With approval and permission |
| `archived` | Excluded | Excluded | Blocked |

Set `list_patients.status` to one state to filter. Use `status: "archived"` only
when archived profiles are requested. Follow `continueCursor` until `isDone`,
including pages with no matching profiles. An archived profile can still be read
by a known patient ID. `isArchived` reflects either archive marker in older records.

## Archive is the delete operation

`archive_patient` removes a profile from normal active lists, preserves its record
and audit history, and disconnects linked patient app access. It does not erase
records permanently. Archival of a profile linked to a staff or platform admin
account is rejected to protect that login.

Archived profiles cannot be edited or restored through MCP. An authorized staff
member must restore the profile in QTIS first. Assignments to a new location must
use an active location in the same practice.

## Approval and retries

All writes require `confirmed: true` after the person approves the exact change,
plus a random `requestKey` of 8–128 characters without personal information.
This boolean is the calling application's assertion of approval; it is not an
independent verification of a human action.

Retry uncertain writes with the **same arguments and request key**. Different
arguments with the same key fail. Do not generate a new key just because the
response was interrupted.

`replayed: true` returns the **current** record state without running the original
write again. An old create/update retried after archive reports the archive. An
old archive retried after restoration does not archive the profile again. A new
change needs fresh approval and a new key. Replay receipts last up to 30 days;
expired used keys stay blocked.
