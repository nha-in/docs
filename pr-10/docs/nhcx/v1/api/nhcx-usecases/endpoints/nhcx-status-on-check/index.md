# Status: deliver the state

`POST /v1/on_status`

Deliver the state of a request back to whoever asked for it.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/on_status \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
