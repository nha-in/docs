# M2 Health Information Provider errors

Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/pr-75/docs/hiecm/v3/troubleshooting/).

During ABDM integration, systems may encounter issues across discovery, linking, consent, encryption, and data exchange workflows. This section outlines common errors, their causes, and recommended resolutions to help ensure smooth implementation.

## Codes

| Code        | HTTP | Message                                                                                                                                                    | Returned by |
| ----------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `ABDM-1000` |      | Unable to connect the database                                                                                                                             |             |
| `ABDM-1001` |      | No data found                                                                                                                                              |             |
| `ABDM-1004` |      | SMS Gateway is unavailable                                                                                                                                 |             |
| `ABDM-1006` |      | Bad Request, invalid request Body                                                                                                                          |             |
| `ABDM-1007` |      | Connection failed due to timeout                                                                                                                           |             |
| `ABDM-1008` |      | SMS service currently disabled                                                                                                                             |             |
| `ABDM-1010` |      | Validation failed                                                                                                                                          |             |
| `ABDM-1011` |      | Gateway database unavailable                                                                                                                               |             |
| `ABDM-1012` |      | No records found against the ABHA Address                                                                                                                  |             |
| `ABDM-1013` |      | Invalid ABHA Number                                                                                                                                        |             |
| `ABDM-1015` |      | Invalid Response                                                                                                                                           |             |
| `ABDM-1016` |      | Invalid TimeStamp                                                                                                                                          |             |
| `ABDM-1017` |      | Invalid TransactionId                                                                                                                                      |             |
| `ABDM-1018` |      | Share Profile database unavailable                                                                                                                         |             |
| `ABDM-1019` |      | Dependent Service Unavailable                                                                                                                              |             |
| `ABDM-1020` |      | Unknown database                                                                                                                                           |             |
| `ABDM-1022` |      | Too many requests                                                                                                                                          |             |
| `ABDM-1023` |      | Invalid User                                                                                                                                               |             |
| `ABDM-1024` |      | Dependent service unavailable                                                                                                                              |             |
| `ABDM-1025` |      | Invalid ServiceId                                                                                                                                          |             |
| `ABDM-1026` |      | Invalid Link Token                                                                                                                                         |             |
| `ABDM-1027` |      | You are blocked. Please try again after 24 hours.                                                                                                          |             |
| `ABDM-1028` |      | HIP is unavailable                                                                                                                                         |             |
| `ABDM-1029` |      | Redis server is unavailable                                                                                                                                |             |
| `ABDM-1030` |      | Invalid request ID                                                                                                                                         |             |
| `ABDM-1031` |      | Invalid request                                                                                                                                            |             |
| `ABDM-1032` |      | Invalid header                                                                                                                                             |             |
| `ABDM-1033` |      | HIU is unavailable                                                                                                                                         |             |
| `ABDM-1034` |      | Notification service unavailable                                                                                                                           |             |
| `ABDM-1035` |      | Invalid HIP ID                                                                                                                                             |             |
| `ABDM-1036` |      | Data does not matched                                                                                                                                      |             |
| `ABDM-1037` |      | Counter and Care context count mismatch                                                                                                                    |             |
| `ABDM-1038` |      | ABHA address and Link token mismatch                                                                                                                       |             |
| `ABDM-1040` |      | Invalid HIU ID                                                                                                                                             |             |
| `ABDM-1041` |      | Invalid Acknowledgement                                                                                                                                    |             |
| `ABDM-1042` |      | Provider Mandatory                                                                                                                                         |             |
| `ABDM-1043` |      | ABHA Address does not match with KYC details.                                                                                                              |             |
| `ABDM-1044` |      | Broadcast Failed                                                                                                                                           |             |
| `ABDM-1045` |      | Database Access is restricted                                                                                                                              |             |
| `ABDM-1046` |      | Invalid Purpose                                                                                                                                            |             |
| `ABDM-1047` |      | Purpose does not exist                                                                                                                                     |             |
| `ABDM-1048` |      | Timeout                                                                                                                                                    |             |
| `ABDM-1049` |      | Invalid Profile Share Intent Keys                                                                                                                          |             |
| `ABDM-1050` |      | Invalid Profile Share Metadata Keys                                                                                                                        |             |
| `ABDM-1051` |      | Invalid ABHA Number or ABHA Address                                                                                                                        |             |
| `ABDM-1052` |      | Invalid TransactionId or response's requestId                                                                                                              |             |
| `ABDM-1401` |      | HIP is not available                                                                                                                                       |             |
| `ABDM-1061` |      | Consent artefact expired                                                                                                                                   |             |
| `ABDM-1062` |      | Consent Not granted                                                                                                                                        |             |
| `ABDM-1063` |      | Date Range given is invalid                                                                                                                                |             |
| `ABDM-1064` |      | request with this request id already exists                                                                                                                |             |
| `ABDM-1109` |      | ABHA DB service unavailable                                                                                                                                |             |
| `ABDM-1108` |      | Notification DB service unavailable                                                                                                                        |             |
| `ABDM-1201` |      | IDP Gateway is unavailable                                                                                                                                 |             |
| `ABDM-9999` |      | Unknown exception                                                                                                                                          |             |
| `ABDM-1006` |      | Invalid combinations of scopes                                                                                                                             |             |
| `ABDM-1056` |      | This care contexts has been already linked                                                                                                                 |             |
| `ABDM-1055` |      | Invalid HIP Id or PHR Id                                                                                                                                   |             |
| `ABDM-1056` |      | Invalid Link Reference Number                                                                                                                              |             |
| `ABDM-1057` |      | Invalid Care Contexts                                                                                                                                      |             |
| `ABDM-1059` |      | Invalid Care Contexts count                                                                                                                                |             |
| `ABDM-1060` |      | Invalid Patient Reference Number                                                                                                                           |             |
| `ABDM-1061` |      | Invalid Patient Display                                                                                                                                    |             |
| `ABDM-1062` |      | ABHA number mismatch with Link token                                                                                                                       |             |
| `ABDM-1063` |      | HIP Id mismatch with Link token                                                                                                                            |             |
| `ABDM-1064` |      | Request body was missing                                                                                                                                   |             |
| `ABDM-1065` |      | Invalid X Auth token                                                                                                                                       |             |
| `ABDM-1066` |      | Invalid JWT token                                                                                                                                          |             |
| `ABDM-1067` |      | Request body not required                                                                                                                                  |             |
| `ABDM-1170` |      | Invalid ABHA address                                                                                                                                       |             |
| `ABDM-1084` |      | ABHA address mismatch with X Auth token                                                                                                                    |             |
| `ABDM-1085` |      | ABHA number mismatch with X Auth token                                                                                                                     |             |
| `ABDM-1086` |      | Patient profile mismatch with X Auth token                                                                                                                 |             |
| `ABDM-1087` |      | Duplicate patient share request                                                                                                                            |             |
| `ABDM-1090` |      | Duplicate HIP link request                                                                                                                                 |             |
| `ABDM-1091` |      | Duplicate Get links request                                                                                                                                |             |
| `ABDM-1092` |      | Duplicate Link token request                                                                                                                               |             |
| `ABDM-1093` |      | Duplicate Bridge request                                                                                                                                   |             |
| `ABDM-1094` |      | Duplicate bridge patch request                                                                                                                             |             |
| `ABDM-1095` |      | Duplicate Bridge service request                                                                                                                           |             |
| `ABDM-1102` |      | Profile information cannot be null                                                                                                                         |             |
| `ABDM-1103` |      | Duplicate Discovery request                                                                                                                                |             |
| `ABDM-1104` |      | Duplicate Init request                                                                                                                                     |             |
| `ABDM-1105` |      | Duplicate Confirm request                                                                                                                                  |             |
| `ABDM-1106` |      | Duplicate On discovery request                                                                                                                             |             |
| `ABDM-1107` |      | Duplicate On init request                                                                                                                                  |             |
| `ABDM-1108` |      | Duplicate On confirm request                                                                                                                               |             |
| `ABDM-1109` |      | Invalid On discovery response                                                                                                                              |             |
| `ABDM-1110` |      | Invalid On init response                                                                                                                                   |             |
| `ABDM-1111` |      | Invalid On confirm response                                                                                                                                |             |
| `ABDM-1112` |      | Invalid or already expired consent artefact id                                                                                                             |             |
| `ABDM-1113` |      | Duplicate health information provider data flow response                                                                                                   |             |
| `ABDM-1149` |      | Intent type is not supported at HIP end                                                                                                                    |             |
| `ABDM-1150` |      | Bridge API version cannot be null                                                                                                                          |             |
| `ABDM-1402` |      | Acknowledgement is not received from HIP                                                                                                                   |             |
| `ABDM-9999` |      | HIP is unable to generate a token at this time. Please try again later.                                                                                    |             |
| `ABDM-9999` |      | HIP is unable to process at this time. Please try again later.                                                                                             |             |
| `ABDM-1030` |      | Request id not found                                                                                                                                       |             |
| `ABDM-2500` |      | No mapping found for                                                                                                                                       |             |
| `ABDM-2401` |      | The X Auth token is invalid.                                                                                                                               |             |
| `ABDM-2402` |      | Invalid Timestamp                                                                                                                                          |             |
| `ABDM-2404` |      | Invalid Request Id                                                                                                                                         |             |
| `ABDM-2429` |      | Too many requests found                                                                                                                                    |             |
| `ABDM-2501` |      | Payment status should be : SUCCESS,CANCELED,PENDING,FAIL,REFUND\_INITIATED,REFUND\_SUCCESS                                                                 |             |
| `ABDM-2500` |      | Authorization header is missing                                                                                                                            |             |
| `ABDM-2403` |      | Invalid X-CM-ID                                                                                                                                            |             |
| `ABDM-2406` |      | Invalid API sequence flow, please follow logical flow                                                                                                      |             |
| `ABDM-2406` |      | The status is invalid. Please follow the logical status flow or transition.                                                                                |             |
| `ABDM-9999` |      | User not found                                                                                                                                             |             |
| `ABDM-9999` |      | Cannot process the request at the moment, please try later.                                                                                                |             |
| `ABDM-9001` |      | No open order against ABHA. Please ensure a minimum of one open order                                                                                      |             |
| `ABDM-9002` |      | No registration found at <\<hospital name>>. Contact counter support                                                                                       |             |
| `ABDM-9003` |      | Hospital services temporarily unavailable. Please try again after some time.                                                                               |             |
| `ABDM-9004` |      | Services disrupted, please try again.                                                                                                                      |             |
| `ABDM-9005` |      | Bank server not responding. Please try again later                                                                                                         |             |
| `ABDM-9006` |      | Service details mismatch. Please ensure original service ID from HMIS                                                                                      |             |
| `ABDM-9007` |      | The Scan and Pay functionality is not enabled at this facility. Kindly contact the hospital administration.                                                |             |
| `ABDM-1006` |      | Invalid count, must be 2 digit and ranges between 1 to 20                                                                                                  |             |
| `ABDM-1407` |      | The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it.                                                          |             |
| `ABDM-1006` |      | Invalid HIType, it must be in Prescription,DiagnosticReport,OPConsultation,DischargeSummary,ImmunizationRecord,HealthDocumentRecord,WellnessRecord,Invoice |             |

