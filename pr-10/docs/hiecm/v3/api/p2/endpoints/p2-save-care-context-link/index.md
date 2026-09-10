# Save Care Context Link

`POST /api/care-context-link/save`

Records a care context link for a person, with the HIP it came from and whether its data has been transferred.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/save \
  --header 'Content-Type: application/json' \
  --data '{
  "hipId": "IN0002222",
  "patientId": "<PATIENT_ID>",
  "careContext": {
    "patientReference": "NITHISH_1999",
    "careContextReference": "Prescription566",
    "hiTypes": [
      "Prescription",
      "WellnessRecord",
      "Invoice",
      "OPConsultation",
      "HealthDocumentRecord"
    ]
  },
  "dataTransferred": true
}'
```
