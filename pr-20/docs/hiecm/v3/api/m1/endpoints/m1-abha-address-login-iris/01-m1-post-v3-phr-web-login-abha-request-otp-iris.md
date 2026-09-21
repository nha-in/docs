# ABHA address login via IRIS - send authentication request

`POST /abha/api/v3/phr/web/login/abha/request/otp`

Starts IRIS login with an ABHA address. `loginId` is the RSA-encrypted ABHA address. Use the returned `txnId` in *ABHA address login via IRIS - verify*.

**Endpoint:** `POST /abha/api/v3/phr/web/login/abha/request/otp`

**Flow:** **ABHA Address Login - IRIS** - step 1 of 5
- Previous: none (first call of this flow)
- Next: *ABHA address login via IRIS - verify*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["abha-login", "aadhaar-iris-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"abha-address"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"aadhaar"` | yes | System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). |

> **Note:** Biometric ABHA-address login uses scope `abha-login`, not `abha-address-login` (the same in Swagger and Postman).

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: abha-address.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: aadhaar.

## Responses

- `200`: Success: Send Authentication Request via Biometric (IRIS Authentication)
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Missing Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "4faf0ca4-ce24-4804-8dfa-1dd1c9f0edfb",
  "message": "Iris authentication request successfully sent"
}
```
