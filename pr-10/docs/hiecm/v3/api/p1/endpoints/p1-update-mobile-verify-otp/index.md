# Update mobile verify OTP

`POST /abha/api/v3/phr/app/login/profile/abha/verify`

Verifies the OTP sent for a mobile number update on an ABHA address. `authData` carries the transaction id and the encrypted OTP.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/abha/api/v3/phr/app/login/profile/abha/verify \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
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
