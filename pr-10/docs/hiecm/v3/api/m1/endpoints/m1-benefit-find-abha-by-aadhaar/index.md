# Find an ABHA number from an Aadhaar number

`GET /v3/profile/benefit/search/abhaByAadhaar`

A benefit scheme lookup, not a general search. The Aadhaar value is
encrypted.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/profile/benefit/search/abhaByAadhaar \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'BENEFIT_NAME: healthid api' \
  --header 'aadhaarNumber: <RSA_ENCRYPTED_AADHAAR_NUMBER>'
```
