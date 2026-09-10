# 5. Register Details

`POST /api/registration/phr/register/details`

Completes mobile-based registration by submitting the person's profile details against the verified transaction, and creates the ABHA address.

```bash
curl --request POST \
  --url https://phrsbx.abdm.gov.in/api/registration/phr/register/details \
  --header 'Content-Type: application/json' \
  --data '{
  "txnId": "<TXN_ID>",
  "phrDetails": {
    "mobile": "<MOBILE>",
    "firstName": "<FIRST_NAME>",
    "middleName": "",
    "lastName": "<LAST_NAME>",
    "yearOfBirth": "1999",
    "dayOfBirth": "14",
    "monthOfBirth": "10",
    "gender": "M",
    "email": "<EMAIL>",
    "profilePhoto": "",
    "address": "<ADDRESS>",
    "stateName": "Tamil Nadu",
    "stateCode": "33",
    "districtName": "Thiruvallur",
    "districtCode": "601",
    "pinCode": "<PIN_CODE>",
    "abhaAddress": "<ABHA_ADDRESS>",
    "password": "<PASSWORD>"
  }
}'
```
