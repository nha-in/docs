---
title: M2 errors
sidebar_label: Errors
sidebar_position: 5
description: NHA's custom error codes for the M2 flows, grouped, with what the list does and does not tell you.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md
---

# M2 errors

[NHA](/docs/overview/glossary#nha)'s Milestone 2 (M2) document ends with a list of custom error codes covering discovery, linking, consent, encryption and data exchange. This page reproduces that list, grouped by the part of [ABDM](/docs/overview/glossary#abdm) each code belongs to, and states plainly what the list leaves out.

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 2. Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## Read this before you use the table

Four honest limits on what follows.

1. **Codes and messages only.** NHA's section introduces itself as covering causes and recommended resolutions. The table it then gives has two columns: the code and the message. Causes and resolutions are not in the document. Where a row below carries advice, that advice comes from the flow description elsewhere in the same document, not from the error table.
2. **These are application codes, not HTTP statuses.** The document does not map them to status codes.
3. **No endpoint mapping.** The document does not say which code comes from which call. The grouping below is ours, inferred from the message text.
4. **The same code appears with different messages.** This is in NHA's own list, not a conversion artefact. Do not branch on the code alone. Log the code and the message together, and match on both.

## Codes that repeat

These codes carry more than one meaning in NHA's list. Every meaning listed is NHA's.

| Code | Meanings in the same list |
|---|---|
| ABDM-1006 | Bad Request, invalid request Body / Invalid combinations of scopes / Invalid count, must be 2 digit and ranges between 1 to 20 / Invalid HIType |
| ABDM-1030 | Invalid request ID / Request id not found |
| ABDM-1056 | This care contexts has been already linked / Invalid Link Reference Number |
| ABDM-1061 | Consent artefact expired / Invalid Patient Display |
| ABDM-1062 | Consent Not granted / ABHA number mismatch with Link token |
| ABDM-1063 | Date Range given is invalid / HIP Id mismatch with Link token |
| ABDM-1064 | request with this request id already exists / Request body was missing |
| ABDM-1108 | Notification DB service unavailable / Duplicate On confirm request |
| ABDM-1109 | ABHA DB service unavailable / Invalid On discovery response |
| ABDM-2406 | Invalid API sequence flow, please follow logical flow / The status is invalid. Please follow the logical status flow or transition. |
| ABDM-2500 | No mapping found for / Authorization header is missing |
| ABDM-9999 | Unknown exception / HIP is unable to generate a token at this time. Please try again later. / HIP is unable to process at this time. Please try again later. / User not found / Cannot process the request at the moment, please try later. |

The consent codes are the ones to watch. ABDM-1061, ABDM-1062 and ABDM-1063 each mean one thing in the consent and data flow and something completely different in linking.

## Linking and care contexts

| Code | Message |
|---|---|
| ABDM-1026 | Invalid Link Token |
| ABDM-1037 | Counter and Care context count mismatch |
| ABDM-1038 | ABHA address and Link token mismatch |
| ABDM-1055 | Invalid HIP Id or PHR Id |
| ABDM-1056 | This care contexts has been already linked |
| ABDM-1056 | Invalid Link Reference Number |
| ABDM-1057 | Invalid Care Contexts |
| ABDM-1059 | Invalid Care Contexts count |
| ABDM-1060 | Invalid Patient Reference Number |
| ABDM-1061 | Invalid Patient Display |
| ABDM-1062 | ABHA number mismatch with Link token |
| ABDM-1063 | HIP Id mismatch with Link token |
| ABDM-1090 | Duplicate HIP link request |
| ABDM-1091 | Duplicate Get links request |
| ABDM-1092 | Duplicate Link token request |
| ABDM-1149 | Intent type is not supported at HIP end |

The three mismatch codes, ABDM-1038, ABDM-1062 and ABDM-1063, all say the same thing about your data: the [link token](/docs/overview/glossary#link-token) you sent belongs to a different patient or a different facility than the request it came with. Decode the token and compare it against what you sent before you retry.

ABDM-1026 is the expired token case. NHA's validity is six months. Regenerate through demographic authentication.

## Discovery and link

| Code | Message |
|---|---|
| ABDM-1012 | No records found against the ABHA Address |
| ABDM-1036 | Data does not matched |
| ABDM-1103 | Duplicate Discovery request |
| ABDM-1104 | Duplicate Init request |
| ABDM-1105 | Duplicate Confirm request |
| ABDM-1106 | Duplicate On discovery request |
| ABDM-1107 | Duplicate On init request |
| ABDM-1108 | Duplicate On confirm request |
| ABDM-1109 | Invalid On discovery response |
| ABDM-1110 | Invalid On init response |
| ABDM-1111 | Invalid On confirm response |

The six duplicate codes are the reason to generate a fresh request ID for every attempt. A retry that reuses the previous request ID is rejected as a duplicate rather than treated as a retry.

## Consent and data flow

| Code | Message |
|---|---|
| ABDM-1006 | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice |
| ABDM-1041 | Invalid Acknowledgement |
| ABDM-1046 | Invalid Purpose |
| ABDM-1047 | Purpose does not exist |
| ABDM-1061 | Consent artefact expired |
| ABDM-1062 | Consent Not granted |
| ABDM-1063 | Date Range given is invalid |
| ABDM-1112 | Invalid or already expired consent artefact id |
| ABDM-1113 | Duplicate health information provider data flow response |
| ABDM-1402 | Acknowledgement is not received from HIP |

ABDM-1061, ABDM-1062 and ABDM-1112 sit on the consent check you run before a transfer. ABDM-1063 sits on the date range check. NHA's list carries nothing for the third check, the encryption parameters. See the validation step on the [API sequence](/docs/api/hie-cm/m2/api-sequence) page.

The ABDM-1006 [HI type](/docs/overview/glossary#hi-type) message is the only place in NHA's document where the accepted HI type strings appear as literal values. Use those spellings.

## Availability of the other party

| Code | Message |
|---|---|
| ABDM-1028 | HIP is unavailable |
| ABDM-1033 | HIU is unavailable |
| ABDM-1035 | Invalid HIP ID |
| ABDM-1040 | Invalid HIU ID |
| ABDM-1042 | Provider Mandatory |
| ABDM-1044 | Broadcast Failed |
| ABDM-1401 | HIP is not available |
| ABDM-9999 | HIP is unable to generate a token at this time. Please try again later. |
| ABDM-9999 | HIP is unable to process at this time. Please try again later. |

The [HIP](/docs/overview/glossary#hip) codes here are what other participants see when your endpoints do not answer, so they will not appear in your own logs. Alert on your own endpoint uptime instead. The [HIU](/docs/overview/glossary#hiu) codes are ones you do see, when the party you are pushing data to is not answering.

## Tokens, headers and identity

| Code | Message |
|---|---|
| ABDM-1013 | Invalid ABHA Number |
| ABDM-1016 | Invalid TimeStamp |
| ABDM-1017 | Invalid TransactionId |
| ABDM-1023 | Invalid User |
| ABDM-1025 | Invalid ServiceId |
| ABDM-1030 | Invalid request ID |
| ABDM-1030 | Request id not found |
| ABDM-1032 | Invalid header |
| ABDM-1043 | ABHA Address does not match with KYC details. |
| ABDM-1051 | Invalid ABHA Number or ABHA Address |
| ABDM-1052 | Invalid TransactionId or response's requestId |
| ABDM-1064 | request with this request id already exists |
| ABDM-1065 | Invalid X Auth token |
| ABDM-1066 | Invalid JWT token |
| ABDM-1084 | ABHA address mismatch with X Auth token |
| ABDM-1085 | ABHA number mismatch with X Auth token |
| ABDM-1086 | Patient profile mismatch with X Auth token |
| ABDM-1170 | Invalid ABHA address |
| ABDM-1201 | IDP Gateway is unavailable |
| ABDM-1407 | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it. |
| ABDM-2401 | The X Auth token is invalid. |
| ABDM-2402 | Invalid Timestamp |
| ABDM-2403 | Invalid X-CM-ID |
| ABDM-2404 | Invalid Request Id |
| ABDM-2500 | Authorization header is missing |

## Request format and sequence

| Code | Message |
|---|---|
| ABDM-1006 | Bad Request, invalid request Body |
| ABDM-1006 | Invalid combinations of scopes |
| ABDM-1006 | Invalid count, must be 2 digit and ranges between 1 to 20 |
| ABDM-1010 | Validation failed |
| ABDM-1015 | Invalid Response |
| ABDM-1031 | Invalid request |
| ABDM-1064 | Request body was missing |
| ABDM-1067 | Request body not required |
| ABDM-2406 | Invalid API sequence flow, please follow logical flow |
| ABDM-2406 | The status is invalid. Please follow the logical status flow or transition. |
| ABDM-2500 | No mapping found for |

ABDM-2406 is the one to read carefully. It means the call itself was well formed and arrived out of order. Go back to the [API sequence](/docs/api/hie-cm/m2/api-sequence) page and check what should have come first.

## Rate limits and blocking

| Code | Message |
|---|---|
| ABDM-1022 | Too many requests |
| ABDM-2429 | Too many requests found |
| ABDM-1027 | You are blocked. Please try again after 24 hours. |

ABDM-1027 is a 24 hour block, not a retryable failure. Retrying through it makes the wait longer, not shorter.

## Infrastructure and dependencies

These are NHA side failures. Retry with backoff. None of them are fixed by changing your payload.

| Code | Message |
|---|---|
| ABDM-1000 | Unable to connect the database |
| ABDM-1001 | No data found |
| ABDM-1004 | SMS Gateway is unavailable |
| ABDM-1007 | Connection failed due to timeout |
| ABDM-1008 | SMS service currently disabled |
| ABDM-1011 | Gateway database unavailable |
| ABDM-1018 | Share Profile database unavailable |
| ABDM-1019 | Dependent Service Unavailable |
| ABDM-1020 | Unknown database |
| ABDM-1024 | Dependent service unavailable |
| ABDM-1029 | Redis server is unavailable |
| ABDM-1034 | Notification service unavailable |
| ABDM-1045 | Database Access is restricted |
| ABDM-1048 | Timeout |
| ABDM-1108 | Notification DB service unavailable |
| ABDM-1109 | ABHA DB service unavailable |
| ABDM-9003 | Hospital services temporarily unavailable. Please try again after some time. |
| ABDM-9004 | Services disrupted, please try again. |
| ABDM-9999 | Unknown exception |
| ABDM-9999 | Cannot process the request at the moment, please try later. |
| ABDM-9999 | User not found |

ABDM-1004 and ABDM-1008 matter for the notification to mobile flow. If NHA's SMS gateway is down, the patient never gets the deep link, and your record stays undiscovered until they try again.

## Codes from other ABDM flows

NHA's M2 error list also carries codes whose messages point at flows other than M2: profile sharing, [bridge](/docs/overview/glossary#bridge) registration, and the scan and pay journey. NHA's document does not say which flow raises which code, so that reading is ours, taken from the message text. Do not treat their absence from your logs as a problem.

| Code | Message |
|---|---|
| ABDM-1049 | Invalid Profile Share Intent Keys |
| ABDM-1050 | Invalid Profile Share Metadata Keys |
| ABDM-1087 | Duplicate patient share request |
| ABDM-1093 | Duplicate Bridge request |
| ABDM-1094 | Duplicate bridge patch request |
| ABDM-1095 | Duplicate Bridge service request |
| ABDM-1102 | Profile information cannot be null |
| ABDM-1150 | Bridge API version cannot be null |
| ABDM-2501 | Payment status should be : `SUCCESS,CANCELED,PENDING,FAIL,REFUND_INITIATED,REFUND_SUCCESS` |
| ABDM-9001 | No open order against ABHA. Please ensure a minimum of one open order |
| ABDM-9002 | No registration found at `<<hospital name>>`. Contact counter support |
| ABDM-9005 | Bank server not responding. Please try again later |
| ABDM-9006 | Service details mismatch. Please ensure original service ID from HMIS |
| ABDM-9007 | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration. |

The `<<hospital name>>` in ABDM-9002 is NHA's own placeholder. The live message carries the facility name.

## What is missing

NHA's M2 document does not give error codes for FHIR bundle validation failures or for encryption failures. The validator command on the [use cases](/docs/api/hie-cm/m2/use-cases) page reports bundle problems locally, before anything reaches NHA. If a transfer fails and no code above explains it, [support](/docs/support) lists the channels for asking NHA directly.
