# Preauthorisation: send the request

`POST /v1/preauth/submit`

Submit a preauthorisation, a resubmission, an enhancement, or an answer to a query. All four carry the same Claim bundle with `use` set to `preauthorization`; the workflow code in the header is what tells them apart.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 12 new, 121 resubmission, 13 enhancement, 19 a query answer under PMJAY; the payer answers 20 received, 21 approved, 23 rejected, 24 queried.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/preauth/submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
