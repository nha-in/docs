# Verify ABHA OTP

`POST /profile/phr/verify`

Verifies the OTP sent for a profile change and returns the accounts and tokens it applies to.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/phr/verify \
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
    "password": {
      "abhaAddress": "<ABHA_ADDRESS>",
      "password": "<PASSWORD>"
    }
  }
}'
```
