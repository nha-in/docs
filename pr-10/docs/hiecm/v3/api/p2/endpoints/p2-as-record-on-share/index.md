# AS - Record On Share

`POST /scan-share/record-share/on-share`

Callback the gateway sends with the outcome of a record share request.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/scan-share/record-share/on-share \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "<TXN_ID>",
    "dataPushUrl": "https://webhook.site/<TXN_ID>/health-information/transfer",
    "keyMaterial": {
      "cryptoAlg": "ECDH.",
      "curve": "curve25519",
      "dhPublicKey": {
        "expiry": "2026-12-28T13:18:20.742Z",
        "parameters": "Ephemeral public key.",
        "keyValue": "<KEYVALUE>"
      },
      "nonce": "H5EG5X61tTJ2ctjs3ByenbMvUezrf1VCRHZukspooaY="
    }
  },
  "response": {
    "requestId": "<TXN_ID>"
  }
}'
```
