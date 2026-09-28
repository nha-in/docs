# 25 September 2026

31 changes

### Reprocess, cancel and shortfall has an API reference

Two callbacks, for payers and providers, each on its own page with a request you can send. [Open the Reprocess, cancel and shortfall reference](/docs/pr-61/docs/nhcx/v1/api/task/).

### PMJAY adjudicator is documented for payers

The PMJAY adjudicator calls now say what payers send and receive. [Open the PMJAY adjudicator reference](/docs/pr-61/docs/nhcx/v1/api/adjudicator/).

### M4 Registry Integration follows the specification of 24 September 2026

The M4 Registry Integration reference is built from the specification published on 24 September 2026. Headers or parameters changed on 85 calls, and required fields on five calls. [Open the M4 Registry Integration reference](/docs/pr-61/docs/hiecm/v3/api/m4/) and check the calls you make.

### PMJAY adjudicator: required fields corrected on two calls

`POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case` requires `action`, `casenumber`, `correlationid`, `memberid` and 4 more; `POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role` requires `caseid`, `payerid`. If you built against the earlier reference, check these calls. [Open the PMJAY adjudicator reference](/docs/pr-61/docs/nhcx/v1/api/adjudicator/).

### Other: three calls corrected

`POST /v1/error` no longer takes `x-hcx-api_call_id`, `x-hcx-correlation_id`, `x-hcx-recipient_code`, `x-hcx-sender_code` and 2 more, and can return `202` and no longer returns `200`; `POST /v1/notification/subscribe` no longer takes `x-hcx-correlation_id`, `x-hcx-recipient_code`, `x-hcx-sender_code`, `x-hcx-timestamp`; `POST /v1/on_status` no longer takes `x-hcx-api_call_id`, `x-hcx-correlation_id`, `x-hcx-recipient_code`, `x-hcx-sender_code` and 2 more, and can return `202` and no longer returns `200`. If you built against the earlier reference, check these calls. [Open the Other reference](/docs/pr-61/docs/nhcx/v1/api/other/).

### Participant registry: response codes corrected on two calls

`POST /participant/getProductIdName` can return `400`, `404`, `500`; `POST /product/getowner` can return `400`, `404`, `500`. If you built against the earlier reference, check these calls. [Open the Participant registry reference](/docs/pr-61/docs/nhcx/v1/api/registry/).

### Status and search: headers or parameters corrected on three calls

`POST /v1/search/on_submit` no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-recipient_code` and 4 more; `POST /v1/search/submit` no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-recipient_code` and 4 more; `POST /v1/status` no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-recipient_code` and 4 more. If you built against the earlier reference, check these calls. [Open the Status and search reference](/docs/pr-61/docs/nhcx/v1/api/status/).

### NHCX: 24 calls take Accept

Each of these calls requires `Accept`, across adjudicator, onboarding, registry: `POST /pmjay/hcx/nhcxpayerservice/wrapper/process/case`, `POST /pmjay/sbxhcx/nhcxpayerservice/v1/get/user-role`, `GET /update/validate` and 21 more. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### NHCX: four calls no longer take x-hcx-api\_call\_id, x-hcx-ben-abha-id and 8 more as headers

Each of these calls no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-debug_flag` and 6 more, across claim, eligibility, payment-notice, preauth: `POST /v1/claim/on_submit`, `POST /v1/coverageeligibility/on_check`, `POST /v1/paymentnotice/on_request` and 1 more. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### NHCX: eight calls require payload and type

Each of these calls requires `payload`, `type`, across claim, communication, eligibility, insurance-plan, other, payment-notice, preauth, status: `POST /v1/claim/on_submit`, `POST /v1/communication/on_request`, `POST /v1/coverageeligibility/on_check` and 5 more. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### NHCX: two calls no longer take x-hcx-api\_call\_id, x-hcx-ben-abha-id and 8 more as headers

