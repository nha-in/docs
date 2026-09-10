# Post Patient Consent Request

`POST /api/care-context-link/patient/consent-request`

Raises a consent request from the person's own PHR for records at the HIPs given, so they can be fetched into the app.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/consent-request \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaAddress": "<ABHA_ADDRESS>",
  "hipIds": [
    "HIP001",
    "HIP002"
  ],
  "consentArtefactIds": [
    "consent-001",
    "consent-002"
  ]
}'
```
