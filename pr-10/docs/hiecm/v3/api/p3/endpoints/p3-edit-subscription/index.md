# Edit Subscription

`PUT /api/consent-management/patients/subscription-requests/{subscriptionId}`

Edits a subscription and approves it in the same step, changing which HIPs and categories the HIU is subscribed to.

```bash
curl --request PUT \
  --url https://phrsbx.abdm.gov.in/api/consent-management/patients/subscription-requests/{subscriptionId} \
  --header 'Content-Type: application/json' \
  --data '{
  "hiuId": "<HIU_ID>",
  "subscriptionEditAndApprovalRequest": {
    "isApplicableForAllHIPs": true,
    "includedSources": [
      {
        "hiTypes": [
          "DiagnosticReport",
          "Prescription",
          "ImmunizationRecord",
          "DischargeSummary",
          "OPConsultation",
          "HealthDocumentRecord",
          "WellnessRecord"
        ],
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "www.abdm.gov.in"
        },
        "categories": [
          "DATA",
          "LINK"
        ],
        "period": {
          "from": "2024-01-09T09:00:00.000Z",
          "to": "2123-12-31T09:00:00.000Z"
        }
      }
    ],
    "excludedSources": []
  }
}'
```
