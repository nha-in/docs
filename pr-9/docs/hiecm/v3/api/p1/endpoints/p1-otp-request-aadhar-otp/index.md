# OTP Request - AADHAR OTP

`POST /login/phr/request/otp`

Starts a login by sending an OTP. `loginHint` names what the person is identifying with, and `loginId` is that value encrypted.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/phr/request/otp \
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
