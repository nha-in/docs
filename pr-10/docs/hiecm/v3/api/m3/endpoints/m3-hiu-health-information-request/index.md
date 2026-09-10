# Request a patient's health information

`POST /hiecm/data-flow/v3/health-information/request`

Also known as: HIU Health Information Request.
Requests health data from the HIP for a specific consent artefact.

The HIU must:
1. Generate an ECDH key pair before this call
2. Pass the ECDH public key in `keyMaterial.dhPublicKey`
3. Expose a `dataPushUrl` endpoint that can receive encrypted FHIR data from the HIP

The HIP encrypts data using the HIU's public key (ECDH shared secret) and pushes
it to `dataPushUrl`. The HIU decrypts using its private key + HIP's public key
from the push request's `keyMaterial`.

**Supported ECDH curves:** `Curve25519`
**Supported crypto algorithms:** `ECDH`

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIU-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "consent": {
      "id": "consent-art-uuid-001"
    },
    "dateRange": {
      "from": "2023-01-01T00:00:00.000Z",
      "to": "2024-01-01T00:00:00.000Z"
    },
    "dataPushUrl": "https://your-hiu-server.com/abdm/data/push",
    "keyMaterial": {
      "cryptoAlg": "ECDH",
      "curve": "Curve25519",
      "dhPublicKey": {
        "expiry": "2024-12-31T00:00:00.000Z",
        "parameters": "Curve25519/32byte",
        "keyValue": "base64-encoded-hiu-ecdh-public-key"
      },
      "nonce": "base64-encoded-random-nonce-32bytes"
    }
  }
}'
```
