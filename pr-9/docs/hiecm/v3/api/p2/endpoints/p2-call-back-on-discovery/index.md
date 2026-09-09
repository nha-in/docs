# call-back on-discovery

`POST /user-initiated-linking/link/on-discover`

Callback the gateway sends with the care contexts discovered at the HIP, or the error that stopped discovery.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/user-initiated-linking/link/on-discover \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "<TXN_ID>",
  "error": {
    "code": "ABDM-1010",
    "message": "Patient not found"
  },
  "response": {
    "requestId": "<TXN_ID>"
  }
}'
```
