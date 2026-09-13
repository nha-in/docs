# Search Auth Methods - ABHAAddress

`POST /login/phr/search`

Returns the authentication methods available for an ABHA address, so the login can offer only the ones that will work.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/phr/search \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
