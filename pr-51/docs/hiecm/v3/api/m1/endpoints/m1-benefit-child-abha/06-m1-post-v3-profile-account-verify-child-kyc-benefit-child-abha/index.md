# Child ABHA KYC - verify Aadhaar OTP

`POST /abha/api/v3/profile/account/verify`

Verifies the Aadhaar OTP sent by *Child ABHA KYC - send Aadhaar OTP* and marks the Child ABHA as KYC verified.

**Endpoint:** `POST /abha/api/v3/profile/account/verify`

**Flow:** **Benefit - Child ABHA** - step 6 of 6
- Previous: *Child ABHA KYC - send Aadhaar OTP*
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| X-token | yes | User token (`Bearer <token>`) received after ABHA creation / login. |
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-profile", "re-KYC"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["OTP"]` | yes | Authentication method used in this step. |
| `authData.otp` | object | yes | OTP authentication block. |
| `authData.otp.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.otp.otpValue` | string | yes | OTP received by the user, RSA-encrypted. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp value}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): User token (`Bearer <token>`) received after ABHA creation / login.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.otp` (object, required): OTP authentication block.
- `authData.otp.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.otp.otpValue` (string, required): OTP received by the user, RSA-encrypted.

## Responses

- `200`: Success: CHILD ABHA KYC- Positive Flow
  - `txnId` (string)
  - `authResult` (string)
  - `message` (string)
  - `accounts` (object[])
  - `accounts.ABHANumber` (string)
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `Invalid Scope` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `422`: Unprocessable Entity (business rule or UIDAI failure).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `message` (string)
  - `timestamp` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "txnId": "bb548986-e96d-4b48-be1b-1e36741e867d",
  "authResult": "success",
  "message": "KYC verification has been done",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    },
    {
      "mobileVerified": "true"
    }
  ]
}
```
