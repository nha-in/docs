# Verify an OTP that ABDM sent, during enrolment

`POST /v3/enrollment/auth/byAbdm`

Confirms the mobile number or email address the person gave during
enrolment. The OTP here came from ABDM rather than from Aadhaar, which is
why the call is separate from the Aadhaar verification.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol",
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
