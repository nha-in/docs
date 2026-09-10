---
name: abdm-m3
description: Use when building, debugging or testing ABDM Milestone 3: raising a consent request, tracking its status, reading consent artefacts, and fetching encrypted health records as an HIU. Carries the endpoints, the consent rules, every recorded error code and the M3 test matrix.
---

# ABDM M3, consent and fetching

Generated from the ABDM Developer Portal on 2026-09-10, catalogue version 2026.08.24. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download it from https://nha-in.github.io/docs/pr-10/skills/abdm-m3/SKILL.md when it is older than the work you are doing.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.

## What this skill covers

- **Integrate.** 25 operations, with their hosts and headers.
- **Debug.** 95 recorded error codes, with the message and what to do.
- **Test.** 16 test cases, each with the call it makes and what to see when it passes.

## Before anything else

- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.
- You act as the HIU. The HIE-CM holds the consent and asks the patient on your behalf. No artefact, no records.
- The patient must be known to you by ABHA address before you can raise a request.
- One consent request can produce more than one artefact. Store the request id and every artefact id.
- Records arrive encrypted on your callback URL. Decrypt them, then acknowledge receipt to the gateway.
- NHA's schema declares `consentId` and `consentRequestId` as UUIDs while NHA's own examples give values that are not. Do not validate them as UUIDs. Recorded as correction C3 in catalogue/openapi/corrections.

## Hosts

- `https://dev.abdm.gov.in` Sandbox. Pair it with the `X-CM-ID: sbx` header.
- `https://apis.abdm.gov.in` Production. Pair it with the `X-CM-ID: abdm` header.
- `https://dev.abdm.gov.in/api` ABDM Gateway (Dev / Sandbox)
- `https://apis.abdm.gov.in/api` ABDM Gateway (Production)
- `https://apihspsbx.abdm.gov.in` HSP Registry (Sandbox)

## Endpoints

25 operations, grouped by the journey they belong to.

### bridge

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v4/int/v1/bridges/MutipleHRPAddUpdateServices` | Register / Update Bridge Services (HIU) |

### consent

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/consent/v3/fetch` | Fetch the full consent artefact |
| `POST` | `/hiecm/consent/v3/request/hiu/on-notify` | Acknowledge a consent notification |
| `POST` | `/hiecm/consent/v3/request/init` | Initiate a consent request |
| `POST` | `/hiecm/consent/v3/request/status` | Check the status of a consent request |

### data-retrieval

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/data-flow/v3/health-information/notify` | Notify the gateway that data was received |
| `POST` | `/hiecm/data-flow/v3/health-information/request` | Request a patient's health information |
| `GET` | `/hiecm/data-flow/v3/health-information/request/status/{transaction-id}` | Health Information Request Status |

### Gateway & Bridge

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | Get OIDC Discovery Document |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}` | Find Bridge Service by Service ID |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | List All Bridge Services |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | Update HIP/HIU Bridge Callback URL |
| `GET` | `/api/hiecm/gateway/v3/certs` | Get Gateway JWKS Certificates |

### Provider directory

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/govt-programs` | List government programs |
| `GET` | `/api/hiecm/gateway/v3/health-lockers` | List health-locker-enabled providers |
| `GET` | `/api/hiecm/gateway/v3/providers` | List providers by name |
| `GET` | `/api/hiecm/gateway/v3/providers/{provider-id}` | Get a provider by id |

### Session and tokens

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api/hiecm/gateway/v3/sessions` | Create a session and get an access token |

