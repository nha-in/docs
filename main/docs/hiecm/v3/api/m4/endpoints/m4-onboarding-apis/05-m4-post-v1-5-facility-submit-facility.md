# Submit the v15Submit facility details

`POST /v1.5/facility/submit-facility`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1.5/facility/submit-facility \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'x-hprid-auth: <X_HPRID_AUTH>' \
  --header 'x-hprid-auth-verifier: <X_HPRID_AUTH_VERIFIER>' \
  --header 'Content-Type: application/json' \
  --data '{
  "trackingId": "80266",
  "sourceOfInformation": "HRP_SUB_1",
  "sourceUniqueID": "1234",
  "facilitySuperUser": "STATE_SUPER_1"
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)
- `x-hprid-auth` (string, required): The HPR token of the signed-in professional, from the HPR login.
- `x-hprid-auth-verifier` (string): The HPR token of the professional verifying the facility submission.

## Body

- `trackingId` (string, required): Unique identification number for your facility. Tracking id generated from basic information API.
- `sourceOfInformation` (string): Source of information of this facility. Should be valid data source provide by HFR team. If you leave this field empty, then your facility will be considered as Submitted entity.
- `sourceUniqueID` (string): Facility Unique Id as exists in HRP or data source.
- `facilitySuperUser` (string)

## Responses

- `200`: OK
  - `facilityId` (string)
  - `status` (string)
  - `message` (string)
- `404`: Not Found

Shape of the 200 response, generated from the schema. The values are placeholders, not a captured response:

```json
{
  "facilityId": "<FACILITY_ID>",
  "status": "<STATUS>",
  "message": "<MESSAGE>"
}
```
