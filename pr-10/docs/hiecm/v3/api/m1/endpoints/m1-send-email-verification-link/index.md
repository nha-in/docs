# Send Email Verification Link

`POST /profile/account/request/emailVerificationLink`

Send a one-click email verification link. The user clicks it to verify their email, no OTP required.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/profile/account/request/emailVerificationLink \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-profile",
    "email-link-verify"
  ],
  "loginHint": "email",
  "loginId": "{{RSA_encrypted_email}}",
  "otpSystem": "abdm, aadhaar"
}'
```
