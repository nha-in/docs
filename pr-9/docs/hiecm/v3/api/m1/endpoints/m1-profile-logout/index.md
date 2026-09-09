# Log the person out and invalidate their user token

`GET /v3/profile/account/request/logout`

Invalidates the `X-token`. Call it when the person signs out, and when
your session ends, so a token cannot outlive the session that produced
it.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/logout \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
```
