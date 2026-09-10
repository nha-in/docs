# Revoke Consent

`POST /api/consent-management/consents/revoke`

Revokes the consent artefacts given, so the HIUs holding them can no longer fetch under them.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consents/revoke \
  --header 'Content-Type: application/json' \
  --data '{
  "consents": [
    "<TXN_ID>"
  ]
}'
```
