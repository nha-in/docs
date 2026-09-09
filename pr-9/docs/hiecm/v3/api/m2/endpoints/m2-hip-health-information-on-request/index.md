# Acknowledge a health information data request

`POST /hiecm/data-flow/v3/health-information/hip/on-request`

Also known as: HIP Health Information Response.
**Async Callback:** After ABDM Gateway sends a health information request to the HIP bridge URL
(`{bridgeUrl}/v0.5/health-information/hip/request`), the HIP calls this Gateway endpoint to
acknowledge receipt and indicate it will begin processing (ACKNOWLEDGED).

After this, the HIP prepares and encrypts FHIR records, then pushes them to the HIU's `dataPushUrl`.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/hip/on-request \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "txn-uuid-data-001",
    "sessionStatus": "ACKNOWLEDGED"
  },
  "response": {
    "requestId": "req-uuid-from-hi-request"
  }
}'
```
