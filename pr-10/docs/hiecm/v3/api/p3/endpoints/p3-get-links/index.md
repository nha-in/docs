# Get Links

`POST /api/consent-management/link/get-links`

Lists the person's linked care contexts at the HIPs given, for choosing what to grant in a consent.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/link/get-links \
  --header 'Content-Type: application/json' \
  --data '{
  "patientId": "<PATIENT_ID>",
  "hipIds": [
    "<hip-id-1>",
    "<hip-id-2>"
  ]
}'
```
