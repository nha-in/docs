# Update mobile - verify OTP

`POST /abha/api/v3/profile/account/verify`

Verifies the OTP sent by *Update mobile - send OTP* and updates the mobile number on the ABHA profile.

**Endpoint:** `POST /abha/api/v3/profile/account/verify`

**Flow:** **Profile - Update Mobile** - step 2 of 2
- Previous: *Update mobile - send OTP*
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
| `scope` | `["ABHA-profile", "mobile-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["OTP"]` | yes | Authentication method used in this step. |
| `authData.OTP` | object | yes | OTP authentication block. |
| `authData.OTP.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.OTP.otpValue` | string | yes | OTP received by the user, RSA-encrypted. |

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
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp}}"
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

- `200`: Success: Update Mobile- Positive Flow
- `400`: Bad Request (request validation failed): Update Mobile- Invalid Transaction Id; Update Mobile- Invalid Scope; Update Mobile- Invalid Auth Methods; Update Mobile- Invalid X-token; Update Mobile- Invalid OTP Value
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Update Mobile- Invalid access token; Update Mobile- X-token expired
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `422`: Unprocessable Entity (business rule or UIDAI failure).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "01bb3a4c-4588-4734-aff4-23d3978e50be",
  "authResult": "success",
  "message": "Mobile Number linked successfully",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    }
  ]
}
```
