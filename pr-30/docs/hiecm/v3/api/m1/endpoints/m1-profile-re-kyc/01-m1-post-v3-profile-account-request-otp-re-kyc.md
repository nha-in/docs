# Re-KYC - send Aadhaar OTP

`POST /abha/api/v3/profile/account/request/otp`

Starts Re-KYC of a logged-in ABHA (`X-token`). UIDAI sends an OTP to the Aadhaar-linked mobile.

**Endpoint:** `POST /abha/api/v3/profile/account/request/otp`

**Flow:** **Profile - Re-KYC** - step 1 of 2
- Previous: none (first call of this flow)
- Next: *Re-KYC - verify Aadhaar OTP*

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
| `loginHint` | `"ABHA-number"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"Aadhaar"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |

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
    "re-kyc"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "aadhaar"
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
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: abha-number.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: aadhaar.

## Responses

- `200`: Success: ReKYC-Send OTP
- `400`: Bad Request (request validation failed): Re-KYC- Invalid Scope; Re-KYC- Invalid X-token; Re-KYC- Invalid LoginId; Re-KYC- Invalid Login Hint
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "c2095ea0-52ed-44ee-b8fc-02375b874e7a",
  "message": "OTP is sent to Aadhaar registered mobile number ending with *******0903"
}
```
