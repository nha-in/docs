# Get suggested ABHA addresses for a new account

`GET /v3/enrollment/enrol/suggestion`

Returns a handful of available ABHA addresses built from the person's
name and date of birth. Offer them as a choice. The person may type their
own instead, subject to the address policy: at least four characters,
letters, numbers and dots only, and it may not begin with a number or
begin or end with a dot.

```bash
curl --request GET \
  --url https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/suggestion \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>' \
  --header 'TRANSACTION_ID: <TRANSACTION_ID>'
```
