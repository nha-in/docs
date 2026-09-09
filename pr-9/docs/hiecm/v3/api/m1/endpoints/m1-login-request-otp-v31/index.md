# Send a login OTP, v3.1

`POST /v3.1/profile/login/request/otp`

The v3.1 variant of the login OTP request. It sits on a different base
path from the rest of M1, `/abha/api/v3.1` rather than `/abha/api/v3`,
which is why the version appears in the path here.

Use v3 by default. v3.1 is used for Aadhaar OTP and biometric login.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3.1/profile/login/request/otp \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
    "aadhaar-verify",
    "aadhaar-otp-verify"
  ],
  "loginHint": "aadhaar",
  "loginId": "<ENCRYPTED_AADHAAR_NUMBER>",
  "otpSystem": "aadhaar"
}'
```
