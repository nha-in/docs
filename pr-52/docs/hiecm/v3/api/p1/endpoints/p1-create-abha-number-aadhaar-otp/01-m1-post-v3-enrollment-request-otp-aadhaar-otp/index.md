# Send Aadhaar OTP for ABHA enrolment

`POST /abha/api/v3/enrollment/request/otp`

Starts ABHA creation with Aadhaar OTP. UIDAI sends an OTP to the mobile number linked with the Aadhaar number. Use the `txnId` from the response in *Create ABHA - verify Aadhaar OTP*.

**Endpoint:** `POST /abha/api/v3/enrollment/request/otp`

**Flow:** **Create ABHA - Aadhaar OTP** - step 1 of 8
- Previous: none (first call of this flow)
- Next: *Create ABHA - verify Aadhaar OTP*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `txnId` | string | no | Transaction ID returned by the previous step of this flow. |
| `scope` | `["ABHA-enrol"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"Aadhaar"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"Aadhaar"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |

> **Note:** `txnId` is optional here. Leave it empty on the first call, or send a previous `txnId` to resend the OTP.

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
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": "{{encrypted aadhaar number}}",
  "otpSystem": "aadhaar"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `txnId` (string): Transaction ID returned by the previous step of this flow.
- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: aadhaar.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: aadhaar.

## Responses

- `200`: Success: ABHA enrolment via Aadhaar-positive flow; ABHA Creation via Aadhaar OTP-REQUEST OTP FOR AADHAAR AUTHENTICATION
  - `txnId` (string)
  - `message` (string)
- `400`: Bad Request (request validation failed): ABHA enrolment via Aadhaar-Invalid scope; ABHA enrolment via Aadhaar-Invalid LoginId; ABHA enrolment via Aadhaar-Invalid Login Hint; ABHA Creation via Aadhaar OTP-Invalid scope; ABHA Creation via Aadhaar OTP-Invalid Login Hint
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `scope` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): ABHA enrolment via Aadhaar-Invalid access token; ABHA Creation via Aadhaar OTP-Invalid access token
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
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "message": "OTP sent to Aadhaar registered mobile number ending with ******0903"
}
```
