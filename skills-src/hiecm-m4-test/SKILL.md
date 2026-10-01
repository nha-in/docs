---
name: hiecm-m4-test
description: "Use when walking the ABDM M4 functional test cases (Health Facility Registry and Healthcare Professionals Registry) against an integrator's own system and the sandbox: runs each case as a loop, records evidence the registry can vouch for, and writes the manifest that stands in for a screenshot report."
---
# HIE-CM m4 test

Walks the ABDM M4 functional test cases, facility and professional registration, against the system you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every M4 test case against your system and the sandbox, one case at a time
- Covers facility search, registration, update and bridge linkage in the Health Facility Registry (HFR), then profile creation in the Healthcare Professionals Registry (HPR)
- Records, for each case, the response and the identifier that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to the identifiers the registry returned, which a reviewer checks against the registry rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the registry directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |
| A facility manager who holds an HP-ID, signed in | Their HPR token goes in `x-hprid-auth` on the facility calls |
| A professional with an Aadhaar linked mobile, for the HPR cases | Present at the desk for the run. Aadhaar authentication and every OTP are human steps, and the skill stops for them |
| Your `bridgeId`, and a facility id for the bridge cases | The bridge from your sandbox registration. The facility id from a submitted facility, or from a search |
| Which registries your system integrates | HFR, HPR or both. Cases for a registry you do not integrate are recorded `not-run` with that reason |

## Say one of these

- "Walk the M4 test cases against my sandbox and log each one."
- "Run only the HFR Bridge linkage cases."
- "Re-run HFR-121, the HIP name was refused on the second bridge."
- "Write a terminal script that runs the HPR cases and asks me for each OTP."

## What happens first

One question: which cases. All of them, one group, or a list of ids. Then the preconditions for the first case are checked before anything is sent. Nothing else is asked until a case needs a human.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last identifier, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with its identifiers, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim | The response was not pasted. A pass with no output is a fail |
| `failed` | Three passes and the exit condition was not observed, or your form let through a value the case says it must refuse | A human step was missing, or a review has not finished. That is `needs-human` |
| `needs-human` | The case reached Aadhaar authentication, an OTP, a person who was not there, or a facility waiting on NHA or state review | Ever as a substitute for a fail you can see |
| `not-run` | The case does not apply to your system, or ABDM publishes no operation or field for it | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one or more of these. They decide what the manifest carries.

- **sandbox.** A call the registry sees. Evidence is the HTTP status, the body and the identifier the registry returned: `txnId`, `trackingId`, `facilityId` or `hprId`. The exit condition is a literal in the body. A reviewer can check the identifier against the registry's own record, which is why this outranks the other two.
- **screen.** A rule about what your form shows, refuses or sends, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. Where a row says "the logged request carries" a path, paste that line of your request log too. A screen case is attested, not observed, and the manifest marks it so.
- **human.** A step only a person can do. Evidence is the last observation before it and the outcome `needs-human` when nobody was there.

Most HFR rows test one form field. They are `screen` for the rule your form enforces and `sandbox` for the call that saves the field. Both halves are needed for a pass.

### Rules that hold for every case

- Search before create. A facility goes to the facility search first, and an Aadhaar authenticated professional goes to `m4_post_v1_registration_aadhaar_checkhpidaccountexist` first. Creating on a match gives the registry two records, which nothing merges.
- Codes, not names. Every dropdown is filled from its master data call and sends the code. A list typed into your source goes stale without a sign.
- Three tokens. The gateway access token from `POST /api/hiecm/gateway/v3/sessions` goes in `Authorization` as a Bearer token. The facility manager's HPR token goes in `x-hprid-auth` on basic information and submit, and a verifier's in `x-hprid-auth-verifier` on submit. The `token` from HP-ID creation goes in the register body as `hprToken`, and in the upload body as `hpr_token`.
- A fresh `REQUEST-ID` on every gateway call, logged before sending: the session call and `gateway_get_gateway_v3_bridge_services`. The M4 registry operations declare no `REQUEST-ID`, so log a local id and the time for each one, and keep the identifier the response returned.
- Paste the response. A step with no pasted output is not done.
- Sensitive values travel encrypted. The mobile and the password are encrypted under the certificate from `m4_get_v1_auth_cert`, fetched each run, never with the M1 key. The Aadhaar number and the Aadhaar OTP never pass through your system: the person enters them on the page at the `url` that `m4_post_aadhaar_generatelink` returns.
- Read the body, not only the status. A 200 can carry `errorStatus` on a facility call, or `error` on a professional call. Paste it, and a field it names was not saved.
- The specification publishes only 200 and 404 for these operations, and no error code. No case in this set passes on a 4xx. A refusal a case asks for happens on your screen, before anything is sent.
- One question when you escalate. The person is being interrupted.

### Paths and names

The set names some paths differently from the specification. This skill uses the specification's paths, on its one sandbox host, `https://apihspsbx.abdm.gov.in/v4/int`. The set's `/api/v1/registration/aadhaar/...` paths are the specification's `/v2/registration/aadhaar/...` paths, and its `/apis/v1/doctors/update-professional` is `/apis/v1/doctors/update-professional-new`. The set's `/api/v1/registration/aadhaar/generateOtp` has no operation in the specification: Aadhaar authentication runs through `m4_post_aadhaar_generatelink` and the hosted page instead.

The HFR rows of the set name Swagger operations. This table maps each to the operation used below.

| The set's name | Operation | Path |
|---|---|---|
| `v15SearchFacilitiesFuzzyPostUsingPOST` | `m4_post_facilitymanagement_v1_5_facility_search` | `POST /FacilityManagement/v1.5/facility/search` |
| `v15FacilityGetMasterTypesUsingGET` | `m4_get_v1_5_facility_get_master_types` | `GET /v1.5/facility/get-master-types` |
| `v15FacilityGetMasterDataUsingGET` | `m4_get_v1_5_facility_get_master_data` | `GET /v1.5/facility/get-master-data` |
| `v15FacilityGetOwnershipSubtypeUsingPOST` | `m4_post_v1_5_facility_get_owner_subtype` | `POST /v1.5/facility/get-owner-subtype` |
| `v15FacilityGetLGDStatesUsingGET` | `m4_get_v1_5_facility_lgd_states` | `GET /v1.5/facility/lgd/states` |
| `v15FacilityGetLGDDistrictsUsingGET` | `m4_get_v1_5_facility_lgd_districts` | `GET /v1.5/facility/lgd/districts` |
| `v15FacilityGetLGDSubDistrictsUsingGET` | `m4_get_v1_5_facility_lgd_subdistricts` | `GET /v1.5/facility/lgd/subdistricts` |
| `v15FetchFacilityTypesUsingPOST` | `m4_post_v1_5_facility_fetch_facility_type` | `POST /v1.5/facility/fetch-facility-type` |
| `v15FetchFacilitySubTypesUsingPOST` | `m4_post_v1_5_facility_fetch_facility_sub_type` | `POST /v1.5/facility/fetch-facility-Sub-type` |
| `v15FacilityGetSpecialitiesUsingPOST` | `m4_post_v1_5_facility_get_specialities` | `POST /v1.5/facility/get-specialities` |
| `v15FacilityBasicInformationUsingPOST` | `m4_post_v1_5_facility_basic_information` | `POST /v1.5/facility/basic-information` |
| `v15FacilityAdditionalInformationUsingPOST` | `m4_post_v1_5_facility_additional_information` | `POST /v1.5/facility/additional-information` |
| `v15FacilityDetailedInformationUsingPOST` | `m4_post_v1_5_facility_detailed_information` | `POST /v1.5/facility/detailed-information` |
| `v15SubmitFacilityDetailsUsingPOST` | `m4_post_v1_5_facility_submit_facility` | `POST /v1.5/facility/submit-facility` |
| `v1MutipleHRPAddUpdateServicesUsingPOST` | `m4_post_v1_bridges_mutiplehrpaddupdateservices` | `POST /v1/bridges/MutipleHRPAddUpdateServices` |

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: HFR-010   pass: 1 of 3   at: 2026-10-01T10:14:02Z
screen: "1City", "City@Care", "Clin" refused with an alert, call log empty   evidence: hfr-010.png
observed: POST /v1.5/facility/basic-information  local id 6f1c...  HTTP 200
body: {"trackingId":"80266","status":"...","message":"...","errorStatus":[]}
matched: exit condition for HFR-010
next: HFR-011
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case id from this skill, such as `HFR-010` or `HPR-011`. Never invent a numbering such as `TC01`. Mark the two bridge linkage runs as occurrence 1 and 2 | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal. For Aadhaar authentication, print the `url` and wait for Enter once the person has finished there. For a mobile OTP, read it from stdin, encrypt it, send it | Every HPR success path passes through Aadhaar authentication and often an OTP. A runner that never asks never reaches one |
| Never ask for the Aadhaar number in the terminal. Never write a typed value to disk, a log or the manifest, and never hard code one | The Aadhaar number belongs on the hosted page. An OTP or a password belongs to the person, not the run |
| Run each `sandbox` row's success call and the refusal its exit condition names as separate checks | The case passes only when both are observed |
| Compare the status and the body literal the exit condition names, such as `200` with `trackingId` present, or `200` with `verified` `false` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal. No case in this set names one | A `404` on any step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| A submit that leaves the facility waiting on review records `needs-human` with the `trackingId` | Review is a person's step, not your system's failure |
| At the end, print one line per case id with its outcome and identifiers, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this. The person's values are typed at the prompts and never echoed back.

