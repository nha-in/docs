# Create ABHA - Aadhaar face authentication

`POST /abha/api/v3/enrollment/enrol/byAadhaar`

Creates an ABHA number with Aadhaar face authentication. First call *Face auth - generate transaction ID (init)*, then poll *Face auth - capture PID / track status* until the status is `COMPLETE`. Then send the same `txnId` here.

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/byAadhaar`

**Flow:** **Create ABHA - Face Authentication** - step 3 of 9
- Previous: *Face auth - capture PID / track status*
- Next: *After ABHA creation - send OTP to verify mobile (optional)*

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| Benefit-Name | no | **Applicable for user who is enrolling via Benefit Program.** |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["face_auth"]` | yes | Authentication method used in this step. |
| `authData.face` | object | yes | Face authentication block. |
| `authData.face.txnId` | string | yes | Transaction ID returned by the previous step of this flow. |
| `authData.face.aadhaar` | string | yes | Aadhaar number, RSA-encrypted. |
| `authData.face.mobile` | string | no | Mobile number to be linked with the ABHA (plain, 10 digits). |
| `consent` | object | yes | Consent captured from the user for ABHA enrolment. |
| `consent.code` | string | yes | Consent code. Use `ABHA-enrollment`. |
| `consent.version` | string | yes | Consent version. Use `1.4`. |

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "face_auth"
    ],
    "face": {
      "txnId": "881f2bf5-7377-4067-b50e-1e6ff100b3cc",
      "aadhaar": "{{encrypted aadhaar number}}",
      "mobile": "{{mobile number}}"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `BENEFIT_NAME` (string): **Applicable for user who is enrolling via Benefit Program.**

## Body

- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.face` (object, required): Face authentication block.
- `authData.face.txnId` (string, required): Transaction ID returned by the previous step of this flow.
- `authData.face.aadhaar` (string, required): Aadhaar number, RSA-encrypted.
- `authData.face.mobile` (string): Mobile number to be linked with the ABHA (plain, 10 digits).
- `consent` (object, required): Consent captured from the user for ABHA enrolment.
- `consent.code` (string, required): Consent code. Use `abha-enrollment`.
- `consent.version` (string, required): Consent version. Use `1.4`.

## Responses

- `200`: Success: Create ABHA via Face - Positive Flow
  - `message` (string)
  - `tokens` (object)
  - `tokens.token` (string)
  - `tokens.expiresIn` (integer)
  - `tokens.refreshToken` (string)
  - `tokens.refreshExpiresIn` (integer)
  - `ABHAProfile` (object)
  - `ABHAProfile.firstName` (string)
  - `ABHAProfile.middleName` (string)
  - `ABHAProfile.lastName` (string)
  - `ABHAProfile.dob` (string)
  - `ABHAProfile.gender` (string)
  - `ABHAProfile.mobile` (string)
  - `ABHAProfile.phrAddress` (string[])
  - `ABHAProfile.districtCode` (string)
  - `ABHAProfile.stateCode` (string)
  - `ABHAProfile.abhaType` (string)
  - `ABHAProfile.stateName` (string)
  - `ABHAProfile.districtName` (string)
  - `ABHAProfile.ABHANumber` (string)
  - `ABHAProfile.abhaStatus` (string)
  - `isNew` (boolean)
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `txnId` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Invalid Benefit Name (generic)
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `message` (string)
  - `timestamp` (string)
- `422`: Unprocessable Entity (business rule or UIDAI failure).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "message": "Account created successfully",
  "txnId": "b764e218-72b7-4bd7-a11e-2c9f2880fd61",
  "tokens": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000
  },
  "ABHAProfile": {
    "firstName": "Username",
    "middleName": "",
    "lastName": "<NAME>",
    "dob": "<DOB>",
    "gender": "F",
    "photo": "",
    "mobile": "******0903",
    "email": null,
    "phrAddress": [
      "<ABHA_ADDRESS>"
    ],
    "districtCode": "490",
    "stateCode": "27",
    "abhaType": "CHILD",
    "stateName": "Maharashtra",
    "districtName": "<ADDRESS>",
    "ABHANumber": "<ABHA_NUMBER>",
    "abhaStatus": "ACTIVE"
  },
  "isNew": true
}
```
