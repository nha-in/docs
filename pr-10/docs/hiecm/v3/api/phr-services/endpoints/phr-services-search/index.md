# search

`POST /nhcx/search`

Searches a payer's records for a member's policy through the National Health Claims Exchange. The result arrives at `on_submit`.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/nhcx/search \
  --header 'Content-Type: application/json' \
  --data '{
  "memberId": "PZ2Q9UZHM",
  "payerId": "1518@hcx",
  "productId": "100155",
  "productName": "PMJAY/HP/S/G",
  "processingId": "1518@hcx"
}'
```
