# The encrypted health data itself, pushed to the URL you supplied

`POST /health-information/transfer`

The actual encrypted FHIR bundle. The HIP Data Bridge posts this directly to
the `dataPushUrl` you supplied in the health information request; it is not
routed through the Gateway, and this literal path is illustrative rather than
fixed, because `dataPushUrl` is a URL you host and register yourself.

Decrypt `entries[].content` with the ECDH shared secret derived from your
private key and `keyMaterial`. `entries[].checksum` is the MD5 of the content
before encryption, so verify it after decrypting. Large payloads arrive across
several calls, paginated by `pageNumber` and `pageCount`.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/health-information/transfer \
  --header 'Content-Type: application/json' \
  --data '{
  "pageNumber": 1,
  "pageCount": 1,
  "transactionId": "8376a2b0-3fc9-4bb5-8af5-54a49a3910f4",
  "entries": [
    {
      "content": "encrypted-fhir-bundle-content",
      "media": "application/fhir+json",
      "checksum": "d41d8cd98f00b204e9800998ecf8427e",
      "careContextReference": "manishk@abdm-02"
    }
  ],
  "keyMaterial": {
    "cryptoAlg": "ECDH",
    "curve": "Curve25519",
    "dhPublicKey": {
      "expiry": "2024-12-31T00:00:00.000Z",
      "parameters": "Curve25519/32byte",
      "keyValue": "base64-encoded-hip-ecdh-public-key"
    },
    "nonce": "base64-encoded-random-nonce-32bytes"
  }
}'
```
