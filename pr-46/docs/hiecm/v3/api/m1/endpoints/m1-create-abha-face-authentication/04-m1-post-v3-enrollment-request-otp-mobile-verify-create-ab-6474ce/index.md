# After ABHA creation - send OTP to verify mobile (optional)

`POST /abha/api/v3/enrollment/request/otp`

Optional, called after the ABHA is created. Needed only when the `mobile` sent in the create-ABHA call is **not** the Aadhaar-linked mobile. ABDM sends an OTP to that mobile number so it can be linked to the ABHA. Send the `txnId` from the ABHA creation response.

**Endpoint:** `POST /abha/api/v3/enrollment/request/otp`

**Flow:** **Create ABHA - Face Authentication** - step 4 of 9
- Previous: *Create ABHA - Aadhaar face authentication*
- Next: *After ABHA creation - verify mobile OTP (optional)*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `scope` | `["ABHA-enrol", "mobile-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"mobile"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"ABDM"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "{{encrypted mobileNumber}}",
  "otpSystem": "abdm"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: mobile.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: abdm.

## Responses

- `200`: Success: Mobile Update - Send OTP- positive flow
  - `txnId` (string)
  - `message` (string)
- `400`: Bad Request (request validation failed): Mobile Update - Send OTP-Invalid Scope; Mobile Update - Send OTP-Invalid LoginId; Mobile Update - Send OTP-Invalid Login Hint
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `scope` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Mobile Update - Send OTP-Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `code` (string)
  - `message` (string)
  - `description` (string)

Example 200 response. The values are placeholders:

```json
{
  "txnId": "37d8d312-35a0-41e7-a6e4-107h6b18a5fa",
  "message": "OTP sent to mobile number ending with ******0903"
}
```
