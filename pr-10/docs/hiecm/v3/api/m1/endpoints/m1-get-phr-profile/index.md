# Get PHR Profile

`GET /phr/web/login/profile/abha-profile`

Retrieve the authenticated user's PHR profile after ABHA Address login.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/phr/web/login/profile/abha-profile \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>'
```
