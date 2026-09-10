# Create a participant record (production, step 1 of 4)

`POST /v2/participant/create`

Production onboarding is four calls. This is the first. It returns a participant ID and a transaction ID, and sends a passcode to the registered mobile number. The participant exists but is pending until the passcode is confirmed. Passcodes and transaction IDs last 24 hours; lose one and you repeat the step.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/create \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "registrytype": "10001",
  "registryid": "<HFR ID>",
  "role": [
    "10001"
  ],
  "endpoint_url": "",
  "mobilenumber": "<mobile on the HFR record>",
  "email": "integration@hospital.example"
}'
```
