# Insurance plan: send the request

`POST /v1/insuranceplan/request`

Ask a payer for the plan behind a policy. The body is a Task with code `poll`, keyed on policy number and provider ID. Sent once per policy the hospital handles, not once per patient.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
