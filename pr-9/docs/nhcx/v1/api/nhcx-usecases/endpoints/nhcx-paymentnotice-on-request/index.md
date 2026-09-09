# Payment: deliver the answer

`POST /v1/paymentnotice/on_request`

Acknowledge a payment notice. The portal's Payment document puts the acknowledgement here; the PMJAY handbook puts it on /v1/task/submit. Confirm which the payer expects.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 30 initiated, 31 processed, 33 settled; 17 for the acknowledgement.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/on_request \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
