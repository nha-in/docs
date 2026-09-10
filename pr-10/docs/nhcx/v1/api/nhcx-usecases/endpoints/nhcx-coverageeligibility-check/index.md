# Coverage eligibility: send the request

`POST /v1/coverageeligibility/check`

Ask whether a policy is in force, what it covers, and what a package will need. `purpose` decides which of the four questions is being asked: validation, discovery, benefits or auth-requirements.

The body is one JSON object with a single `payload` field carrying the JWE. The exchange answers `202 Accepted` with a receipt; the decision arrives later on the matching callback.

Workflow codes: none listed. The check sits alongside registration, code 10, and admission, code 11.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check \
  --header 'Content-Type: application/json' \
  --data '{
  "payload": "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIi...."
}'
```
