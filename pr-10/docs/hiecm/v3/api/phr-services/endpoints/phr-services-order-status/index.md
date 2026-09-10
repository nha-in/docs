# order-status

`POST /scan-pay/order-status`

Returns the status of a scan and pay order by its order number.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/scan-pay/order-status \
  --header 'Content-Type: application/json' \
  --data '{
  "orderNumber": "ORD-ABDM-123456",
  "openOrderRequestId": "<TXN_ID>"
}'
```
