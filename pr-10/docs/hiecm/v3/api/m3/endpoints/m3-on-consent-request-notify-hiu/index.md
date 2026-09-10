# The patient's decision, sent to the requester

`POST /api/v3/hiu/consent/request/notify`

On a grant, carries every consent artefact id created against the request, with the request id. On a denial, carries the denial, with `reason` set if the gateway supplied one.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hiu/consent/request/notify \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "consentRequestId": "77969467-5a92-44bb-9d6c-4caf24907ea5",
    "status": "GRANTED",
    "reason": null,
    "consentArtefacts": [
      {
        "id": "28ef6ae8-ad03-488d-b26e-940e27154cc0"
      }
    ]
  }
}'
```
