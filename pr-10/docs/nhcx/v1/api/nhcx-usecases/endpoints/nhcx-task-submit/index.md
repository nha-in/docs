# Task: send the request

`POST /v1/task/submit`

One endpoint, several jobs, told apart by the Task's code and reason. Cancel a preauthorisation, reprocess a rejected claim, or claim a shortfall on a partly paid one. A supporting document is mandatory on a reprocess.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: PC01 cancel, 36 reprocess or shortfall; the payer answers 251 acknowledged, 252 approved, 253 rejected, 254 queried, PC02 cancellation done.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/task/submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
