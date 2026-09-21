# Login request OTP

`POST /abha/api/v3/profile/login/request/otp`

"This API endpoint is used to request an OTP (One-Time Password) for logging into an ABHA (Ayushman Bharat Health Account) profile. It is used to send the OTP to the user’s registered mobile number or email address for the purpose of logging into their ABHA profile. The OTP is essential for verifying the user’s identity and ensuring secure access to their profile.

**Example of OTP Request**

Example 1:
 **Login via ABHA Number - Using Aadhaar OTP:** This endpoint sends the OTP to the user’s registered mobile number for logging into their ABHA profile using their ABHA number and Aadhaar.

Example 2:
 **Login via ABHA Number - Using ABHA OTP:** This endpoint sends the OTP to the user’s registered mobile number for logging into their ABHA profile using their ABHA number and ABHA number.

Example 3:
 **Login via Aadhaar:** This endpoint sends the OTP to the user’s registered mobile number for logging into their ABHA profile using their Aadhaar number.

 Example 4:
 **Login via Mobile number:** This endpoint sends the OTP to the user’s registered mobile number for logging into their ABHA profile using their mobile number.

 Example 5:
 **ABHA PROFILE (Login via Biometric) -** It is used to send the OTP to user registered mobile number for logging into their ABHA profile. The request body should include the scope, loginHint loginId, otpSystem.

 For Login via Biometric using face
 **scope:** `ABHA-login`, ` Aadhaar-face-verify `

 For Login via Biometric using fingerprint
 **scope:** `ABHA-login`, ` Aadhaar-bio-verify `

For Login via Biometric using Iris
 **scope:** `ABHA-login`, ` Aadhaar-iris-verify `

Example 6:
 **Find ABHA - Send OTP:** It is used to send OTP on user registered Mobile number to fetch complete ABHA Details along with JWT Tokens.

 For requesting an OTP incase of Find ABHA, the loginHint will be `index ` and loginId will be RSA encrypted index key to fetch the complete ABHA details of that particular ABHA number.

Example 7:
 **Find ABHA - FingerprintAuth / IrisAuth:** It is used to request Biometric authentication (Fingerprint/Iris) to fetch complete ABHA Details along with JWT Tokens.

 For authentication request incase of Find ABHA, the loginHint will be `index ` and loginId will be RSA encrypted index key to fetch the complete ABHA details of that particular ABHA number.

Example:8
 **Find ABHA - FaceAuth:** This API will help to generate transaction ID. This transaction ID will be used for whole face authentication process.

 The user can submit this transaction ID to the **ABHA** app using either intent-based sharing or by generating a QR code.

User can use this transaction ID to generate QR code using any QR generator tool. Open ABHA app and scan this QR code on ABHA App to start and complete the face capture process.

The data format of the QR code should follow this pattern:
https:///face-auth?txnId=.

**For example:** "https://phrsbx.ABDM.gov.in/face-auth?txnId=bac7251b-cd25-44d5-9707-f3d2ba181c1c"

 For Sandbox - PHR-env-base-URL - https://phrsbx.ABDM.gov.in
 For Production - PHR-env-base-URL - https://phr.ABDM.gov.in

