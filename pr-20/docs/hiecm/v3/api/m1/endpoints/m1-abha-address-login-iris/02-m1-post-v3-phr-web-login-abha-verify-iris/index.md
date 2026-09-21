# ABHA address login via IRIS - verify

`POST /abha/api/v3/phr/web/login/abha/verify`

Completes IRIS login with an ABHA address. Send the `txnId` and the IRIS PID. Returns `users` and `tokens.token` (send it as `X-token` to the profile, PHR card and QR code APIs).

**Endpoint:** `POST /abha/api/v3/phr/web/login/abha/verify`

**Flow:ABHA Address Login - IRIS** - step 2 of 5
- Previous: *ABHA address login via IRIS - send authentication request*
- Next: *Get ABHA-address profile*

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| REQUEST-ID | yes | Unique UUID for every request. |
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `scope` | `["ABHA-login", "Aadhaar-iris-verify"]` | yes | Scope that selects this use case. Send exactly the values listed for this API. |
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["iris"]` | yes | Authentication method used in this step. |
| `authData.iris` | object | yes | IRIS authentication block. |
| `authData.iris.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.iris.irisAuthPid` | string | yes | Base64 PID block captured from a registered IRIS RD device. |

> **Note:** Biometric ABHA-address login uses scope `ABHA-login`, not `ABHA-address-login` (the same in Swagger and Postman).

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-iris-verify"
  ],
  "authData": {
    "authMethods": [
      "iris"
    ],
    "iris": {
      "txnId": "41e59beb-6ee7-421e-a844-3652b2482038",
      "irisAuthPid": "{{irisAuthPid}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `REQUEST-ID` (string, required): Unique UUID for every request.
- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.

## Body

- `scope` (string[], required): Scope that selects this use case. Send exactly the values listed for this API.
- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.iris` (object, required): IRIS authentication block.
- `authData.iris.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.iris.irisAuthPid` (string, required): Base64 PID block captured from a registered IRIS RD device.

## Responses

- `200`: Success: Verify via Biometric - Iris Authentication
- `400`: Bad Request (request validation failed): Biometric is locked; Biometric data did not match
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Missing Credentials (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "4faf0ca4-ce24-4804-8dfa-1dd1c9f0edfb",
  "message": "Iris verified successfully",
  "authResult": "success",
  "users": [
    {
      "abhaAddress": "<ABHA_ADDRESS>",
      "fullName": "<NAME>",
      "profilePhoto": "<BASE64_PHOTO>",
      "abhaNumber": "<ABHA_NUMBER>",
      "status": "ACTIVE",
      "kycStatus": "VERIFIED"
    }
  ],
  "tokens": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000,
    "switchProfileEnabled": false
  }
}
```
