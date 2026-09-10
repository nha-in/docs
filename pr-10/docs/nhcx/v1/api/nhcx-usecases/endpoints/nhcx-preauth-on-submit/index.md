# Preauthorisation: deliver the answer

`POST /v1/preauth/on_submit`

Return the adjudicated preauthorisation as a ClaimResponse. Read `outcome` and the adjudication reason together: `complete` alone means approved or rejected.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 12 new, 121 resubmission, 13 enhancement, 19 a query answer under PMJAY; the payer answers 20 received, 21 approved, 23 rejected, 24 queried.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/preauth/on_submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
