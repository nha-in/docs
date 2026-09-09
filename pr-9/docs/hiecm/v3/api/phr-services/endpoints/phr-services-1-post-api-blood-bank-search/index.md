# 1. POST /api/blood-bank/search

`POST /api/blood-bank/search`

Searches for blood banks and blood availability. Beckn `search` action; results arrive at `on_search`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/blood-bank/search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85110",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.9.1",
    "consumer_id": "aarogya.setu",
    "consumer_uri": "<BASE_URL>",
    "transaction_id": "<TRANSACTION_ID>",
    "message_id": "<MESSAGE_ID>",
    "timestamp": "<TIMESTAMP>",
    "ttl": "PT30S"
  },
  "message": {
    "intent": {
      "item": {
        "descriptor": {
          "name": "<NAME>"
        },
        "category_id": "BLOOD_GROUP"
      },
      "fulfillment": {
        "type": "BLOOD_BANK"
      },
      "location": {
        "gps": "28.6139,77.2090",
        "radius": {
          "type": "CIRCULAR",
          "value": "10",
          "unit": "km"
        },
        "city": {
          "name": "<NAME>",
          "code": "std:011"
        }
      }
    }
  }
}'
```
