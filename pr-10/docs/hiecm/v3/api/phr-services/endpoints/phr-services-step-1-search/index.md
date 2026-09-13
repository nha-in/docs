# STEP 1 - search

`POST /ambulance-booking/search`

Searches for ambulance services. Beckn `search` action; results arrive at `on_search`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/ambulance-booking/search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/ambulance-booking",
    "message_id": "<TXN_ID>",
    "timestamp": "2026-06-12T10:00:00",
    "transaction_id": "<TXN_ID>"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "ALL",
          "name": "<NAME>"
        }
      },
      "fulfillment": {
        "type": "EMERGENCY",
        "start": {
          "time": {
            "timestamp": "2026-06-12T10:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2026-06-12T23:59:59"
          }
        }
      },
      "locations": [
        {
          "descriptor": {
            "code": "SOURCE",
            "name": "<NAME>"
          },
          "gps": "12.423423,77.325647",
          "address": "<ADDRESS>"
        }
      ],
      "item": {
        "descriptor": {
          "code": "AMBULANCE",
          "name": "<NAME>"
        }
      }
    }
  }
}'
```
