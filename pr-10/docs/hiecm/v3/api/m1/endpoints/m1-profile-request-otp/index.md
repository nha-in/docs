# Send an OTP to change something on the profile

`POST /v3/profile/account/request/otp`

Raise this before updating a mobile number, an email address or a
password. `scope` names both the area and the action, for example
`["abha-profile", "mobile-verify"]`.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/otp \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "mobile-verify"
  ],
  "loginHint": "mobile",
  "loginId": "<MOBILE_ENCRYPTION>",
  "otpSystem": "abdm"
}'
```
