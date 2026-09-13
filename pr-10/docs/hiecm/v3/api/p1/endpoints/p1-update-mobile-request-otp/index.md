# Update mobile request OTP

`POST /profile/abha/request/otp`

Sends an OTP to a new mobile number so it can replace the one on the signed-in ABHA address. `loginId` is the encrypted new number.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/abha/request/otp \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "scope": [
    "abha-profile",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "<ENCRYPTED_DATA>",
  "otpSystem": "<OTPSYSTEM>"
}'
```
