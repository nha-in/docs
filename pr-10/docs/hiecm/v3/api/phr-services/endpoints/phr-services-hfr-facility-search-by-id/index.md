# Get HFR Facility Details By Search ID

`GET /v4/hfr/facility/search/searchFacility/IN2710002401`

Looks up a facility by search ID in the Health Facility Registry
(HFR), NHA's national registry of health facilities. This is a
different registry from the nearby-health-service facility search
elsewhere in this file: it is a separate NHA system with its own
host and its own record shape, not an alternate route to the same
data.

```bash
curl --request GET \
  --url https://phrsbx.abdm.gov.in/v4/hfr/facility/search/searchFacility/IN2710002401
```
