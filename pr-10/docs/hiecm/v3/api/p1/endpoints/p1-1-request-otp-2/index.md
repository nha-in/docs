# 1. Request OTP

`POST /api/registration/phr/request/otp`

Starts ABHA address registration for a person with no ABHA number, by sending an OTP to their mobile. `loginId` is the encrypted mobile number.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/phr/request/otp \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-address-enroll",
    "mobile-verify"
  ],
  "loginHint": "mobile-number",
  "loginId": "xHu0gDObXVpar+WN4yvTqpIswFtJmdbufWPlqp==",
  "otpSystem": "<OTPSYSTEM>"
}'
```
