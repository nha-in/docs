# Init Consent Request

`POST /api/consent-management/consent/request/init`

Raises a consent request as a HIU: names the patient, the purpose, the record types and the period of care wanted.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consent/request/init \
  --header 'Content-Type: application/json' \
  --data '{
  "consent": {
    "purpose": {
      "text": "Care management",
      "code": "CAREMGT",
      "refUri": "www.abdm.gov.in"
    },
    "patient": {
      "id": "nithishjanithi@sbx"
    },
    "hiu": {
      "id": "IN0002222"
    },
    "hip": {
      "id": "wdwsd"
    },
    "careContexts": null,
    "requester": {
      "name": "<NAME>",
      "identifier": {
        "type": "REGNO1",
        "value": "MH1001",
        "system": "https://www.mciindia.9985"
      }
    },
    "hiTypes": [
      "Prescription"
    ],
    "permission": {
      "accessMode": "VIEW",
      "dateRange": {
        "from": "2023-05-09T08:58:09.738Z",
        "to": "2025-04-12T09:00:00.738Z"
      },
      "dataEraseAt": "2026-09-10T12:26:00.738Z",
      "frequency": {
        "unit": "HOUR",
        "value": 0,
        "repeats": 0
      }
    }
  }
}'
```
