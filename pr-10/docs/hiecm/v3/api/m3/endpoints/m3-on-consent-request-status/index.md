# The consent manager reports the state of a consent request you asked about.

`POST /api/v3/hiu/consent/request/on-status`

The consent manager reports the state of a consent request you asked about.

GRANTED is absent from `status`'s enum here on purpose: a grant is communicated
through the notify callback with `consentArtefacts`, not through this status
callback.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hiu/consent/request/on-status \
  --header 'Content-Type: application/json' \
  --data '{
  "consentRequest": {
    "id": "77969467-5a92-44bb-9d6c-4caf24907ea5",
    "status": "REQUESTED"
  },
  "error": null,
  "response": {
    "requestId": "68b099de-f7ba-4a92-9bd5-97de2e397f31"
  },
  "resp": null
}'
```
