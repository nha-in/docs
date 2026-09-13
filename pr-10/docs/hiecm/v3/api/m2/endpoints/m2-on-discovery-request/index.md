# A discovery request for a patient you may hold records for

`POST /api/v3/hip/patient/care-context/discover`

Inbound to every HIP. Answer with care context metadata only: a discovery response carries no clinical or sensitive data. A rejected answer is reported as ABDM-1109.

Retry count, backoff and timeout for this callback are not stated in NHA's material, so treat them as unknown.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hip/patient/care-context/discover \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "<TRANSACTION_ID>",
  "patient": {
    "id": "<ID>",
    "verifiedIdentifiers": [
      "<VERIFIED_IDENTIFIERS>"
    ],
    "unverifiedIdentifiers": [
      "<UNVERIFIED_IDENTIFIERS>"
    ],
    "name": "<NAME>",
    "gender": "M",
    "yearOfBirth": 0
  }
}'
```
