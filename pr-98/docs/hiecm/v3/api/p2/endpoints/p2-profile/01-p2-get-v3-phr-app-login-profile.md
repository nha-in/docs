# Get profile

`GET /abha/api/v3/phr/app/login/profile`

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-AUTH-TOKEN: <X_AUTH_TOKEN>'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): The user token from a login or enrolment response, sent with a `Bearer ` prefix. It acts for that ABHA holder.
- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.
- `X-AUTH-TOKEN` (string, required): The user token issued at login. Send it beside X-token.

## Responses

- `200`: OK
  - `abhaAddress` (string)
  - `fullName` (string)
  - `firstName` (string)
  - `middleName` (string)
  - `lastName` (string)
  - `dayOfBirth` (string)
  - `monthOfBirth` (string)
  - `yearOfBirth` (string)
  - `dateOfBirth` (string)
  - `gender` (string)
  - `email` (string)
  - `mobile` (string)
  - `abhaNumber` (string)
  - `address` (string)
  - `stateName` (string)
  - `districtName` (string)
  - `pinCode` (string)
  - `stateCode` (string)
  - `districtCode` (string)
  - `authMethods` (string[])
  - `status` (string)
  - `emailVerified` (string)
  - `mobileVerified` (string)
  - `kycStatus` (string)
  - `abhaLinkedCount` (string)
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
  "abhaAddress": "<ABHA_ADDRESS>",
  "fullName": "John Doe",
  "firstName": "John",
  "middleName": "",
  "lastName": "Doe",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "yearOfBirth": "<DOB>",
  "dateOfBirth": "<DOB>",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "******0903",
  "abhaNumber": "<ABHA_NUMBER>",
  "address": "<ADDRESS>",
  "stateName": "Maharashtra",
  "districtName": "<ADDRESS>",
  "pinCode": "<PINCODE>",
  "stateCode": "27",
  "districtCode": "123",
  "authMethods": [
    "MOBILE_OTP",
    "PASSWORD",
    "... 1 more of the same shape"
  ],
  "status": "ACTIVE",
  "emailVerified": "true",
  "mobileVerified": "true",
  "kycStatus": "VERIFIED",
  "abhaLinkedCount": "3"
}
```
