# Verify OTP ReKyc, update Mobile, CHILD ABHA KYC

`POST /abha/api/v3/profile/account/verify`

Verify an OTP (One-Time Password) for various purposes such as ReKyc, Update Mobile,Update Email,Set Password etc.

**Example of OTP Request**

Example1:
 **Verify Password:** This scenario involves verifying an OTP sent to the user’s registered contact method to verify their password.

Example2:
 **Re-KYC:** This scenario involves verifying an OTP sent to the user’s registered contact method to perform re-KYC (Know Your Customer) verification.

Example3:
 **Update Mobile-Verify OTP:** This scenario involves verifying an OTP sent to the user’s new mobile number to update their mobile number in the ABHA profile.

Example8:
 **Update Email-Verify OTP:** This scenario involves verifying an OTP sent to the user’s new email address to update their email address in the ABHA profile.

Example9:
 **Set Password:** This scenario involves setting a new password for the user’s ABHA account.

Example10:
 **Update Old Password:** This scenario involves updating the user’s password using their old password.

Example11:
 **CHILD ABHA KYC - Verify OTP:** This action allows users to complete the KYC verification for a Child ABHA by verifying the OTP sent to the Aadhaar-linked mobile number of the child/guardian. Successful verification completes the Re-KYC process for the Child ABHA account.

**Note:**
 **1.** OTP will be valid for 10 minute only

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/verify \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'X-token: Bearer {{X-token}}' \
  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "re-kyc"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "{{txnId}}",
      "otpValue": "{{encrypted otp value}}"
    }
  }
}'
```

## Authorization

- `Authorization` (bearer token, required)

## Headers

- `X-token` (string, required)
- `REQUEST-ID` (string, required)
- `TIMESTAMP` (string, required)

## Body

- `scope` (string[], required)
- `authData` (object, required)
- `authData.authMethods` (string[], required)
- `authData.otp` (object)
- `authData.otp.txnId` (string, required)
- `authData.otp.otpValue` (string, required)
- `reasons` (string[])

## Responses

- `200`: The 200 response code indicates a successful request. In this context, it refers to the successful verification of an OTP (One-Time Password) for various services. **Types of OTP Verifications:** **PASSWORD_VERIFY_OTP- Positive Flow :** The 200 response code indicates a successful request. In this context, it refers to the successful verification of the OTP (One-Time Password) for password verification purposes. **Re-KYC- Positive Flow :** The 200 response code indicates a successful request. In this context, it refers to the successful completion of the Re-KYC process. **Update Mobile- Positive Flow:** The 200 OK response code indicates a successful request. In this context, it refers to the successful update of the mobile number. **Update Email- Positive Flow:** The 200 OK response code indicates a successful request. In this context, it refers to the successful update of the email address. **PASSWORD UPDATE-OLD PASSWORD- Positive Flow:** The 200 OK response code indicates a successful request. In this context, it refers to the successful update of the password when the old password is verified. **CHILD ABHA KYC - Verify OTP- Positive Flow:** This action allows users to complete the KYC verification for a Child ABHA by verifying the OTP sent to the Aadhaar-linked mobile number of the child/guardian. Successful verification completes the Re-KYC process for the Child ABHA account.
- `400`: The 400 response code indicates a bad request. In this context, it refers to various errors encountered during the OTP (One-Time Password) generation or validation process. **Types of OTP Response Errors:** **Update Email - Invalid Scope**: The scope of the OTP response is invalid. **Update Email- Invalid Auth Methods**: The authentication method provided is invalid. **Update Email -Invalid X-token**: The X-token provided is invalid or expired. **Update Email -Invalid OTP Value**: The OTP value provided is invalid. **Update Mobile -Invalid Transaction Id**: The transaction ID provided is invalid. **Update Mobile - Invalid Scope**: The scope of the OTP response is invalid. **Update Mobile - Invalid Auth Methods:**: The authentication method provided is invalid.. **Update Mobile -  Invalid X-token:**: The X-token provided is invalid or expired. **Update Mobile-Invalid OTP Value**: The OTP value provided is invalid. **Re-KYC- Invalid Transaction Id**: The transaction ID provided is invalid. **Re-KYC  - Invalid Transaction Id**: The transaction ID provided is invalid. **Re-KYC- Invalid Auth Method**:  The authentication method provided is invalid.. **Re-KYC - Invalid X-token**: The X-token provided is invalid or expired.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `401`: The 401 response code indicates an unauthorized request. In this context, it refers to the lack of proper authentication during the operation of the Invalid Credentials. **Types of OTP Response Errors:** **Update Email-X-token expired**: The X-token provided for updating the email address has expired. **Update Mobile-Invalid access token**: The access token provided for updating the mobile number is invalid. **Update Mobile-X-token expired**: The X-token provided for updating the mobile number has expired. **Re-KYC - Invalid access token:**: The access token provided for Re-KYC is invalid. **Re-KYC-X-token expired**: The X-token provided for Re-KYC has expired.. **Password_Set-Invalid access token**:  The access token provided for setting the password is invalid. **Password_Set-X-token expired**: The ABHA number provided for ABHA OTP is invalid. **PASSWORD_UPDATE-OLD PASSWORD-Invalid access token**: The access token provided for updating the password using the old password is invalid. **PASSWORD_UPDATE-OLD PASSWORD-X-token expired**: The X-token provided for updating the password using the old password has expired.
  See Everything returns 401: /docs/hiecm/v3/troubleshooting/everything-returns-401
- `422`: The 422 Unprocessable Entity response for this endpoint indicates that the server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions. **Types of OTP Response Errors:** **Re-KYC-Invalid OTP**: The OTP provided for Re-KYC is invalid. **PASSWORD VERIFY OTP-Invalid OTP-AADHAAR**: The OTP provided for Aadhaar verification during password verification is invalid.
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors
- `500`: Internal Server Error
  See Error codes for this module: /docs/hiecm/v3/api/m1/errors

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "txnId": "6e3c1761-8e4c-44a3-929e-32b2c16083d5",
  "authResult": "success",
  "message": "Password updated successfully",
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>"
    }
  ]
}
```
