---
name: abdm-m2
description: Use when building, debugging or testing ABDM Milestone 2: care contexts, HIP initiated linking, discovery, and pushing encrypted health records to a requester. Carries the endpoints, the prerequisites, every recorded error code and the M2 test matrix.
---

# ABDM M2, linking and sharing

Generated from the ABDM Developer Portal on 2026-09-09, catalogue version 2026.08.24. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.

This file is a snapshot. Re-download it from https://nha-in.github.io/docs/pr-9/skills/abdm-m2/SKILL.md when it is older than the work you are doing.
If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.

## What this skill covers

- **Integrate.** 31 operations, with their hosts and headers.
- **Debug.** 120 recorded error codes, with the message and what to do.
- **Test.** 10 test cases, each with the call it makes and what to see when it passes.

## Before anything else

- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.
- You act as the HIP. NHA requires a valid Facility ID and registration in the HIP role before you can create health records and share them.
- M2 is keyed to an ABHA address, so a working M1 integration comes first.
- Hold a link token per patient, stored at registration. NHA gives its validity as six months and says to validate it before use. If you hold no valid one, regenerate it using demographic authentication.
- Records go out as FHIR R4 conforming to the ABDM profiles at https://nrces.in/ndhm/fhir/r4/index.html.
- Four callbacks name a path and carry no payload in either of NHA sources: discovery, link init, link confirm and consent notify. Do not assume a body for those.

## Hosts

- `https://dev.abdm.gov.in` Sandbox. Pair it with the `X-CM-ID: sbx` header.
- `https://apis.abdm.gov.in` Production. Pair it with the `X-CM-ID: abdm` header.
- `https://dev.abdm.gov.in/api` ABDM Gateway (Dev / Sandbox)
- `https://apihspsbx.abdm.gov.in` HSP Registry (Sandbox)

## Endpoints

31 operations, grouped by the journey they belong to.

### bridge

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/v4/int/v1/bridges/MutipleHRPAddUpdateServices` | Register / Update Bridge Services (HIU) |

### data-transfer

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/consent/v3/request/hip/on-notify` | Acknowledge a consent notification |
| `POST` | `/hiecm/data-flow/v3/health-information/hip/on-request` | Acknowledge a health information data request |
| `POST` | `/hiecm/data-flow/v3/health-information/notify` | Notify the gateway that a data transfer finished |

### deep-linking

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/hip/v3/link/patient/links/sms/notify2` | Send an SMS with a deep link to the ABHA App |

### Gateway & Bridge

| Method | Path | What it does |
| --- | --- | --- |
| `GET` | `/api/hiecm/gateway/v3/.well-known/openid-configuration` | Get OIDC Discovery Document |
| `GET` | `/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}` | Find Bridge Service by Service ID |
| `GET` | `/api/hiecm/gateway/v3/bridge-services` | List All Bridge Services |
| `PATCH` | `/api/hiecm/gateway/v3/bridge/url` | Update HIP/HIU Bridge Callback URL |
| `GET` | `/api/hiecm/gateway/v3/certs` | Get Gateway JWKS Certificates |

### hip-linking

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/hip/v3/link/carecontext` | Link care contexts to an ABHA address |
| `POST` | `/hiecm/hip/v3/link/context/notify` | Link Care Context Notify |
| `POST` | `/hiecm/v3/token/generate-token` | Generate Link Token |

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