```text
preflight  m4_get_v1_auth_cert  HTTP 200  certificate read
HFR-001  m4_post_facilitymanagement_v1_5_facility_search  HTTP 200  facilities[0].facilityId IN0610090166  matched
HFR-010  screen: "1City" refused, nothing sent.  passed? y/n: y  evidence file: hfr-010.png
HFR-010  m4_post_v1_5_facility_basic_information  HTTP 200  trackingId 80266  matched
HFR-010  passed
HPR-002  m4_post_aadhaar_generatelink  HTTP 200  txnId present  url present  matched
  Open the url and finish Aadhaar authentication there, then press Enter, or leave blank if nobody is here:
HPR-007  m4_post_aadhaar_isauthenticated  HTTP 200  body true  matched
HPR-011  m4_post_v2_registration_aadhaar_demographicauthviamobile  HTTP 200  verified false  matched
HPR-011  m4_post_v1_registration_aadhaar_generatemobileotp  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 1234, or leave blank if nobody is here:
HPR-011  needs-human
```

Nudge: a certificate fetch, a session call, or a call with a made up `trackingId` tests your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The ids, the mandatory marks and the wording of each check are ABDM's, from NHA's M4 HFR sheet of 16 March 2024 and its HPR test cases final. The groups follow the set. Where the set names an operation, the operation id here is the one in `references/integrate.md`, which carries the host, the headers and a full request.

### HFR Search facility

