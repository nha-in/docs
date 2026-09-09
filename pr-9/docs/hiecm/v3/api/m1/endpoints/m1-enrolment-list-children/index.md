# List the child ABHA accounts linked to this account

`GET /v3/enrollment/profile/children`

A parent or guardian can hold ABHA accounts for children under their own
account. This returns them.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/profile/children \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'X-token: Bearer <X_TOKEN_FROM_LOGIN_VERIFY>'
```
