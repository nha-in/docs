# Send Share Acknowledgement (HIP → Gateway)

`POST /patient-share/v3/on-share`

HIP sends an acknowledgement back to the ABDM Gateway after receiving
and processing the patient's shared profile.
Typically includes a token/queue number assigned to the patient.
**Server:** `https://dev.abdm.gov.in/api/hiecm`

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/patient-share/v3/on-share \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS",
    "abhaAddress": "johnkumar@sbx",
    "profile": {
      "context": "123",
      "tokenNumber": "TKN-0042"
    }
  }
}'
```
