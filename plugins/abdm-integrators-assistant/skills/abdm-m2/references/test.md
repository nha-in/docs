# HIE-CM m2 test

Walks the ABDM M2 functional test cases, Health Information Provider, against the system you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every M2 test case in the Building HIP set against your system and the sandbox, one case at a time
- Records, for each case, the call and the callback that prove it with their REQUEST-IDs, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| A public callback URL, reachable from the internet over HTTPS | Your deployment, or a tunnel to a local build. Register it with `gateway_patch_gateway_v3_bridge_url`. Without it no M2 case can pass, because every answer arrives there |
| Your HIP id, linked to your client id | The facility's HFR id, linked through the NHPR portal or the M4 software linkage calls. It goes in `X-HIP-ID` |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the sandbox directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |
| A person with a sandbox ABHA address and the ABDM sandbox PHR app on their phone | Present for the run. Logging in, entering an OTP, approving or revoking a consent and pulling records are all human steps, and the skill stops for each |
| That person's name, gender and year of birth as their ABHA holds them | The demographic linking cases send these, and a mismatch is refused |
| A way to raise a consent request to your HIP as an HIU | The sandbox HIU web interface, or an HIU you control |
| At least one record per HI type you claim, as a FHIR bundle | Your own system. The sharing case sends it |

## Say one of these

- "Walk the M2 test cases against my sandbox and log each one."
- "Run only the user initiated linking cases."
- "Re-run HIP_INTI_LINK_505, the on_carecontext callback never came yesterday."
- "Write a terminal script that runs the M2 test cases and stops for each PHR app step."

## What happens first

One question: which cases. All of them, one group, or a list of ids. Then the preflight below runs, and the preconditions for the first case are checked before anything is sent. Nothing else is asked until a case needs a human.

**Preflight.** Not a test case, and never counted as one.

1. `gateway_post_gateway_v3_sessions` returns 202 with `accessToken` present.
2. `gateway_get_gateway_v3_bridge_services` returns 200 with `bridge.url` equal to your callback URL and `bridge.active` `true`, and `services` holding your HIP id with `HIP` in `types`.
3. A POST you send to your own callback URL from outside your network reaches your handler and is logged.

If any of the three fails, stop and fix it. Every case below would fail for the same reason.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last callback, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed, including the callback, and the observation is pasted verbatim | The response was not pasted, or only the 202 was seen. A pass with no output is a fail |
| `failed` | Three passes and the exit condition was not observed, or the callback never arrived, or it carried the refusal the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached an OTP, a PHR app login, a consent approval or revocation, a records pull, or a person who was not there | Ever as a substitute for a fail you can see |
| `not-run` | The case does not apply to your entity, you do not claim the optional capability, or ABDM publishes no operation for it | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one of these, or a combination. It decides what the manifest carries.

