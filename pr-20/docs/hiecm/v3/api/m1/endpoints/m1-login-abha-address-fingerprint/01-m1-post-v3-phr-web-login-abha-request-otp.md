# Login request OTP

`POST /abha/api/v3/phr/web/login/abha/request/otp`

Facilitate secure user authentication by sending a One-Time Password (OTP) to the user’s mobile number. This ensures that only authorised users can access their accounts

 **ABHA ADDRESS Verification via Mobile OTP:** Sends an OTP to the mobile number used for ABHA enrolment.

 **ABHA ADDRESS Verification via Aadhaar OTP:** Sends an OTP to the mobile number linked to the user’s Aadhaar number.

 **ABHA ADDRESS Verification via Biometric (Fingerprint Authentication):** Sends Fingerprint Authentication request.

 **ABHA ADDRESS Verification via Biometric (Face Authentication):** Sends Face Authentication request.

 **ABHA ADDRESS Verification via Biometric (Iris Authentication):** Sends an Iris Authentication request.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/abha/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "loginHint": "abha-address",
  "loginId": "{{encryptedAbhaAddress}}",
  "otpSystem": "aadhaar"
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `REQUEST-ID` (string, required)
- `TIMESTAMP` (string, required)

## Body

- `scope` (string[], required)
- `loginHint` (string, required)
- `loginId` (string, required)
- `otpSystem` (string, required)

## Responses

- `200`: The 200 response code indicates that the OTP has been successfully sent to the  mobile number. This response confirms that the authentication process has been initiated, ensuring that only authorized users can access their accounts. The OTP must be entered correctly to proceed with the authentication.
- `400`: The 400 response code indicates a client error. In this context. **Types of OTP Responses:** **User not found:** failure to find user . **Invalid abha number:** The provided abha address is Invalid.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates a access denial.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: **Internal Server Error** An Internal Server Error (500) indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "message": "OTP is sent to Mobile number ending with ******9127"
}
```
