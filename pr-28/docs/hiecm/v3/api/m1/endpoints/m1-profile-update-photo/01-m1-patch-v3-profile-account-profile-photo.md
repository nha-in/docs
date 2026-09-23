# Update profile photo

`PATCH /abha/api/v3/profile/account`

Updates the profile photo of the logged-in ABHA user (`X-token`). Send the photo as a Base64 string.

**Endpoint:** `PATCH /abha/api/v3/profile/account`

**Flow:** **Profile - Update Photo** - step 1 of 1
- Previous: none (first call of this flow)
- Next: none (last call of this flow)

**Headers** (plus `Authorization: Bearer <gateway token>`):

| Header | Required | Description |
|---|---|---|
| TIMESTAMP | yes | Current UTC timestamp in ISO-8601 format. |
| REQUEST-ID | yes | Unique UUID for every request. |
| X-token | yes | User token (`Bearer <token>`) received after verification / login. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| `profilePhoto` | string | no | Base64 encoded profile photo. |

> **Note:** The source spec has no response example for this use case. Its only examples are for Child ABHA.

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'Content-Type: application/json' \
  --data '{
  "profilePhoto": "{{profile photo string}}"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `TIMESTAMP` (string, required): Current UTC timestamp in ISO-8601 format.
- `REQUEST-ID` (string, required): Unique UUID for every request.
- `X-token` (string, required): User token (`Bearer <token>`) received after verification / login.

## Body

- `profilePhoto` (string): Base64 encoded profile photo.

## Responses

- `200`: Success.
- `400`: Bad Request (request validation failed).
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized (invalid / expired gateway token, X-token or benefit access).
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `422`: Unprocessable Entity (business rule or UIDAI failure).
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
  "kycVerified": false,
  "verificationStatus": "VERIFIED",
  "verificationType": "CHILD_ABHA",
  "createdDate": "10-05-2024"
}
```
