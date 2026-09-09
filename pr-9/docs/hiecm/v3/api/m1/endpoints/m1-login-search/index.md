# Search ABHA Profile (for Password Login)

`POST /profile/login/search`

Look up a profile by ABHA Number as the first step of the password login flow.
Returns basic profile info to confirm the correct account before requesting password.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/profile/login/search \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "ABHANumber": "<ABHANUMBER>"
}'
```
