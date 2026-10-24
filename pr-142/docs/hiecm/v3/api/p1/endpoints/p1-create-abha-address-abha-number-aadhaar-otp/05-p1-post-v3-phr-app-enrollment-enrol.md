# Enrol ABHA address

`POST /abha/api/v3/phr/app/enrollment/enrol`

Flows:
- P1-Registration-login › P1 - Create ABHA Address Flow › Enrolment via Mobile › Enrol ABHA Address
- P1-Registration-login › P1 - Create ABHA Address Flow › Enrolment via ABHA Number-ABHA OTP › Enrol ABHA Address
- P1-Registration-login › P1 - Create ABHA Address Flow › Enrolment via ABHA Number-Aadhaar OTP › Enrol ABHA Address

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/enrol \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "phrDetails": {
    "firstName": "John",
    "middleName": "",
    "lastName": "Doe",
    "dayOfBirth": "<DOB>",
    "monthOfBirth": "<DOB>",
    "yearOfBirth": "<DOB>",
    "gender": "M",
    "email": "",
    "mobile": "<ENCRYPTED_MOBILE>",
    "address": "<ADDRESS>",
    "stateName": "Maharashtra",
    "stateCode": "27",
    "districtName": "<ADDRESS>",
    "districtCode": "123",
    "pinCode": "<PINCODE>",
    "abhaAddress": "<ABHA_ADDRESS>",
    "password": "<ENCRYPTED_PASSWORD>"
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.

## Body

- `txnId` (string, required)
- `phrDetails` (object, required)
- `phrDetails.mobile` (string)
- `phrDetails.firstName` (string)
- `phrDetails.middleName` (string)
- `phrDetails.lastName` (string)
- `phrDetails.yearOfBirth` (string)
- `phrDetails.dayOfBirth` (string)
- `phrDetails.monthOfBirth` (string)
- `phrDetails.gender` (string)
- `phrDetails.email` (string)
- `phrDetails.profilePhoto` (string)
- `phrDetails.address` (string)
- `phrDetails.stateName` (string)
- `phrDetails.stateCode` (string)
- `phrDetails.districtName` (string)
- `phrDetails.districtCode` (string)
- `phrDetails.pinCode` (string)
- `phrDetails.abhaAddress` (string)
- `phrDetails.password` (string)

## Responses

- `200`: OK
  - `txnId` (string)
  - `message` (string)
  - `phrDetails` (object)
  - `phrDetails.firstName` (string)
  - `phrDetails.middleName` (string)
  - `phrDetails.lastName` (string)
  - `phrDetails.fullName` (string)
  - `phrDetails.dayOfBirth` (string)
  - `phrDetails.monthOfBirth` (string)
  - `phrDetails.yearOfBirth` (string)
  - `phrDetails.dateOfBirth` (string)
  - `phrDetails.gender` (string)
  - `phrDetails.email` (string)
  - `phrDetails.mobile` (string)
  - `phrDetails.address` (string)
  - `phrDetails.stateName` (string)
  - `phrDetails.districtName` (string)
  - `phrDetails.pinCode` (string)
  - `phrDetails.abhaAddress` (string[])
  - `phrDetails.stateCode` (string)
  - `phrDetails.districtCode` (string)
  - `tokens` (object)
  - `tokens.token` (string)
  - `tokens.expiresIn` (integer)
  - `tokens.refreshToken` (string)
  - `tokens.refreshExpiresIn` (integer)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p1/errors
  - `code` (string)
  - `message` (string)

Example 200 response. The values are placeholders:

```json
{
  "txnId": "6907ebb5-ff71-47f9-8052-6dd5554df5df",
  "message": "ABHA Address Created Successfully",
  "phrDetails": {
    "firstName": "John",
    "middleName": "",
    "lastName": "Doe",
    "fullName": "John Doe",
    "dayOfBirth": "<DOB>",
    "monthOfBirth": "<DOB>",
    "yearOfBirth": "<DOB>",
    "dateOfBirth": "<DOB>",
    "gender": "M",
    "email": "<EMAIL>",
    "mobile": "******1234",
    "address": "<ADDRESS>",
    "stateName": "Maharashtra",
    "districtName": "<ADDRESS>",
    "pinCode": "<PINCODE>",
    "abhaAddress": [
      "<ABHA_ADDRESS>",
      "<ABHA_ADDRESS>",
      "... 1 more of the same shape"
    ],
    "stateCode": "27",
    "districtCode": "123"
  },
  "tokens": {
    "token": "<JWT TOKEN>",
    "expiresIn": 1800,
    "refreshToken": "<JWT TOKEN>",
    "refreshExpiresIn": 1296000
  }
}
```
