# ABHA address login via Aadhaar OTP - verify

`POST /abha/api/v3/phr/web/login/abha/verify`

Verifies the Aadhaar OTP for ABHA-address login. Returns the linked ABHA address(es) in `users` and `tokens.token`. Send that token as the `X-token` header to the ABHA-address profile, PHR card and QR code APIs.

**Endpoint:** `POST /abha/api/v3/phr/web/login/abha/verify`

**Flow:** **ABHA Address Login - Aadhaar OTP** - step 3 of 6
- Previous: *ABHA address login via Aadhaar OTP - send OTP*
- Next: *Get ABHA-address profile*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-address-login", "Aadhaar-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["OTP"]` | yes | Authentication method used in this step. |
| `authData.OTP` | object | yes | OTP authentication block. |
| `authData.OTP.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.OTP.otpValue` | string | yes | OTP received by the user, RSA-encrypted. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "aadhaar-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "otpValue": "{{encryptedOtpValue}}"
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

- `200`: Success: OTP Verification -Success Aadhaaar Otp
- `400`: Bad Request (request validation failed): ABHA Address Verification via Aadhaar OTP-Invalid Scope; ABHA Address Verification via Aadhaar OTP-Invalid Auth Methods; ABHA Address Verification via Aadhaar OTP-Invalid Transaction Id
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Missing Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "message": "OTP verified successfully",
  "authResult": "success",
  "users": [
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "<NAME>",
      "profilePhoto": "<BASE64_PHOTO>",
      "abhaNumber": "<ABHA_NUMBER>",
      "status": "ACTIVE",
      "kycStatus": "VERIFIED"
    }
  ],
  "tokens": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000
  }
}
```
