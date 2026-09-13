# A request to start linking a care context

`POST /api/v3/hip/link/care-context/init`

Inbound to the HIP. A duplicate arrives as ABDM-1104, and a rejected answer as ABDM-1110.

Retry count, backoff and timeout for this callback are not stated in NHA's material, so treat them as unknown.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hip/link/care-context/init \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "<TRANSACTION_ID>",
  "abhaAddress": "<ABHA_ADDRESS>",
  "patient": [
    {
      "referenceNumber": "<REFERENCE_NUMBER>",
      "display": "<DISPLAY>",
      "careContexts": [
        "<CARE_CONTEXTS>"
      ],
      "hiType": "<HI_TYPE>",
      "count": 0
    }
  ]
}'
```
