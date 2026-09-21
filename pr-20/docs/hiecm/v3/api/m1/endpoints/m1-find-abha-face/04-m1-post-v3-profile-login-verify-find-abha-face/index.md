# Find ABHA via Face - verify

`POST /abha/api/v3/profile/login/verify`

Completes face authentication for the chosen account. Once *Face auth - capture PID / track status* reports `COMPLETE`, send the same `txnId` here (the body has no PID).

**Endpoint:** `POST /abha/api/v3/profile/login/verify`

**Flow:** **Find ABHA - Face** - step 4 of 4
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
| `scope` | `["abha-login", "aadhaar-face-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["face_auth"]` | yes | Authentication method used in this step. |
| `authData.face` | object | yes | Face authentication block. |
| `authData.face.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |

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
    "aadhaar-face-verify"
  ],
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "{{txnId}}"
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
- `authData.face` (object, required): Face authentication block.
- `authData.face.txnId` (string, required): Transaction ID returned by the previous step of this flow.

## Responses

- `200`: Success: Positive flow
- `400`: Bad Request (request validation failed): Invalid DTO; Invalid DTO (2); Invalid PID; Empty Body; Invalid TxnId; Invalid AuthMethod; Invalid AuthMethod (2)
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Authorization
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: Invalid URL
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `422`: Unprocessable Entity (business rule or UIDAI failure): Used PID; Expired PID; Used Bio PID; Another User PID; Biometric not matched
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "d17cb533-9bfa-40f5-a7bc-b84143516787",
  "authResult": "success",
  "message": "Aadhaar Face Authentication Success",
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
      "profilePhoto": "{{base64 profile photo}}",
      "mobileVerified": false
    }
  ]
}
```
