# Predetermination: send the request

`POST /v1/predetermination/submit`

Ask what the payer would pay for a proposed course of treatment, without committing the provider to deliver it and without reserving a benefit. Reuses the Claim bundle with `use` set to `predetermination`.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/predetermination/submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
