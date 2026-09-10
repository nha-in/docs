# Get a new user token from a refresh token

`GET /v3/profile/account/request/token`

Refreshes the `X-token` without making the person log in again. Read the
expiry from the response rather than assuming one.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/account/request/token \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'R-token: <R_TOKEN>'
```
