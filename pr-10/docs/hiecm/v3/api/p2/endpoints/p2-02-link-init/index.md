# 02 link-init

`POST /user-initiated-linking/link/init`

Initiates linking of the care contexts discovered at a HIP. The HIP replies with how the person will authenticate.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/user-initiated-linking/link/init \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "<TXN_ID>",
  "patient": [
    {
      "referenceNumber": "<ABHA_ADDRESS>",
      "display": "Test",
      "careContexts": [
        {
          "referenceNumber": "Test 1",
          "display": "Sugar Test"
        }
      ],
      "hiType": "Invoice",
      "count": 1
    }
  ]
}'
```