A row with no HTTP status and no call is one NHA lists for this module (Sandbox2.0 M2 and M3 API review v2, NHA, 21 September 2026) without saying which call returns it.

Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/pr-75/docs/hiecm/v3/reference/error-codes).

## What the codes mean

### ABDM-1013: the ABHA number is not valid

ABDM does not accept the [ABHA number](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-number) you sent. The message is "Invalid ABHA Number". In the [HIP](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hip) initiated link request, `abhaNumber` is 14 digits and nothing else, matching `^\d{14}$`.

Notes for AI agents

**When it goes wrong.** Send the 14 digits with no hyphens or spaces. Check that the field carries a number, not an [ABHA address](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-address). If the format is right, the account may not exist in the environment you are calling.

### ABDM-1022: too many requests

You are sending more requests than ABDM accepts from your client, and it has started refusing them. The message is "Too many requests", and the patient share calls return it with HTTP 429.

`ABDM-2429`, "Too many requests found", means the same, so handle both. `ABDM-1027` goes further: "You are blocked. Please try again after 24 hours."

Notes for AI agents

**What happens.** Bulk jobs and retry loops without backoff are the usual causes. A loop that retries at once can turn one refusal into a 24 hour block.

**When it goes wrong.** Back off exponentially, add jitter, and cap the number of attempts. If it happens in normal use, batch your work, cache what does not change, and stop polling anything that has a callback.

