# Configure certificate and callback (production, step 3 of 4)

`POST /v2/participant/update`

Sends the encryption certificate and the callback address. A second transaction ID and passcode arrive on the registered mobile.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/update \
  --header 'Accept: <ACCEPT>' \
  --header 'Content-Type: application/json' \
  --data '{
  "participantcode": "12345678934@hcx",
  "encryptioncert": "<ENCRYPTIONCERT>",
  "endpointurl": "<ENDPOINTURL>"
}'
```
