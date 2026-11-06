# Receive the HIU's data push URL and encryption key, as the PHR app

`POST /api/v3/patient-record/on-share`

**Hosted by the PHR application, not by ABDM.** The HIE-CM calls this endpoint at the callback URL registered for your bridge, so the path below is relative to that URL.

This is a callback API for the PHR application. The HIE-CM provides the HIU's answer to the share request: the data push URL to post the records to, and the ECDH key material to encrypt them with. Generate your own key pair and nonce, encrypt each record, and POST them to the data push URL, then call POST /api/hiecm/patient-record/v3/notify with the transfer status.

```bash
curl --request POST \
  --url {bridgeUrl}/api/v3/patient-record/on-share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'request-id: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'timestamp: 2022-10-06T15:10:00.587Z' \
  --header 'x-hiu-id: HIU_ID' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "56582bc6-5c17-4b32-9244-9b61d47a8059",
    "dataPushUrl": "https://webhook.site/a2477c41-2185-47eb-835a/health-information/transfer",
    "keyMaterial": {
      "cryptoAlg": "ECDH.",
      "curve": "curve25519",
      "dhPublicKey": {
        "expiry": "2026-12-28T13:18:20.742Z",
        "parameters": "Ephemeral public key.",
        "keyValue": "BFN7KTdOT0jIAExG2A8Jg+01wMPWxptiGqwHRVvtiVEsUq2FR7P2UdqZxJyPJSeR6muai21iQhasNxnhh8I5M+g="
      },
      "nonce": "e589643f-48a9-41ed-ab2b-479e709e8f80"
    }
  },
  "response": {
    "requestId": "180ce450-ce28-493f-ac43-9f5253fa1167"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `request-id` (string, required): Random UUID, a v4 style guid, unique per callback.
- `timestamp` (string, required): ISO 8601 timestamp of when the callback was sent.
- `x-hiu-id` (string, required): Identifier of the health information user to which the request was intended.

## Body

- `hiRequest` (object, required): The data push URL and the encryption key.
- `hiRequest.transactionId` (string, required): The transactionId the share request carried.
- `hiRequest.dataPushUrl` (string, required): The HIU's URL the PHR app posts the encrypted records to.
- `hiRequest.keyMaterial` (object, required)
- `response` (object, required)
- `response.requestId` (string, required): The REQUEST-ID of the share request this answers.

## Responses

- `202`: Accepted. Post the encrypted records to the data push URL next.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
