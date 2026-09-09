# on_submit

`POST /nhcx/v1/search/on_submit`

Callback carrying the payer's answer to a policy search.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/v1/search/on_submit \
  --header 'Content-Type: application/json' \
  --data '{
  "type": "<TYPE>",
  "payload": "<PAYLOAD>"
}'
```
