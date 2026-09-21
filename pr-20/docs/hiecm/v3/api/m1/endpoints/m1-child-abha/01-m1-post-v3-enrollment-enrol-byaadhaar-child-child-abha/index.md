# Create Child ABHA

`POST /abha/api/v3/enrollment/enrol/byAadhaar`

Creates a Child ABHA linked to the parent's ABHA. Send the **parent's**`X-token` (from the parent's ABHA creation or login) and `Benefit-Name`.** Only for Government integrators approved by NHA.**

**Endpoint:** `POST /abha/api/v3/enrollment/enrol/byAadhaar`

**Flow:Child ABHA** - step 1 of 5
- Previous: none (first call of this flow)
- Next: *Get Child ABHA list of the parent*

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| Benefit-Name | yes | **Applicable for user who is enrolling via Benefit Program.** |
| X-token | yes | **Applicable for child ABHA creation. X-token of Parent user, user can get X-token after login to the system** |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `authData` | object | yes | Authentication payload for this use case. |
| `authData.authMethods` | `["child"]` | yes | Authentication method used in this step. |
| `authData.child` | object | yes | Child ABHA details. |
| `authData.child.dayOfBirth` | string | yes | Day of birth of the child. |
| `authData.child.monthOfBirth` | string | yes | Month of birth of the child. |
| `authData.child.yearOfBirth` | string | yes | Year of birth of the child. |
| `authData.child.gender` | string | yes | Gender (M / F / O). |
| `authData.child.password` | string | no | Password (RSA-encrypted) / password block. |
| `authData.child.name` | string | yes | Full name. |
| `authData.child.profilePhoto` | string | no | Base64 encoded profile photo. |
| `authData.child.parentConsent` | string | no | Parent consent flag for creating a child ABHA. |
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
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "child"
    ],
    "child": {
      "dayOfBirth": "{{day Of Birth}}",
      "monthOfBirth": "{{month Of Birth}}",
      "yearOfBirth": "{{year Of Birth}}",
      "gender": "{{Gender}}",
      "password": "",
      "name": "{{Name}}",
      "profilePhoto": "",
      "parentConsent": "true"
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
- `BENEFIT_NAME` (string, required): **Applicable for user who is enrolling via Benefit Program.**
- `X-token` (string, required): **Applicable for child abha creation. X-token of Parent user, user can get X-token after login to the system**

## Body

- `authData` (object, required): Authentication payload for this use case.
- `authData.authMethods` (string[], required): Authentication method used in this step.
- `authData.child` (object, required): Child ABHA details.
- `authData.child.dayOfBirth` (string, required): Day of birth of the child.
- `authData.child.monthOfBirth` (string, required): Month of birth of the child.
- `authData.child.yearOfBirth` (string, required): Year of birth of the child.
- `authData.child.gender` (string, required): Gender (M / F / O).
- `authData.child.password` (string): Password (RSA-encrypted) / password block.
- `authData.child.name` (string, required): Full name.
- `authData.child.profilePhoto` (string): Base64 encoded profile photo.
- `authData.child.parentConsent` (string): Parent consent flag for creating a child ABHA.
- `consent` (object, required): Consent captured from the user for ABHA enrolment.
- `consent.code` (string, required): Consent code. Use `abha-enrollment`.
- `consent.version` (string, required): Consent version. Use `1.4`.

## Responses

- `200`: Success: Create CHILD ABHA - Positive Flow; CHILD ABHA - Account Already Exist
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): CHILD ABHA-Invalid Benefit Name; CHILD ABHA-Access Issue; CHILD ABHA - X-token expired
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `422`: Unprocessable Entity (business rule or UIDAI failure): CHILD ABHA-CHILD LIMIT
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "message": "Account created successfully",
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
