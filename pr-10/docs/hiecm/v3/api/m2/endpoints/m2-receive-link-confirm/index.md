# Link On-Confirm, HIP confirms linked care contexts

`POST /hiecm/user-initiated-linking/v3/link/care-context/on-confirm`

**Async Callback:** After receiving a link confirm request at the HIP bridge URL
(`{bridgeUrl}/v0.5/links/link/confirm`) with the patient's OTP, the HIP validates
the OTP and calls this Gateway endpoint to confirm the linked care contexts.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "patient": [
    {
      "referenceNumber": "PAT-REF-001",
      "display": "Ramesh Kumar",
      "careContexts": [
        {
          "referenceNumber": "VISIT-2024-001",
          "display": "OPD Visit 10-Jan-2024"
        }
      ],
      "hiType": [
        "Prescription"
      ],
      "count": 1
    }
  ],
  "response": {
    "requestId": "req-uuid-from-link-confirm"
  }
}'
```
