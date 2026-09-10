# HIU On-Fetch (Consent Artefact Fetch Callback)

`POST /api/consent-management/consent/on-fetch`

Callback the gateway sends with a consent artefact the HIU asked to fetch, or the error that stopped it.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consent/on-fetch \
  --header 'Content-Type: application/json' \
  --data '{
  "requestId": "<GENERATED>",
  "timestamp": "<ISO_8601_TIMESTAMP>",
  "consent": {
    "status": "GRANTED",
    "consentDetail": {
      "consentId": "<consent-artefact-id>",
      "createdAt": "<ISO_8601_TIMESTAMP>",
      "patient": {
        "id": "<abha-address>@abdm"
      },
      "careContexts": [],
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT"
      },
      "hip": {
        "id": "<hip-id>"
      },
      "hiu": {
        "id": "<hiu-id>"
      },
      "consentManager": {
        "id": "sbx.abdm.gov.in"
      },
      "hiTypes": [
        "OPConsultation"
      ],
      "permission": {
        "accessMode": "VIEW",
        "dateRange": {
          "from": "2021-01-01T00:00:00.000Z",
          "to": "2023-12-31T23:59:59.999Z"
        },
        "dataEraseAt": "2024-12-31T23:59:59.999Z",
        "frequency": {
          "unit": "HOUR",
          "value": 1,
          "repeats": 0
        }
      }
    },
    "signature": "<signature>"
  },
  "resp": {
    "requestId": "<original-request-id>"
  }
}'
```
