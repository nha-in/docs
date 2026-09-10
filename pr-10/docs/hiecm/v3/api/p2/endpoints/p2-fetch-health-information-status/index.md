# Fetch Health Information Status

`POST /api/care-context-link/patient/health-information/status`

Returns the transfer status for the transaction ids given.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/health-information/status \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionIds": [
    "txn-001",
    "txn-002"
  ]
}'
```
