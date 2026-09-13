# Search ABHA Address, Get Auth Methods

`POST /phr/web/login/abha/search`

Look up available authentication methods for a given ABHA Address before login.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/phr/web/login/abha/search \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
