# update payment

`PUT /scan-pay/update/payment/{id}`

Records the outcome of a scan and pay payment: the amount, the transaction id and the receipt.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/scan-pay/update/payment/{id} \
  --header 'Content-Type: application/json' \
  --data '{
  "paymentName": "Kidney Function Test(Kft)Panel(Urea+Creat)",
  "orderNumber": "ORD-ABDM-123456",
  "transactionId": "",
  "counterCode": "IN0810000177",
  "paymentUrl": "https://payit.cc/I4321024287",
  "amount": "60.00"
}'
```
