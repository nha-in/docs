# Create a session and get an access token

`POST /api/hiecm/gateway/v3/sessions`

Send the client id and client secret from your ABDM sandbox
registration. The response carries a bearer token that every module
API accepts in the `Authorization` header.

This is the one call that does not itself need a bearer token, which
is why `security` is empty here.

The token is short lived. Read `expiresIn` from the response rather
than assuming a duration, and refresh before it runs out instead of
waiting for a 401.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "clientId": "<CLIENT_ID>",
  "clientSecret": "<CLIENT_SECRET>",
  "grantType": "client_credentials"
}'
```
