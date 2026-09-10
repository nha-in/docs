# Insurance plan: deliver the answer

`POST /v1/insuranceplan/on_request`

Answer with the insurance plan, scoped to the requesting provider's empanelment. A scheme plan is package-based and can run to 21 MB; a private insurer's is coverage-based.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/on_request \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
