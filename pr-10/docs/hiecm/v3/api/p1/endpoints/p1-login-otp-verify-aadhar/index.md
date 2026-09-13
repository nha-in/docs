# Login OTP Verify - AADHAR

`POST /login/phr/verify`

Verifies the login OTP. On success the response carries the accounts linked to the identifier and a token for each, or a transaction to pick one with.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/phr/verify \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "<SCOPE>"
  ],
  "authData": {
    "authMethods": [
      "<AUTH_METHODS>"
    ],
    "otp": {
      "txnId": "<TXN_ID>",
      "otpValue": "<OTP_VALUE>"
    },
    "face": {
      "txnId": "<TXN_ID>",
      "faceAuthPid": "<FACE_AUTH_PID>"
    },
    "password": {
      "abhaAddress": "<ABHA_ADDRESS>",
      "password": "<PASSWORD>"
    },
    "face_login": {
      "aadhaar": "<AADHAAR>",
      "faceAuthPid": "<FACE_AUTH_PID>"
    }
  }
}'
```
