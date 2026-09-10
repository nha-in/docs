# The outcome of a care context notify call you made

`POST /v3/links/context/on-notify`

Hosted by your bridge, not by ABDM. The gateway calls this endpoint at the callback URL registered for your bridge, so the path above is relative to that URL. This is the result leg for `m2_link_care_context_notify`.

`response.requestId` echoes the REQUEST-ID you sent to m2_link_care_context_notify.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/v3/links/context/on-notify \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS"
  },
  "error": {
    "code": "<CODE>",
    "message": "<MESSAGE>"
  },
  "response": {
    "requestId": "<REQUEST_ID>"
  }
}'
```
