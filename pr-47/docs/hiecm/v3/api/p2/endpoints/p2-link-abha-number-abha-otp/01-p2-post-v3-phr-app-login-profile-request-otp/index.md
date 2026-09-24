# Request profile OTP

`POST /abha/api/v3/phr/app/login/profile/request/otp`

Flows:
- P2-Consents Management › P2 -PHR Profile › P2 - Update Mobile › Send OTP - Update Mobile
- P2-Consents Management › P2 -PHR Profile › P2 - Link ABHA Number › P2 - via ABHA OTP › Send ABHA OTP - Link-DeLink
- P2-Consents Management › P2 -PHR Profile › P2 - Link ABHA Number › P2 - via Aadhaar OTP › Send Aadhaar OTP - Link-DeLink

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "loginHint": "abha-number",
  "loginId": "<ENCRYPTED_LOGIN_ID>",
  "otpSystem": "abdm"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): The user token from a login or enrolment response, sent with a `Bearer ` prefix. It acts for that ABHA holder.
- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.

## Body

- `scope` (string[], required)
- `loginHint` (string, required)
- `loginId` (string, required)
- `otpSystem` (string, required)

## Responses

- `200`: OK
  - `txnId` (string)
  - `message` (string)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors

Example 200 response. The values are placeholders:

```json
{
  "txnId": "d01cebdf-95f5-480c-8289-6f3b218e7248",
  "message": "OTP is sent to Mobile number ending with ******2425"
}
```
