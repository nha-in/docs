# Send AADHAAR Otp - Link-DeLink

`POST /login/profile/request/otp`

Sends an Aadhaar OTP to authorise linking or delinking an ABHA number with the signed-in address. `loginId` is the encrypted Aadhaar.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/profile/request/otp \
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
