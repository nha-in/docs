# Login profile verify

`POST /abha/api/v3/phr/app/login/profile/verify`

Flows:
- P2-Consents Management › P2 -PHR Profile › P2 - Update Mobile › Verify OTP - Update Mobile
- P2-Consents Management › P2 -PHR Profile › P2 - Update Password › Verify Password - Update Password
- P2-Consents Management › P2 -PHR Profile › P2 - Link ABHA Number › P2 - via ABHA OTP › Verify ABHA OTP - Link-DeLink
- P2-Consents Management › P2 -PHR Profile › P2 - Link ABHA Number › P2 - via Aadhaar OTP › Verify Aadhaar OTP - Link-DeLink

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer <JWT TOKEN>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
      "otpValue": "{{encryptedData}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.

## Headers

- `X-token` (string, required): The user token from a login or enrolment response, sent with a `Bearer ` prefix. It acts for that ABHA holder.
- `REQUEST-ID` (string, required): Unique UUID for each request.
- `TIMESTAMP` (string, required): Request timestamp in UTC, ISO-8601 with Z.

## Body

- `scope` (string[], required)
- `authData` (object, required)
- `authData.authMethods` (string[])
- `authData.otp` (object)
- `authData.otp.txnId` (string)
- `authData.otp.otpValue` (string)
- `authData.password` (object)
- `authData.password.abhaAddress` (string)
- `authData.password.password` (string)

## Responses

- `200`: OK
  - `txnId` (string)
  - `message` (string)
  - `authResult` (string)
  - `users` (object[])
  - `users.abhaAddress` (string)
  - `users.fullName` (string)
  - `users.abhaNumber` (string)
  - `users.status` (string)
  - `users.kycStatus` (string)
  - `accounts` (object[])
  - `accounts.mobile` (string)
  - `accounts.firstName` (string)
  - `accounts.middleName` (string)
  - `accounts.lastName` (string)
  - `accounts.name` (string)
  - `accounts.yearOfBirth` (string)
  - `accounts.dayOfBirth` (string)
  - `accounts.monthOfBirth` (string)
  - `accounts.gender` (string)
  - `accounts.email` (object)
  - `accounts.profilePhoto` (string)
  - `accounts.status` (string)
  - `accounts.stateCode` (string)
  - `accounts.districtCode` (string)
  - `accounts.subDistrictCode` (object)
  - `accounts.villageCode` (object)
  - `accounts.townCode` (object)
  - `accounts.wardCode` (object)
  - `accounts.pincode` (string)
  - `accounts.address` (string)
  - `accounts.kycPhoto` (string)
  - `accounts.stateName` (string)
  - `accounts.districtName` (string)
  - `accounts.subdistrictName` (string)
  - `accounts.villageName` (object)
  - `accounts.townName` (string)
  - `accounts.wardName` (object)
  - `accounts.authMethods` (string[])
  - `accounts.tags` (object)
  - `accounts.kycVerified` (boolean)
  - `accounts.verificationStatus` (string)
  - `accounts.verificationType` (string)
  - `accounts.emailVerified` (object)
  - `accounts.ABHANumber` (string)
  - `accounts.preferredAbhaAddress` (string)
  - `tokens` (object)
  - `tokens.token` (string)
  - `tokens.expiresIn` (integer)
  - `tokens.refreshToken` (string)
  - `tokens.refreshExpiresIn` (integer)
- `400`: Bad Request
  See Error codes for this module: /docs/hiecm/v3/api/p2/errors
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
  "txnId": "e10ca603-97f5-4cf2-8191-d51ea7db3845",
  "message": "Entered OTP is incorrect. Kindly re-enter valid OTP.",
  "authResult": "failed",
  "users": []
}
```
