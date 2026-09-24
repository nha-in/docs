# Login via Mobile number - verify OTP

`POST /abha/api/v3/profile/login/verify`

Verifies the mobile OTP. Returns a short-lived token (`token`, used as the `T-token` header) and the list of ABHA accounts linked to the mobile. Then call *Login via Mobile number - verify user (select ABHA)* with the chosen ABHA number to get the user X-token.

**Endpoint:** `POST /abha/api/v3/profile/login/verify`

**Flow:** **Login - Mobile Number** - step 2 of 3
- Previous: *Login via Mobile number - send OTP*
- Next: *Login via Mobile number - verify user (select ABHA)*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-login", "mobile-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["OTP"]` | yes | Authentication method used in this step. |
| `authData.otp` | object | yes | OTP authentication block. |
| `authData.otp.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.otp.otpValue` | string | yes | OTP received by the user, RSA-encrypted. |

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
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted OTP}}"
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
- `authData.otp` (object, required): OTP authentication block.
- `authData.otp.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.otp.otpValue` (string, required): OTP received by the user, RSA-encrypted.

## Responses

- `200`: Success: Verify Login Via Mobile Number
  - `authResult` (string)
  - `message` (string)
  - `token` (string)
  - `expiresIn` (integer)
  - `refreshToken` (string)
  - `refreshExpiresIn` (integer)
  - `accounts` (object[])
  - `accounts.ABHANumber` (string)
  - `accounts.preferredAbhaAddress` (string)
  - `accounts.name` (string)
  - `accounts.status` (string)
  - `accounts.profilePhoto` (string)
- `400`: Bad Request (request validation failed): Invalid OTP Value; Invalid Transaction Id
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `description` (string)
  - `message` (string)
- `404`: Not Found: User Not Found; Resource Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "txnId": "588453aa-4bb0-44c0-bbdd-62ebd53c37c6",
  "authResult": "success",
  "message": "OTP verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 300,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "AADHAAR",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>",
      "kycVerified": true
    },
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dob": "<DOB>",
      "verifiedStatus": "VERIFIED",
      "verificationType": "CHILD_ABHA",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```
