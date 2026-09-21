# Request enrolment OTP

`POST /abha/api/v3/enrollment/request/otp`

Generate and send an OTP (One-Time Password) to the user’s registered mobile number. The OTP is essential for verifying the user’s identity and ensuring secure access to the ABHA (Ayushman Bharat Health Account) enrolment process. Depending on the type of identifier provided (Aadhaar Number, ABHA Number, or Mobile Number), the OTP will be generated and sent to the corresponding registered mobile number.

**Usage of this API for below scenarios: OTP Request**

 **1. AADHAR OTP:** When the user wants to enrol using their Aadhar Number, an OTP is sent to the mobile number registered with their Aadhar linked mobile number. For this pass loginHint as "Aadhar-number".
 **2. Mobile OTP:** When the user wants to enrol using their Mobile Number, an OTP is sent to the provided mobile number. For this pass loginHint as "mobile-number".
**Note:**
 **1.** OTP will be valid for 10 minute only

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "{{txnId}}",
  "scope": [
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": "{{encrypted aadhaar number}}",
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

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful generation and delivery of an OTP (One-Time Password) for various services. **Types of OTP Responses:** **AADHAAR OTP Response:** This OTP is generated for authentication or verification purposes related to AADHAAR, the unique identification number issued by the Indian government. **ABHA OTP Response:** This OTP is generated for authentication or verification purposes related to ABHA (Ayushman Bharat Health Account), which is part of India’s health ID system **Mobile OTP Response.** This OTP is generated for general mobile number verification purposes, such as logging into an account, completing a transaction, or verifying identity **Email OTP Response:** This OTP is generated for verification purposes of Email, the OTP is send to the registered email address
- `400`: The 400 response code indicates a bad request. In this context, it refers to various errors encountered during the OTP (One-Time Password) generation or validation process. **Types of OTP Response Errors:** **ABHA enrolment via Aadhar - Invalid Scope**: This error occurs when the scope provided in the OTP request is invalid. The scope specifies the purpose of the OTP request, such as abha-enrol, mobile-verify, etc. **ABHA enrolment via Aadhar  -Send OTP- Invalid LoginId**: This error occurs when the login ID provided for the Aadhaar OTP is invalid. The login ID should be the encrypted Aadhaar number. **Mobile Update -Send OTP- Invalid Scope**:  This error occurs when the scope provided in the OTP request for mobile update is invalid. **Mobile Update -Send OTP- Invalid LoginId**: This error occurs when the login ID provided for the mobile OTP is invalid. The login ID should be the encrypted mobile number. **Mobile Update -Send OTP- Invalid LoginHint**: This error occurs when the login hint provided for the mobile OTP is invalid. The login hint should indicate the type of identifier being used, such as mobile. **ABHA Creation via Aadhar- Invalid Scope**: This error occurs when the scope provided in the OTP request for ABHA creation via Aadhaar is invalid. **ABHA Creation via Aadhar- Invalid Login Hint**: This error occurs when the login hint provided for the Aadhaar OTP is invalid. The login hint should indicate the type of identifier being used, such as aadhaar. **ABHA enrolment via Aadhar  - Invalid Scope**: The scope of the OTP response is invalid. **ABHA Verify via Email- Invalid Scope**: This error occurs when the scope provided in the OTP request for ABHA creation via email is invalid. **ABHA Verify via Email- Invalid Login Hint**: This error occurs when the login hint provided for the email OTP is invalid. The login hint should indicate the type of identifier being used, such as aadhaar. **ABHA Verify via Email  - Invalid LoginHint**: This error occurs when the email ID provided for the email OTP is invalid. The login ID should be the encrypted email address..
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials **Types of OTP Response Errors:** **ABHA Enrolment via Aadhaar - Invalid Access Token**: This error occurs when the access token provided for authorization is invalid. The access token is essential for authenticating the request, and an invalid token means the server cannot verify the user’s identity. **Mobile Update - Send OTP - Invalid Access Token**: This error occurs when the access token provided for authorization is invalid. The access token is essential for authenticating the request, and an invalid token means the server cannot verify the user’s identity. **ABHA Creation via Aadhaar OTP - Invalid Access Token**:  This error occurs when the access token provided for authorization is invalid. The access token is essential for authenticating the request, and an invalid token means the server cannot verify the user’s identity. **EMail verification via  OTP - Invalid Access Token**:  This error occurs when the access token provided for authorization is invalid. The access token is essential for authenticating the request, and an invalid token means the server cannot verify the user’s identity.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "c6a49f66-c740-4a7d-a93d-8c0431bbb8f3",
  "message": "OTP is sent to Aadhaar registered mobile number ending with*******0903"
}
```
