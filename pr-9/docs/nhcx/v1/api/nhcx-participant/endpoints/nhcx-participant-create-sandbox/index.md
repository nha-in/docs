# Create a participant record (sandbox)

`POST /participant/create`

Creates your identity on the sandbox exchange in one call, with no passcode step. The response carries the participant code that becomes `x-hcx-sender_code` on everything you send from then on. A hospital group creates one participant per facility, each with its own HFR ID, using the same credentials.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create \
  --header 'Accept: <ACCEPT>' \
  --header 'source: <SOURCE>' \
  --header 'Content-Type: application/json' \
  --data '{
  "linked_registry_codes": [
    "10001"
  ],
  "registryid": "<your ABDM client id>",
  "participant_name": "Test Hospital",
  "scheme_code": "PMJAY",
  "state": "Haryana",
  "district": "Panchkula",
  "roles": [
    "10001"
  ],
  "primaryEmail": "integration@hospital.example",
  "phone": [
    "01123456789"
  ],
  "primaryMobile": "9876543210",
  "signing_cert_path": "",
  "encryption_cert": "<contents of certificate.b64>",
  "endpoint_url": "https://nhcx.hospital.example"
}'
```
