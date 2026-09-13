# Refresh Patient Health Information

`POST /api/care-context-link/patient/health-information/refresh`

Asks the HIPs given to send any records added since the last transfer.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/health-information/refresh \
  --header 'Content-Type: application/json' \
  --data '{
  "hipIds": [
    "HIP001",
    "HIP002"
  ]
}'
```
