# Link care contexts to an ABHA address

`POST /hiecm/hip/v3/link/carecontext`

Also known as: HIP Initiated Care Context Linking (Single or Multiple).
Links one or more care contexts (health records) to a patient's ABHA address.
Use the same endpoint for both single and multiple care context linking, the `careContexts` array can contain one or many entries.

Requires the `X-Link-Token` header with a freshly generated link token.

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext \
  --header 'REQUEST-ID: 5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11' \
  --header 'TIMESTAMP: 2022-10-06T15:10:00.587Z' \
  --header 'X-CM-ID: <X_CM_ID>' \
  --header 'X-HIP-ID: IN2810014366' \
  --header 'X-Link-Token: <X_LINK_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
  "abhaNumber": "91234567890123",
  "abhaAddress": "patient@sbx",
  "patient": [
    {
      "referenceNumber": "PAT-REF-001",
      "display": "Ramesh Kumar",
      "careContexts": [
        {
          "referenceNumber": "VISIT-2024-001",
          "display": "OPD Visit 10-Jan-2024"
        }
      ],
      "hiType": [
        "Prescription"
      ],
      "count": 1
    }
  ]
}'
```