### ABDM-1026: the link token is not valid

Linking a [care context](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#care-context) needs a [link token](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#link-token), and the one you sent is not usable. The message is "Invalid Link Token". A mismatch has its own code:

- `ABDM-1038`, "ABHA address and Link token mismatch"
- `ABDM-1062`, "ABHA number mismatch with Link token"
- `ABDM-1063`, "HIP Id mismatch with Link token"

Notes for AI agents

**When it goes wrong.** A link token is valid for six months, so check it before you use it. If it has expired, or was issued for another patient or facility, generate a new one through the [link token call](/docs/pr-75/docs/hiecm/v3/api/m2/endpoints/m2-abdm-link-token-hip/01-m2-post-v3-token-generate-token). Do not retry with the old token.

### ABDM-1032: a required header is missing or malformed

A required header is absent or unusable, and the response does not say which. The message is "Invalid header". Some headers have a code of their own, so check these first:

- `ABDM-2402`, "Invalid Timestamp", for `TIMESTAMP`
- `ABDM-2403`, "Invalid X-CM-ID", for `X-CM-ID`
- `ABDM-2404`, "Invalid Request Id", for `REQUEST-ID`
- `ABDM-2500`, "Authorization header is missing", for `Authorization`

Notes for AI agents

**Before you start.** The gateway calls take `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID` and `Authorization`. Many M2 and M3 calls also take `X-HIP-ID` or `X-HIU-ID`.

**When it goes wrong.** Check that each header is present, spelled exactly, with its hyphens and case, and carries a well formed value. Log the full header set on every failed request, so the next failure is a comparison rather than a hunt.

### ABDM-1035: the HIP id is not recognised

ABDM does not recognise the [Health Information Provider](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hip) (HIP) id on this call. The message is "Invalid HIP ID", and the link token call returns it with HTTP 400. This is a registration problem, not a request problem, so retrying does not change it.

Notes for AI agents

**What happens.** The facility is not registered, your software is not linked to it, or the id belongs to the other environment.

**When it goes wrong.** Confirm the facility exists in the [Health Facility Registry](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hfr) and that your software is linked to it as a bridge, as [M4 Registry Integration](/docs/pr-75/docs/hiecm/v3/milestones/m4) describes. Send that facility's id in `X-HIP-ID`.

### ABDM-1040: the HIU id is not recognised

ABDM does not recognise the [Health Information User](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hiu) (HIU) id on this request. The message is "Invalid HIU ID". Like the [HIP](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hip) case, this is a registration problem, so retrying does not change it.

Notes for AI agents

**When it goes wrong.** Confirm the entity is registered in the HIU role and that `X-HIU-ID` carries the HIU id, not the HIP id. If you hold both ids, keep them in separate configuration values so they cannot be swapped.

### ABDM-1056: already linked, or an invalid link reference

The code carries two messages, and the message tells you which case you are in:

- "This care contexts has been already linked": the [care context](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#care-context) is already linked to this patient.
- "Invalid Link Reference Number": the link reference number you sent matches nothing issued in this link flow.

In user initiated linking, the link init exchange can carry it in an `error` object. The message there is "This care context has already been linked".

Notes for AI agents

**Before you start.** Keep your own record of the care contexts you have linked and the reference numbers you used. This code usually means your state and the gateway's state disagree.

**When it goes wrong.** Already linked: treat it as done once you have confirmed the care context is linked, and do not retry the link. Invalid reference number: restart the link flow for a fresh reference rather than guessing the value.

### ABDM-1062: ABHA number mismatch, or consent not granted

One code, two messages, so read the message as well as the code:

- "ABHA number mismatch with Link token": in linking, the [ABHA number](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-number) in your request is not the one the link token was issued for.
- "Consent Not granted": the patient has not granted the consent you are acting on.

`ABDM-1061` and `ABDM-1063` also carry two messages each.

Notes for AI agents

**When it goes wrong.** Linking: generate a link token for this patient and link with the ABHA number it was issued for. Consent: check the consent's status before you request data. A denied or expired consent does not start working on retry.

### ABDM-1063: HIP id mismatch, or an invalid date range

One code, two messages:

- "HIP Id mismatch with Link token": the [HIP](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hip) id sending the link is not the one the link token was issued for.
- "Date Range given is invalid": the date range you asked for is not valid.

Notes for AI agents

**What happens.** The mismatch appears when one system serves several facilities and mixes their identities between steps. The date range fails when its end comes before its start, or when it falls outside what the consent grants.

**When it goes wrong.** Linking: generate the link token under the same `X-HIP-ID` that will send the link. Consent: read the date range the consent artefact grants, and request inside it.

### ABDM-1064: a repeated request id, or a missing body

One code, two messages:

- "request with this request id already exists": you sent a request id that was already used.
- "Request body was missing": the call needs a JSON body and none arrived.

`ABDM-1067`, "Request body not required", is the opposite case: a body arrived where none is wanted.

Notes for AI agents

**What happens.** A request id hardcoded during testing works once and fails afterwards. A missing body usually comes from a client that sends a POST without one, a missing `Content-Type`, or a proxy that strips the body.

**When it goes wrong.** Generate a fresh UUID for every request, retries included. Send the JSON body the operation documents, with a `Content-Type` of `application/json`. If your client looks right, log the request as it leaves your process, which is where a proxy shows up.

### ABDM-1112: the consent artefact is invalid or expired

The [consent artefact](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#consent-artefact) you presented is unknown or has expired. The message is "Invalid or already expired consent artefact id". An expired artefact is often not a bug: a consent window is allowed to end.

Notes for AI agents

**How you know it worked.** A fetch against an artefact that is still valid is accepted.

**When it goes wrong.** Check the artefact's validity before you fetch. If you still need the data, raise a new consent request. Do not retry against the old artefact.

### ABDM-1170: the ABHA address is not valid

ABDM does not accept the [ABHA address](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-address) you sent. The message is "Invalid ABHA address". An ABHA address matches `^[a-zA-Z0-9][a-zA-Z0-9_.]+[a-zA-Z0-9]@(abdm|sbx)$`. It starts and ends with a letter or digit, may carry dots and underscores in between, and ends with `@abdm` or `@sbx`.

Notes for AI agents

**When it goes wrong.** Check the address against the pattern, suffix included. If it matches, confirm the account exists in the environment you are calling before you link against it.

### ABDM-1407: the ABHA number is deactivated

The [ABHA number](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-number) behind this [ABHA address](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#abha-address) exists, but it is deactivated. The message is "The ABHA Number associated with this ABHA Address is currently deactivated. Please reactivate it." Nothing about your request is wrong.

Notes for AI agents

**When it goes wrong.** There is no fix on your side. The person has to reactivate the ABHA number before this call can succeed. Tell them so plainly rather than showing a generic failure, because they are the only one who can resolve it.

### ABDM-2401: the X Auth token is not valid

The token that identifies the patient was rejected, not your application's access token. The message is "The X Auth token is invalid." It is the user token issued when the patient logged in, sent as `X-AUTH-TOKEN`.

`ABDM-1065`, "Invalid X Auth token", reports the same problem. `ABDM-1084` to `ABDM-1086` report a token that does not match the ABHA address, ABHA number or profile in the request.

Notes for AI agents

**What happens.** The token has expired, belongs to a different person from the one in the request, or was never obtained because the login did not finish.

**When it goes wrong.** Have the person log in again for a fresh token, or use the `refreshToken` issued at login. Never send your application's access token in `X-AUTH-TOKEN`: the two are not interchangeable.

### ABDM-2402: the timestamp is not valid

ABDM refused the `TIMESTAMP` header, with the message "Invalid Timestamp". Send it as ISO 8601 in UTC, with milliseconds and the `Z` suffix, for example `2022-10-06T15:10:00.587Z`. [ABDM-1016](/docs/pr-75/docs/hiecm/v3/api/m1/errors#abdm-1016), "Invalid TimeStamp", reports the same header.

Notes for AI agents

**How you know it worked.** The same request, with only `TIMESTAMP` corrected, returns its normal response.

**When it goes wrong.** Generate the value from a synchronised clock with a date library, never by hand. If a well formed UTC value still fails, compare your host clock with a time server.

### ABDM-2403: the X-CM-ID is not valid

The `X-CM-ID` header does not name a consent manager the gateway recognises. The message is "Invalid X-CM-ID". In the sandbox, at `https://dev.abdm.gov.in`, the value is `sbx`. The usual cause is a host from one environment with a value meant for the other.

Notes for AI agents

**When it goes wrong.** Take the host and the `X-CM-ID` value from one environment setting, so they cannot disagree.

### ABDM-2404: the REQUEST-ID is not valid

The `REQUEST-ID` header is missing or is not a universally unique identifier (UUID). The message is "Invalid Request Id". In the asynchronous flows this value is how a callback is matched to your call, so a bad one breaks that match too. A request id that was already used returns [ABDM-1064](#abdm-1064) instead.

Notes for AI agents

**How you know it worked.** The call returns its normal response, and in an asynchronous flow the callback's `requestId` matches the `REQUEST-ID` you sent.

**When it goes wrong.** Generate a fresh UUID for every request and log it before sending. A retry is a new request and takes a new value.

### ABDM-2406: the calls are out of order

The gateway tracks where you are in a flow, and your call does not fit. The messages are:

- "Invalid API sequence flow, please follow logical flow"
- "The status is invalid. Please follow the logical status flow or transition."

A step you depend on has not happened yet, or the flow has moved past the state your call assumes.

Notes for AI agents

**What happens.** Skipping a step, replaying an earlier step after the flow has moved on, or sending the next step before the previous step's callback arrived all produce it.

**When it goes wrong.** Work out which step the gateway believes you are on. Find your last confirmed callback and resume from the step after it. Do not retry the rejected call in place. If the flow has diverged, restart it from its first step.

### ABDM-2500: no Authorization header, or no matching request

One code, two messages:

- "Authorization header is missing": the call arrived without an access token, so the gateway does not know which application is calling.
- "No mapping found for": a callback's `resp.requestId` matches no request the gateway is waiting on.

Every gateway call except the session call itself needs `Authorization`, carrying `Bearer` and the access token.

Notes for AI agents

**What happens.** The header was never set, or a token refresh failed and your client sent an empty value.

**When it goes wrong.** Get an access token from the [session call](/docs/pr-75/docs/hiecm/v3/api/gateway/endpoints/gateway-abdm-sessions/01-gateway-post-gateway-v3-sessions) and send it on every call. Refresh it before `expiresIn` runs out rather than waiting for a failure. In a callback, set `resp.requestId` to the `REQUEST-ID` of the request you are answering.

### ABDM-9999: a catch-all, so read the message

`ABDM-9999` covers many failures, and the message carries the meaning. Some messages report a problem in your request, for example "Invalid Transaction Id", "Invalid LoginId" or "RequestId cannot be NULL or Blank". Others mean ABDM or the [HIP](/docs/pr-75/docs/hiecm/v3/getting-started/glossary#hip) could not process it, for example "Unknown exception" or "Cannot process the request at the moment, please try later."

Notes for AI agents

**What happens.** The code may arrive bare or followed by a colon and a space. Match on the code, then branch on the message. More specific codes exist for an unavailable service: `ABDM-1019` and `ABDM-1024` for a dependent service, `ABDM-1028` for the HIP and `ABDM-1033` for the HIU.

**How you know it worked.** After a request problem, the corrected request succeeds. After an unavailability message, the same request succeeds later, unchanged.

**When it goes wrong.** For a request problem, fix the field the message names, because a retry repeats the mistake. For an unavailability message, retry with exponential backoff and a cap on attempts, so the loop does not end in [ABDM-1022](#abdm-1022). If it persists for hours, report it through [Support](/docs/pr-75/docs/support) with your `REQUEST-ID` and `TIMESTAMP`.

[NextStill stuck? Ask for helpWhere to file what you hit, so the answer lands back in these pages.](/docs/support)
