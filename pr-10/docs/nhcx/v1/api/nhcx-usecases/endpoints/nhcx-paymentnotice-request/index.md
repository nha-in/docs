# Payment: send the request

`POST /v1/paymentnotice/request`

Tell the provider that money has moved against an approved claim. Three notices can arrive for one case as the transfer progresses, and only the last carries the bank reference.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 30 initiated, 31 processed, 33 settled; 17 for the acknowledgement.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/request \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
