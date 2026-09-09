# The link token m2_generate_link_token generated, or why it failed

`POST /v3/hip/token/on-generate-token`

Hosted by your bridge, not by ABDM. The gateway calls this endpoint at the callback URL registered for your bridge, so the path above is relative to that URL.

`response.requestId` echoes the REQUEST-ID you sent to m2_generate_link_token, so match this callback to that call before reading `abhaAddress` or `linkToken`.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/v3/hip/token/on-generate-token \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "linkToken": "<LINK_TOKEN>",
  "error": {
    "code": "<CODE>",
    "message": "<MESSAGE>"
  },
  "response": {
    "requestId": "<REQUEST_ID>"
  }
}'
```
