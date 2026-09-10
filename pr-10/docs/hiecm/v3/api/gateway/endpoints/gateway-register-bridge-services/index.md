# Register / Update Bridge Services (HIU)

`POST /v4/int/v1/bridges/MutipleHRPAddUpdateServices`

Registers or updates one or more HIU service entries under a facility
in the HSP Registry. Set `type` to `"HIU"` for Health Information User registration.
**Base URL:** `https://apihspsbx.abdm.gov.in`

```bash
curl --request POST \
  --url https://dev.abdm.gov.in/v4/int/v1/bridges/MutipleHRPAddUpdateServices \
  --header 'Content-Type: application/json' \
  --data '{
  "facilityId": "IN07100XXXXX",
  "facilityName": "City Health HIU",
  "HRP": [
    {
      "bridgeId": "BRIDGE_HIU_001",
      "hipName": "City Health HIU",
      "type": "HIU",
      "active": true
    }
  ]
}'
```
