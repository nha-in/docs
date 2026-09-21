# Re-KYC - verify Aadhaar OTP

`POST /abha/api/v3/profile/account/verify`

Verifies the Aadhaar OTP sent by *Re-KYC - send Aadhaar OTP* and refreshes the ABHA's KYC details from Aadhaar.

**Endpoint:** `POST /abha/api/v3/profile/account/verify`

**Flow:Profile - Re-KYC** - step 2 of 2
- Previous: *Re-KYC - send Aadhaar OTP*
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| X-token | yes | User token (`Bearer `) received after ABHA creation / login. |
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-profile", "re-KYC"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
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
    "re-kyc"
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

- `Authorization` (bearer token, required)

## Headers

- `X-token` (string, required): User token (`Bearer `) received after ABHA creation / login.
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

- `200`: Success: Re-KYC- Positive Flow
- `400`: Bad Request (request validation failed): Re-KYC- Invalid Transaction Id; Re-KYC- Invalid Scope; ReKyc- Invalid Auth Method; Re-KYC- Invalid X-token; Re-Kyc- Invalid OTP Value
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): ReKyc- Invalid access token; ReKYC- X-token expired
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `422`: Unprocessable Entity (business rule or UIDAI failure): Re-KYC-INVALID OTP
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "bb548986-e96d-4b48-be1b-1e36741e867d",
  "authResult": "success",
  "message": "Re-kyc done successfully",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    }
  ]
}
```
