# De-Link Request

`POST /login/profile/abha/de-link`

Removes the link between the signed-in ABHA address and an ABHA number, against a verified transaction.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/login/profile/abha/de-link \
  --header 'Content-Type: application/json' \
  --data '{
  "action": "<ACTION>",
  "transactionId": "<TRANSACTION_ID>"
}'
```
