# Link Request

`POST /profile/phr/link`

Links an ABHA number to the signed-in ABHA address, against a verified transaction.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/phr/link \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "<ACTION>",
  "transactionId": "<TRANSACTION_ID>"
}'
```
