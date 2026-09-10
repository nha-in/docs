# Claim: deliver the answer

`POST /v1/claim/on_submit`

Return the adjudicated claim. Several interim answers may arrive on one correlation ID before the final one; only the final carries `response.complete`.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: 15 the claim, 151 a query answer, 14 a provisional discharge submission; the payer answers 25 received, 26 approved, 27 queried, 28 in process, 29 forwarded, 291 denied.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/claim/on_submit \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
