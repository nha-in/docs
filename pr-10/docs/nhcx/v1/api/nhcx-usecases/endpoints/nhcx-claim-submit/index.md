# Claim: send the request

`POST /v1/claim/submit`

Submit the claim at discharge, or a provisional discharge submission, or an answer to a query on a claim. The same Claim resource as the preauthorisation with `use` switched to `claim`.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 15 the claim, 151 a query answer, 14 a provisional discharge submission; the payer answers 25 received, 26 approved, 27 queried, 28 in process, 29 forwarded, 291 denied.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/claim/submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
