# 3 October 2026

4 changes

### M4 Registry Integration: required fields corrected on six calls

`POST /FacilityManagement/v1.5/facility/bygeoLocation/searchWithinRadiusWithFilter` requires `centerLat`, `centerLon`, `from`, `radiusInKm` and 1 more; `POST /FacilityManagement/v1.5/facility/search` requires `page`, `resultsPerPage`; `POST /search/address/filter/deduplicate` requires `district`, `name`, `subDistrict`; and 3 more. If you built against the earlier reference, check these calls. [Open the M4 Registry Integration reference](/docs/pr-114/docs/hiecm/v3/api/m4/).

### The abdm-integrators-assistant plugin is 0.10.3

Reinstall to move from 0.10.1. [Build with AI](/docs/pr-114/docs/hiecm/v3/getting-started/build-with-ai).

### The nhcx plugin is 1.0.4

Reinstall to move from 1.0.3. [Build with AI](/docs/pr-114/docs/hiecm/v3/getting-started/build-with-ai).

### The uhi-integrators-assistant plugin is 0.1.2

Reinstall to move from 0.1.1. [Build with AI](/docs/pr-114/docs/hiecm/v3/getting-started/build-with-ai).
