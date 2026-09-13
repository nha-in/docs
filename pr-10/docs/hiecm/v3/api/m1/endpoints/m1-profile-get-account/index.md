# Read the signed in person's ABHA profile

`GET /v3/profile/account`

Needs the `X-token` from login, because it reads one person's account
rather than anything about your application.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
```
