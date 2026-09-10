# Communication: send the request

`POST /v1/communication/request`

The payer's asynchronous channel to the provider. Raise a turnaround-time alert, pass on a grievance, announce a wallet or policy change, ask for information outside a formal query, or acknowledge an arbitration request.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: as carried on the payer's request.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/communication/request \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
