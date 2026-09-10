# HIU Consent Notification

`POST /api/consent-management/consent/request/notify`

Notification the gateway sends a HIU when a consent request is granted, denied, revoked or expires.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consent/request/notify \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "consentRequestId": "<TXN_ID>",
    "status": "DENIED",
    "consentArtefacts": [
      {
        "id": "<TXN_ID>"
      }
    ]
  }
}'
```
