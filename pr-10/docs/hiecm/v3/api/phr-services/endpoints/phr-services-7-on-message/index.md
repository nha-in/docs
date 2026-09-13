# 7 .On_message

`POST /teleconsulting/message`

Sends a message within a teleconsultation. Beckn `message` action.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/message \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_message",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/teleconsulting",
    "message_id": "<TXN_ID>",
    "timestamp": "2022-07-05T15:24:35.481906Z",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>"
  },
  "message": {
    "intent": {
      "chat": {
        "sender": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image",
            "id": "santoshjagtap@sbx"
          }
        },
        "receiver": {
          "person": {
            "name": "<NAME>",
            "gender": "M",
            "image": "image hashed base64",
            "id": "<EMAIL>"
          }
        },
        "content": {
          "content_id": "<TXN_ID>",
          "content_value": "Base64 Encoded text",
          "content_type": "text"
        },
        "time": {
          "timestamp": "2022-10-03T11:32:01"
        }
      }
    }
  }
}'
```
