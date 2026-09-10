# call-back link-on-confirm

`POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm`

Callback the gateway sends after a link confirmation: the patient's linked care contexts, or the error that stopped it.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm \
  --header 'Content-Type: application/json' \
  --data '{
  "patient": [
    {
      "referenceNumber": "<ABHA_ADDRESS>",
      "display": "Test",
      "careContexts": [
        {
          "referenceNumber": "Test 4",
          "display": "Sugar Test"
        }
      ],
      "hiType": "Invoice",
      "count": 1
    }
  ],
  "response": {
    "requestId": "<TXN_ID>"
  }
}'
```
