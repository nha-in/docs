# Consent Auto Approve

`POST /api/consent-management/consents/auto-approve`

Creates an auto-approval policy: consent requests from the HIU named are approved without asking, for the sources included and not the ones excluded.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/consent-management/consents/auto-approve \
  --header 'Content-Type: application/json' \
  --data '{
  "isApplicableForAllHIPs": true,
  "hiu": {
    "id": "IN0002222",
    "name": "<NAME>"
  },
  "includedSources": [
    {
      "hiTypes": [
        "OPCONSULTATION"
      ],
      "purpose": {
        "text": "Care Management",
        "code": "CAREMGT",
        "refUri": "string"
      },
      "hip": null,
      "period": {
        "from": "2025-09-30T16:51:40.617Z",
        "to": "2026-07-09T16:51:40.617Z"
      }
    }
  ],
  "excludedSources": null
}'
```
