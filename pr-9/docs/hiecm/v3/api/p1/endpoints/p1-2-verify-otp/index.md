# 2. Verify OTP

`POST /api/registration/phr/verify/otp`

Verifies the mobile OTP for a registration transaction. `authData` carries the transaction id and the encrypted OTP.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/phr/verify/otp \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-enroll",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "<TXN_ID>",
      "otpValue": "<OTPVALUE>"
    }
  }
}'
```