### user-linking

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/hiecm/user-initiated-linking/v3/link/care-context/on-confirm` | Link On-Confirm, HIP confirms linked care contexts |
| `POST` | `/hiecm/user-initiated-linking/v3/link/care-context/on-init` | Link On-Init, HIP responds with OTP communication details |
| `POST` | `/hiecm/user-initiated-linking/v3/patient/care-context/on-discover` | On Discovery, HIP responds with found care contexts |

### webhooks

| Method | Path | What it does |
| --- | --- | --- |
| `POST` | `/api-hiu/data/notification` | The provider pushes encrypted health information to the URL named in the reques… |
| `POST` | `/api/v3/hip/health-information/request` | A request for the records a consent covers |
| `POST` | `/api/v3/hip/link/care-context/confirm` | Confirmation of a link, carrying the token the patient approved |
| `POST` | `/api/v3/hip/link/care-context/init` | A request to start linking a care context |
| `POST` | `/api/v3/hip/patient/care-context/discover` | A discovery request for a patient you may hold records for |
| `POST` | `/v0.5/consents/hiu/notify` | A consent notification to an HIU bridge |
| `POST` | `/v3/hip/token/on-generate-token` | The link token m2_generate_link_token generated, or why it failed |
| `POST` | `/v3/link/on_carecontext` | The outcome of a care context linking call you made |
| `POST` | `/v3/links/context/on-notify` | The outcome of a care context notify call you made |
| `POST` | `/v3/patients/sms/on-notify` | The outcome of an SMS deep link notify call you made |

## Headers

| Header | What it is |
| --- | --- |
| `REQUEST-ID` | A fresh UUID that you generate for this request. The callback that answers it carries the same value, so this… |
| `TIMESTAMP` | The current time in ISO 8601, UTC, with milliseconds and a `Z` suffix, from a synchronised clock. The sandbox… |
| `X-CM-ID` | Which consent manager you are talking to. `sbx` on the sandbox and `abdm` in production. A dedicated error co… |
| `X-HIP-ID` | Identifier of the Health Information Provider the request or callback belongs to. |
| `X-Link-Token` | Short-lived link token generated via POST /hiecm/v3/token/generate-token |

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

Code, message and error name are as published. The action column reads the message text by a documented rule, and says Unclassified rather than guessing.

| Code | Message | What to do |
| --- | --- | --- |
| `ABDM-1000` | Unable to connect the database | Retry |
| `ABDM-1001` | No data found | Fix request |
| `ABDM-1004` | SMS Gateway is unavailable | Retry |
| `ABDM-1006` | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecor… | Fix request |
| `ABDM-1006` | Bad Request, invalid request Body | Fix request |
| `ABDM-1006` | Invalid combinations of scopes | Fix request |
| `ABDM-1006` | Invalid count, must be 2 digit and ranges between 1 to 20 | Fix request |
| `ABDM-1007` | Connection failed due to timeout | Retry |
| `ABDM-1008` | SMS service currently disabled | Retry |
| `ABDM-1010` | Validation failed | Fix request |
| `ABDM-1011` | Gateway database unavailable | Retry |
| `ABDM-1012` | No records found against the ABHA Address | Fix request |
| `ABDM-1013` | Invalid ABHA Number | Fix request |
| `ABDM-1015` | Invalid Response | Fix request |
| `ABDM-1016` | Invalid TimeStamp | Fix request |
| `ABDM-1017` | Invalid TransactionId | Fix request |
| `ABDM-1018` | Share Profile database unavailable | Retry |
| `ABDM-1019` | Dependent Service Unavailable | Retry |
| `ABDM-1020` | Unknown database | Retry |
| `ABDM-1022` | Too many requests | Back off |
| `ABDM-1023` | Invalid User | Fix request |
| `ABDM-1024` | Dependent service unavailable | Retry |
| `ABDM-1025` | Invalid ServiceId | Fix request |
| `ABDM-1026` | Invalid Link Token | Fix auth |
| `ABDM-1027` | You are blocked. Please try again after 24 hours. | Blocked, no retry |
| `ABDM-1028` | HIP is unavailable | Chase the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) |
| `ABDM-1029` | Redis server is unavailable | Retry |
| `ABDM-1030` | Invalid request ID | Fix request |
| `ABDM-1030` | Request id not found | Fix request |
| `ABDM-1031` | Invalid request | Fix request |
| `ABDM-1032` | Invalid header | Fix request |
| `ABDM-1033` | HIU is unavailable | Chase the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) |
| `ABDM-1034` | Notification service unavailable | Retry |
| `ABDM-1035` | Invalid HIP ID | Fix request |
| `ABDM-1036` | Data does not matched | Fix request |
| `ABDM-1037` | Counter and Care context count mismatch | Fix request |
| `ABDM-1038` | ABHA address and Link token mismatch | Fix auth |
| `ABDM-1040` | Invalid HIU ID | Fix request |
| `ABDM-1041` | Invalid Acknowledgement | Fix request |
| `ABDM-1042` | Provider Mandatory | Fix request |
| `ABDM-1043` | ABHA Address does not match with KYC details. | Fix request |
| `ABDM-1044` | Broadcast Failed | Retry |
| `ABDM-1045` | Database Access is restricted | Retry |
| `ABDM-1046` | Invalid Purpose | New consent |
| `ABDM-1047` | Purpose does not exist | New consent |
| `ABDM-1048` | Timeout | Retry |
| `ABDM-1049` | Invalid Profile Share Intent Keys | Ask support |
| `ABDM-1050` | Invalid Profile Share Metadata Keys | Ask support |
| `ABDM-1051` | Invalid ABHA Number or ABHA Address | Fix request |
| `ABDM-1052` | Invalid TransactionId or response's requestId | Fix request |
| `ABDM-1055` | Invalid HIP Id or PHR Id | Fix request |
| `ABDM-1056` | This care contexts has been already linked | Treat as success |
| `ABDM-1056` | Invalid Link Reference Number | Fix request |
| `ABDM-1057` | Invalid Care Contexts | Fix request |
| `ABDM-1059` | Invalid Care Contexts count | Fix request |
| `ABDM-1060` | Invalid Patient Reference Number | Fix request |
| `ABDM-1061` | Invalid Patient Display | Fix request |
| `ABDM-1061` | Consent artefact expired | New consent |
| `ABDM-1062` | ABHA number mismatch with Link token | Fix auth |
| `ABDM-1062` | Consent Not granted | New consent |
| `ABDM-1063` | HIP Id mismatch with Link token | Fix auth |
| `ABDM-1063` | Date Range given is invalid | New consent |
| `ABDM-1064` | request with this request id already exists | New request id |
| `ABDM-1064` | Request body was missing | Fix request |
| `ABDM-1065` | Invalid X Auth token | Fix auth |
| `ABDM-1066` | Invalid JWT token | Fix auth |
| `ABDM-1067` | Request body not required | Fix request |
| `ABDM-1084` | ABHA address mismatch with X Auth token | Fix auth |
| `ABDM-1085` | ABHA number mismatch with X Auth token | Fix auth |
| `ABDM-1086` | Patient profile mismatch with X Auth token | Fix auth |
| `ABDM-1087` | Duplicate patient share request | New request id |
| `ABDM-1090` | Duplicate HIP link request | New request id |
| `ABDM-1091` | Duplicate Get links request | New request id |
| `ABDM-1092` | Duplicate Link token request | New request id |
| `ABDM-1093` | Duplicate Bridge request | New request id |
| `ABDM-1094` | Duplicate bridge patch request | New request id |
| `ABDM-1095` | Duplicate Bridge service request | New request id |
| `ABDM-1102` | Profile information cannot be null | Ask support |
| `ABDM-1103` | Duplicate Discovery request | New request id |
| `ABDM-1104` | Duplicate Init request | New request id |
| `ABDM-1105` | Duplicate Confirm request | New request id |
| `ABDM-1106` | Duplicate On discovery request | New request id |
| `ABDM-1107` | Duplicate On init request | New request id |
| `ABDM-1108` | Duplicate On confirm request | New request id |
| `ABDM-1108` | Notification DB service unavailable | Retry |
| `ABDM-1109` | Invalid On discovery response | Fix request |
| `ABDM-1109` | ABHA DB service unavailable | Retry |
| `ABDM-1110` | Invalid On init response | Fix request |
| `ABDM-1111` | Invalid On confirm response | Fix request |
| `ABDM-1112` | Invalid or already expired consent artefact id | New consent |
| `ABDM-1113` | Duplicate health information provider data flow response | New request id |
| `ABDM-1149` | Intent type is not supported at HIP end | Fix request |
| `ABDM-1150` | Bridge API version cannot be null | Ask support |
| `ABDM-1170` | Invalid ABHA address | Fix request |
| `ABDM-1201` | IDP Gateway is unavailable | Retry |
| `ABDM-1401` | HIP is not available | Chase the HIP |
| `ABDM-1402` | Acknowledgement is not received from HIP | Chase the HIP |
| `ABDM-1407` | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it. | Fix request |
| `ABDM-2401` | The X Auth token is invalid. | Fix auth |
| `ABDM-2402` | Invalid Timestamp | Fix request |
| `ABDM-2403` | Invalid X-CM-ID | Fix request |
| `ABDM-2404` | Invalid Request Id | Fix request |
| `ABDM-2406` | Invalid API sequence flow, please follow logical flow | Fix request |
| `ABDM-2406` | The status is invalid. Please follow the logical status flow or transition. | Fix request |
| `ABDM-2429` | Too many requests found | Back off |
| `ABDM-2500` | Authorization header is missing | Fix auth |
| `ABDM-2500` | No mapping found for | Fix request |
| `ABDM-2501` | Payment status should be : `SUCCESS,CANCELED,PENDING,FAIL,REFUND_INITIATED,REFUND_SUCCESS | Ask support |
| `ABDM-9001` | No open order against ABHA. Please ensure a minimum of one open order | Ask support |
| `ABDM-9002` | No registration found at `<<hospital name>>`. Contact counter support | Ask support |
| `ABDM-9003` | Hospital services temporarily unavailable. Please try again after some time. | Retry |
| `ABDM-9004` | Services disrupted, please try again. | Retry |
| `ABDM-9005` | Bank server not responding. Please try again later | Ask support |
| `ABDM-9006` | Service details mismatch. Please ensure original service ID from HMIS | Ask support |
| `ABDM-9007` | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration. | Ask support |
| `ABDM-9999` | HIP is unable to generate a token at this time. Please try again later. | Chase the HIP |
| `ABDM-9999` | HIP is unable to process at this time. Please try again later. | Chase the HIP |
| `ABDM-9999` | Unknown exception | Retry |
| `ABDM-9999` | Cannot process the request at the moment, please try later. | Retry |
| `ABDM-9999` | User not found | Retry |

