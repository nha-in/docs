# Link Care Context Notify

`POST /hiecm/hip/v3/link/context/notify`

Sends an explicit notification to the ABDM Gateway about a newly linked care context.
This is called after successful care context linking to ensure the patient's ABHA App
receives a timely notification with the care context details.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/context/notify \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'Content-Type: application/json' \
  --data '{
  "notification": {
    "patient": {
      "id": "patient@sbx"
    },
    "careContext": {
      "patientReference": "patient@sbx",
      "careContextReference": "VISIT-2024-001"
    },
    "hiTypes": [
      "Prescription"
    ],
    "date": "2024-01-10T12:00:00.000Z",
    "hip": {
      "id": "HIP_SERVICE_ID",
      "name": "S Y Hospital",
      "type": "HIP"
    }
  }
}'
```
