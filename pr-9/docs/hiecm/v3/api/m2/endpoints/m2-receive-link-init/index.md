# Link On-Init, HIP responds with OTP communication details

`POST /hiecm/user-initiated-linking/v3/link/care-context/on-init`

**Async Callback:** After receiving a link init request at the HIP bridge URL
(`{bridgeUrl}/v0.5/links/link/init`), the HIP calls this Gateway endpoint to
return the authentication details (OTP communication medium and expiry).

The Gateway uses this to prompt the patient to enter the OTP for link confirmation.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/on-init \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "txn-uuid-001",
  "link": {
    "referenceNumber": "link-ref-uuid-001",
    "authenticationType": "DIRECT",
    "meta": {
      "communicationMedium": "MOBILE",
      "communicationHint": "OTP",
      "communicationExpiry": "2024-01-10T12:10:00.000Z"
    }
  },
  "response": {
    "requestId": "req-uuid-from-link-init"
  }
}'
```