A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.

## Test cases

10 cases, from NHA's M2 matrix for Care context linking and data sharing. "Mandatory" is NHA's own marking.

### HIP initiated linking

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `LNK_01` | Mandatory | Group every new record into a care context |  | Two visits for one patient show as two entries in a PHR app, each named so the patient knows which visit it w… |
| `LNK_02` | Mandatory | Store the link token at registration and validate it before every use |  | Linking works while the token is valid. An expired or missing token triggers regeneration, not a link attempt. |
| `LNK_03` | Mandatory | Link a care context for a patient who gave you their ABHA address |  | The link is acknowledged and the record appears in the patient's PHR app with no action from the patient. |

### Notification to mobile

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `NTF_01` | Conditional | Tell NHA a record is ready for a patient who has no ABHA address |  | The patient receives an SMS with a link that opens a PHR app, or offers to install one. |

### Discovery and user initiated linking

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `DSC_01` | Mandatory | Match an inbound discovery request and return the patient's care contexts | webhook `[object Object]` | A patient who has visited your facility sees their visits, named recognisably. A patient who has never visite… |

### Data request and transfer

| Case | Type | What it proves | Call | Passes when |
| --- | --- | --- | --- | --- |
| `DAT_01` | Mandatory | Validate a FHIR bundle against the NRCeS implementation guide |  | The validator reports no structural or profile error, for one bundle per HI type you support. |
| `DAT_02` | Mandatory | Refuse a health information request that falls outside the consent | webhook `[object Object]` | Nothing is sent, and the failure carries the matching error code. |
| `DAT_03` | Mandatory | Encrypt a bundle so only the requester can read it |  | Decrypting your output with the matching private key returns the original bundle byte for byte. |
| `DAT_04` | NHA procedure | Deliver a record you created to the ABHA PHR app end to end |  | The record displays, readable, in the ABHA PHR app, without you touching the app in between. |
| `DAT_05` | Mandatory | Close the transfer with a completion notification, inside the timeout | `null health-information/notify` | A transfer that succeeded is recorded as succeeded on both sides, within 20 minutes of the request arriving. |

## Where the detail is

- Every endpoint, with its body fields and responses: /docs/hiecm/v3/api/m2
- The flows as diagrams: /docs/hiecm/v3/milestones/m2
- Every error code across modules: /docs/hiecm/v3/reference/error-codes
- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary
- Terms: /docs/hiecm/v3/getting-started/glossary
