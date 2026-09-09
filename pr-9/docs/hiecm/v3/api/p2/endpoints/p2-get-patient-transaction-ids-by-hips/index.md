# Get Patient Transaction IDs by HIPs

`POST /api/care-context-link/patient/transaction-ids`

Returns the transfer transaction ids for a person's records at the HIPs given, under the consent artefacts given.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/care-context-link/patient/transaction-ids \
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
