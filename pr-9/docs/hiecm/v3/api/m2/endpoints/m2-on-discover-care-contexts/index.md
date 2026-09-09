# On Discovery, HIP responds with found care contexts

`POST /hiecm/user-initiated-linking/v3/patient/care-context/on-discover`

**Async Callback:** After receiving a discovery request at the HIP bridge URL
(`{bridgeUrl}/v0.5/care-contexts/discover`), the HIP calls this Gateway endpoint
to return the list of care contexts found for the patient.

The HIP matches the patient using the demographics provided
(name, gender, DOB, verified identifiers) and returns matching records.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'Content-Type: application/json' \
  --data '{
  "transactionId": "txn-uuid-001",
  "patient": [
    {
      "referenceNumber": "PAT-REF-001",
      "display": "Ramesh Kumar",
      "careContexts": [
        {
          "referenceNumber": "VISIT-2024-001",
          "display": "OPD Visit 10-Jan-2024"
        },
        {
          "referenceNumber": "LAB-2024-001",
          "display": "Lab Report 10-Jan-2024"
        }
      ],
      "hiType": [
        "DiagnosticReport"
      ],
      "count": 2
    }
  ],
  "response": {
    "requestId": "req-uuid-from-discover"
  }
}'
```