Each of these calls no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-recipient_code` and 6 more, across claim, preauth: `POST /v1/claim/submit`, `POST /v1/preauth/submit`. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### NHCX: six calls no longer take x-hcx-api\_call\_id, x-hcx-ben-abha-id and 7 more as headers

Each of these calls no longer takes `x-hcx-api_call_id`, `x-hcx-ben-abha-id`, `x-hcx-correlation_id`, `x-hcx-recipient_code` and 5 more, across communication, eligibility, insurance-plan, payment-notice: `POST /v1/communication/on_request`, `POST /v1/communication/request`, `POST /v1/coverageeligibility/check` and 3 more. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### NHCX: four calls go to apisprod.nha.gov.in/pmjay/hcx/participanthcxservice

Each of these calls goes to `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`, not `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice`, across onboarding, registry: `GET /update/validate`, `GET /validate`, `POST /v2/participant/create` and 1 more. If you built against the earlier reference, check them. [Open the NHCX reference](/docs/pr-61/docs/nhcx/v1/api/).

### Participant registry: three calls changed address

`POST /V2/participant/delink/abha/policy` is now `POST /v2/participant/delink/abha/policy`, `POST /V2/participant/get/policies` is now `POST /v2/participant/get/policies`, `POST /V2/participant/link/abha/policy` is now `POST /v2/participant/link/abha/policy`. If your code sends the old address, change it. [Open the Participant registry reference](/docs/pr-61/docs/nhcx/v1/api/registry/).

### One call moved from Participant registry to PMJAY adjudicator

`POST /update/abhanumber`, now in PMJAY adjudicator rather than Participant registry. The calls are unchanged; their pages moved. [Open the PMJAY adjudicator reference](/docs/pr-61/docs/nhcx/v1/api/adjudicator/).

### Two callbacks moved from Other to Reprocess, cancel and shortfall

`POST /v1/task/on_submit`, `POST /v1/task/submit`, now in Reprocess, cancel and shortfall rather than Other. The calls are unchanged; their pages moved. [Open the Reprocess, cancel and shortfall reference](/docs/pr-61/docs/nhcx/v1/api/task/).

### M4 Registry Integration: 15 calls withdrawn

`POST /FacilityManagement/v1.5/facility/bygeoLocation/searchFacilityAndInfrastructureWithinRadiusWithFilter`, `POST /fetchProfessionalFacility`, `POST /getFacilityCreatedByHprId`, `POST /getFacilityDeclaredByHprId` and 11 more. If you call these, stop: the reference no longer carries them. [Open the M4 Registry Integration reference](/docs/pr-61/docs/hiecm/v3/api/m4/).

### Two Claim calls withdrawn

`POST /internal/v1/claim/on_submit`, `POST /internal/v1/claim/submit`. If you call these, stop: the reference no longer carries them. [Open the Claim reference](/docs/pr-61/docs/nhcx/v1/api/claim/).

### Two Communication calls withdrawn

`POST /internal/v1/communication/on_request`, `POST /internal/v1/communication/request`. If you call these, stop: the reference no longer carries them. [Open the Communication reference](/docs/pr-61/docs/nhcx/v1/api/communication/).

### Two Coverage eligibility calls withdrawn

`POST /internal/v1/coverageeligibility/check`, `POST /internal/v1/coverageeligibility/on_check`. If you call these, stop: the reference no longer carries them. [Open the Coverage eligibility reference](/docs/pr-61/docs/nhcx/v1/api/eligibility/).

### Two Insurance plan calls withdrawn

`POST /internal/v1/insuranceplan/on_request`, `POST /internal/v1/insuranceplan/request`. If you call these, stop: the reference no longer carries them. [Open the Insurance plan reference](/docs/pr-61/docs/nhcx/v1/api/insurance-plan/).

### Two Other calls withdrawn

`POST /internal/v1/task/on_submit`, `POST /internal/v1/task/submit`. If you call these, stop: the reference no longer carries them. [Open the Other reference](/docs/pr-61/docs/nhcx/v1/api/other/).

### Two Payment notice calls withdrawn

`POST /internal/v1/paymentnotice/on_request`, `POST /internal/v1/paymentnotice/request`. If you call these, stop: the reference no longer carries them. [Open the Payment notice reference](/docs/pr-61/docs/nhcx/v1/api/payment-notice/).

### Two Pre-authorisation calls withdrawn

`POST /internal/v1/preauth/on_submit`, `POST /internal/v1/preauth/submit`. If you call these, stop: the reference no longer carries them. [Open the Pre-authorisation reference](/docs/pr-61/docs/nhcx/v1/api/preauth/).

### Two Predetermination calls withdrawn

`POST /v1/predetermination/on_submit`, `POST /v1/predetermination/submit`. If you call these, stop: the reference no longer carries them. [Open the Predetermination reference](/docs/pr-61/docs/nhcx/v1/api/).

### One Participant registry call withdrawn

`POST /get/linked/registry/mst`. If you call it, stop: the reference no longer carries it. [Open the Participant registry reference](/docs/pr-61/docs/nhcx/v1/api/registry/).

### Two M4 Registry Integration calls added

`POST /FacilityManagement/v1.5/facility/bygeoLocation/searchWithinRadiusWithFilter`, `POST /v1.0/facility/search-facilities`. [Open the M4 Registry Integration reference](/docs/pr-61/docs/hiecm/v3/api/m4/).

### Postman collections for every HIE-CM module

Each module's reference page offers its collection and the sandbox environment they share, with the session token fetched for you. [Open the API reference](/docs/pr-61/docs/hiecm/v3/api/).

### The nhcx-full skill is published

Install it with your agent, alongside the others. [Build with AI](/docs/pr-61/docs/hiecm/v3/getting-started/build-with-ai).

### The nhcx plugin is 1.0.0

Reinstall to move from 0.1.0. [Build with AI](/docs/pr-61/docs/hiecm/v3/getting-started/build-with-ai).

### Two skills withdrawn: hiecm-subscription-build, nhcx-insurance

They are no longer published; remove them from your agent. [Build with AI](/docs/pr-61/docs/hiecm/v3/getting-started/build-with-ai).