**Note:** OTP will be valid for 10 minute only

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "search-abha",
    "mobile-verify"
  ],
  "loginHint": "index",
  "loginId": "{{rsaIndexEncryptionOutput}}",
  "otpSystem": "abdm",
  "txnId": "{{searchTxnId}}"
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

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful generation and delivery of an OTP (One-Time Password) for various services. **Types of OTP Responses:** **Login Via Mobile Number - Positive flow:** This action allows users to log in to their ABHA (Ayushman Bharat Health Account) using their mobile number. An OTP (One-Time Password) is sent to the provided mobile number. This ensures that the user’s identity is securely verified before granting access to their ABHA profile. **Login Via ABHA Number using ABHA OTP - Positive flow:** This action allows users to log in to their ABHA using their ABHA Number. An OTP is sent to the mobile number registered with the ABHA Number. This ensures that the user’s identity is securely verified before granting access to their ABHA profile. **Login Via ABHA Number - Using Aadhaar OTP-positive flow:** This action allows users to log in to their ABHA using their Aadhaar Number. An OTP is sent to the mobile number registered with the aadhaar Number. This ensures that the user’s identity is securely verified before granting access to their ABHA profile. **Login via Aadhaar- Positive Flow.** This action allows users to log in to their ABHA using their Aadhaar number. An OTP is sent to the mobile number registered with the Aadhaar. This ensures that the user’s identity is securely verified before granting access to their ABHA profile. **Forgot ABHA via Mobile OTP- Positive flow:** This action allows users to retrieve their ABHA number by sending an OTP to the mobile number registered with their ABHA profile. This ensures that the user’s identity is securely verified before retrieving the ABHA number **Forgot ABHA via Aadhaar OTP- Positive Flow:**  This action allows users to retrieve their ABHA number by sending an OTP to the mobile number registered with their Aadhaar. This ensures that the user’s identity is securely verified before retrieving the ABHA number.
- `400`: Indicates various errors encountered during the OTP generation process . **Types of OTP Responses:** **Login Via Mobile Number - Invalid LoginHint:** This action attempts to log in to ABHA (Ayushman Bharat Health Account) using an invalid loginHint. The loginHint provided does not match the expected values. **Login Via ABHA Number - Using ABHA OTP - Invalid Scope**  This action attempts to log in to ABHA using an invalid scope. The scope provided does not match the expected values for the OTP request. **Login via Aadhaar - Invalid Login Hint:** This action attempts to log in to ABHA using an invalid loginHint. The loginHint provided does not match the expected values. **Login via Aadhaar OTP - Invalid Scope:** This action attempts to log in to ABHA using an invalid scope. The scope provided does not match the expected values for the OTP request **Login via Aadhaar OTP - Invalid LoginId:** This action attempts to log in to ABHA using an invalid loginId. The loginId provided does not match the expected format or value **Login via Aadhaar OTP - Invalid Login Hint:** This action attempts to log in to ABHA using an invalid loginHint. The loginHint provided does not match the expected values **Login Via ABHA Number - Using ABHA OTP - Invalid LoginHint:**  This action attempts to log in to ABHA using an invalid loginHint. The loginHint provided does not match the expected values **Login Via ABHA Number - Using ABHA OTP - Invalid LoginId:** This action attempts to log in to ABHA using an invalid loginId. The loginId provided does not match the expected format or value. **Login via Aadhaar - Invalid Scope:** This action attempts to log in to ABHA using an invalid scope. The scope provided does not match the expected values for the OTP request.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials. **Types of OTP Response Errors:** **Login Via Mobile Number - Invalid Access Token**: This action attempts to log in to ABHA (Ayushman Bharat Health Account) using a mobile number, but fails due to an invalid access token. The access token provided for authorization is invalid, meaning the server cannot verify the user’s identity. **Login via Aadhaar - Invalid Access Token**:  This action attempts to log in to ABHA using an Aadhaar number, but fails due to an invalid access token. The access token provided for authorization is invalid, meaning the server cannot verify the user’s identity. **Login Via ABHA Number - Using ABHA OTP - Invalid Access Token**:This action attempts to log in to ABHA using an ABHA number and ABHA OTP, but fails due to an invalid access token. The access token provided for authorization is invalid, meaning the server cannot verify the user’s identity. **Login Via ABHA Number - Using Aadhaar OTP - Invalid Access Token**: This action attempts to log in to ABHA using an ABHA number and Aadhaar OTP, but fails due to an invalid access token. The access token provided for authorization is invalid, meaning the server cannot verify the user’s identity..
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `404`: Not Found
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "37d8d312-35a0-41e7-a6e4-1074eb18a5fa",
  "message": "OTP sent to Aadhaar registered mobile number ending with ******0903"
}
```
