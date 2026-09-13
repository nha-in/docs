# Initiate a consent request

`POST /hiecm/consent/v3/request/init`

Also known as: Consent Init Request.
Initiates a new consent request for a patient's health records.

The Gateway notifies the patient via the ABHA App. The patient can approve or deny.
The HIU receives the patient's decision via a callback to `{hiuBridgeUrl}/v0.5/consents/hiu/notify`.

**Key fields:**
- `purpose.code`, ABDM-defined purpose codes (e.g. `CAREMGT`, `BTG`, `PUBHLTH`, `HPAYMT`, `DSRCH`, `PATRQST`)
- `hiTypes`, Health Information types requested
- `permission.accessMode`, `VIEW` (read-only) or `STORE`
- `permission.dataEraseAt`, Consent expiry after which data access is revoked

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/consent/v3/request/init \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2026-08-25T15:51:15.339Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "consent": {
    "purpose": {
      "text": "Care Management",
      "code": "CAREMGT",
      "refUri": "http://terminology.hl7.org/CodeSystem/v3-ActReason"
    },
    "patient": {
      "id": "patient@sbx"
    },
    "hiu": {
      "id": "HIU_SERVICE_ID",
      "name": "City Health HIU"
    },
    "hip": null,
    "careContexts": null,
    "requester": {
      "name": "Dr. Sharma",
      "identifier": {
        "type": "REGNO",
        "value": "MCI-12345",
        "system": "https://www.mciindia.org"
      }
    },
    "hiTypes": [
      "Prescription",
      "DiagnosticReport"
    ],
    "permission": {
      "accessMode": "VIEW",
      "dateRange": {
        "from": "2023-01-01T00:00:00.000Z",
        "to": "2024-01-01T00:00:00.000Z"
      },
      "dataEraseAt": "2025-01-01T00:00:00.000Z",
      "frequency": {
        "unit": "HOUR",
        "value": 1,
        "repeats": 0
      }
    }
  }
}'
```
