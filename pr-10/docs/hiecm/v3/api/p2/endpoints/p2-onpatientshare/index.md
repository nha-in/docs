# onpatientshare

`POST /api/hiecm/patient-share/v3/on-share`

Callback the gateway sends after a profile share at a facility, acknowledging the share request.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/hiecm/patient-share/v3/on-share \
  --header 'Content-Type: application/json' \
  --data '{
  "acknowledgement": {
    "status": "SUCCESS",
    "abhaAddress": "<ABHA_ADDRESS>",
    "profile": {
      "context": "5",
      "tokenNumber": "<TOKENNUMBER>",
      "expiry": "1800"
    }
  },
  "response": {
    "requestId": "<TXN_ID>"
  }
}'
```
