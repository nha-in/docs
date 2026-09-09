# Mark Linked Facility as Read

`DELETE /api/care-context-link/read/link/patient/links/{hipId}`

Marks the records from one HIP as seen, clearing the unread indicator for that facility.

```bash
curl --request DELETE \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/read/link/patient/links/{hipId}
```
