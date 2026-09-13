# 1. First Search

`POST /api/teleconsulting/search`

Searches for teleconsultation services by category. Beckn `search` action; results arrive at `on_search`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/teleconsulting/search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/teleconsulting",
    "message_id": "<TXN_ID>",
    "timestamp": "2022-07-05T15:24:35",
    "transaction_id": "<TXN_ID>"
  },
  "message": {
    "intent": {
      "category": {
        "descriptor": {
          "code": "CARDIOLOGY",
          "name": "<NAME>"
        }
      },
      "fulfillment": {
        "agent": {
          "name": "<NAME>"
        },
        "type": "Online",
        "start": {
          "time": {
            "timestamp": "2022-07-15T00:00:00"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-16T00:00:00"
          }
        }
      },
      "item": {
        "descriptor": {
          "code": "Consultation",
          "name": "<NAME>"
        }
      }
    }
  }
}'
```
