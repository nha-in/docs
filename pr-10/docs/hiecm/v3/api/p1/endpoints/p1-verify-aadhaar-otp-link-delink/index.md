# Verify AADHAAR Otp - Link-DeLink

`POST /login/profile/verify`

Verifies the Aadhaar OTP for a link or delink transaction and returns the accounts it applies to.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/profile/verify \
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
    }
  }
}'
```
