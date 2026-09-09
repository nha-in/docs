# The consent artefact detail, fetched by artefact id

`POST /api/v3/hiu/consent/on-fetch`

The artefact itself, in answer to a fetch by artefact id.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/hiu/consent/on-fetch \
  --header 'Content-Type: application/json' \
  --data '{
  "consent": {
    "status": "GRANTED",
    "consentDetail": {
      "consentId": "28ef6ae8-ad03-488d-b26e-940e27154cc0",
      "hip": {
        "id": "HIP_ID",
        "name": "<NAME>",
        "type": "HIP"
      },
      "hiu": {
        "id": "MANISH_HIU"
      },
      "hiTypes": [
        "Prescription",
        "DiagnosticReport",
        "DischargeSummary",
        "ImmunizationRecord",
        "HealthDocumentRecord",
        "WellnessRecord",
        "OPConsultation"
      ],
      "patient": {
        "id": "abha@sbx"
      },
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "www.abdm.gov.in"
      },
      "createdAt": "2026-07-21T10:51:32.000Z",
      "requester": {
        "name": "<NAME>",
        "identifier": {
          "value": "MH1001",
          "type": "REGNO",
          "system": "https://www.mciindia.org"
        }
      },
      "permission": {
        "accessMode": "VIEW",
        "dateRange": {
          "from": "1995-09-13T17:18:44.408Z",
          "to": "2026-02-11T10:08:44.408Z"
        },
        "dataEraseAt": "2026-08-20T06:16:54.710Z",
        "frequency": {
          "unit": "DAY",
          "value": 0,
          "repeats": 0
        }
      },
      "lastUpdated": "2026-07-21T10:51:32.001Z",
      "careContexts": [
        {
          "patientReference": "manishk@abdm",
          "careContextReference": "manishk@abdm-02"
        }
      ],
      "schemaVersion": "v3",
      "consentManager": {
        "id": "sbx"
      }
    },
    "signature": "a6aukWvKlwH1myRXb/liHAwKCCFGcKbqGKrEQL+ZE4Ie8RssNAcyF6mwQAZ/DkpeSHrqV4SEMDcEeQB/RmK67R5lpC2t/s09Kpy2KkbHlZmb4EUgl/RBDa1o1V02YeivxSSsgNFbJa7EQuQujYoSVGAACsZP/04lhgOUibUq0rzo1wilO7O+BAeDpezUhs0216GFJnOebbR72tZQSUUPee5TPRJBpGdmjh8p8bmxRAIUSEp1ntLDi7TQOv0AqprcbM6uJbMZ8qBJJYizxri9W3NoEdPU/sdzWKjyth02TCzzE4mv5/DUpzzpUa2KyHZTrju7jhhmGL8ABcpriSuyhA=="
  },
  "error": null,
  "response": {
    "requestId": "e1ff8798-53c1-4d1c-8443-e38589c7ac98"
  },
  "resp": null
}'
```
