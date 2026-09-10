# On Search

`POST /v1/on_search`

Callback carrying the PM-JAY empanelled facilities that matched a search.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/v1/on_search \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "messageId": "<MESSAGE_ID>",
    "transactionId": "<TRANSACTION_ID>",
    "consumerId": "<CONSUMER_ID>",
    "consumerUri": "<CONSUMER_URI>",
    "action": "on_search"
  },
  "message": {
    "catalog": {
      "providers": [
        {
          "id": "string",
          "descriptor": {
            "name": "<NAME>"
          },
          "locations": [],
          "items": [],
          "fulfillments": []
        }
      ]
    }
  }
}'
```
