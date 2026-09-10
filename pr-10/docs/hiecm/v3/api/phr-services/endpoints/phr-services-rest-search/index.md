# Rest Search

`POST /v1/rest/search`

Searches PM-JAY empanelled facilities and returns the results in the same call, without a callback.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/v1/rest/search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85112",
    "country": "IND",
    "city": "std:011",
    "action": "search",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu.abdm.gov.in/aarogyasetu/api/v3/app/api/hem",
    "message_id": "<GENERATED>",
    "timestamp": "<ISO_8601_TIMESTAMP>",
    "transaction_id": "<GENERATED>"
  },
  "message": {
    "intent": {
      "fulfillment": {
        "start": {
          "time": {
            "timestamp": "2022-07-22T13:21:41"
          }
        },
        "end": {
          "time": {
            "timestamp": "2022-07-22T23:59:59"
          }
        },
        "type": "PMJAYHEM"
      },
      "item": {
        "descriptor": {
          "code": "PMJAY",
          "name": "<NAME>",
          "flag": false
        }
      },
      "location": {
        "state": {
          "name": "<NAME>",
          "code": "27"
        }
      }
    }
  }
}'
```
