# List participants by role

`POST /fetch/participants/list`

How a hospital system builds its list of payers, and how a payer finds hospitals. The list is not searchable by name on the server side: fetch it, filter by name in your own code, and cache it for the day, because it changes rarely.

```bash
curl --request POST \
  --url https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list \
  --header 'Accept: <ACCEPT>' \
  --header 'X-CM-ID: sbx' \
  --header 'Content-Type: application/json' \
  --data '{
  "role": "PAYER",
  "fromdate": "01/04/2021",
  "todate": "31/03/2027",
  "entitytype": "<ENTITYTYPE>"
}'
```