- **sandbox.** A call the gateway sees, and the callback that answers it. Evidence is the HTTP status, the body and the REQUEST-ID of the call, and the body of the callback POST that arrived at your URL, both pasted. The exit condition is a literal in the callback. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. A screen case is attested, not observed, and the manifest marks it so.
- **human.** A step only a person can do. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- A 202 alone never passes a case. It says the gateway accepted the request, not that anything happened. The callback is the evidence. `hiecm.concept.m2-exchange-not-call`
- Match each callback to its call by `response.requestId`, which equals the `REQUEST-ID` you sent. A callback with no matching id is not evidence for this case. `hiecm.concept.asynchronous-callbacks`
- Wait for a callback for a fixed window, such as 60 seconds, then record the pass as silent. Silence is a failed pass, never a pass. `hiecm.concept.m2-never-block-the-desk`
- Log every inbound POST in full before parsing it. A handler written against an assumed shape fails where nobody sees it. `hiecm.concept.m2-inbound-is-a-surface`
- Act on a callback only when it carries the bearer token and a request id you sent. Anything can post to a public URL. `hiecm.concept.callback-authenticity`
- Two tokens. The gateway access token goes in `Authorization` on every call. The link token from the `on-generate-token` callback goes in `X-LINK-TOKEN` on `m2_post_hip_v3_link_carecontext`.
- Fresh `REQUEST-ID` on every call, logged before sending. After a failure the id is the only handle on the call, and the callback is matched by it.
- A retry is a duplicate. A refused link token request is remembered, and the same request again returns `ABDM-1092`. Change the input or wait before the next pass. `hiecm.concept.m2-retry-is-a-duplicate`
- Send the headers each operation lists in the specification: `X-CM-ID` `sbx` on calls to the sandbox gateway, and `X-HIP-ID` where the operation lists it. `REQUEST-ID` and `TIMESTAMP` go on every call.
- Paste the response and the callback. A step with no pasted output is not done.
- Sensitive values travel encrypted, and the records you share are encrypted with the key material the request carries. Never log a record, an OTP or a mobile number in clear.
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: HIP_INTI_LINK_505   pass: 1 of 3   at: 2026-10-01T10:14:02Z
called: POST /api/hiecm/hip/v3/link/carecontext  REQUEST-ID 6f1c...  HTTP 202
callback: POST /api/v3/link/on_carecontext  at 10:14:09Z
body: {"abhaAddress":"...","status":"Successfully Linked care context","response":{"requestId":"6f1c..."}}
matched: exit condition for HIP_INTI_LINK_505, step 1
next: HIP_INTI_LINK_506
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing and it listens on your callback URL. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case id from this skill, such as `HIP_INTI_LINK_503`. Never invent a numbering such as `TC01` | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal: log in to the PHR app, approve the consent, enter the OTP there, pull the records. Wait for the person to answer | Every M2 linking and sharing path passes through a person. A runner that never asks never reaches one |
| Never write a typed value, an OTP or a record body to disk, a log or the manifest, and never hard code one | They belong to the person, not the run |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the callback literal the exit condition names, such as `linkToken` present, or `status` `Successfully Linked care context`, or `error.code` `ABDM-1037` | A status alone never passes a check, and a 202 never does |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| Run the preflight first, label it `preflight`, and keep it out of the case counts | It tests your setup, not a case |
| At the end, print one line per case id with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this.

```text
preflight          GET /api/hiecm/gateway/v3/bridge-services  REQUEST-ID 0c7e...  HTTP 200  bridge.url matches  ok
HIP_INTI_LINK_503  POST /api/hiecm/v3/token/generate-token  REQUEST-ID 4d2a...  HTTP 202
  waiting up to 60 s for /api/v3/hip/token/on-generate-token
HIP_INTI_LINK_503  callback response.requestId 4d2a...  linkToken present  matched
HIP_INTI_LINK_505  count 2, one care context  REQUEST-ID 91b0...  HTTP 202
HIP_INTI_LINK_505  callback /api/v3/link/on_carecontext  error.code ABDM-1037  matched
HIP_INTI_LINK_505  count 1, one care context  REQUEST-ID 8b17...  HTTP 202
HIP_INTI_LINK_505  callback /api/v3/link/on_carecontext  status Successfully Linked care context  matched
HIP_INTI_LINK_505  passed
HIP_INTI_LINK_506  Ask the person to pull records in the PHR app. Is the visit listed? y/n, or blank if nobody is here:
```

## Test cases

The ids, the mandatory marks and the wording of each check are ABDM's, from the M2 Building HIP set, August 2022. The sections are grouped as the set groups them. Where the set names an API, the operation id here is the one in `references/integrate.md` and the M2 specification, which carry the host, the headers and a full request.

The set asks that at least one HIP initiated linking method be demonstrated, and recommends all of them. ABDM's M2 specification now publishes one: linking by demographic details, through a link token. That group is mandatory. The mobile OTP, Aadhaar OTP and Direct Auth groups are recorded `not-run`.

### Group 1: health record creation

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

#### Health_RECORD_CREATION_101, digital health records are created. `screen`

Your system creates digital health records for the HI types you claim. ABDM requires only that what you share is a FHIR bundle, so the evidence is the record in your system and the FHIR bundle it produces for one visit of each claimed HI type. Name the HI types in the manifest, using the values the specification lists: `DiagnosticReport`, `DischargeSummary`, `HealthDocumentRecord`, `ImmunizationRecord`, `OPConsultation`, `Prescription`, `WellnessRecord`, `Invoice`.

Screen check alongside: each bundle is stored against a visit, so a care context can name it. A bundle no care context names cannot be shared. `hiecm.concept.m2-care-context-and-records`

