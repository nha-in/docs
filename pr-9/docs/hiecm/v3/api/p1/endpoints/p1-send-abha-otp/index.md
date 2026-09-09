# Send ABHA OTP

`POST /profile/phr/request/otp`

Sends an OTP to the contact registered on the signed-in ABHA address, to authorise a profile change. `loginId` is encrypted.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/phr/request/otp \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "<SCOPE>"
  ],
  "loginHint": "<LOGIN_HINT>",
  "loginId": "<LOGIN_ID>",
  "otpSystem": "<OTP_SYSTEM>"
}'
```
