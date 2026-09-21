# Find ABHA via Fingerprint - verify

`POST /abha/api/v3/profile/login/verify`

Completes fingerprint authentication for the chosen account. Send the `txnId` from *Find ABHA via Fingerprint - send authentication request* with the fingerprint PID.

**Endpoint:** `POST /abha/api/v3/profile/login/verify`

**Flow:** **Find ABHA - Fingerprint** - step 3 of 3
- Previous: *Find ABHA via Fingerprint - send authentication request*
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["abha-login", "aadhaar-bio-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["bio"]` | yes | Authentication method used in this step. |
| `authData.bio` | object | yes | Fingerprint authentication block. |
| `authData.bio.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.bio.fingerPrintAuthPid` | string | yes | Base64 PID block captured from a registered fingerprint RD device. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "{{txnId}}",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.bio` (object, required): Fingerprint authentication block.
- `authData.bio.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.bio.fingerPrintAuthPid` (string, required): Base64 PID block captured from a registered fingerprint RD device.

## Responses

- `200`: Success: Find ABHA via Fingerprint - Positive flow
- `400`: Bad Request (request validation failed): Invalid Fingerprint PID
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: User Not Found; Resource Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "fe1c527e-1ab8-40c4-84d2-9eedb3378d39",
  "authResult": "success",
  "message": "BIO verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```
