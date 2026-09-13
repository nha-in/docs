# STEP 3 - init

`POST /ambulance-booking/init`

Initialises an ambulance booking for the service selected from search results. Beckn `init` action; the reply arrives at `on_init`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/ambulance-booking/init \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "init",
    "timestamp": "2026-06-12T10:00:00",
    "core_version": "0.7.1",
    "consumer_id": "aarogyaSetu.eua",
    "consumer_uri": "https://aarogyasetu-sandbox.abdm.gov.in/aarogyasetu/api/v3/app/api/ambulance-booking",
    "provider_id": "nha.hspa",
    "provider_uri": "https://hspasbx.abdm.gov.in/api/v1/hspa/ambulance",
    "transaction_id": "<TXN_ID>",
    "message_id": "<TXN_ID>"
  },
  "message": {
    "order": {
      "id": "<O_R_D_E_R_I_D>"
    }
  }
}'
```
