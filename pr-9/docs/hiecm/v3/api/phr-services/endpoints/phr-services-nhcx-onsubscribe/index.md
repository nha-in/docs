# nhcx-onsubscribe

`POST /nhcx/v1/hcx/notification/on_subscribe`

Callback confirming a subscription to National Health Claims Exchange notifications.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/v1/hcx/notification/on_subscribe \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "<SUPABASE_SERVICE_ROLE_API_KEY_1A5M>"
}'
```
