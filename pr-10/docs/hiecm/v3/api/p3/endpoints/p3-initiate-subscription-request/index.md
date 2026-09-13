# Initiate Subscription Request

`POST /api/consent-management/subscription-requests/init`

Raises a subscription request as a HIU: asks to be notified when the patient links new care contexts at the HIPs and categories named, for a period.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/subscription-requests/init \
  --header 'Content-Type: application/json' \
  --data '{
  "hiu": {
    "id": "<hiu-id>"
  },
  "patient": {
    "id": "<abha-address>@abdm"
  },
  "purpose": {
    "text": "Care Management",
    "code": "CAREMGT",
    "refUri": "www.abdm.gov.in"
  },
  "hips": [
    {
      "id": "<hip-id>"
    }
  ],
  "categories": [
    "LINK",
    "DATA"
  ],
  "period": {
    "from": "2021-01-01T00:00:00.000Z",
    "to": "2023-12-31T23:59:59.999Z"
  }
}'
```
