# Fetch Patient Health Information

`POST /api/care-context-link/patient/health-information/fetch`

Fetches the health information received for the request ids given, with paging.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/health-information/fetch \
  --header 'Content-Type: application/json' \
  --data '{
  "requestIds": [
    "req-001",
    "req-002"
  ],
  "limit": 10,
  "offset": 0
}'
```
