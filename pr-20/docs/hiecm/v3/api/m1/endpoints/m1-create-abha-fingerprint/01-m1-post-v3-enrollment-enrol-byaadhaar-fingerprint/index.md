# Create ABHA - Aadhaar fingerprint (bio)

`POST /abha/api/v3/enrollment/enrol/byAadhaar`

Creates an ABHA number by authenticating the Aadhaar holder's fingerprint. The PID block is captured with a UIDAI-registered fingerprint RD device. The response contains the ABHA profile and `tokens.token` (user X-token).

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/byAadhaar`

**Flow:Create ABHA - Fingerprint** - step 1 of 7
- Previous: none (first call of this flow)
- Next: *After ABHA creation - send OTP to verify mobile (optional)*

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| Benefit-Name | no | **Applicable for user who is enrolling via Benefit Program.** |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["bio"]` | yes | Authentication method used in this step. |
| `authData.bio` | object | yes | Fingerprint authentication block. |
| `authData.bio.Aadhaar` | string | yes | Aadhaar number, RSA-encrypted. |
| `authData.bio.fingerPrintAuthPid` | string | yes | Base64 PID block captured from a registered fingerprint RD device. |
| `authData.bio.mobile` | string | no | Mobile number to be linked with the ABHA (plain, 10 digits). |
| `consent` | object | yes | Consent captured from the user for ABHA enrolment. |
| `consent.code` | string | yes | Consent code. Use `ABHA-enrollment`. |
| `consent.version` | string | yes | Consent version. Use `1.4`. |

> **Note:** The Postman collection (Create ABHA - Fingerprint 3.1) sends `authMethods: ["OTP"]`. This spec uses `["bio"]`; confirm with NHA.

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
      "bio"
    ],
    "bio": {
      "aadhaar": "{{encrypted aadhaar number}}",
      "fingerPrintAuthPid": "{{fingerPrintAuthPid}}",
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

- `Authorization` (bearer token, required)

## Headers

- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `BENEFIT_NAME` (string): **Applicable for user who is enrolling via Benefit Program.**

## Body

- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.bio` (object, required): Fingerprint authentication block.
- `authData.bio.aadhaar` (string, required): Aadhaar number, RSA-encrypted.
- `authData.bio.fingerPrintAuthPid` (string, required): Base64 PID block captured from a registered fingerprint RD device.
- `authData.bio.mobile` (string): Mobile number to be linked with the ABHA (plain, 10 digits).
- `consent` (object, required): Consent captured from the user for ABHA enrolment.
- `consent.code` (string, required): Consent code. Use `abha-enrollment`.
- `consent.version` (string, required): Consent version. Use `1.4`.

## Responses

- `200`: Success: Create ABHA via Fingerprint - Positive Flow
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): Aadhaar Bio-Invalid Benefit Name
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `422`: Unprocessable Entity (business rule or UIDAI failure): Aadhaar Bio-Invalid certificate
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

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
