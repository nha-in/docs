# Find an ABHA for somebody who does not know theirs

`POST /v3/profile/account/abha/search`

Takes an encrypted mobile number, Aadhaar number or biometric result and
sends an OTP to the mobile on record. The response carries a `txnId` and
a message naming the masked mobile the OTP went to, so the person can
confirm it is theirs before waiting for it.

Two shapes are documented for the response: an array, which fits one
mobile number mapping to several accounts, and a single object. The
single-object example carries a URL of `profile/login/request/otp`,
so it likely describes a different endpoint. Expect an array, and
treat the single object as unconfirmed.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/abha/search \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "search-abha"
  ],
  "mobile": "<MOBILE>"
}'
```
