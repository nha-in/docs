# Task: deliver the answer

`POST /v1/task/on_submit`

Answer a Task with a Task whose output references a ClaimResponse, read by the same parser as any other decision.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: PC01 cancel, 36 reprocess or shortfall; the payer answers 251 acknowledged, 252 approved, 253 rejected, 254 queried, PC02 cancellation done.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/task/on_submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
