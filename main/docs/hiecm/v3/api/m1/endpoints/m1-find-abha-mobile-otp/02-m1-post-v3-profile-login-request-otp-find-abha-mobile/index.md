# Find ABHA via Mobile - send OTP

`POST /abha/api/v3/profile/login/request/otp`

Sends a mobile OTP for the ABHA account picked from *Search ABHA by mobile*. Send `loginHint: index`, the RSA-encrypted `index` of the chosen account, and the `txnId` returned by the search.

**Endpoint:** `POST /abha/api/v3/profile/login/request/otp`

**Flow:** **Find ABHA - Mobile OTP** - step 2 of 3
- Previous: *Search ABHA by mobile*
- Next: *Find ABHA via Mobile - verify OTP*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-login", "search-ABHA", "mobile-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `loginHint` | `"index"` | yes | Type of identifier sent in `loginId`. |
| `loginId` | string | yes | Identifier value, RSA-encrypted with the ABHA public certificate. |
| `otpSystem` | `"ABDM"` | yes | System that generates and delivers the OTP (`Aadhaar` = UIDAI, `ABDM` = ABDM). |
| `txnId` | string | yes | Transaction ID returned by the previous step of this flow. |

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
    "search-abha",
    "mobile-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "abdm",
  "txnId": "{{searchTxnId}}"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `loginHint` (string, required): Type of identifier sent in `loginId`. One of: index.
- `loginId` (string, required): Identifier value, RSA-encrypted with the ABHA public certificate.
- `otpSystem` (string, required): System that generates and delivers the OTP (`aadhaar` = UIDAI, `abdm` = ABDM). One of: abdm.
- `txnId` (string, required): Transaction ID returned by the previous step of this flow.

## Responses

- `200`: Success: Search ABHA Via Mobile Number - Send OTP
  - `txnId` (string)
  - `message` (string)
- `400`: Bad Request (request validation failed): Search ABHA Via Mobile Number - Invalid LoginId
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `txnId` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `code` (string)
  - `message` (string)
  - `description` (string)
- `404`: Not Found: Resource not found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `timestamp` (string)
  - `path` (string)
  - `description` (string)
  - `error` (string)
  - `requestId` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "txnId": "dcc22def-8102-4c9a-a36e-15743556fdc4",
  "message": "OTP sent to Aadhaar registered mobile number ending with ******7828"
}
```
