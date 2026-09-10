# Generate Link Token

`POST /hiecm/v3/token/generate-token`

Generates a short-lived link token for a specific patient identified by their ABHA number/address.
The link token is passed as `X-Link-Token` header when calling the care context linking API.
Must be called immediately before the linking call, tokens expire quickly.

This call is accepted with `202` and carries no token. The token
itself arrives on the `m2_on_generate_token_result` callback, at the
callback URL registered for your bridge.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/v3/token/generate-token \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": 91234567890123,
  "abhaAddress": "patient@sbx",
  "name": "Ramesh Kumar",
  "gender": "M",
  "yearOfBirth": 1985
}'
```
