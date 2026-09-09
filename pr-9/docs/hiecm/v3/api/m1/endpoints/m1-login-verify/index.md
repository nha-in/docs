# Verify a login OTP and get a user token

`POST /v3/profile/login/verify`

Returns the user scoped token that profile calls need, sent afterwards as
the `X-token` header. That token identifies one person, so it is not
interchangeable with the gateway session token, which identifies your
application.

If the identifier the person used maps to more than one ABHA, this
responds with the list instead of a token, and you continue with the
user selection call.

Documented responses cover 400, 401, 404 and 422 as well as 200, so
read the body rather than only the status.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/login/verify \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'T-token: <T_TOKEN>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>' \
  --header 'Content-Type: application/json' \
  --data '{
  "scope": [
    "abha-login",
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