### Group 2: HIP initiated linking by mobile OTP

Optional. ABDM's M2 specification publishes no operation for HIP initiated linking authenticated by a mobile OTP. Record every case in this group `not-run` with that reason. Do not improvise a call.

Loop limit: 3 passes per test case.

| Case | What it checks | Outcome |
|---|---|---|
| HIP_INTI_LINK_201 | Linking by mobile OTP is offered | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_202 | The OTP reaches the ABHA mobile | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_203 | The OTP is validated, and a wrong one refused | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_204 | A link token is created | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_205 | Records are linked with that token | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_206 | The linked records can be pulled in the PHR app | `not-run`, no operation in the M2 specification |

### Group 3: HIP initiated linking by Aadhaar OTP

Optional. ABDM's M2 specification publishes no operation for HIP initiated linking authenticated by an Aadhaar OTP. Record every case in this group `not-run` with that reason.

Loop limit: 3 passes per test case.

| Case | What it checks | Outcome |
|---|---|---|
| HIP_INTI_LINK_301 | Linking by Aadhaar OTP is offered | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_302 | The OTP reaches the Aadhaar linked mobile | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_303 | The OTP is validated, and a wrong one refused | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_304 | A link token is created | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_305 | Records are linked with that token | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_306 | The linked records can be pulled in the PHR app | `not-run`, no operation in the M2 specification |

### Group 4: HIP initiated linking by Direct Auth

Optional. ABDM's M2 specification publishes no operation for HIP initiated linking approved in the PHR app by Direct Auth. Record every case in this group `not-run` with that reason.

Loop limit: 3 passes per test case.

| Case | What it checks | Outcome |
|---|---|---|
| HIP_INTI_LINK_401 | Linking by Direct Auth is offered | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_402 | The approval request appears in the PHR app | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_403 | A link token is created | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_404 | Records are linked with that token | `not-run`, no operation in the M2 specification |
| HIP_INTI_LINK_405 | The linked records can be pulled in the PHR app | `not-run`, no operation in the M2 specification |

### Groups 4.6, 4.8 and 4.1: consent granted, revoked and expired

The set marks these three mandatory for an integrator implementing Direct Auth linking. Run them whenever you run HIP_INIT_SHARE_CARECONTEXT. Every HIP receives these notifications, and the sharing case refuses data on a consent your system did not store. The specification also makes the HIP responsible for tracking expiry, and forbids serving a request on an expired consent.

Loop limit: 3 passes per test case.

**Preconditions.** A care context already linked to the person's ABHA address, from HIP_INTI_LINK_505 or USER_INIT_LINK_605. The person present with the PHR app.

#### HIP_INIT_GRANT_CONSENT_, a granted consent is stored. `human`, `sandbox` and `screen`

Raise a consent request to your HIP as an HIU. The person approves it in the PHR app; stop for that.

Exit condition: three observations, all pasted.

1. An inbound POST arrives at your URL for `m2_post_v3_consent_request_hip_notify` with `notification.status` `GRANTED`, `notification.consentDetail.consentId` present, and `notification.consentDetail.hip.id` equal to your HIP id.
2. Your `m2_post_consent_v3_request_hip_on_notify` returns 202, sent with `acknowledgement.consentId` equal to that consent id, `acknowledgement.status` `OK` and `response.requestId` equal to the notify's `REQUEST-ID`.
3. Screen: your system shows the consent stored against the patient, with its HI types, date range, purpose and expiry.

Nudge: store `consentDetail` whole. The sharing case checks the HIU, the HI types and the date range against it.

#### HIP_INIT_REVOKE_CONSENT, a revoked consent is removed. `human`, `sandbox` and `screen`

The person revokes the consent from HIP_INIT_GRANT_CONSENT_ in the PHR app; stop for that.

Exit condition: an inbound `m2_post_v3_consent_request_hip_notify` with `notification.status` `REVOKED` and `notification.consentId` equal to the stored consent; your on-notify returns 202 with that `acknowledgement.consentId`; and your screen no longer shows the consent as usable. Paste both bodies.

#### HIP_INIT_EXPIRE_CONSENT, an expired consent is removed. `human`, `sandbox` and `screen`

Raise a new consent request. The person approves it with a short expiry; stop for that. Then wait past the expiry.

