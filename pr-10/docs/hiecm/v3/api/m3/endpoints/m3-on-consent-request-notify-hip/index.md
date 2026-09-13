# The patient's decision, sent to the record holder

`POST /api/v3/consent/request/hip/notify`

The same decision sent to the system that holds the records, with all care context references.

`status` only ever carries `GRANTED`, `REVOKED` or `EXPIRED` on this callback.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/api/v3/consent/request/hip/notify \
  --header 'Content-Type: application/json' \
  --data '{
  "status": "GRANTED",
  "consentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "consentDetail": {
    "schemaVersion": "v3",
    "consentId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "createdAt": "2024-05-01T05:10:20.123Z",
    "patient": {
      "id": "abdulkalam@abdm"
    },
    "careContexts": [
      {
        "patientReference": "batman@tmh",
        "careContextReference": "Episode1"
      }
    ],
    "purpose": {
      "text": "Care Management",
      "code": "CAREMGT",
      "refUri": "www.abc.com"
    },
    "hip": {
      "id": "cowin_hip_01",
      "name": "Cowin",
      "type": "HIP"
    },
    "hiu": {
      "id": "cowin_hiu_01",
      "name": "Cowin",
      "type": "HIU"
    },
    "consentManager": {
      "id": "abdm"
    },
    "requester": {
      "name": "abdulkalam@abdm",
      "identifier": {
        "value": "REG1",
        "type": "MH1001",
        "system": "https://www.sample.com"
      }
    },
    "hiTypes": [
      "Prescription"
    ],
    "permission": {
      "accessMode": "VIEW",
      "dateRange": {
        "from": "2021-09-28T12:30:08.573Z",
        "to": "2021-09-28T12:30:08.573Z"
      },
      "dataEraseAt": "2021-09-28T12:30:08.573Z",
      "frequency": {
        "unit": "HOUR",
        "value": 1,
        "repeats": 0
      }
    }
  },
  "signature": "scrubbed-base64-signature",
  "grantAcknowledgement": false
}'
```
