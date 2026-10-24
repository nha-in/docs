# Submit the reply to a share request with the data push URL and the encryption key

`POST /api/hiecm/patient-record/v3/on-share`

Acts as the callback endpoint for the PHR application. After the initial request, the HIU responds to this callback with the data push URL and the encryption key required for securely transferring the user's health records.

The HIU makes this call after receiving the share request on its /api/v3/patient-record/share bridge endpoint. The transactionId is the one that request carried, and response.requestId is that request's REQUEST-ID. The HIE-CM forwards the body to the PHR app's /api/v3/patient-record/on-share callback.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/patient-record/v3/on-share \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIU-ID: HIU_ID' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "hiRequest": {
    "transactionId": "18235d89-cb13-479d-ad71-7a57d5f669a8",
    "dataPushUrl": "https://webhook.site/a2477c41-2185-47eb-835a/health-information/transfer",
    "keyMaterial": {
      "cryptoAlg": "ECDH.",
      "curve": "curve25519",
      "dhPublicKey": {
        "expiry": "2022-12-28T13:18:20.742Z",
        "parameters": "Ephemeral public key.",
        "keyValue": "BFN7KTdOT0jIAExG2A8Jg+01wMPWxptiGqwHRVvtiVEsUq2FR7P2UdqZxJyPJSeR6muai21iQhasNxnhh8I5M+g="
      },
      "nonce": "28236d89-cb13-479d-ad71-7a57d5f669a9"
    }
  },
  "response": {
    "requestId": "efd6964f-6893-4b66-9e4e-28afc164126b"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): JWT access token issued by the ABDM session API after successful validation of client id and secret.

## Headers

- `REQUEST-ID` (string, required): Random UUID, a v4 style guid, unique per request.
- `TIMESTAMP` (string, required): ISO 8601 timestamp of when the request was initiated.
- `X-HIU-ID` (string, required): Identifier of the health information user to which the request was intended.
- `X-CM-ID` (string, required): Suffix of the consent manager to which the request was intended. sbx in the sandbox, abdm in production.

## Body

- `hiRequest` (object, required): The data push URL and the encryption key.
- `hiRequest.transactionId` (string, required): The transactionId the share request carried.
- `hiRequest.dataPushUrl` (string, required): The HIU's URL the PHR app posts the encrypted records to.
- `hiRequest.keyMaterial` (object, required)
- `response` (object, required)
- `response.requestId` (string, required): The REQUEST-ID of the share request this answers.

## Responses

- `202`: Accepted. The HIE-CM forwards the data push URL and key to the PHR app's on-share callback.
  See The callback never arrives: /docs/hiecm/v3/troubleshooting/callback-never-arrives
