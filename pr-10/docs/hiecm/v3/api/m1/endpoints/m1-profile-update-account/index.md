# Update fields on an ABHA profile

`PATCH /v3/profile/account`

Changes self declared profile details. Changing a mobile number or an
email address is not done here: those need the OTP pair below, because
NHA verifies the new value before accepting it.

```bash
curl --request PATCH \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "<ABHA_NUMBER>",
  "name": "<NAME>",
  "dob": "<DATE_OF_BIRTH>",
  "gender": "M"
}'
```
