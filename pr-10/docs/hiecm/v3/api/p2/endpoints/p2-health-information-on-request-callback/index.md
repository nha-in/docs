# Health Information On-Request Callback

`POST /api/care-context-link/health-information/on-request`

Callback the gateway sends after a health information request: the transaction id for the transfer, or the error that stopped it.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/health-information/on-request \
  --header 'Content-Type: application/json' \
  --data '{
  "requestId": "<GENERATED>",
  "timestamp": "2026-06-12T00:00:00.000Z",
  "hiRequest": {
    "transactionId": "txn-001",
    "sessionStatus": "ACKNOWLEDGED"
  },
  "error": null,
  "resp": {
    "requestId": "<REQUEST_ID>"
  }
}'
```
