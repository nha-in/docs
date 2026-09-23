# Update profile

`POST /abha/api/v3/phr/app/login/profile/updateProfile`

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/updateProfile \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "profilePhoto": "",
  "firstName": "John",
  "middleName": "",
  "lastName": "Doe",
  "dayOfBirth": "<DOB>",
  "monthOfBirth": "<DOB>",
  "yearOfBirth": "<DOB>",
  "gender": "M",
  "email": "<EMAIL>",
  "mobile": "******0903",
  "address": "<ADDRESS>",
  "stateName": "Maharashtra",
  "districtName": "<ADDRESS>",
  "pinCode": "<PINCODE>",
  "stateCode": "27",
  "districtCode": "12"
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): The user token from a login or enrolment response, sent with a `Bearer ` prefix. It acts for that ABHA holder.
- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.

## Body

- `profilePhoto` (string, required)
- `firstName` (string, required)
- `middleName` (string, required)
- `lastName` (string, required)
- `dayOfBirth` (string, required)
- `monthOfBirth` (string, required)
- `yearOfBirth` (string, required)
- `gender` (string, required)
- `email` (string, required)
- `mobile` (string, required)
- `address` (string, required)
- `stateName` (string, required)
- `districtName` (string, required)
- `pinCode` (string, required)
- `stateCode` (string, required)
- `districtCode` (string, required)

## Responses

- `200`: OK
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
- `401`: Unauthorized
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `403`: Forbidden
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

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
  "email": "",
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
    "AADHAAR_OTP"
  ],
  "status": "ACTIVE",
  "emailVerified": "false",
  "mobileVerified": "true",
  "kycStatus": "VERIFIED",
  "abhaLinkedCount": "3"
}
```
