# Confirmation of a link, carrying the token the patient approved

`POST /api/v3/hip/link/care-context/confirm`

Inbound to the HIP. A duplicate arrives as ABDM-1105, and a rejected answer as ABDM-1111.

Retry count, backoff and timeout for this callback are not stated in NHA's material, so treat them as unknown.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hip/link/care-context/confirm \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "confirmation": {
    "token": 0,
    "linkRefNumber": "5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11"
  }
}'
```
