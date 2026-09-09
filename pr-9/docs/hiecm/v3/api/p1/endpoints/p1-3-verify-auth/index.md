# 3. Verify Auth

`POST /api/registration/abha/verify/auth`

Verifies the OTP for a registration transaction started against an ABHA number. `authData` carries the transaction id and the encrypted OTP.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/abha/verify/auth \
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
