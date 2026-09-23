# Login via Biometric (Iris) - send authentication request

`POST /abha/api/v3/profile/login/request/otp`

Starts IRIS login for an ABHA number. Use the returned `txnId` in *Login via Biometric (Iris) - verify*.

**Endpoint:** `POST /abha/api/v3/profile/login/request/otp`

**Flow:** **Login - Biometric v3 (Iris)** - step 1 of 2
- Previous: none (first call of this flow)
- Next: *Login via Biometric (Iris) - verify*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-login", "Aadhaar-iris-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"ABHA-number"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"ABDM"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |

> **Note:** The Postman collection does biometric login with a single call to `/abha/api/v3.1/profile/login/verify` (see tag *Login - Biometric v3.1*). Confirm which contract is current.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "{{encrypted abha-number}}",
  "otpSystem": "abdm"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: abha-number.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: abdm.

## Responses

- `200`: Success: Login Via Biometric - Using Iris - Send OTP
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: Resource not found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "message": "IRIS authentication request successfully sent."
}
```
