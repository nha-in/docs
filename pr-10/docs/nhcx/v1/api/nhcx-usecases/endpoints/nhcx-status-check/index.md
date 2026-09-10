# Status: ask where a request has got to

`POST /v1/status`

Ask the exchange for the state of a request already triggered, so neither side has to infer what happened from silence.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/status \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