Exit condition: the `GRANTED` notification and its acknowledgement as in HIP_INIT_GRANT_CONSENT_. Then an inbound `m2_post_v3_consent_request_hip_notify` with `notification.status` `EXPIRED` and `notification.consentId` equal to it. Your on-notify returns 202, and your screen no longer shows the consent as usable.

Nudge: if no `EXPIRED` notification arrives, your system must still stop using the consent at its `dataEraseAt` or expiry. Record the case `failed` only if your system keeps it usable; a missing notification alone is an escalation.

### Group 8: HIP initiated linking by demographic details

Mandatory for government and private integrators.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 20 minutes old, from the preflight. The person's ABHA address, already verified in your system, and their name, gender and year of birth. A care context in your system for them, with a record behind it.

#### HIP_INTI_LINK_501, the option exists and completes. `sandbox`

Your system offers linking by demographic details, and the journey completes. Drive it end to end through your screen or API.

Calls, in order: `m2_post_v3_token_generate_token`, wait for `m2_post_v3_hip_token_on_generate_token`, then `m2_post_hip_v3_link_carecontext` with that token, and wait for `m2_post_v3_link_on_carecontext`.

Exit condition: the 202 and the callback for each call, all pasted. The literals are those of HIP_INTI_LINK_503 and HIP_INTI_LINK_505.

#### HIP_INTI_LINK_502, the demographic details are captured. `screen`

Your system holds the person's name, gender, year of birth and mobile before the link token is requested, and reads them from the verified ABHA profile rather than asking again. Evidence: the patient record with those fields filled. `hiecm.concept.m1-never-ask-twice`

The set lists Aadhaar number, state, district and address too. The link token request carries none of them, so they are not checked here.

#### HIP_INTI_LINK_503, the gateway validates the details. `sandbox`

Two observations, both needed.

1. Matching details: `m2_post_v3_token_generate_token`, sent with `abhaAddress` or `abhaNumber`, `name`, `gender` and `yearOfBirth`, returns 202. Then the callback `m2_post_v3_hip_token_on_generate_token` arrives with `linkToken` present, `abhaAddress` equal to the one sent, and `response.requestId` equal to your `REQUEST-ID`.
2. A mismatch: the same call with `yearOfBirth` changed. Either a synchronous 400 with `error.code`, or a callback with an `error` object and no `linkToken`. Your screen says the details did not match, and no token is stored. The specification names no single code for a demographic mismatch, so paste the code that came back.

Nudge: send the mismatch once. A second identical request returns `ABDM-1092`, "Duplicate Link token request", which hides the real cause. `hiecm.concept.m2-retry-is-a-duplicate`

Nudge: a synchronous 400 with `ABDM-1035` is your HIP id, not the patient. Fix `X-HIP-ID` and the bridge linkage before the next pass.

#### HIP_INTI_LINK_504, the link token is kept. `sandbox` and `screen`

Exit condition: the `linkToken` from HIP_INTI_LINK_503 step 1, pasted with its value masked. Screen check: your system stores it against the patient and the ABHA address it was issued for. The specification gives a link token a life of six months, so a second visit reuses it rather than requesting a new one.

#### HIP_INTI_LINK_505, the care context is linked. `sandbox`

Your backend sends the link request as a batch process, the same way for a new record and a legacy one.

Exit condition: three observations, all pasted.

1. `m2_post_hip_v3_link_carecontext`, sent with the link token in `X-LINK-TOKEN`, returns 202. The callback `m2_post_v3_link_on_carecontext` arrives with `status` `Successfully Linked care context`, `abhaAddress` equal to the one linked, and `response.requestId` equal to your `REQUEST-ID`.
2. A refusal: the same call with `patient[].count` not equal to the number of `careContexts`. The callback arrives with `error.code` `ABDM-1037`, and your system does not mark the care context linked.
3. An update: add a record to the linked care context. `m2_post_hip_v3_link_context_notify` returns 202, and the callback `m2_post_v3_links_context_on_notify` arrives with `acknowledgement.status` `SUCCESS`.

Nudge: `ABDM-1038` in the callback is a link token issued for another ABHA address. `ABDM-1056`, "This care contexts has been already linked", is done, not failed; confirm and do not retry.

