# Create an ABHA from a verified Aadhaar OTP

`POST /v3/enrollment/enrol/byAadhaar`

Exchanges the OTP you just received for a real ABHA number. Send the
`txnId` from the OTP request, the encrypted OTP value, and the consent
block recording that the person agreed.

This is the call that creates the account, so treat a success as a
permanent side effect. If you retry it blindly after a timeout you may be
enrolling somebody twice.

`BENEFIT_NAME` is sent on this call when the enrolment belongs to a
benefit scheme.

The demographic authentication variant reads the user token from a
different place: `token` at the top level, while the OTP, face and
fingerprint variants take `tokens.token`. Check which one you get
before parsing.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "txnId": "<TXN_ID>",
      "otpValue": "<OTPVALUE>",
      "mobile": "<MOBILE>"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```
