# Login via Biometric (Fingerprint) - v3.1 single step

`POST /abha/api/v3.1/profile/login/verify`

v3.1 fingerprint login in a single call. Send the encrypted Aadhaar number and the fingerprint PID. Returns the user X-token (`token`). No send-request step is needed.

**Endpoint:** `POST /abha/api/v3.1/profile/login/verify`

**Flow:** **Login - Biometric v3.1** - independent API; call the one that fits your identifier / modality.

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-login", "Aadhaar-bio-login-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["bio_login"]` | yes | Authentication method used in this step. |
| `authData.bio_login` | object | yes | Fingerprint login block (v3.1). |
| `authData.bio_login.Aadhaar` | string | yes | Aadhaar number, RSA-encrypted. |
| `authData.bio_login.fingerPrintAuthPid` | string | yes | Base64 PID block captured from a registered fingerprint RD device. |

> **Note:** This API is only in the Postman collection (v3.1). The request/response is taken from there, and the success response shape reuses the v3 biometric verify example.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-login-verify"
  ],
  "authData": {
    "authMethods": [
      "bio_login"
    ],
    "bio_login": {
      "aadhaar": "{{encryptedAadhaar}}",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.bio_login` (object, required): Fingerprint login block (v3.1).
- `authData.bio_login.aadhaar` (string, required): Aadhaar number, RSA-encrypted.
- `authData.bio_login.fingerPrintAuthPid` (string, required): Base64 PID block captured from a registered fingerprint RD device.

## Responses

- `200`: Success: Verify Login via Fingerprint (v3.1) - Positive flow
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: User Not Found; Resource Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "fe1c527e-1ab8-40c4-84d2-9eedb3378d39",
  "authResult": "success",
  "message": "BIO verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1800,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE",
      "profilePhoto": "<BASE64_PHOTO>"
    }
  ]
}
```
