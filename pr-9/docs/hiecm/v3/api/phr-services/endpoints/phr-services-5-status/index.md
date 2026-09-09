# 5. Status

`POST /teleconsulting/status`

Asks for the current status of a teleconsultation order. Beckn `status` action; the reply arrives at `on_status`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/teleconsulting/status \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2004:85111",
    "country": "IND",
    "city": "std:011",
    "action": "status",
    "core_version": "0.7.1",
    "consumer_id": "phr.euapid.bb",
    "consumer_uri": "https://d2xk0g5obixbh6.cloudfront.net/aarogyasetu/api/v3/app/api/teleconsulting",
    "message_id": "<TXN_ID>",
    "timestamp": "2022-07-05T15:24:35",
    "provider_id": "hspa-nha",
    "provider_uri": "http://hspasbx.abdm.gov.in/api/v1",
    "transaction_id": "<TXN_ID>"
  },
  "message": {
    "order": {
      "id": "8441-696786-1042"
    }
  }
}'
```
