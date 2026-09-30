# Get professional info

`POST /apis/v1/doctors/fetch-professional-info`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/apis/v1/doctors/fetch-professional-info \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "practitioner": {
    "id": "<HPR_ID>",
    "name": "",
    "contactNumber": "976243XXXX",
    "state": "UTTAR PRADESH",
    "registrationNumber": ""
  }
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `practitioner` (object)
- `practitioner.id` (string)
- `practitioner.name` (string)
- `practitioner.contactNumber` (string)
- `practitioner.state` (string)
- `practitioner.registrationNumber` (string)
- `practitioner.stateCouncilName` (string)

## Responses

- `200`: OK
  - `message` (string)
  - `practitioners` (object)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "message": "<MESSAGE>"
}
```
