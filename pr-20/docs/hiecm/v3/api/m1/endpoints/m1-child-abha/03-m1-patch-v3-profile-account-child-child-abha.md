# Update Child ABHA profile

`PATCH /abha/api/v3/profile/account`

Updates the demographic details (name, DOB, gender) of a Child ABHA. Send `Benefit-Name` and the `X-token` from the Child ABHA creation response. A non-KYC Child ABHA can be updated only once.

**Endpoint:** `PATCH /abha/api/v3/profile/account`

**Flow:Child ABHA** - step 3 of 5
- Previous: *Get Child ABHA list of the parent*
- Next: *Child ABHA KYC - send Aadhaar OTP*

**Headers** (plus `Authorization: Bearer `):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC TIMESTAMP in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| Benefit-Name | yes | Benefit / programme name approved by NHA for the integrator. |
| X-token | yes | User token (`Bearer `) received after verification / login. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `abhaNumber` | string | yes | 14 digit ABHA number (xx-xxxx-xxxx-xxxx). |
| `dob` | string | yes | Date of birth (d-M-yyyy). |
| `name` | string | yes | Full name. |
| `gender` | string | yes | Gender (M / F / O). |

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'BENEFIT_NAME: {{Benefit Name}}' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "<ABHA_NUMBER>",
  "dob": "<DOB>",
  "name": "<NAME>",
  "gender": "F"
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `BENEFIT_NAME` (string, required): Benefit / program name approved by NHA for the integrator.
- `X-token` (string, required): User token (`Bearer `) received after verification / login.

## Body

- `abhaNumber` (string, required): 14 digit ABHA number (xx-xxxx-xxxx-xxxx).
- `dob` (string, required): Date of birth (d-M-yyyy).
- `name` (string, required): Full name.
- `gender` (string, required): Gender (M / F / O).

## Responses

- `200`: Success: CHILD ABHA-Child Details
- `400`: Bad Request (request validation failed): CHILD ABHA-Access Issue
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access): CHILD ABHA-Access Issue
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found: CHILD ABHA-Access Issue
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `422`: Unprocessable Entity (business rule or UIDAI failure): CHILD ABHA-Access Issue
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "ABHANumber": "<ABHA_NUMBER>",
  "preferredAbhaAddress": "<ABHA_ADDRESS>",
  "mobile": "******0903",
  "firstName": "<NAME>",
  "middleName": "<NAME>",
  "lastName": "<NAME>",
  "yearOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "dayOfBirth": "<DOB>",
  "gender": "F",
  "status": "ACTIVE",
  "stateCode": 27,
  "districtCode": 290,
  "stateName": "Maharashtra",
  "districtName": "<ADDRESS>",
  "subdistrictName": "<ADDRESS>",
  "authMethods": [
    "MOBILE_OTP"
  ],
  "tags": {},
  "kycVerified": false,
  "verificationStatus": "VERIFIED",
  "verificationType": "CHILD_ABHA",
  "createdDate": "10-05-2024"
}
```
