# Health Information Data Transfer (HIP to HIU)

`POST /api/care-context-link/v0.5/health-information/transfer`

Receives a page of encrypted health information from a HIP, with the key material needed to decrypt it. Pages arrive in sequence under one transaction id.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/v0.5/health-information/transfer \
  --header 'Content-Type: application/json' \
  --data '{
  "pageNumber": 1,
  "pageCount": 1,
  "transactionId": "txn-001",
  "entries": [
    {
      "content": "<encrypted-content-here>",
      "media": "application/fhir+json",
      "checksum": "checksum-value",
      "careContextReference": "care-context-ref-001"
    }
  ],
  "keyMaterial": {
    "cryptoAlg": "ECDH",
    "curve": "curve25519",
    "dhPublicKey": {
      "expiry": "2026-12-31T00:00:00.000Z",
      "parameters": "Ephemeral public key",
      "keyValue": "<KEYVALUE>"
    },
    "nonce": "<nonce-value>"
  }
}'
```
