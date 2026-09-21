# After ABHA creation - send OTP to verify email (optional)

`POST /abha/api/v3/enrollment/request/otp`

Optional. Sends an ABDM OTP to an email address so it can be linked to the newly created ABHA. Send the `txnId` from the previous enrolment step.

**Endpoint:** `POST /abha/api/v3/enrollment/request/otp`

**Flow:** **Create ABHA - Face Authentication** - step 6 of 9
- Previous: *After ABHA creation - verify mobile OTP (optional)*
- Next: *After ABHA creation - verify email OTP (optional)*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `scope` | `["abha-enrol", "email-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"email"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"abdm"` | yes | System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). |

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
    "email-verify"
  ],
  "loginHint": "email",
  "loginId": "{{encrypted email}}",
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
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: email.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: abdm.

## Responses

- `200`: Success: Email Verify via OTP-positive flow
- `400`: Bad Request (request validation failed): ABHA Verify via Email-Invalid scope; ABHA Verify via Email-Invalid LoginId; ABHA Verify via Email-Invalid Login Hint
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Email verify via  OTP-Invalid access token
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "message": "OTP sent to email address ending with *************<EMAIL>"
}
```
