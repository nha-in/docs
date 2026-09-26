# Create ABHA - Demographic authentication (Demo Auth)

`POST /abha/api/v3/enrollment/enrol/byAadhaar`

Creates an ABHA number from Aadhaar demographic details (name, DOB, gender, state/district, mobile), without OTP or biometric. If an ABHA already exists for the Aadhaar, it is returned. **Only for integrators approved by NHA**, who must send the `Benefit-Name` header.

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/byAadhaar`

**Flow:** **Benefit - Create ABHA via Demo Auth** - step 1 of 1
- Previous: none (first call of this flow)
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| Benefit-Name | yes | **Applicable for user who is enrolling via Benefit Program.** |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["demo_auth"]` | yes | Authentication method used in this step. |
| `authData.demo_auth` | object | yes | Demographic authentication block (Aadhaar demographic match). |
| `authData.demo_auth.aadhaarNumber` | string | yes | Aadhaar number, RSA-encrypted. |
| `authData.demo_auth.districtCode` | string | yes | LGD district code. |
| `authData.demo_auth.stateCode` | string | yes | LGD state code. |
| `authData.demo_auth.dateOfBirth` | string | yes | Date of birth as per Aadhaar (dd-MM-yyyy). |
| `authData.demo_auth.gender` | string | yes | Gender (M / F / O). |
| `authData.demo_auth.name` | string | yes | Full name. |
| `authData.demo_auth.mobile` | string | no | Mobile number to be linked with the ABHA (plain, 10 digits). |
| `authData.demo_auth.profilePhoto` | string | no | Base64 encoded profile photo. |
| `authData.demo_auth.pinCode` | string | no | PIN code of the address. |
| `authData.demo_auth.address` | string | no | Address as per Aadhaar. |
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
      "demo_auth"
    ],
    "demo_auth": {
      "aadhaarNumber": "{{encrypted aadhaar number}}",
      "districtCode": "{{District code}}",
      "stateCode": "{{State code}}",
      "dateOfBirth": "{{DOB}}",
      "gender": "{{Gender}}",
      "name": "{{Full name}}",
      "mobile": "{{Mobile number}}",
      "profilePhoto": "{{Base64 plain String}}",
      "pinCode": "<PINCODE>",
      "address": "<ADDRESS>"
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
- `BENEFIT_NAME` (string, required): **Applicable for user who is enrolling via Benefit Program.**

## Body

- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.demo_auth` (object, required): Demographic authentication block (Aadhaar demographic match).
- `authData.demo_auth.aadhaarNumber` (string, required): Aadhaar number, RSA-encrypted.
- `authData.demo_auth.districtCode` (string, required): LGD district code.
- `authData.demo_auth.stateCode` (string, required): LGD state code.
- `authData.demo_auth.dateOfBirth` (string, required): Date of birth as per Aadhaar (dd-MM-yyyy).
- `authData.demo_auth.gender` (string, required): Gender (M / F / O).
- `authData.demo_auth.name` (string, required): Full name.
- `authData.demo_auth.mobile` (string): Mobile number to be linked with the ABHA (plain, 10 digits).
- `authData.demo_auth.profilePhoto` (string): Base64 encoded profile photo.
- `authData.demo_auth.pinCode` (string): PIN code of the address.
- `authData.demo_auth.address` (string): Address as per Aadhaar.
- `consent` (object, required): Consent captured from the user for ABHA enrolment.
- `consent.code` (string, required): Consent code. Use `abha-enrollment`.
- `consent.version` (string, required): Consent version. Use `1.4`.

## Responses

- `200`: Success: DemoAuth API - New ABHA creation; DemoAuth API - In case of Existing ABHA Number
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
- `400`: Bad Request (request validation failed): DemoAuth API-State District not matching
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `txnId` (string)
  - `timestamp` (string)
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): DemoAuth API-Invalid Benefit Name
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
  - `message` (string)
  - `timestamp` (string)
- `422`: Unprocessable Entity (business rule or UIDAI failure): DemoAuth API-6 ABHA linked to Mobile; DemoAuth API-Details not matches against Aadhaar
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
  - `error` (object)
  - `error.code` (string)
  - `error.message` (string)
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Example 200 response. The values are placeholders:

```json
{
  "healthIdNumber": "<ABHA_NUMBER>",
  "healthId": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "Username",
  "middleName": "<NAME>",
  "lastName": "<NAME>",
  "name": "<NAME>",
  "yearOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "gender": "F",
  "stateCode": "27",
  "districtCode": "490",
  "stateName": "MAHARASHTRA",
  "districtName": "<ADDRESS>",
  "kycVerified": true,
  "token": "<TOKEN>",
  "jwtResponse": {
    "token": "<TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<TOKEN>",
    "refreshExpiresIn": 1296000
  },
  "status": "ACTIVE",
  "new": true
}
```
