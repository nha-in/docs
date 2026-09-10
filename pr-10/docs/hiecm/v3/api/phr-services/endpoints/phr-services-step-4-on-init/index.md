# STEP 4 - on_init

`POST /ambulance-booking/on_init`

Callback carrying the provider's reply to an ambulance booking `init`: the quote and the terms to confirm.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/ambulance-booking/on_init \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {
    "domain": "nic2008:86909",
    "country": "IND",
    "city": "std:011",
    "action": "on_init",
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
      "id": "<O_R_D_E_R_I_D>",
      "state": "INITIALIZED"
    }
  }
}'
```