Applies to all users. Mandatory unless marked.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. `m4_get_v1_5_facility_get_master_types` returns 200 with `masterTypes` present; read the type names there rather than typing them.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-001 | `screen`, `sandbox` | Optional. Search by facility id, `facilityId`. 12 characters, letters and digits, starting with `IN`. | Screen: `XY0610090166` and `IN06100901` refused, nothing sent. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `facilityId` set returns 200 with `facilities[0].facilityId` equal to it. |
| HFR-002 | `screen`, `sandbox` | Mandatory when no facility id is given. Search by name, `facilityName`. Letters and digits, full or part of the name. | Screen: a partial name is accepted. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` returns 200 with `facilities` an array and `totalFacilities` present. |
| HFR-003 | `screen`, `sandbox` | Mandatory when no facility id is given. Ownership, `ownershipCode`. A dropdown, one value, codes from master data type `OWNER`. | Screen: only one value can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `OWNER` returns 200 with `data[0].code` present. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `ownershipCode` set returns 200 with `facilities` present. |
| HFR-004 | `screen`, `sandbox` | Mandatory when no facility id is given. State, `stateLGDCode`. A searchable dropdown showing "Select State / UT" until chosen. | Screen: the dropdown lists the returned names and searches them. Sandbox: `m4_get_v1_5_facility_lgd_states` returns 200 with `[0].code` and `[0].name` present. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `stateLGDCode` set returns 200. |
| HFR-005 | `screen`, `sandbox` | Optional. District, `districtLGDCode`. A searchable dropdown for the chosen state, showing "Select District" until chosen. | Sandbox: `m4_get_v1_5_facility_lgd_districts` with `stateCode` set returns 200 with `[0].code` present. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `districtLGDCode` set returns 200. |
| HFR-006 | `screen`, `sandbox` | Optional. Sub-district, `subDistrictLGDCode`. A searchable dropdown for the chosen district, showing "Select Sub-District" until chosen. | Sandbox: `m4_get_v1_5_facility_lgd_subdistricts` with `districtCode` set returns 200 with `[0].code` present. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `subDistrictLGDCode` set returns 200. |
| HFR-007 | `screen`, `sandbox` | Optional. Pincode, `pincode`. Digits only, at most 6. | Screen: `4110011` refused, nothing sent. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `pincode` set returns 200. |
| HFR-008 | `screen`, `sandbox` | Mandatory. Page, `page`. Defaults to 1, integers only, never typed by the user. | Screen: no page field the user can type into. The logged request carries `page` `1`. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` returns 200 with `numberOfPages` present. |
| HFR-009 | `screen`, `sandbox` | Mandatory. Results per page, `resultsPerPage`. Defaults to 10, never typed by the user. | Screen: the logged request carries `resultsPerPage` `10`. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` returns 200 with at most 10 entries in `facilities`. |

### HFR Registration: basic information

Applies to the facility manager. Every row saves through `m4_post_v1_5_facility_basic_information`. The first save sends `trackingId` `""` and keeps the `trackingId` it returns; every later call in the run carries it.

Loop limit: 3 passes per test case.

**Preconditions.** The facility searched first, as in the group above, and not found. The facility manager's HPR token in `x-hprid-auth`.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-010 | `screen`, `sandbox` | Mandatory. Facility Name, `facilityInformation.facilityName`. Starts with a letter, letters and digits only, no special characters, more than 4 characters, editable. A bypassed rule raises an alert. | Screen: `1City`, `City@Care` and `Clin` each refused with an alert, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-011 | `screen`, `sandbox` | Mandatory. Latitude, `facilityAddressDetails.latitude`. A number from -90 to +90 with 1 to 6 decimal places, from a map or the device location, editable. | Screen: `91.5` and `18.1234567` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-012 | `screen`, `sandbox` | Mandatory. Longitude, `facilityAddressDetails.longitude`. A number from -180 to +180 with 1 to 6 decimal places, editable. | Screen: `181.0` and `73.1234567` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-013 | `screen`, `sandbox` | Not marked. Country, `facilityAddressDetails.country`. Defaults to India and cannot be edited. | Screen: the field shows India and is locked. The logged request carries `facilityAddressDetails.country` `India`. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-014 | `screen`, `sandbox` | Mandatory. State or UT, `facilityAddressDetails.stateLGDCode`. A searchable dropdown filled from the LGD states call, showing "Select State / UT" until chosen. | Screen: the dropdown lists the names the call returned and searches them. Sandbox: `m4_get_v1_5_facility_lgd_states` returns 200 with `[0].code` and `[0].name` present. The request carries the chosen `code` as `stateLGDCode`. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-015 | `screen`, `sandbox` | Mandatory. District, `facilityAddressDetails.districtLGDCode`. A searchable dropdown filled for the chosen state, showing "Select District" until chosen. | Screen: the dropdown lists only districts of the chosen state. Sandbox: `m4_get_v1_5_facility_lgd_districts` with `stateCode` set returns 200 with `[0].code` and `[0].name` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-016 | `screen`, `sandbox` | Mandatory. Sub-district, `facilityAddressDetails.subDistrictLGDCode`. A searchable dropdown filled for the chosen district, showing "Select Sub-District" until chosen. | Screen: the dropdown lists only sub-districts of the chosen district. Sandbox: `m4_get_v1_5_facility_lgd_subdistricts` with `districtCode` set returns 200 with `[0].code` and `[0].name` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-017 | `screen`, `sandbox` | Mandatory. Address line 1, `facilityAddressDetails.addressLine1`. Letters and digits, and only these special characters: `. - , / ( ) _`. | Screen: `12 Main Road #4` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-018 | `screen`, `sandbox` | Optional. Address line 2, `facilityAddressDetails.addressLine2`. Same rule as address line 1. | Screen: `Near Gate @2` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-019 | `screen`, `sandbox` | Mandatory. Pincode, `facilityAddressDetails.pincode`. Digits only, at most 6. | Screen: `4110011` and `41100A` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-020 | `screen`, `sandbox` | Mandatory when the operational status is Functional. Working days, `timingsOfFacility[].workingDays`. Several days can be chosen. Codes come from master data type `WORKING-DAYS`. | Screen: saving with status Functional and no day chosen is refused. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `WORKING-DAYS` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-021 | `screen`, `sandbox` | Mandatory. Opening hours, `timingsOfFacility[].openingHours`. A From and a To time, as `10:00 AM - 2:00 PM`, or `24*7`. Only for a day that is chosen. | Screen: a To time with no From time is refused, and hours cannot be entered for a day not chosen. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-022 | `screen`, `sandbox` | Mandatory. Operational status, `facilityInformation.facilityOperationalStatus`. A dropdown. Codes come from master data type `FAC-STATUS`. | Screen: the dropdown offers only the returned values. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `FAC-STATUS` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-023 | `screen`, `sandbox` | Optional. Landline number for public display, `facilityContactInformation.facilityLandlineNumber` with `facilityStdCode`. 6 to 8 digits. The set prints the mobile rule on this row and the landline rule on the next; the check uses the rule that fits the field. | Screen: `12345` and `123456789` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-024 | `screen`, `sandbox` | Optional. Mobile number for public display, `facilityContactInformation.facilityContactNumber`. 10 digits, no letters or special characters. | Screen: `987654321` and `98765abc12` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-025 | `screen`, `sandbox` | Optional. Email for public display, `facilityContactInformation.facilityEmailId`. A valid email format. | Screen: `clinic@` and `clinic.example.com` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-026 | `screen`, `sandbox` | Optional. Website, `facilityContactInformation.websiteLink`. A valid link. | Screen: `not a link` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-027 | `screen`, `sandbox` | Optional. Building photograph, `facilityUploads.facilityBuildingPhoto` with `name` and `value`. One file, PNG, JPEG or JPG, at most 5 MB. | Screen: a 6 MB image and a PDF refused, a second file not accepted. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-028 | `screen`, `sandbox` | Optional. Board photograph, `facilityUploads.facilityBoardPhoto` with `name` and `value`. Same rule as the building photograph. | Screen: a 6 MB image and a PDF refused, a second file not accepted. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-029 | `screen`, `sandbox` | Optional. Address proof type, `facilityAddressProof[].addressProofType`. Several can be chosen. Codes come from master data type `ADDRESS-PROOF`. | Screen: more than one type can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `ADDRESS-PROOF` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-030 | `screen`, `sandbox` | Mandatory when an address proof type is chosen. Address proof, `facilityAddressProof[].addressProofAttachment`. One file per chosen type, at most 5 MB. | Screen: a chosen type with no file is refused, and a 6 MB file is refused. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-031 | `screen`, `sandbox` | Mandatory. Ownership, `facilityInformation.ownershipCode`. A dropdown, one value. Codes come from master data type `OWNER`. | Screen: only one value can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `OWNER` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-032 | `screen`, `sandbox` | Mandatory only for government ownership. Ownership subtype, `facilityInformation.ownershipSubTypeCode`. Values from the owner subtype call. | Screen: required for government ownership, absent for private. Sandbox: `m4_post_v1_5_facility_get_owner_subtype` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-033 | `screen`, `sandbox` | Mandatory only for a central government subtype. Ownership subtype 2, `facilityInformation.ownershipSubTypeCode2`. Codes come from master data type `CENTRAL-GOVERNMENT`. | Screen: required for the central subtype, absent otherwise. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `CENTRAL-GOVERNMENT` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-034 | `screen`, `sandbox` | Mandatory. System of medicine, `facilityInformation.systemOfMedicineCode`. Several can be chosen. Codes come from master data type `MEDICINE`. | Screen: more than one system can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `MEDICINE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-035 | `screen`, `sandbox` | Mandatory. Facility type, `facilityInformation.facilityTypeCode`. A dropdown filled from the facility type call. | Screen: the dropdown offers only the returned types. Sandbox: `m4_post_v1_5_facility_fetch_facility_type` returns 200 with `type` `FACILITY-TYPE` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-036 | `screen`, `sandbox` | Mandatory. Facility subtype, `facilityInformation.facilitySubType`. A dropdown filled for the chosen facility type. | Screen: the dropdown changes with the facility type. Sandbox: `m4_post_v1_5_facility_fetch_facility_sub_type` with `facilityTypeCode` set returns 200 with `type` `FACILITY-SUB-TYPE` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-037 | `screen`, `sandbox` | Mandatory, except for Pharmacy, Blood Bank, Diagnostic Lab, Imaging Center, Cath Lab and Dialysis Center. Type of service, `facilityInformation.typeOfServiceCode`. Several can be chosen. The set names master data type `SPECIALITY-TYPE`. | Screen: required for a hospital type, not required for a pharmacy. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `SPECIALITY-TYPE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |
| HFR-038 | `screen`, `sandbox` | Mandatory, except for Pharmacy, Blood Bank, Cath Lab and Dialysis Center. Specialization, with codes from the specialities call for each system of medicine. Several can be chosen. Basic information carries `facilityInformation.specialityTypeCode`; the chosen codes are saved on detailed information, row HFR-049. | Screen: more than one specialization can be chosen, and the list changes with the system of medicine. Sandbox: `m4_post_v1_5_facility_get_specialities` returns 200 with `type` `SPECIALITIES` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information` returns 200 with `trackingId` present. |

### HFR Registration: health programme ids

Applies to the facility manager. Every row saves through `m4_post_v1_5_facility_additional_information` with the run's `trackingId`.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-039 | `screen`, `sandbox` | Optional. National Health Resource Repository id, `linkedProgramIds.nhrrId`. Must be a valid NHRR id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-040 | `screen`, `sandbox` | Optional. National Identification Number, `linkedProgramIds.nin`. Must be a valid NIN. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-041 | `screen`, `sandbox` | Optional. Hospital id allotted by the AB-PMJAY Hospital Empanelment Module, `linkedProgramIds.abpmjayId`. Must be a valid AB-PMJAY hospital id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-042 | `screen`, `sandbox` | Optional. ROHINI id, `linkedProgramIds.rohiniId`. Must be a valid ROHINI id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-043 | `screen`, `sandbox` | Optional. Ex-Servicemen Contributory Health Scheme id, `linkedProgramIds.echsId`. Must be a valid ECHS id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-044 | `screen`, `sandbox` | Optional. Central Government Health Scheme id, `linkedProgramIds.cghsId`. Must be a valid CGHS id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-045 | `screen`, `sandbox` | Optional. CEA registration number, `linkedProgramIds.ceaRegistration`. Must be a valid CEA registration number. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-046 | `screen`, `sandbox` | Optional. State insurance scheme id, `linkedProgramIds.stateInsuranceSchemeId`. Must be letters and digits. | Screen: `SIS-01!` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |

### HFR Registration: infrastructure and specialities

Applies to the facility manager. Every row saves through `m4_post_v1_5_facility_detailed_information` with the run's `trackingId`. Which sections are mandatory depends on the facility type, the type of service and the system of medicine. A pharmacy, a blood bank, a diagnostic laboratory or an imaging centre needs no bed counts.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-047 | `screen`, `sandbox` | Mandatory. System of medicine, `specialities[].systemOfMedicineCode`. Only codes saved on basic information, from master data type `MEDICINE`. | Screen: a system not saved on basic information is not offered. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `MEDICINE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-048 | `screen`, `sandbox` | Mandatory. Specialization available, `specialities[].isSpecializationAvalaible`. `Y` or `N` for each system of medicine. | Screen: only `Y` or `N` can be chosen. The logged request carries one of them. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-049 | `screen`, `sandbox` | Mandatory when the row above is `Y`. Specialities, `specialities[].specialities`. Several can be chosen, codes from the specialities call for that system. | Screen: the list is locked while the row above is `N`. Sandbox: `m4_post_v1_5_facility_get_specialities` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-050 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countIPDBedsWithoutOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-051 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countIPDBedsWithOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-052 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countICUBedsWithVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-053 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countICUBedsWithoutVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-054 | `screen`, `sandbox` | Optional. `countHDUBedsWithFunctionalVentilators`, digits only, at most 2. | `not-run`. The specification publishes no field of this name in `medicalInfrastructure`. HDU beds with ventilators are row HFR-055. |
| HFR-055 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countHDUBedsWithVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-056 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countHDUBedsWithoutVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-057 | `screen`, `sandbox` | Mandatory. Total ventilators, `medicalInfrastructure.totalNumberOfVentilators`. Digits only, at most 4. Your form computes it from the bed counts with ventilators, and it cannot be edited. | Screen: the field is locked and equals `countICUBedsWithVentilators` plus `countHDUBedsWithVentilators` in the same request. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-058 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDayCareBedsWithoutOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-059 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDayCareBedsWithOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-060 | `screen`, `sandbox` | Mandatory. Total beds, `medicalInfrastructure.totalNumberOfBeds`. Digits only, at most 4. Your form computes it from the bed counts, as the set defines it, and it cannot be edited. | Screen: the field is locked and equals the sum your form shows beside it. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-061 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDentalChairs`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |

### HFR Registration: submission

Applies to the facility manager. Until submit returns, the facility stays in `Draft` and ABDM cannot see it. After submit, the facility may wait on NHA or state review. That wait is `needs-human` with the `trackingId`, not a fail.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-062 | `sandbox`, `screen`, `human` | Optional. Source of information, `sourceOfInformation`. A default your system sets, never typed by the user. It must be a source the HFR team issued. Left empty, the facility is treated as a submitted entity. | Screen: the field is not on the form. Sandbox: `m4_post_v1_5_facility_submit_facility`, sent with `x-hprid-auth` and the run's `trackingId`, returns 200 with `status` and `message` present. Paste both. A facility now waiting on NHA or state review is `needs-human`, not `failed`. |
| HFR-063 | `screen`, `sandbox` | Optional. Source unique id, `sourceUniqueID`. A default your system sets, never typed by the user. | Screen: the field is not on the form. The logged `m4_post_v1_5_facility_submit_facility` request carries `sourceUniqueID`. Sandbox: the same 200 as the row above. |

### HFR Facility update: basic information

Applies to the facility manager. The same fields as registration, edited on a facility your system already saved. Every row changes the field, then sends the call with the `trackingId` from registration, never `""`.

Loop limit: 3 passes per test case.

**Preconditions.** A `trackingId` from the registration group in this run or an earlier one.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-064 | `screen`, `sandbox` | Mandatory. Edit the facility name, `facilityInformation.facilityName`. Starts with a letter, letters and digits only, no special characters, more than 4 characters, editable. A bypassed rule raises an alert. | Screen: `1City`, `City@Care` and `Clin` each refused with an alert, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-065 | `screen`, `sandbox` | Mandatory. Latitude, `facilityAddressDetails.latitude`. A number from -90 to +90 with 1 to 6 decimal places, from a map or the device location, editable. | Screen: `91.5` and `18.1234567` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-066 | `screen`, `sandbox` | Mandatory. Longitude, `facilityAddressDetails.longitude`. A number from -180 to +180 with 1 to 6 decimal places, editable. | Screen: `181.0` and `73.1234567` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-067 | `screen`, `sandbox` | Not marked. Country, `facilityAddressDetails.country`. Defaults to India and cannot be edited. | Screen: the field shows India and is locked. The logged request carries `facilityAddressDetails.country` `India`. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-068 | `screen`, `sandbox` | Mandatory. State or UT, `facilityAddressDetails.stateLGDCode`. A searchable dropdown filled from the LGD states call, showing "Select State / UT" until chosen. | Screen: the dropdown lists the names the call returned and searches them. Sandbox: `m4_get_v1_5_facility_lgd_states` returns 200 with `[0].code` and `[0].name` present. The request carries the chosen `code` as `stateLGDCode`. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-069 | `screen`, `sandbox` | Mandatory. District, `facilityAddressDetails.districtLGDCode`. A searchable dropdown filled for the chosen state, showing "Select District" until chosen. | Screen: the dropdown lists only districts of the chosen state. Sandbox: `m4_get_v1_5_facility_lgd_districts` with `stateCode` set returns 200 with `[0].code` and `[0].name` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-070 | `screen`, `sandbox` | Mandatory. Sub-district, `facilityAddressDetails.subDistrictLGDCode`. A searchable dropdown filled for the chosen district, showing "Select Sub-District" until chosen. | Screen: the dropdown lists only sub-districts of the chosen district. Sandbox: `m4_get_v1_5_facility_lgd_subdistricts` with `districtCode` set returns 200 with `[0].code` and `[0].name` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-071 | `screen`, `sandbox` | Mandatory. Address line 1, `facilityAddressDetails.addressLine1`. Letters and digits, and only these special characters: `. - , / ( ) _`. | Screen: `12 Main Road #4` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-072 | `screen`, `sandbox` | Optional. Address line 2, `facilityAddressDetails.addressLine2`. Same rule as address line 1. | Screen: `Near Gate @2` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-073 | `screen`, `sandbox` | Mandatory. Pincode, `facilityAddressDetails.pincode`. Digits only, at most 6. | Screen: `4110011` and `41100A` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-074 | `screen`, `sandbox` | Mandatory when the operational status is Functional. Working days, `timingsOfFacility[].workingDays`. Several days can be chosen. Codes come from master data type `WORKING-DAYS`. | Screen: saving with status Functional and no day chosen is refused. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `WORKING-DAYS` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-075 | `screen`, `sandbox` | Mandatory. Opening hours, `timingsOfFacility[].openingHours`. A From and a To time, as `10:00 AM - 2:00 PM`, or `24*7`. Only for a day that is chosen. | Screen: a To time with no From time is refused, and hours cannot be entered for a day not chosen. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-076 | `screen`, `sandbox` | Mandatory. Operational status, `facilityInformation.facilityOperationalStatus`. A dropdown. Codes come from master data type `FAC-STATUS`. | Screen: the dropdown offers only the returned values. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `FAC-STATUS` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-077 | `screen`, `sandbox` | Optional. Landline number for public display, `facilityContactInformation.facilityLandlineNumber` with `facilityStdCode`. 6 to 8 digits. The set prints the mobile rule on this row and the landline rule on the next; the check uses the rule that fits the field. | Screen: `12345` and `123456789` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-078 | `screen`, `sandbox` | Optional. Mobile number for public display, `facilityContactInformation.facilityContactNumber`. 10 digits, no letters or special characters. | Screen: `987654321` and `98765abc12` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-079 | `screen`, `sandbox` | Optional. Email for public display, `facilityContactInformation.facilityEmailId`. A valid email format. | Screen: `clinic@` and `clinic.example.com` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-080 | `screen`, `sandbox` | Optional. Website, `facilityContactInformation.websiteLink`. A valid link. | Screen: `not a link` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-081 | `screen`, `sandbox` | Optional. Building photograph, `facilityUploads.facilityBuildingPhoto` with `name` and `value`. One file, PNG, JPEG or JPG, at most 5 MB. | Screen: a 6 MB image and a PDF refused, a second file not accepted. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-082 | `screen`, `sandbox` | Optional. Board photograph, `facilityUploads.facilityBoardPhoto` with `name` and `value`. Same rule as the building photograph. | Screen: a 6 MB image and a PDF refused, a second file not accepted. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-083 | `screen`, `sandbox` | Optional. Address proof type, `facilityAddressProof[].addressProofType`. Several can be chosen. Codes come from master data type `ADDRESS-PROOF`. | Screen: more than one type can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `ADDRESS-PROOF` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-084 | `screen`, `sandbox` | Mandatory when an address proof type is chosen. Address proof, `facilityAddressProof[].addressProofAttachment`. One file per chosen type, at most 5 MB. | Screen: a chosen type with no file is refused, and a 6 MB file is refused. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-085 | `screen`, `sandbox` | Mandatory. Ownership, `facilityInformation.ownershipCode`. A dropdown, one value. Codes come from master data type `OWNER`. | Screen: only one value can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `OWNER` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-086 | `screen`, `sandbox` | Mandatory only for government ownership. Ownership subtype, `facilityInformation.ownershipSubTypeCode`. Values from the owner subtype call. | Screen: required for government ownership, absent for private. Sandbox: `m4_post_v1_5_facility_get_owner_subtype` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-087 | `screen`, `sandbox` | Mandatory only for a central government subtype. Ownership subtype 2, `facilityInformation.ownershipSubTypeCode2`. Codes come from master data type `CENTRAL-GOVERNMENT`. | Screen: required for the central subtype, absent otherwise. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `CENTRAL-GOVERNMENT` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-088 | `screen`, `sandbox` | Mandatory. System of medicine, `facilityInformation.systemOfMedicineCode`. Several can be chosen. Codes come from master data type `MEDICINE`. | Screen: more than one system can be chosen. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `MEDICINE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-089 | `screen`, `sandbox` | Mandatory. Facility type, `facilityInformation.facilityTypeCode`. A dropdown filled from the facility type call. | Screen: the dropdown offers only the returned types. Sandbox: `m4_post_v1_5_facility_fetch_facility_type` returns 200 with `type` `FACILITY-TYPE` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-090 | `screen`, `sandbox` | Mandatory. Facility subtype, `facilityInformation.facilitySubType`. A dropdown filled for the chosen facility type. | Screen: the dropdown changes with the facility type. Sandbox: `m4_post_v1_5_facility_fetch_facility_sub_type` with `facilityTypeCode` set returns 200 with `type` `FACILITY-SUB-TYPE` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-091 | `screen`, `sandbox` | Mandatory, except for Pharmacy, Blood Bank, Diagnostic Lab, Imaging Center, Cath Lab and Dialysis Center. Type of service, `facilityInformation.typeOfServiceCode`. Several can be chosen. The set names master data type `SPECIALITY-TYPE`. | Screen: required for a hospital type, not required for a pharmacy. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `SPECIALITY-TYPE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-092 | `screen`, `sandbox` | Mandatory, except for Pharmacy, Blood Bank, Cath Lab and Dialysis Center. Specialization, with codes from the specialities call for each system of medicine. Several can be chosen. Basic information carries `facilityInformation.specialityTypeCode`; the chosen codes are saved on detailed information, row HFR-049. | Screen: more than one specialization can be chosen, and the list changes with the system of medicine. Sandbox: `m4_post_v1_5_facility_get_specialities` returns 200 with `type` `SPECIALITIES` and `data[0].code` present. Sandbox: `m4_post_v1_5_facility_basic_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |

