# 4. Create Custom PHR Address

`POST /api/registration/abha/custom/phr/create`

Creates an ABHA address of the person's own choosing, once the registration transaction has been verified.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/abha/custom/phr/create \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "abhaAddress": "<ABHA_ADDRESS>"
}'
```
