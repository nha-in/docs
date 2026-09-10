# 6.on_cancel

`POST /teleconsulting/on_cancel`

Callback carrying the provider's reply to a teleconsultation cancellation.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/on_cancel \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "on_cancel",
    "timestamp": "2025-10-17T06:11:24.068345Z",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/teleconsulting",
    "provider_id": "hspa-nha",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>",
    "message_id": "<TXN_ID>"
  },
  "message": {
    "order": {
      "id": "1128-796387-3415",
      "state": "CANCELLED",
      "fulfillment": {
        "tags": {
          "@abdm/gov.in/cancelledby": "doctor",
          "@abdm/gov.in/teleconsultation/uri": "false"
        }
      }
    }
  }
}'
```