### HFR Facility update: health programme ids

Applies to the facility manager.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-093 | `screen`, `sandbox` | Optional. National Health Resource Repository id, `linkedProgramIds.nhrrId`. Must be a valid NHRR id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-094 | `screen`, `sandbox` | Optional. National Identification Number, `linkedProgramIds.nin`. Must be a valid NIN. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-095 | `screen`, `sandbox` | Optional. Hospital id allotted by the AB-PMJAY Hospital Empanelment Module, `linkedProgramIds.abpmjayId`. Must be a valid AB-PMJAY hospital id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-096 | `screen`, `sandbox` | Optional. ROHINI id, `linkedProgramIds.rohiniId`. Must be a valid ROHINI id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-097 | `screen`, `sandbox` | Optional. Ex-Servicemen Contributory Health Scheme id, `linkedProgramIds.echsId`. Must be a valid ECHS id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-098 | `screen`, `sandbox` | Optional. Central Government Health Scheme id, `linkedProgramIds.cghsId`. Must be a valid CGHS id. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-099 | `screen`, `sandbox` | Optional. CEA registration number, `linkedProgramIds.ceaRegistration`. Must be a valid CEA registration number. | Screen: the field accepts the id and shows it again after a reload. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-100 | `screen`, `sandbox` | Optional. State insurance scheme id, `linkedProgramIds.stateInsuranceSchemeId`. Must be letters and digits. | Screen: `SIS-01!` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_additional_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |

### HFR Facility update: infrastructure and specialities

Applies to the facility manager.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-101 | `screen`, `sandbox` | Mandatory. System of medicine, `specialities[].systemOfMedicineCode`. Only codes saved on basic information, from master data type `MEDICINE`. | Screen: a system not saved on basic information is not offered. Sandbox: `m4_get_v1_5_facility_get_master_data` with `type` `MEDICINE` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-102 | `screen`, `sandbox` | Mandatory. Specialization available, `specialities[].isSpecializationAvalaible`. `Y` or `N` for each system of medicine. | Screen: only `Y` or `N` can be chosen. The logged request carries one of them. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-103 | `screen`, `sandbox` | Mandatory when the row above is `Y`. Specialities, `specialities[].specialities`. Several can be chosen, codes from the specialities call for that system. | Screen: the list is locked while the row above is `N`. Sandbox: `m4_post_v1_5_facility_get_specialities` returns 200 with `data[0].code` present. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-104 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countIPDBedsWithoutOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-105 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countIPDBedsWithOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-106 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countICUBedsWithVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-107 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countICUBedsWithoutVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-108 | `screen`, `sandbox` | Optional. `countHDUBedsWithFunctionalVentilators`, digits only, at most 2. | `not-run`. The specification publishes no field of this name in `medicalInfrastructure`. HDU beds with ventilators are row HFR-109. |
| HFR-109 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countHDUBedsWithVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-110 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countHDUBedsWithoutVentilators`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-111 | `screen`, `sandbox` | Mandatory. Total ventilators, `medicalInfrastructure.totalNumberOfVentilators`. Digits only, at most 4. Your form computes it from the bed counts with ventilators, and it cannot be edited. | Screen: the field is locked and equals `countICUBedsWithVentilators` plus `countHDUBedsWithVentilators` in the same request. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-112 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDayCareBedsWithoutOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-113 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDayCareBedsWithOxygen`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-114 | `screen`, `sandbox` | Mandatory. Total beds, `medicalInfrastructure.totalNumberOfBeds`. Digits only, at most 4. Your form computes it from the bed counts, as the set defines it, and it cannot be edited. | Screen: the field is locked and equals the sum your form shows beside it. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |
| HFR-115 | `screen`, `sandbox` | Optional. `medicalInfrastructure.countDentalChairs`. Digits only, at most 2. | Screen: `ab` and `100` refused, nothing sent. Sandbox: `m4_post_v1_5_facility_detailed_information`, sent with the run's `trackingId`, returns 200 with the same `trackingId`. |

### HFR Facility update: submission

Applies to the facility manager. Review after submit is `needs-human`, as in registration.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-116 | `sandbox`, `screen`, `human` | Optional. Source of information, `sourceOfInformation`. A default your system sets, never typed by the user. It must be a source the HFR team issued. Left empty, the facility is treated as a submitted entity. | Screen: the field is not on the form. Sandbox: `m4_post_v1_5_facility_submit_facility`, sent with `x-hprid-auth` and the run's `trackingId`, returns 200 with `status` and `message` present. Paste both. A facility now waiting on NHA or state review is `needs-human`, not `failed`. |
| HFR-117 | `screen`, `sandbox` | Optional. Source unique id, `sourceUniqueID`. A default your system sets, never typed by the user. | Screen: the field is not on the form. The logged `m4_post_v1_5_facility_submit_facility` request carries `sourceUniqueID`. Sandbox: the same 200 as the row above. |

### HFR Bridge linkage, first occurrence

The set lists the bridge linkage rows twice, with the same ids. The first occurrence links one bridge to a facility. The second, below, links a second bridge to the same facility and adds two uniqueness checks. Record both, marked occurrence 1 and occurrence 2.

Loop limit: 3 passes per test case.

