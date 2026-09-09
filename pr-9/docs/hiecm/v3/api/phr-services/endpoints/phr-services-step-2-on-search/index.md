# STEP 2 - on_search

`POST /ambulance-booking/on_search`

Callback carrying the ambulance providers and services that matched a search.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/ambulance-booking/on_search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "on_search",
    "timestamp": "2026-06-12T10:00:00",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/ambulance-booking",
    "transaction_id": "<TXN_ID>",
    "message_id": "<TXN_ID>"
  },
  "message": {}
}'
```
