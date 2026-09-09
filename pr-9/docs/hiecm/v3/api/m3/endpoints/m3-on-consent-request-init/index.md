# The consent request was accepted, with its request id

`POST /api/v3/hiu/consent/request/on-init`

Carries the consent request and the request id. Store the request id: it is how a later notification is tied back to the request you made.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hiu/consent/request/on-init \
  --header 'Content-Type: application/json' \
  --data '{
  "consentRequest": {
    "id": "77969467-5a92-44bb-9d6c-4caf24907ea5"
  },
  "error": null,
  "response": {
    "requestId": "6cb80f71-49fa-4f8c-93d5-de9916a708e8"
  }
}'
```
