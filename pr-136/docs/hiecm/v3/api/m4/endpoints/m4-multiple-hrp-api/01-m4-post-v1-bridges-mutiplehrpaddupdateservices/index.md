# Submit the facility add and update

`POST /v1/bridges/MutipleHRPAddUpdateServices`

```bash
curl --request POST \
  --url https://apihspsbx.abdm.gov.in/v4/int/v1/bridges/MutipleHRPAddUpdateServices \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>' \
  --header 'Content-Type: application/json' \
  --data '{
  "facilityId": "IN0610090166",
  "facilityName": "Singla Eye Center",
  "HRP": [
    {
      "bridgeId": "SBX_00XXXX",
      "hipName": "Singla Eye Center",
      "type": "HIP",
      "active": true
    }
  ]
}'
```

## Authorization

- `Authorization` (bearer token, required): M4 declares bearer authentication. The published M4 specifications name no call that issues the token.

## Headers

- `Authorization` (string)

## Body

- `facilityId` (string, required): Id of the facility. Should start with 'IN' and have the length of 12 characters.
- `facilityName` (string, required): Name of the facility. Accepted characters: Alphanumeric, -_.(),/. The first character must be an alphabet or digit, and only one space is allowed between words.
- `HRP` (object[])
- `HRP.bridgeId` (string, required): Valid Bridge Id to be linked. Alphanumeric.
- `HRP.hipName` (string, required): Name of the hospital which will reflect on ABHA/PHR app when the patient will search for the respective hospital. HIP name can be the Hospital name added with suffix of bridge name. Example: Hospital name=XYZ and bridge name=BRIDGE TEST, so the HIP name = XYZ BRIDGE. HIP name can not be mor than 15 characters. No Special character is allowed (%$*#@(~&!) Should be unique for every bridge for a facility.
- `HRP.type` (string, required): Type of the bridge to be linked. Accepted values: HIP or HIU.
- `HRP.active` (boolean, required): Active Status of the bridge to be linked. Accepted values: true or false.

## Responses

- `200`: OK
- `404`: Not Found