#### HIP_INTI_LINK_506, the linked records can be pulled. `human` and `screen`

The person opens the PHR app and pulls records from your facility; stop for that.

Exit condition: the person sees the care context linked in HIP_INTI_LINK_505. Screen check, in the PHR app: the HI types, the visit date and time, the patient details, the ABHA number and the ABHA address are correct, for structured and unstructured records alike. Evidence: a screenshot from the PHR app.

### Group 6: user initiated linking

Applies to every HIP. Mandatory, except USER_INIT_LINK_601, which the set does not mark.

Loop limit: 3 passes per test case.

**Preconditions.** Your HIP listed as active, from the preflight. The person present with the PHR app and an ABHA whose mobile, name, gender and year of birth match a patient in your system who has at least one unlinked care context.

#### USER_INIT_LINK_601, the person logs in to the PHR app. `human`

The person logs in to the ABDM sandbox PHR app; stop for that. Evidence: their confirmation, or `needs-human`. No call of yours proves this step.

#### USER_INIT_LINK_602, your facility can be found. `human` and `screen`

The person searches for your facility in the PHR app and selects it. Evidence: a screenshot with your facility listed. If it is missing, check the preflight's `services` entry before anything else.

#### USER_INIT_LINK_603, the profile reaches your HIP. `sandbox`

Exit condition: an inbound POST arrives at your URL for `m2_post_v3_hip_patient_care_context_discover`, with `transactionId` and `patient.id` present. Paste it in full. Your system searches by ABHA address first, then by mobile, and narrows a mobile match by name, gender and year of birth.

#### USER_INIT_LINK_604, the records found are returned. `sandbox`, `human`

Exit condition: your `m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340` returns 202, sent with `transactionId` equal to the discover's, `response.requestId` equal to the discover's `REQUEST-ID`, `patient[].careContexts` holding at least one entry, and `matchedBy` naming the identifier you matched on. The person then sees those care contexts in the PHR app; stop for that.

Then the refusal: run a discover for a person your system does not hold. Your on-discover carries an `error` object and no `patient`, and the PHR app says no records were found. The specification names no single code for no match, so paste the code your system sent.

Nudge: return only unlinked care contexts. One already linked comes back from init as `ABDM-1056`.

#### USER_INIT_LINK_605, the person links with an OTP. `sandbox`, `human`

Three observations, all pasted.

1. An inbound `m2_post_v3_hip_link_care_context_init` arrives with `transactionId`, `abhaAddress` and the selected `patient[].careContexts`. Your `m2_post_user_initiated_linking_v3_link_care_context_on_init` returns 202, sent with `link.referenceNumber`, `link.authenticationType` `DIRECT` and `link.meta.communicationMedium` `MOBILE`.
2. Your system sends the OTP to the person's mobile. The person enters it in the PHR app; stop for that. An inbound `m2_post_v3_hip_link_care_context_confirm` arrives with `confirmation.linkRefNumber` equal to your `link.referenceNumber` and `confirmation.token`.
3. Your `m2_post_user_initiated_linking_v3_link_care_context_on_confirm` returns 202, sent with `patient[].careContexts` holding only the care contexts selected in step 1.

Then a wrong OTP: your on-confirm carries an `error` object and no `patient`, and the PHR app says the link failed and lets the person retry.

Screen check: only the selected records appear under the linked care context in the PHR app.

#### USER_INIT_LINK_606, the request is validated before it reaches you. `sandbox`

Exit condition: the discover from USER_INIT_LINK_603 carries `patient.verifiedIdentifiers` with at least one entry, and your on-discover's `matchedBy` names a type from that list. Paste both. A match made only on `unverifiedIdentifiers` fails this case.

#### USER_INIT_LINK_607, the linked records can be pulled. `human` and `screen`

As HIP_INTI_LINK_506, for the care contexts linked in USER_INIT_LINK_605.

### Group 7: notifying a patient by SMS with a deep link

Applies to every HIP. Mandatory. This case covers a patient who gave a mobile and no ABHA address at registration.

Loop limit: 3 passes per test case.

#### HIP_INIT_NOTIFY_HIECM, a new record triggers the SMS. `sandbox`, `human` and `screen`

Create a new record in your system for a patient with a mobile and no ABHA address.

