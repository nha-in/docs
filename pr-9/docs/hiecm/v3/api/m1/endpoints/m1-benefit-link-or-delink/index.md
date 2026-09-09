# Link or unlink a benefit record from an ABHA

`POST /v3/profile/benefit/linkAndDelink`

One call does both directions. The success response names the
scheme and confirms the link in a human readable `status` string rather
than a code, so match on the HTTP status and the scheme, not on that
text.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/linkAndDelink \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "link"
  ],
  "loginHint": "abha-number",
  "loginId": "<RSA_ENCRYPTED_ABHA_NUMBER>"
}'
```
