# Update mobile - send OTP

`POST /abha/api/v3/profile/account/request/otp`

Starts a mobile number change for a logged-in ABHA user (`X-token`). ABDM sends an OTP to the **new** mobile number.

**Endpoint:** `POST /abha/api/v3/profile/account/request/otp`

**Flow:Profile - Update Mobile** - step 1 of 2
- Previous: none (first call of this flow)
- Next: *Update mobile - verify OTP*

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| X-token | yes | User token (`Bearer `) received after ABHA creation / login. |
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-profile", "mobile-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"mobile"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"ABDM"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp \
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
  "loginHint": "mobile",
  "loginId": "{{encrypted mobile number}}",
  "otpSystem": "abdm"
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
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: mobile.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: abdm.

## Responses

- `200`: Success: Update Mobile-Positive flow
- `400`: Bad Request (request validation failed): Update Mobile- Invalid Scope; Update Mobile- Invalid LoginId; Update Mobile- Invalid Login Hint; Update Mobile-Already verified mobile number
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "1c5fa806-67e1-4ad5-a848-0c4d805cd824",
  "message": "OTP sent to mobile number ending with ******0903"
}
```
