# Coverage eligibility: deliver the answer

`POST /v1/coverageeligibility/on_check`

Answer an eligibility check with a CoverageEligibilityResponse. The payer may instead answer with a forward instruction, asking the exchange to pass the same request to another payer.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed. The check sits alongside registration, code 10, and admission, code 11.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/on_check \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
