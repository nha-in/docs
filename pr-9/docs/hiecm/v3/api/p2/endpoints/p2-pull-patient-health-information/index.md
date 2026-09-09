# Pull Patient Health Information

`POST /api/care-context-link/patient/health-information/pull`

Asks the HIPs given to send the person's records. The data arrives later through the transfer endpoint.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/health-information/pull \
  --header 'Content-Type: application/json' \
  --data '{
  "hipIds": [
    "HIP001"
  ],
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