Exit condition: four observations.

1. Your system calls `m2_post_hip_v3_link_patient_links_sms_notify2` on its own, sending only `notification.phoneNo` and `notification.hip`. It returns 202.
2. The callback `m2_post_v3_patients_sms_on_notify` arrives with `acknowledgement.status` `SUCCESS` and `response.requestId` equal to your `REQUEST-ID`. Paste both.
3. The person receives the SMS, opens the link, installs or opens a PHR app and discovers your facility; stop for that. The discover that follows is USER_INIT_LINK_603, and the new record must be among the care contexts returned.
4. Screen: after linking, your system shows the record with the patient's ABHA address and ABHA number.

Nudge: the specification lists no `X-HIP-ID` header on this call. The HIP id travels in `notification.hip.id`.

### Group 8: data transfer and share

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A consent stored by HIP_INIT_GRANT_CONSENT_, for a care context linked to the person.

#### HIP_INIT_SHARE_CARECONTEXT, records are shared on request. `human`, `sandbox` and `screen`

The person starts "Get data" for the linked care context in the PHR app; stop for that.

Exit condition: five observations, all pasted.

1. An inbound `m2_post_v3_hip_health_information_request` arrives with `transactionId`, `hiRequest.consent.id`, `hiRequest.dateRange`, `hiRequest.dataPushUrl` and `hiRequest.keyMaterial`.
2. Your `m2_post_data_flow_v3_health_information_hip_on_request` returns 202, sent with `hiRequest.transactionId` equal to it and `hiRequest.sessionStatus` `ACKNOWLEDGED`.
3. Your system checks that `hiRequest.consent.id` is a stored, granted, unexpired consent for that HIU, and selects only the HI types and the date range it allows.
4. Your `m2_post_health_information_transfer` POST to the `dataPushUrl` returns 202, with each `entries[].media` `application/fhir+json` and your own `keyMaterial` carrying `cryptoAlg` `ECDH` and `curve` `Curve25519`.
5. Your `m2_post_data_flow_v3_health_information_notify` returns 202, sent with `notification.notifier.type` `HIP`, `statusNotification.sessionStatus` `TRANSFERRED` and each `statusResponses[].hiStatus` `DELIVERED`.

The transfer completes within two hours of the request arriving. Then the person sees the records in the PHR app, readable and in the right FHIR document type; stop for that, and take the screenshot.

Then the refusal: request data on the consent revoked in HIP_INIT_REVOKE_CONSENT. Your system pushes nothing, and its on-request carries an `error` object.

Nudge: the PHR app decrypts with its own private key and the public key you sent in `keyMaterial`. Derive the shared secret from the requester's `dhPublicKey`, never from a key of your own pair alone.

## When the last case is recorded

Write the manifest. It is the whole report. Case ids to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no access tokens, no link tokens, no OTPs, no record content, no client secret.

```json
{
  "skill": "abdm-m2",
  "set": "M2 Building HIP, NHA, August 2022 sheet",
  "entity": "private",
  "hip_id": "<your HIP id>",
  "callback_url": "<your registered callback URL>",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T12:03:11Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "HIP_INTI_LINK_503", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["4d2a...", "e81f..."],
     "observed": ["generate-token 202", "on-generate-token linkToken present, response.requestId 4d2a...", "mismatch callback error.code present, no linkToken"]},
    {"id": "HIP_INTI_LINK_505", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["91b0...", "8b17...", "c3d9..."],
     "observed": ["on_carecontext error.code ABDM-1037", "on_carecontext status Successfully Linked care context", "links/context/on-notify acknowledgement.status SUCCESS"]},
    {"id": "Health_RECORD_CREATION_101", "outcome": "passed", "evidence": "screen",
     "attachment": "op-consultation-bundle.png", "rule": "hiecm.concept.m2-care-context-and-records"},
    {"id": "HIP_INIT_SHARE_CARECONTEXT", "outcome": "needs-human", "evidence": "human",
     "request_ids": [], "reason": "Get data is started in the PHR app; nobody present"},
    {"id": "HIP_INTI_LINK_201", "outcome": "not-run", "reason": "no operation for HIP initiated linking by mobile OTP in the M2 specification"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases for your entity are not `passed`; and the one case to fix first.