### webhooks

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api/v3/consent/request/hip/notify` | The patient's decision, sent to the record holder |
| `POST` | `/api/v3/hiu/consent/on-fetch` | The consent artefact detail, fetched by artefact id |
| `POST` | `/api/v3/hiu/consent/request/notify` | The patient's decision, sent to the requester |
| `POST` | `/api/v3/hiu/consent/request/on-init` | The consent request was accepted, with its request id |
| `POST` | `/api/v3/hiu/consent/request/on-status` | The consent manager reports the state of a consent request you asked about. |
| `POST` | `/api/v3/hiu/health-information/on-request` | Acknowledgement of a health information request |
| `POST` | `/health-information/transfer` | The encrypted health data itself, pushed to the URL you supplied |

## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | A fresh UUID that you generate for this request. The callback that answers it carries the same value. In M3 a… |
| `TIMESTAMP` | The current time in ISO 8601 UTC, with milliseconds and the `Z` suffix. The gateway rejects a request whose t… |
| `X-CM-ID` | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. |
| `X-HIU-ID` | Identifier of the health information user the request or callback is intended for. |

## A request, in full

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

## Errors

### Codes

Code, message and error name are as published. The action column reads the message text by a documented rule, and says Unclassified where the rule could not classify one.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1000` | Unable to connect the database | Retry |
| `ABDM-1001` | Subscription source update returned empty | Unclassified |
| `ABDM-1002` | Invalid frequency unit, it must be in HOUR, WEEK, DAY, MONTH, YEAR | Fix request |
| `ABDM-1003` | Email Gateway is unavailable | Retry |
| `ABDM-1004` | SMS Gateway is unavailable | Retry |
| `ABDM-1005` | Invalid receiver | Fix request |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecor… | Fix request |
| `ABDM-1007` | Connection failed due to timeout | Retry |
| `ABDM-1008` | SMS service currently disabled | Unclassified |
| `ABDM-1009` | Email service currently disabled | Unclassified |
| `ABDM-1010` | No pending care context found for this abha address | Unclassified |
| `ABDM-1011` | Gateway database unavailable | Retry |
| `ABDM-1012` | No records found against the ABHA Address | Unclassified |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1014` | Invalid Mobile Email | Fix request |
| `ABDM-1015` | Invalid Response | Fix request |
| `ABDM-1016` | Invalid Timestamp | Fix request |
| `ABDM-1017` | Invalid Transaction Id | Fix request |
| `ABDM-1018` | Share Profile database unavailable | Retry |
| `ABDM-1019` | Dependent Service Unavailable | Retry |
| `ABDM-1020` | Unknown database | Unclassified |
| `ABDM-1021` | Lack of required priviledges | Fix request |
| `ABDM-1022` | Too many requests | Retry |
| `ABDM-1023` | Invalid User | Fix request |
| `ABDM-1024` | Dependent service unavailable | Retry |
| `ABDM-1025` | Invalid ServiceId | Fix request |
| `ABDM-1026` | Bridge Id not found | Fix request |
| `ABDM-1027` | You are blocked. Please try again after 24 hours. | Cannot proceed |
| `ABDM-1028` | HIP is unavailable | Retry |
| `ABDM-1029` | Redis server is unavailable | Retry |
| `ABDM-1030` | Request id not found | Fix request |
| `ABDM-1031` | Invalid reason. Reason should not be null or empty and should contains only alphabets, dot(.) and comma(,) | Fix request |
| `ABDM-1032` | Invalid header | Fix request |
| `ABDM-1033` | HIU is unavailable | Retry |
| `ABDM-1034` | Notification service unavailable | Retry |
| `ABDM-1035` | OTP does not matched | Unclassified |
| `ABDM-1039` | Invalid Consent request id | Cannot proceed |
| `ABDM-1040` | Invalid Locker ID | Fix request |
| `ABDM-1041` | Invalid Acknowledgement | Fix request |
| `ABDM-1046` | Invalid Purpose | Fix request |
| `ABDM-1047` | Purpose does not exist | Fix request |
| `ABDM-1048` | Timeout | Retry |
| `ABDM-1051` | Invalid ABHA Number or ABHA Address | Fix request |
| `ABDM-1054` | Invalid Subscription Request Id | Fix request |
| `ABDM-1057` | Invalid Care Contexts | Fix request |
| `ABDM-1058` | Invalid HI Types | Fix request |
| `ABDM-1060` | Invalid Patient Reference Number | Fix request |
| `ABDM-1061` | Consent artefact expired | Cannot proceed |
| `ABDM-1062` | ABHA number mismatch with Link token), | Fix request |
| `ABDM-1063` | HIP Id mismatch with Link token | Fix request |
| `ABDM-1064` | request with this request id already exists | Fix request |
| `ABDM-1065` | Health facility does not exist | Fix request |
| `ABDM-1070` | Duplicate consent request | Cannot proceed |
| `ABDM-1071` | User doesn't belongs to same organisation | Unclassified |
| `ABDM-1072` | Included source size must be at least 1 | Unclassified |
| `ABDM-1074` | HIP object cannot be null in excluded sources | Fix request |
| `ABDM-1075` | HIP object cannot be null in included sources | Fix request |
| `ABDM-1077` | Auto approval policy id doesn't exist. | Unclassified |
| `ABDM-1078` | Failed to upload documents | Unclassified |
| `ABDM-1079` | Auto approval id is already disabled | Fix request |
| `ABDM-1080` | Subscription request may be already approved or denied | Fix request |
| `ABDM-1081` | Please upload registration certificate of your organisation | Unclassified |
| `ABDM-1082` | Please upload authority letter from your organisation | Unclassified |
| `ABDM-1083` | User doesn't belongs to same organisation | Unclassified |
| `ABDM-1084` | The Details fetched from Aadhaar is not matching with our database. Please select the correct details to proc… | Unclassified |
| `ABDM-1085` | ABHA number mismatch with X Auth token | Fix request |
| `ABDM-1099` | Invalid event Id, it cannot be null | Fix request |
| `ABDM-1100` | You have requested multiple OTPs Or Exceeded maximum number of attempts for OTP match in this transaction. Pl… | Retry |
| `ABDM-1112` | The provided gender does not match the gender in DigiLocker records | Unclassified |
| `ABDM-1113` | Duplicate health information provider data flow response data flow resoponse | Fix request |
| `ABDM-1116` | generate_and_save_link_token : 'NoneType' object has no attribute 'get' | Unclassified |
| `ABDM-1117` | Auto approval id is already active | Fix request |
| `ABDM-1118` | Login via ABHA Number OTP is not allowed | Fix request |
| `ABDM-1119` | Login via Aadhaar OTP is not allowed | Fix request |
| `ABDM-1120` | No care context is available for this patient. | Unclassified |
| `ABDM-1144` | Incorrect facility ID or password. | Fix request |
| `ABDM-1145` | Subscription is already disabled | Fix request |
| `ABDM-1146` | Subscription is not in revoked state | Unclassified |
| `ABDM-1147` | Subscription is not in granted state | Unclassified |
| `ABDM-1148` | Subscription id does not belong to the patient | Unclassified |
| `ABDM-1151` | Health locker is already setup for the user | Fix request |
| `ABDM-1152` | Subscription not found for the locker | Fix request |
| `ABDM-1153` | Unable to create Consent Auto Approval for the health locker | Cannot proceed |
| `ABDM-1154` | Unable to save user health locker | Unclassified |
| `ABDM-1170` | Invalid ABHA address | Fix request |
| `ABDM-1401` | Your mobile number is not linked to the ABHA number. Please update your mobile number in ABHA or try to regis… | Unclassified |
| `ABDM-1402` | Transaction Id is not matching with response | Unclassified |
| `ABDM-1403` | As per NHA policy, you have exceeded ABHA address creation limit, please link your ABHA address to ABHA numbe… | Unclassified |
| `ABDM-1404` | Patient record share detail not found | Fix request |
| `ABDM-1405` | Invalid health information status | Fix request |
| `ABDM-1406` | Invalid session status, Status should be TRANSFERRED, PARTIAL_TRANSFERRED or FAILED | Fix request |
| `ABDM-1407` | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it. | Cannot proceed |
| `ABDM-1408` | Invalid API sequence flow, please follow logical flow | Fix request |
| `ABDM-8877` | HIP did not acknowledge the HIP consent notify. Please try again after some time | Cannot proceed |
| `ABDM-9999` | Invalid purpose text, it must be in Care Management, Break the Glass, Public Health, Healthcare Payment, Dise… | Fix request |

A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.

## Test cases

16 cases, from NHA's M3 matrix for Consent management and health record fetch. "Mandatory" is NHA's own marking.

### Consent request

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `CNS_01` | Core path | Raise a consent request for a patient's previous records | `null /api/hiecm/consent/v3/request/init` | You receive an on-init callback carrying a consent request id. |
| `CNS_02` | Core path | Poll the request status before the patient acts | `null /api/hiecm/consent/v3/request/status` | Status comes back `Requested`. |
| `CNS_03` | Edge path | Handle a consent request that produces no on-init callback at all | `null /api/hiecm/consent/v3/request/init` | The on-init callback arrives at your registered URL. Nothing arriving means the URL is not registered or not … |
| `CNS_04` | Coverage | Send one consent request per purpose of use code you will use in production | `null /api/hiecm/consent/v3/request/init` | Each code is accepted and reaches the patient's PHR app. |
| `CNS_05` | Coverage | Send one consent request per HI type you will display | `null /api/hiecm/consent/v3/request/init` | Each type is accepted, and your system renders what comes back for it. |

### Consent grant and denial

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `GRT_01` | Core path | Receive a grant and acknowledge the consent artefact ids | `null /api/hiecm/consent/v3/request/hiu/on-notify` | You receive a notify callback with one or more consent artefact ids and the request id. |
| `GRT_02` | Core path | Handle a denial on a second request | webhook `/api/v3/hiu/consent/request/notify` | You receive a notify callback with status `Denied` and no artefact ids. |
| `GRT_03` | Edge path | Handle a grant that produces more than one artefact | `null /api/hiecm/consent/v3/fetch` | Every artefact id in the notify callback is fetched and used, not only the first. |

### Consent artefact handling

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `ART_01` | Core path | Fetch a consent artefact by id | `null /api/hiecm/consent/v3/fetch` | You receive an on-fetch callback for the artefact id you quoted. |
| `ART_02` | Edge path | Stop fetching once the consent has expired | `null /api/hiecm/consent/v3/fetch` | The fetch fails and your code stops, rather than retrying forever. |

### Data fetch

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `DAT_01` | Core path | Request the health information under a granted consent | `null /api/hiecm/data-flow/v3/health-information/request` | You receive an on-request callback with a transaction id, request id and status. |
| `DAT_02` | Core path | Receive the encrypted records |  | Encrypted records arrive at the data push callback URL you supplied. |
| `DAT_03` | Core path | Decrypt the records and render them |  | The records read as FHIR content your system can display, as plain text or structured output. |
| `DAT_04` | Edge path | Render a partial result when only some requested HI types exist | `null /api/hiecm/data-flow/v3/health-information/request` | The types that exist render. Your system does not treat the missing ones as a failure. |
| `DAT_05` | Core path | Notify receipt and close the transaction | `null /api/hiecm/data-flow/v3/health-information/notify` | You call health information notify and the transaction closes. |

### Consent revocation

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `REV_01` | Edge path | Stop fetching once the patient revokes consent | `null /api/hiecm/consent/v3/fetch` | The fetch fails and your system stops. Access ends from the point of revocation. |

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m3
- The flows as diagrams: /docs/hiecm/v3/milestones/m3
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