**Preconditions.** A facility id, 12 characters starting with `IN`, from a submitted facility or a search. A facility still in `Draft` has no id to link: that is `needs-human`, waiting on review. Your `bridgeId`.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-118 | `screen`, `sandbox` | Mandatory. First occurrence. Facility id, `facilityId`. 12 characters starting with `IN`, and present in the HFR. | Screen: `XY0610090166` and `IN061009016` refused, nothing sent. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `facilityId` set returns 200 with `facilities[0].facilityId` equal to it. |
| HFR-119 | `screen`, `sandbox` | Mandatory. First occurrence. Facility name, `facilityName`. Filled from the facility id, not typed. | Screen: the name appears after the id is entered and equals `facilities[0].facilityName` from the search. The logged request carries that value. |
| HFR-120 | `screen`, `sandbox` | Mandatory. First occurrence. Bridge id, `HRP[].bridgeId`. Letters and digits; the gateway checks it is valid. | Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` returns 200. Paste the whole body: the specification publishes no fields for it. Then `gateway_get_gateway_v3_bridge_services`, with a fresh `REQUEST-ID`, returns 200 with `bridge.id` equal to the `bridgeId` sent. |
| HFR-121 | `screen`, `sandbox` | Mandatory. First occurrence. HIP name, `HRP[].hipName`. At most 15 characters, no special characters. Patients see it in their ABHA or PHR app. It can be the hospital name with the bridge name as a suffix. | Screen: `Singla Eye Center Pune` and `EyeCare#1` refused, nothing sent. Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` with a valid name returns 200. |
| HFR-122 | `screen`, `sandbox` | Mandatory. First occurrence. HIP type, `HRP[].type`, such as `HIP` or `HIU`. The gateway validates it. | Screen: only the published types can be chosen. Sandbox: `gateway_get_gateway_v3_bridge_services` returns 200 with a `services[]` entry whose `id` equals the `facilityId` and whose `types` holds the `type` sent. |
| HFR-123 | `screen`, `sandbox` | Mandatory. First occurrence. Active, `HRP[].active`. `true` or `false` only. | Screen: the control offers only true or false. Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` with `active` `true` returns 200, and again with `active` `false` returns 200. |

### HFR Bridge linkage, second occurrence

A second bridge on the facility from the first occurrence. A facility that publishes and fetches records needs one entry of type `HIP` and one of type `HIU`, not one entry that claims both.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HFR-118 | `screen`, `sandbox` | Mandatory. Second occurrence. Facility id, `facilityId`. 12 characters starting with `IN`, and present in the HFR. | Screen: `XY0610090166` and `IN061009016` refused, nothing sent. Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` with `facilityId` set returns 200 with `facilities[0].facilityId` equal to it. |
| HFR-119 | `screen`, `sandbox` | Mandatory. Second occurrence. Facility name, `facilityName`. Filled from the facility id, not typed. | Screen: the name appears after the id is entered and equals `facilities[0].facilityName` from the search. The logged request carries that value. |
| HFR-120 | `screen`, `sandbox` | Mandatory. Second occurrence. Bridge id, `HRP[].bridgeId`. Letters and digits; the gateway checks it is valid. It must differ from the bridge already linked to this facility. | Screen: the first occurrence's `bridgeId` refused for this facility, nothing sent. Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` returns 200. Paste the whole body: the specification publishes no fields for it. Then `gateway_get_gateway_v3_bridge_services`, with a fresh `REQUEST-ID`, returns 200 with `bridge.id` equal to the `bridgeId` sent. |
| HFR-121 | `screen`, `sandbox` | Mandatory. Second occurrence. HIP name, `HRP[].hipName`. At most 15 characters, no special characters. Patients see it in their ABHA or PHR app. It can be the hospital name with the bridge name as a suffix. It must not repeat the HIP name of the facility's other bridge. | Screen: the first occurrence's `hipName` refused, nothing sent. Screen: `Singla Eye Center Pune` and `EyeCare#1` refused, nothing sent. Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` with a valid name returns 200. |
| HFR-122 | `screen`, `sandbox` | Mandatory. Second occurrence. HIP type, `HRP[].type`, such as `HIP` or `HIU`. The gateway validates it. | Screen: only the published types can be chosen. Sandbox: `gateway_get_gateway_v3_bridge_services` returns 200 with a `services[]` entry whose `id` equals the `facilityId` and whose `types` holds the `type` sent. |
| HFR-123 | `screen`, `sandbox` | Mandatory. Second occurrence. Active, `HRP[].active`. `true` or `false` only. | Screen: the control offers only true or false. Sandbox: `m4_post_v1_bridges_mutiplehrpaddupdateservices` with `active` `true` returns 200, and again with `active` `false` returns 200. |

### HPR Creation of HPR profile

Applies to all integrators that create an HPR ID. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. The certificate from `m4_get_v1_auth_cert`, read this run. A professional present with an Aadhaar linked mobile.

Calls, in order: `m4_post_aadhaar_generatelink` with `scopes` `["nhpr-register"]` and `source` `NHPR`, the person on the page at `url`, `m4_post_aadhaar_isauthenticated` until `true`, `m4_post_v2_registration_aadhaar_verifyotp`, `m4_post_v1_registration_aadhaar_checkhpidaccountexist`, then `m4_post_v2_registration_aadhaar_demographicauthviamobile`, the mobile OTP when `verified` is `false`, `m4_post_v1_registration_aadhaar_hpid_suggestion` and `m4_post_v2_registration_aadhaar_createhpridwithpreverified`. The `url` is valid for five minutes. A slow person needs a fresh link, not a retry.

Nudge: `m4_post_aadhaar_isauthenticated` answers a bare `true` or `false`, not an object. A client that parses it as an object fails on the success path.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HPR-002 | `sandbox`, `human` | Mandatory. Your system offers HPR ID creation through Aadhaar. An Aadhaar number that is not 12 digits is refused with "Aadhaar is not valid". | Sandbox: `m4_post_aadhaar_generatelink` returns 200 with `txnId` and `url` present. Human: on the page at `url`, the person enters an 11 digit number and sees it refused. Nobody present: `needs-human` with the `txnId`. |
| HPR-003 | `screen` | Mandatory. The ABDM consent text is shown, and the person's agreement is stored, before Aadhaar authentication starts. | Screen: the consent screen, the stored agreement with its time, and a call log where `m4_post_aadhaar_generatelink` comes after that time. |
| HPR-004 | `screen` | Mandatory. The same consent offered in a language other than English, Hindi first. | Screen: the consent shown in Hindi, and the stored agreement for that language. |
| HPR-005 | `sandbox`, `human`, `screen` | Mandatory. The Aadhaar number refusal of HPR-002, and the person's details shown once authentication succeeds. The set names this row for the refusal and describes the display; both are checked. | Human: the refusal as in HPR-002. Sandbox: `m4_post_v2_registration_aadhaar_verifyotp` returns 200 with `name`, `gender` and `birthdate` present. Screen: those values shown. |
| HPR-006 | `human` | Mandatory. A captcha before the Aadhaar number is submitted. A wrong captcha is refused with a message; a right one lets Submit work. | Human: on the page at `url`, the person sees a wrong captcha refused and a right one accepted, and says so. Nobody present: `needs-human`. |
| HPR-007 | `human`, `sandbox` | Mandatory. The Aadhaar OTP goes to the Aadhaar linked mobile and can be entered. A wrong OTP is refused with "Aadhaar OTP is not valid". A valid OTP is 6 digits. | Human: the person enters a wrong OTP and sees it refused, then the right one. Sandbox: `m4_post_aadhaar_isauthenticated` with the `txnId` returns 200 with body `false` before, and `true` after. Nobody present: `needs-human` with the `txnId`. |
| HPR-008 | `screen` | Mandatory. Resend OTP works at most twice, each time after 60 seconds, then blocks for 30 minutes. It applies to the mobile OTP of HPR-011; on the hosted page, the person checks the same for the Aadhaar OTP. | Screen: a recording or timestamped screenshots: disabled at send, enabled after 60 seconds, blocked after the second resend. |
| HPR-010 | `sandbox`, `screen` | Mandatory. An existing HP-ID is found and offered for login. With no HP-ID, a communication mobile equal to the Aadhaar mobile goes straight to the creation screen. | Sandbox: `m4_post_v1_registration_aadhaar_checkhpidaccountexist` returns 200. With `hprIdNumber` present, the screen shows the found ID, offers login, and no create call follows. Without it, `m4_post_v2_registration_aadhaar_demographicauthviamobile` returns 200 with `verified` `true`, and the log shows no `m4_post_v1_registration_aadhaar_generatemobileotp` before creation. |
| HPR-011 | `sandbox`, `human` | Mandatory. A communication mobile that differs from the Aadhaar mobile is verified by OTP, then the HP-ID is created. | Sandbox: `m4_post_v2_registration_aadhaar_demographicauthviamobile` returns 200 with `verified` `false`. `m4_post_v1_registration_aadhaar_generatemobileotp` returns 200 with `txnId` present. Human: the person enters the OTP. `m4_post_v1_registration_aadhaar_verifymobileotp` returns 200 with `txnId` present. `m4_post_v1_registration_aadhaar_hpid_suggestion` returns 200 with a non-empty array. `m4_post_v2_registration_aadhaar_createhpridwithpreverified` returns 200 with `hprIdNumber` and `token` present. |

### HPR Register in HPR

Applies to all integrators that create an HPR ID. One call proves the whole form: `m4_post_v1_doctors_register_professional_new`, with the `hprToken` from creation. Each row checks one field on your form and its path in the logged request. Fetch the master lists first and send codes, never names.

Loop limit: 3 passes per test case.

**Preconditions.** HPR-011 or HPR-010 reached a created HP-ID in this run, so a `token` is held.

Nudge: the documents in HPR-059, HPR-069 and HPR-075 are not finished until they are uploaded. A registration accepted with a mandatory document missing is still incomplete; HPR-080 closes it.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HPR-018 | `sandbox` | Mandatory. The `token` returned when the HP-ID is created is the `hprToken` for registration. | Sandbox: `m4_post_v2_registration_aadhaar_createhpridwithpreverified` returns 200 with `token` present. `m4_post_v1_doctors_register_professional_new`, with that value as `hprToken`, returns 200 with `hprId` present. |
| HPR-019 | `screen` | Non-mandatory. Profile photo, `practitioner.profilePhoto`, taken from Aadhaar with the name, date of birth, gender and KYC status. | Screen: the photo from the `photo` of `m4_post_v2_registration_aadhaar_verifyotp` is shown. Record whether your form lets it be edited, which the set questions. |
| HPR-020 | `screen` | Mandatory. The HPR ID is shown, system generated and not editable. | Screen: the ID shown equals `hprId` from `m4_post_v2_registration_aadhaar_createhpridwithpreverified`, and the field is locked. |
| HPR-022 | `screen` | Non-mandatory. Communication mobile, `practitioner.officialMobile`, with its status, Verified or Not Verified, not editable. | Screen: the mobile and its status shown and locked. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.officialMobileStatus`. |
| HPR-024 | `screen` | Non-mandatory. Communication email, `practitioner.officialEmail`, with its status, Verified or Not Verified, not editable. | Screen: the email and its status shown and locked. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.officialEmailStatus`. |
| HPR-026 | `screen` | Mandatory. Salutation, `practitioner.personalInformation.salutation`, offering options such as Dr, Mr and Ms. The specification publishes no salutation master call. | Screen: saving with no salutation is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.personalInformation.salutation`. |
| HPR-027 | `screen` | Mandatory. First name, `practitioner.personalInformation.firstName`, taken from Aadhaar and not editable. | Screen: the field is locked and equals `firstName` from `m4_post_v2_registration_aadhaar_createhpridwithpreverified`. The logged `m4_post_v1_doctors_register_professional_new` request carries the same value. |
| HPR-028 | `screen` | Mandatory. Middle name, `practitioner.personalInformation.middleName`, taken from Aadhaar and not editable. | Screen: the field is locked and equals `middleName` from `m4_post_v2_registration_aadhaar_createhpridwithpreverified`. The logged `m4_post_v1_doctors_register_professional_new` request carries the same value. |
| HPR-029 | `screen` | Mandatory. Last name, `practitioner.personalInformation.lastName`, taken from Aadhaar and not editable. | Screen: the field is locked and equals `lastName` from `m4_post_v2_registration_aadhaar_createhpridwithpreverified`. The logged `m4_post_v1_doctors_register_professional_new` request carries the same value. |
| HPR-030 | `screen` | Non-mandatory. Father's name, `practitioner.personalInformation.fatherName`, typed by the user. | Screen: the field can be filled and left empty. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.personalInformation.fatherName` when filled. |
| HPR-031 | `screen` | Non-mandatory. Mother's name, `practitioner.personalInformation.motherName`, typed by the user. | Screen: the field can be filled and left empty. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.personalInformation.motherName` when filled. |
| HPR-032 | `screen` | Non-mandatory. Spouse's name, `practitioner.personalInformation.spouseName`, typed by the user. | Screen: the field can be filled and left empty. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.personalInformation.spouseName` when filled. |
| HPR-033 | `screen`, `sandbox` | Mandatory. Nationality, `practitioner.personalInformation.nationality`. A dropdown with India as the default. | Sandbox: `m4_get_v1_masters_countries` returns 200. Screen: India preselected. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.personalInformation.nationality`. |
| HPR-036 | `screen`, `sandbox` | Mandatory. Languages spoken, `practitioner.personalInformation.languagesSpoken`. A multi-select dropdown. | Sandbox: `m4_get_v1_masters_languages` returns 200. Screen: two languages can be chosen. The logged `m4_post_v1_doctors_register_professional_new` request carries both. |
| HPR-037 | `screen` | Mandatory. Address as per KYC, `practitioner.addressAsPerKYC`, taken from Aadhaar and not editable. | Screen: the field is locked and matches `address` from `m4_post_v2_registration_aadhaar_verifyotp`. The logged `m4_post_v1_doctors_register_professional_new` request carries it. |
| HPR-038 | `screen` | Non-mandatory. Communication address same as KYC address, `practitioner.communicationAddress.isCommunicationAddressAsPerKYC`. Choosing state and district fills the pincode, and the reverse. | Screen: the choice is offered, and pincode and district fill each other. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.isCommunicationAddressAsPerKYC`. |
| HPR-039 | `screen` | Non-mandatory. Communication address, `practitioner.communicationAddress.address`, filled when the communication address differs from the KYC address. | Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.address`. |
| HPR-040 | `screen` | Non-mandatory. Name of the communication person, `practitioner.communicationAddress.name`, filled when the communication address differs from the KYC address. | Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.name`. |
| HPR-041 | `screen`, `sandbox` | Non-mandatory. Country, a dropdown, `practitioner.communicationAddress.country`, filled when the communication address differs from the KYC address. | Sandbox: `m4_get_v1_masters_countries` returns 200. Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.country`. |
| HPR-042 | `screen`, `sandbox` | Non-mandatory. State or UT, a dropdown, `practitioner.communicationAddress.state`, filled when the communication address differs from the KYC address. | Sandbox: `m4_get_v1_masters_states` returns 200. Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.state`. |
| HPR-043 | `screen`, `sandbox` | Non-mandatory. District, a dropdown, `practitioner.communicationAddress.district`, filled when the communication address differs from the KYC address. | Sandbox: `m4_get_v1_masters_district_id` returns 200. Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.district`. |
| HPR-044 | `screen`, `sandbox` | Non-mandatory. Sub-district, a dropdown, `practitioner.communicationAddress.subDistrict`, filled when the communication address differs from the KYC address. | Sandbox: `m4_get_v1_masters_sub_districts_id` returns 200. Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.subDistrict`. |
| HPR-045 | `screen` | Non-mandatory. City, town or village, `practitioner.communicationAddress.city`, filled when the communication address differs from the KYC address. | Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.city`. |
| HPR-046 | `screen` | Non-mandatory. Postal code, `practitioner.communicationAddress.pincode`, filled when the communication address differs from the KYC address. | Screen: the field can be filled. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.communicationAddress.pincode`. |
| HPR-054 | `screen` | Mandatory. Category, `practitioner.registrationAcademic.category`, one value from a dropdown, such as Doctor, Modern Medicine. The set takes these values from its master data sheet, not a call. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.category`. |
| HPR-055 | `screen` | Mandatory. Category id, `practitioner.registrationAcademic.registrationData[].categoryId`, from a dropdown. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].categoryId`. |
| HPR-056 | `screen`, `sandbox` | Mandatory. Council, `practitioner.registrationAcademic.registrationData[].registeredWithCouncil`, from a dropdown. | Sandbox: `m4_get_v1_masters_medical_councils` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].registeredWithCouncil`. |
| HPR-057 | `screen` | Mandatory. Registration number, `practitioner.registrationAcademic.registrationData[].registrationNumber`, typed. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].registrationNumber`. |
| HPR-058 | `screen` | Mandatory. Registration date, `practitioner.registrationAcademic.registrationData[].registrationDate`, typed or picked. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].registrationDate`. |
| HPR-059 | `screen` | Mandatory. Registration certificate, `practitioner.registrationAcademic.registrationData[].registrationCertificate`, a base64 image with `fileType` and `data`. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].registrationCertificate.data`. |
| HPR-060 | `screen` | Non-mandatory. Name differs on the registration certificate, `practitioner.registrationAcademic.registrationData[].isNameDifferentInCertificate`, yes or no. Yes asks for a PDF, PNG, JPEG or JPG of at most 5 MB. | Screen: a 6 MB file refused, nothing sent. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].isNameDifferentInCertificate`. |
| HPR-061 | `screen` | Non-mandatory. Proof of name change for registration, `practitioner.registrationAcademic.registrationData[].proofOfNameChangeCertificate`, asked for only on yes, at most 5 MB. | Screen: a 6 MB file refused, nothing sent. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].proofOfNameChangeCertificate`. |
| HPR-062 | `screen`, `sandbox` | Mandatory. Degree or diploma, `practitioner.registrationAcademic.registrationData[].qualifications[].nameOfDegreeOrDiplomaObtained`, from a dropdown. | Sandbox: `m4_post_v1_masters_courses` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].nameOfDegreeOrDiplomaObtained`. |
| HPR-063 | `screen`, `sandbox` | Mandatory. Country of the qualification, `practitioner.registrationAcademic.registrationData[].qualifications[].country`, from a dropdown. | Sandbox: `m4_get_v1_masters_countries` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].country`. |
| HPR-064 | `screen`, `sandbox` | Mandatory. State of the qualification, `practitioner.registrationAcademic.registrationData[].qualifications[].state`, from a dropdown. | Sandbox: `m4_get_v1_masters_states` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].state`. |
| HPR-065 | `screen`, `sandbox` | Mandatory. College, `practitioner.registrationAcademic.registrationData[].qualifications[].college`, from a dropdown. | Sandbox: `m4_get_v1_masters_colleges_stateid_medicineid` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].college`. |
| HPR-066 | `screen`, `sandbox` | Mandatory. University, `practitioner.registrationAcademic.registrationData[].qualifications[].university`, from a dropdown. | Sandbox: `m4_get_v1_masters_universites_id` returns 200. Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].university`. |
| HPR-067 | `screen` | Non-mandatory. Month of award, `practitioner.registrationAcademic.registrationData[].qualifications[].monthOfAwardingDegreeDiploma`. | Screen: saving with the field empty works. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].monthOfAwardingDegreeDiploma`. |
| HPR-068 | `screen` | Mandatory. Year of award, `practitioner.registrationAcademic.registrationData[].qualifications[].yearOfAwardingDegreeDiploma`. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].yearOfAwardingDegreeDiploma`. |
| HPR-069 | `screen` | Mandatory. Degree certificate, `practitioner.registrationAcademic.registrationData[].qualifications[].degreeCertificate`, a base64 image with `fileType` and `data`. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].degreeCertificate.data`. |
| HPR-070 | `screen` | Mandatory. Name differs on the degree certificate, `practitioner.registrationAcademic.registrationData[].qualifications[].isNameDifferentInCertificate`, yes or no. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].isNameDifferentInCertificate`. |
| HPR-071 | `screen` | Non-mandatory. Proof of name change for the degree, `practitioner.registrationAcademic.registrationData[].qualifications[].proofOfNameChangeCertificate`, base64, asked for only on yes, PDF, PNG, JPEG or JPG of at most 5 MB. | Screen: a 6 MB file refused, nothing sent. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.registrationAcademic.registrationData[].qualifications[].proofOfNameChangeCertificate`. |
| HPR-072 | `screen` | Mandatory. Currently working, `practitioner.currentWorkDetails.currentlyWorking`, yes or no from a dropdown. | Screen: saving with the field empty is refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.currentWorkDetails.currentlyWorking`. |
| HPR-073 | `screen` | Mandatory. On no, the reason, `practitioner.currentWorkDetails.reasonForNotWorking`, from a dropdown with a free text option. | Screen: no, with no reason, refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.currentWorkDetails.reasonForNotWorking`. |
| HPR-074 | `screen` | Mandatory. On yes, a choice of Government, Private or Both, `practitioner.currentWorkDetails.chooseWorkStatus`. | Screen: yes, with no choice, refused. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.currentWorkDetails.chooseWorkStatus`. |
| HPR-075 | `screen` | Mandatory. For Government or Both, a document such as a payslip or transfer order, `practitioner.currentWorkDetails.certificateAttachment`, at most 5 MB. Private needs none. | Screen: Government with no document refused; Private saves with none. The logged `m4_post_v1_doctors_register_professional_new` request carries `practitioner.currentWorkDetails.certificateAttachment`. |
| HPR-076 | `screen`, `sandbox` | Mandatory for Government or Both. Facility declaration, `practitioner.currentWorkDetails.facilityDeclarationData`. The professional finds the facility by name or facility id. | Sandbox: `m4_post_facilitymanagement_v1_5_facility_search` returns 200 with `facilities[0].facilityId` present. The logged `m4_post_v1_doctors_register_professional_new` request carries that value as `practitioner.currentWorkDetails.facilityDeclarationData.facilityId`. |
| HPR-077 | `sandbox`, `human` | Mandatory. Preview the profile and submit. An SMS or email confirms it. | Sandbox: `m4_post_v1_doctors_register_professional_new` returns 200 with `hprId` and `status` present. Human: the professional confirms the SMS or email arrived. Nobody present: `needs-human`. |

### HPR Fetch, update and upload

Applies to all integrators that create an HPR ID. The set groups these as fetch professional details, update professional details, and the upload document API.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| HPR-078 | `sandbox`, `screen` | Non-mandatory. After creation, your system shows the professional's details from the fetch call. | Sandbox: `m4_post_v1_doctors_fetch_professional_info` with `practitioner.id` set to the `hprId` returns 200 with `practitioners` present. Screen: the details shown match it. |
| HPR-079 | `sandbox` | Mandatory. The professional can update details already entered. The payload is built as for registration. | Sandbox: `m4_post_v1_doctors_update_professional_new` returns 200 with `hprId` present. `m4_post_v1_doctors_fetch_professional_info` then returns 200 with the changed value. |
| HPR-080 | `sandbox` | Non-mandatory. A document not ready at registration is uploaded later. The first call gives the document id, the second uploads. | Sandbox: `m4_post_v1_doctors_fetch_documents_list` with `hprid` set returns 200 with `documentList` present. `m4_post_v1_uploads_upload_document` with `hpr_token` and that `document_id` returns 200 with the uploaded certificate's `status` and `msg` present, such as `degreeCertificate.status`. |

## When the last case is recorded

Write the manifest. It is the whole report. Case ids to the identifiers the registry returned, nothing else, so a reviewer checks it against the registry's own record rather than reading screenshots. Secrets never appear in it: no tokens, no OTPs, no Aadhaar numbers, no passwords, no mobile numbers, no client secret.

```json
{
  "skill": "abdm-m4",
  "set": "M4 HFR, NHA, 16 March 2024 sheet, and HPR test cases final",
  "registries": ["HFR", "HPR"],
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T12:03:11Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "HFR-001", "outcome": "passed", "evidence": "sandbox",
     "identifiers": ["facilityId IN0610090166"],
     "observed": ["facility/search 200 facilities[0].facilityId"]},
    {"id": "HFR-010", "outcome": "passed", "evidence": "screen+sandbox",
     "attachment": "hfr-010.png", "identifiers": ["trackingId 80266"],
     "observed": ["basic-information 200 trackingId"]},
    {"id": "HFR-054", "outcome": "not-run",
     "reason": "no countHDUBedsWithFunctionalVentilators field in the M4 specification"},
    {"id": "HFR-062", "outcome": "needs-human", "evidence": "sandbox",
     "identifiers": ["trackingId 80266"], "reason": "submitted; waiting on NHA or state review"},
    {"id": "HFR-121", "occurrence": 2, "outcome": "passed", "evidence": "screen+sandbox",
     "attachment": "hfr-121-second.png", "identifiers": ["facilityId IN0610090166"]},
    {"id": "HPR-011", "outcome": "needs-human", "evidence": "human",
     "identifiers": ["txnId de4f..."], "reason": "mobile OTP; nobody present"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases for your system are not `passed`; and the one case to fix first.
