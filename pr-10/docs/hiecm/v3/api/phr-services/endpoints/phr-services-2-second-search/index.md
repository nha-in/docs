# 2. Second Search

`POST /teleconsulting/search`

Refines a teleconsultation search, for example by provider or time slot. Beckn `search` action; results arrive at `on_search`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/search \
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
    "provider_id": "hspa-nha",
    "message_id": "<TXN_ID>",
    "timestamp": "<TXN_ID>",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>"
  },
  "message": {
    "intent": {
      "provider": {
        "id": "1",
        "categories": [
          {
            "id": "201",
            "parent_category_id": "101",
            "descriptor": {
              "name": "<NAME>",
              "code": "CARDIOLOGY"
            }
          },
          {
            "id": "101",
            "descriptor": {
              "name": "<NAME>",
              "code": "ALLOPATHY"
            }
          }
        ],
        "fulfillments": [
          {
            "type": "Online",
            "agent": {
              "id": "<EMAIL>",
              "image": null
            },
            "start": {
              "time": {
                "timestamp": "2024-06-25T10:30:27"
              }
            },
            "end": {
              "time": {
                "timestamp": "2024-06-25T23:59:59"
              }
            }
          }
        ],
        "items": [
          {
            "id": "1",
            "descriptor": {
              "name": "<NAME>",
              "code": "CONSULTATION"
            },
            "price": {
              "currency": "INR",
              "value": "0.0"
            },
            "fulfillment_id": "1",
            "category_id": "201"
          }
        ]
      }
    }
  }
}'
```
