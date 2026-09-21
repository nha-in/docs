# Login via Face Auth (QR) - verify

`POST /abha/api/v3.1/profile/login/verify`

Completes login through the face-auth QR / ABHA-app flow. First call *Face auth - generate transaction ID (init)*, then poll *Face auth - capture PID / track status* until `COMPLETE`. Then send the same `txnId` here. Returns the user X-token (`token`).

**Endpoint:** `POST /abha/api/v3.1/profile/login/verify`

**Flow:** **Login - Face Auth QR (v3.1)** - step 3 of 3
- Previous: *Face auth - capture PID / track status*
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["abha-login", "aadhaar-face-login-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["face_auth"]` | yes | Authentication method used in this step. |
| `authData.face_login` | object | yes | Face login block (v3.1). |
| `authData.face_login.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.face_login.aadhaar` | string | yes | Aadhaar number, RSA-encrypted. |

> **Note:** This API is only in the Postman collection (v3.1).

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-face-login-verify"
  ],
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face_login": {
      "txnId": "8220299c-40ad-40b6-bc52-13a7d46a69d0",
      "aadhaar": "{{encrypted aadhaar number}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.face_login` (object, required): Face login block (v3.1).
- `authData.face_login.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.face_login.aadhaar` (string, required): Aadhaar number, RSA-encrypted.

## Responses

- `200`: Success: Positive flow
- `400`: Bad Request (request validation failed).
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
  "txnId": "ad0aff4b-77dc-48c0-9c4a-18ac4f13af49",
  "authResult": "success",
  "message": "FACE verified successfully",
  "token": "<TOKEN>...",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>...",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "{{base64 profile photo}}"
    }
  ]
}
```
