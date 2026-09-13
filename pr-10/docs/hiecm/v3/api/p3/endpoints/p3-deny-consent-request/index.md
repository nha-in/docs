# Deny Consent Request

`POST /api/consent-management/consent-requests/{consentRequestId}/deny`

Denies a consent request, with the reason the person gave.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consent-requests/{consentRequestId}/deny \
  --header 'Content-Type: application/json' \
  --data '{
  "reason": "Not required"
}'
```
