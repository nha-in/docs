# Create an ABHA from an identity document

`POST /v3/enrollment/enrol/byDocument`

The route for somebody who cannot complete Aadhaar authentication. A
driving licence is one accepted document. The account created this way is
restricted until it is upgraded through Aadhaar KYC, so tell the person
that rather than letting them discover it later.

```bash
curl --request POST \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byDocument \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "documentType": "DRIVING_LICENCE",
  "documentId": "DL0820****858",
  "firstName": "<FIRST_NAME>",
  "middleName": "<MIDDLE_NAME>",
  "lastName": "<LAST_NAME>",
  "dob": "<DATE_OF_BIRTH>",
  "gender": "M",
  "frontSidePhoto": "<ENCRYPTED_VALUE>",
  "backSidePhoto": "<ENCRYPTED_VALUE>",
  "address": "<ADDRESS>",
  "state": "<STATE>",
  "district": "<DISTRICT>",
  "pinCode": "<PIN_CODE>",
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
}'
```
