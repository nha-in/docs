# Set the preferred ABHA address

`POST /profile/phr/set-preferred/abha-address`

Marks one of the person's ABHA addresses as the preferred one, against a verified transaction.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/profile/phr/set-preferred/abha-address \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "<TRANSACTION_ID>"
}'
```
