# Verify OTP / Biometric for ABHA Address Login

`POST /phr/web/login/abha/verify`

Complete the ABHA Address login with OTP or biometric.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/phr/web/login/abha/verify \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-login",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "otpValue": "{{RSA_encrypted_otp}}"
    }
  }
}'
```
