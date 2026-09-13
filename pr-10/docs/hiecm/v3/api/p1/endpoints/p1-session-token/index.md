# Session-Token

`POST /api/global/get/session`

Issues the access token every PHR application call carries as a bearer token, with its refresh token and both expiry windows.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/global/get/session
```
