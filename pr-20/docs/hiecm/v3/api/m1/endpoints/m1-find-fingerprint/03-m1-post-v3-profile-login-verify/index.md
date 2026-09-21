# Login profile verify

`POST /abha/api/v3/profile/login/verify`

"This API endpoint is used to verify the OTP (One-Time Password) for logging into an ABHA (Ayushman Bharat Health Account) profile. It is used to verify the OTP sent to the user’s registered mobile number or email address for the purpose of logging into their ABHA profile. The OTP is essential for verifying the user’s identity and ensuring secure access to their profile.

**Example of OTP Request**

Example 1:
 **Login via ABHA Number - Using Aadhaar OTP:** This endpoint verifies the OTP sent to the user’s registered mobile number for logging into their ABHA profile using their ABHA number and Aadhaar OTP.

Example 2:
 **Login via ABHA Number - Using ABHA OTP:** This endpoint verifies the OTP sent to the user’s registered mobile number for logging into their ABHA profile using their ABHA number and ABHA OTP.

Example3:
 **Verify Password:** This endpoint verifies the user’s password for logging into their ABHA profile.

Example 4:
 **Login via Aadhaar:** verifies the OTP sent to the user’s registered mobile number for logging into their ABHA profile using their Aadhaar number..

 Example 5:
 **Login via Mobile number:** This endpoint verifies the OTP sent to the user’s registered mobile number for logging into their ABHA profile using their mobile number.

 Example 6:
 **ABHA PROFILE (Login via Biometric) -** Its used to verify the user’s identity using biometric data (such as fingerprints, face, Iris) for logging into their ABHA profile. The request body should include the scope, authentication methods, and biometric data.

 For Login via Biometric using face
 **scope:** `ABHA-login`, ` Aadhaar-face-verify `

 For Login via Biometric using fingerprint
 **scope:** `ABHA-login`, ` Aadhaar-bio-verify `

For Login via Biometric using Iris
 **scope:** `ABHA-login`, ` Aadhaar-iris-verify `

Example 7:
 **Find ABHA - Verify OTP:** It is used to verify the OTP to Fetch Complete ABHA Details along with JWT Tokens.

**Note:** OTP will be valid for 10 minute only

Example 8:
 **Find ABHA - Verify via Biometric:** It is used to find the ABHA details using Biometric(Fingerprint, Face, Iris) data in the form of PID.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-bio-verify"
  ],
  "authData": {
    "authMethods": [
      "bio"
    ],
    "bio": {
      "txnId": "{{txnId}}",
      "fingerPrintAuthPid": "{{PID}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `REQUEST-ID` (string, required)
- `TIMESTAMP` (string, required)

## Body

- `scope` (string[], required)
- `authData` (object, required)
- `authData.authMethods` (string[], required)
- `authData.otp` (object)
- `authData.otp.otpValue` (string, required)
- `authData.otp.txnId` (string, required)

## Responses

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful generation and delivery of an OTP (One-Time Password) for various services. **Types of OTP Responses:** **Login via ABHA Number - Using Aadhaar OTP (Positive Flow) :** This endpoint handles the login process via ABHA number using an Aadhaar OTP. If the OTP entered by the user matches the OTP sent by Aadhaar, the system will authenticate the user and display the user's profile along with a JWT token and profile details. **Login via ABHA Number - Using ABHA OTP  (Positive Flow) :** This endpoint handles the login process via ABHA number using an ABHA OTP. If the OTP entered by the user matches the OTP sent by Aadhaar, the system will authenticate the user and display the user's profile along with a JWT token and profile details. **Login via Mobile Number - (Positive Flow) :** This endpoint handles the login process via mobile number using an mobile OTP. If the OTP entered by the user matches the OTP sent by Aadhaar, the system will authenticate the user and display the user's profile along with a JWT token and profile details. **Login via Password -  (Positive Flow) :** This endpoint handles the login process via Password using password. If the password(encrypted) entered by the user matches the password already set by user, then the system will authenticate the user and display the user's profile along with a JWT token and profile details. **Login via Biometric - FingerPrint/Face/Iris -  (Positive Flow) :** This endpoint handles the login process via encrypted PID. If the pid(encrypted) entered by the user matches the details of the user, then the system will authenticate the user and display the user's profile along with a JWT token and profile details. **Forgot ABHA via Aadhaar OTP - Positive Flow:** This scenario describes the process of recovering an ABHA number using an Aadhaar OTP. The user provides their Aadhaar number and the correct OTP received on their registered mobile number. Upon successful verification, the ABHA number is recovered. **Forgot ABHA via Mobile OTP - Positive Flow:** This scenario describes the process of recovering an ABHA number using a Mobile OTP. The user provides their registered Mobile number and the correct OTP received on their mobile number. Upon successful verification, the ABHA number is recovered. **Find ABHA via Biometric  - Positive Flow:** This scenario describes the process of Finding an ABHA details using a Biometric . The user provides correct Biometric data in the form pid. Upon successful verification, the ABHA number is recovered.
- `400`: Indicates various errors encountered during the search process, such as invalid identifiers or missing parameters.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: Unauthorized Access.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: The requested resource was not found. This can occur if the profile does not exist.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "authResult": "success",
  "message": "Password verified successfully",
  "token": "<TOKEN>",
  "expiresIn": 1296000,
  "refreshToken": "<TOKEN>",
  "refreshExpiresIn": 1296000,
  "accounts": []
}
```
