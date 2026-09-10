# Send an OTP to begin or continue an enrolment

`POST /v3/enrollment/request/otp`

The first call of most enrolment flows, and the one people reuse without
noticing. What it does depends on `scope` and `loginHint`.

Starting an enrolment: `scope` is `["abha-enrol"]`, `loginHint` is
`aadhaar`, `loginId` is the encrypted Aadhaar number and `otpSystem` is
`aadhaar`. The OTP goes to the mobile registered with Aadhaar.

Verifying a mobile or email afterwards: `scope` gains `mobile-verify` or
`email-verify`, `otpSystem` becomes `abdm`, and you pass the `txnId` from
the enrolment you are continuing.

`loginId` is encrypted, never the raw value. Encrypt it against the ABDM
public key first.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": "_encrypted_12_digit_aadhaar_no_",
  "otpSystem": "aadhaar"
}'
```
