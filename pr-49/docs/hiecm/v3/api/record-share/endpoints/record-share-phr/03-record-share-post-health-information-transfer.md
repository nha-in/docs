# Push the encrypted records to the HIU's data push URL, as the PHR app

`POST /health-information/transfer`

**Hosted by the HIU at the dataPushUrl it supplied in on-share, not by ABDM.** The PHR application posts here directly; the path is whatever the data push URL names.

The PHR app sends the records covered by the share, one entry per care context, each an encrypted FHIR bundle with its checksum, along with the PHR app's own ECDH key material so the HIU can derive the shared key and decrypt. The shape below is the placeholder body in NHA's Postman collection; it follows the M2 and M3 health information transfer.

```bash
curl --request POST \
  --url {bridgeUrl}/health-information/transfer \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'request-id: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'timestamp: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "pageNumber": 0,
  "pageCount": 0,
  "transactionId": "string",
  "entries": [
    {
      "content": "Encrypted content of data packaged in FHIR bundle",
      "media": "mimetype of the content.",
      "checksum": "string",
      "careContextReference": "10004-20200001768-1"
    },
    {
      "content": "Encrypted content of data packaged in FHIR bundle",
      "media": "mimetype of the content.",
      "checksum": "string",
      "careContextReference": "10004-20200001768-2"
    }
  ],
  "keyMaterial": {
    "cryptoAlg": "ECDH",
    "curve": "Curve25519",
    "dhPublicKey": {
      "expiry": "2026-12-28T13:18:20.742Z",
      "parameters": "Curve25519/32byte random key",
      "keyValue": "string"
    },
    "nonce": "string"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `request-id` (string, required): Random UUID, a v4 style guid, unique per callback.
- `timestamp` (string, required): ISO 8601 timestamp of when the callback was sent.

## Body

- `pageNumber` (integer, required): This page, counting from 0.
- `pageCount` (integer, required): How many pages the transfer has.
- `transactionId` (string, required): The transfer's identifier, from the share request.
- `entries` (object[], required): One entry per care context shared.
- `entries.content` (string): Encrypted content of data packaged in a FHIR bundle.
- `entries.media` (string): MIME type of the content.
- `entries.checksum` (string): Checksum of the content.
- `entries.careContextReference` (string)
- `keyMaterial` (object, required): ECDH key material for encrypting the records.
- `keyMaterial.cryptoAlg` (string, required)
- `keyMaterial.curve` (string, required)
- `keyMaterial.dhPublicKey` (object, required)
- `keyMaterial.dhPublicKey.expiry` (string, required)
- `keyMaterial.dhPublicKey.parameters` (string, required)
- `keyMaterial.dhPublicKey.keyValue` (string, required): The public key, base64.
- `keyMaterial.nonce` (string, required): A 32 byte random nonce for this transfer.

## Responses

- `202`: Accepted. Decrypt, then call notify with RECEIVED, PARTIAL_RECEIVED or FAILED.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
