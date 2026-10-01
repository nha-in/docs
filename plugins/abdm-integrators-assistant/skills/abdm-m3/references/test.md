# HIE-CM m3 test

Walks the ABDM M3 functional test cases, Health Information User, against the system you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every M3 test case against your system and the sandbox, one case at a time: raising a consent request, the patient's grant, denial, revocation or expiry, and fetching and showing the records
- Records, for each case, the acknowledgement and the callback that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your HIU service id | Your registration. It is the `X-HIU-ID` header and `consent.hiu.id` in the request |
| A public callback URL, reachable from the internet | Your deployment, or a tunnel to a local build. Register it with `gateway_patch_gateway_v3_bridge_url`. Every M3 answer arrives there as a POST. A 202 alone never passes a case |
| A data push URL, reachable from the internet | The URL you send as `hiRequest.dataPushUrl`. The HIP posts the encrypted records to it directly |
| A test patient with an ABHA address ending `@sbx`, and a PHR app on their phone | Present at the desk for the run. Every grant, denial and revocation is theirs to make in that app, and the skill stops for each |
| A HIP that holds records for that patient, of each HI type you claim | Your own M2 build or any sandbox HIP the patient is linked to. Without a record of a type, that type's case is recorded as not run |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the sandbox directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |

## Say one of these

- "Walk the M3 test cases against my sandbox and log each one."
- "Run only the consent cases, HIU_FLOW_102 and HIU_FLOW_103."
- "Re-run HIU_FLOW_108, the prescription fetch failed yesterday."
- "Write a terminal script that runs the M3 test cases and asks me when the patient has approved."

## What happens first

One question: which cases. All of them, one function group, or a list of ids. Then the preconditions for the first case are checked before anything is sent. They are a fresh session token, the bridge URL registered, and a POST from outside your network arriving at your callback URL. Nothing else is asked until a case needs a human.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last acknowledgement, the last callback body, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

M3 calls are asynchronous. The gateway answers `202` with no body, and the answer arrives later as a POST to your callback URL. An exit condition names both. `hiecm.concept.asynchronous-callbacks`

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim: the acknowledgement and the callback body | The callback was not pasted. A 202 with no callback is not a pass |
| `failed` | Three passes and the exit condition was not observed, or the sandbox sent the answer the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached a grant, a denial or a revocation in the PHR app, and the patient was not there or did not act | Ever as a substitute for a fail you can see |
| `not-run` | The case does not apply to your entity, you do not claim the HI type, no HIP holds a record of it, or ABDM publishes no operation for it | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one or more of these. They decide what the manifest carries.

- **sandbox.** A call the gateway sees. Evidence is the `202`, the REQUEST-ID, and the callback body that answered it, pasted. The exit condition is a literal in the callback. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. A screen case is attested, not observed, and the manifest marks it so.
- **human.** A step only the patient can do in their PHR app. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Fresh `REQUEST-ID` on every call, logged before sending. The callback carries it back as `response.requestId`, and after a failure it is the only handle on the call.
- Paste the response and the callback. A step with no pasted output is not done.
- Log the whole callback body on arrival, before you parse it. A handler written against an assumed shape then fails where you can see it.
- Send the headers each operation asks for, and no fewer. The table below is from the specification.
- Send `TIMESTAMP` in UTC with milliseconds and a trailing Z, as in `2022-10-06T15:10:00.587Z`.
- Read plural as plural. A grant carries `notification.consentArtefacts`, one per HIP. Fetch each one; never take the first. `hiecm.concept.m3-plural-artefacts-and-codes`
- Carry ABDM's `error.message` to the screen beside the code. Never translate a code into words of your own.
- Generate a fresh ECDH key pair on Curve25519 and a fresh nonce for every health information request. Keep the private key against that request's `transactionId` and never send it anywhere.
- Never decrypt by guesswork. The specification gives ECDH and the HIP's AES-GCM encryption; the key derivation is on the data flow page. If your system cannot derive the key, it says so before the run, by name. `hiecm.concept.m3-refuse-to-guess`
- One question when you escalate. The patient is being interrupted.

| Operation | Headers beside `Authorization`, `REQUEST-ID` and `TIMESTAMP` |
|---|---|
| `gateway_post_gateway_v3_sessions` | `X-CM-ID` |
| `m3_post_consent_v3_request_init` | `X-CM-ID` |
| `m3_post_consent_v3_request_status` | `X-CM-ID`, `X-HIU-ID` |
| `m3_post_consent_v3_request_hiu_on_notify` | `X-CM-ID` |
| `m3_post_consent_v3_fetch` | `X-CM-ID`, `X-HIU-ID` |
| `m3_post_data_flow_v3_health_information_request` | `X-CM-ID`, `X-HIU-ID` |
| `m3_post_data_flow_v3_health_information_notify` | `X-CM-ID` |
| `m3_get_data_flow_v3_health_information_request_status_tra_550104` | `X-CM-ID` |

`X-CM-ID` is `sbx` on the sandbox. Every callback arrives at your URL carrying `X-HIU-ID`; check it is yours before you act on the body. `hiecm.concept.callback-authenticity`

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: HIU_FLOW_102   pass: 1 of 3   at: 2026-10-01T10:14:02Z
sent: POST /api/hiecm/consent/v3/request/init  REQUEST-ID 6f1c...  HTTP 202
callback: POST /api/v3/hiu/consent/request/on-init  at 10:14:05Z
body: {"consentRequest":{"id":"e5ec..."},"response":{"requestId":"6f1c..."}}
matched: exit condition for HIU_FLOW_102
next: HIU_FLOW_103
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case id from this skill, such as `HIU_FLOW_102`. Never invent a numbering such as `TC01` | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| The runner listens on the callback URL, or reads your callback log, and matches each callback to its call by `response.requestId` | Every M3 answer is a callback. A runner that only reads the 202 sees nothing |
| At each `human` step, stop and prompt in the terminal: "Approve the request in the PHR app, then press Enter, or leave blank if nobody is here" | Every grant, denial and revocation is the patient's. A runner that never asks never reaches one |
| Never write a private key, a token or a decrypted record to disk, a log or the manifest, and never hard code one | They belong to the patient and to that request, not to the run |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the status and the callback literal the exit condition names, such as `202` then `notification.status` `GRANTED`, or `400` with `[0].error.code` `ABDM-9999` | A status alone never passes a check. A `202` alone never passes one |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| Wait for a callback for a stated time, such as 60 seconds, then record what was observed | A callback that never comes is a fail to escalate, not a pass to assume |
| At the end, print one line per case id with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this.

```text
HIU_FLOW_102  init  REQUEST-ID 6f1c...  HTTP 202
HIU_FLOW_102  on-init  response.requestId 6f1c...  consentRequest.id present  matched
HIU_FLOW_102  init, no purpose.code  REQUEST-ID 2d7a...  HTTP 400  [0].error.code ABDM-9999  matched
HIU_FLOW_102  passed
HIU_FLOW_106  Approve the request in the PHR app, then press Enter, or leave blank if nobody is here:
HIU_FLOW_106  notify  notification.status GRANTED  consentArtefacts 2  matched
HIU_FLOW_106  on-notify  REQUEST-ID 81b0...  HTTP 202
HIU_FLOW_106  fetch x2  on-fetch consent.status GRANTED x2  matched
HIU_FLOW_106  passed
```

Nudge: calls with a malformed `consentRequestId`, an unknown `consentId` or a stale token test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts. The callback reachability check before the run is a `preflight` too.

## Test cases

The ids, the mandatory marks and the wording of each check are ABDM's, from the M3 Building HIU set. The sections are grouped as the set groups them. The operation ids are the ones in `references/integrate.md`, which carries the host, the headers and a full request.

The set names six V3 APIs for the first group. Each maps to one operation:

| API in the set | Operation | Its answer arrives as |
|---|---|---|
| `/api/hiecm/consent/v3/request/init` | `m3_post_consent_v3_request_init` | `m3_post_v3_hiu_consent_request_on_init` |
| `/api/hiecm/consent/v3/request/status` | `m3_post_consent_v3_request_status` | `m3_post_v3_hiu_consent_request_on_status` |
| `/api/hiecm/consent/v3/request/hiu/on-notify` | `m3_post_consent_v3_request_hiu_on_notify` | Nothing. It acknowledges `m3_post_v3_hiu_consent_request_notify` |
| `/api/hiecm/consent/v3/fetch` | `m3_post_consent_v3_fetch` | `m3_post_v3_hiu_consent_on_fetch` |
| `/api/hiecm/data-flow/v3/health-information/request` | `m3_post_data_flow_v3_health_information_request` | `m3_post_v3_hiu_health_information_on_request`, then the HIP's push to your data push URL |
| `/api/hiecm/data-flow/v3/health-information/notify` | `m3_post_data_flow_v3_health_information_notify` | Nothing. Your system sends it once the records are received |

The HIP's push to your data push URL has the shape of `m2_post_health_information_transfer` in the M2 specification: `transactionId`, `entries[]` and the HIP's own `keyMaterial`.

### 1. Create Consent Request

Applies to: HIU.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token from `gateway_post_gateway_v3_sessions` with `accessToken` present, less than 20 minutes old. `hiecm.concept.gateway-session` The callback URL registered and reachable. The patient present, logged in to their PHR app.

#### HIU_FLOW_101, find the patient by ABHA number or address. Mandatory. `screen`

Your system lets the user enter an ABHA address or number, and checks it is valid before any consent request is raised.

ABDM's M3 specification publishes no patient lookup operation. The check this case can prove is your own: `consent.patient.id` must match `^[a-zA-Z0-9][a-zA-Z0-9_.\-!]+[a-zA-Z0-9]@(abdm|sbx)$`. Enter one address that matches and one that does not, such as one with no `@sbx`.

Exit condition: the bad address is refused on screen and the call log holds no `m3_post_consent_v3_request_init` for it; the good one goes on to HIU_FLOW_102. Evidence: both screens and the empty call log. If your system also confirms the address exists by another route, attach that observation.

#### HIU_FLOW_102, raise a consent request. Mandatory. `sandbox`, `screen`

The user enters a purpose, a date range, a consent expiry and one or more HI types, and initiates the request.

Calls: `m3_post_consent_v3_request_init` with `consent.purpose.code` from the published list (`CAREMGT` for care), `consent.patient.id`, `consent.hiu.id`, `consent.requester`, `consent.hiTypes`, and `consent.permission` with `accessMode`, `dateRange.from`, `dateRange.to`, `dataEraseAt` and `frequency`.

Exit condition, two checks, both needed:

1. Success: the init returns `202`, then a POST arrives at your `on-init` URL with `consentRequest.id` present, `error` absent or null, and `response.requestId` equal to the REQUEST-ID you sent. Store `consentRequest.id`.
2. Refusal: the same init with `consent.purpose.code` left out returns `400` with `[0].error.code` `ABDM-9999` and `[0].error.message` `Consent purpose code cannot be null`. Your screen shows that message.

Screen check alongside: the form offers the HI types as ABDM lists them, and the date range and expiry are entered, not defaulted silently.

#### HIU_FLOW_103, the request reaches the patient's PHR app. Mandatory. `human`, `sandbox`

Stop and ask the patient: "Do you see a consent request from this HIU in your PHR app?" Their yes is the human observation. Do not let them approve or deny yet.

Then call `m3_post_consent_v3_request_status` with the stored `consentRequestId`.

Exit condition: the status call returns `202`, then a POST arrives at your `on-status` URL with `consentRequest.id` equal to the stored id and `consentRequest.status` `REQUESTED`. If nobody is there to look at the app, record `needs-human` with the init's REQUEST-ID.

The set's note for the tester describes the older consent-requests and patients APIs. Follow this case as written here.

#### HIU_FLOW_104, the list of consent requests. Mandatory. `screen`

Your system lists the consent requests raised for a patient. Each row shows the ABHA number or address, the patient's name, the date the request was created, its expiry, and its status.

Evidence: the list after HIU_FLOW_102, showing the new request as `REQUESTED`. The status on screen comes from the last `on-status` or `notify` body your system received, not from a value it assumed. `hiecm.concept.consent-artefact`

#### HIU_FLOW_105, a denied request fetches nothing. Mandatory. `human`, `sandbox`, `screen`

Raise a fresh request as in HIU_FLOW_102. Stop and ask the patient to deny it in the PHR app.

Exit condition: a POST arrives at your `notify` URL with `notification.consentRequestId` equal to the stored id and `notification.status` `DENIED`. Your system acknowledges it with `m3_post_consent_v3_request_hiu_on_notify`, `response.requestId` set to the notify's REQUEST-ID, which returns `202`. After that, the call log holds no `m3_post_consent_v3_fetch` and no `m3_post_data_flow_v3_health_information_request` for this request.

Screen check: the request shows as denied, with the time of the denial, and no record is shown for it.

#### HIU_FLOW_106, an approved request, as the patient edited it. Any one of the fetch cases in this group is mandatory. `human`, `sandbox`, `screen`

Raise a fresh request as in HIU_FLOW_102. Stop and ask the patient to approve it, changing at least one of the HI types, the from date, the to date or the expiry before they grant.

Exit condition, in order:

1. A POST arrives at your `notify` URL with `notification.status` `GRANTED` and `notification.consentArtefacts` holding at least one `id`. Store every id.
2. Your system sends `m3_post_consent_v3_request_hiu_on_notify` with one `acknowledgement[]` entry per artefact, `status` `OK` and its `consentId`, and gets `202`.
3. For each artefact, `m3_post_consent_v3_fetch` with `consentId` returns `202`, then a POST arrives at your `on-fetch` URL with `consent.status` `GRANTED` and `consent.consentDetail.consentId` equal to that id.

Screen check: your system shows what the patient granted, read from `consent.consentDetail`: `hiTypes`, `permission.dateRange.from`, `permission.dateRange.to` and `dataEraseAt`, which differ from what you requested. It also shows the time of the grant.

#### Fetching and showing the records, shared by the next seven cases

Each fetch case runs this under an artefact from HIU_FLOW_106 that covers its HI type. `sandbox`, then `screen`.

1. Generate a fresh Curve25519 key pair and nonce for this request.
2. Send `m3_post_data_flow_v3_health_information_request` with `hiRequest.consent.id`, a `hiRequest.dateRange` inside the granted range, your `hiRequest.dataPushUrl`, and `hiRequest.keyMaterial`: `cryptoAlg` `ECDH`, `curve` `curve25519`, `dhPublicKey.expiry`, `dhPublicKey.parameters`, `dhPublicKey.keyValue` and `nonce`. It returns `202`.
3. A POST arrives at your `on-request` URL with `hiRequest.transactionId` present and `error` absent or null. Store the `transactionId` against the private key.
4. The HIP posts to your data push URL with the same `transactionId` and `entries[]`. Each entry carries `content`, `media` `application/fhir+json`, `checksum` and `careContextReference`, beside the HIP's `keyMaterial`.
5. Your system decrypts each entry with the private key it generated for this request, the HIP's `keyMaterial.dhPublicKey.keyValue`, and both nonces. The MD5 of the decrypted content equals `checksum`, and the content parses as a FHIR bundle.
6. Your system sends `m3_post_data_flow_v3_health_information_notify` with `notification.transactionId`, `notification.notifier.type` `HIU`, `statusNotification.sessionStatus` `RECEIVED` and one `statusResponses[]` entry per care context with `hiStatus` `OK`. It returns `202`.

Optional: `m3_get_data_flow_v3_health_information_request_status_tra_550104` with the `transactionId` returns `200` with `status` present. Paste it.

Exit condition: steps 2 to 6 observed and pasted, and the screen shows the decrypted record of that HI type. Never paste decrypted content into the run record; paste the checksum match.

If the patient's HIP holds no record of the type, record the case `not-run` with that reason. If you do not claim the type, record `not-run` too. The set marks the fetch cases as a group: at least one of them must pass.

| Case | HI type in the set | `hiTypes` value | Exit condition beyond the shared steps |
|---|---|---|---|
| HIU_FLOW_107 | Diagnostic report, structured or unstructured | `DiagnosticReport` | The diagnostic report is shown, with its FHIR bundle |
| HIU_FLOW_108 | Prescription, structured or unstructured | `Prescription` | The prescription is shown, with its FHIR bundle |
| HIU_FLOW_109 | Discharge summary, structured or unstructured | `DischargeSummary` | The discharge summary is shown, with its FHIR bundle |
| HIU_FLOW_110 | Consultation note, structured or unstructured | `OPConsultation` | The consultation note is shown, with its FHIR bundle |
| HIU_FLOW_111 | Immunization record, structured or unstructured | `ImmunizationRecord` | The immunization record is shown, with its FHIR bundle |
| HIU_FLOW_112 | Health record, structured or unstructured | `HealthDocumentRecord` | The health document is shown, with its FHIR bundle |
| HIU_FLOW_113 | Wellness record, structured or unstructured | `WellnessRecord` | The wellness record is shown, with its FHIR bundle |

### 2. Revoke Consent Request

Loop limit: 3 passes per test case.

#### HIU_FLOW_201, the PHR app offers revocation. Mandatory for PHR apps. `human`, `screen`

The set applies this case to PHR apps, not to an HIU. A PHR app shows an option to revoke a granted consent, and records when it was revoked. `hiecm.concept.consent-in-a-phr-app`

If your system is an HIU only, record `not-run` with the reason "applies to PHR apps". The revocation itself is still the human step of HIU_FLOW_202.

#### HIU_FLOW_202, a revoked consent shows no records. Mandatory. `human`, `sandbox`, `screen`

Start from a consent granted in HIU_FLOW_106 whose records your system has shown. Stop and ask the patient to revoke it for your HIU in the PHR app.

Exit condition, in order:

1. A POST arrives at your `notify` URL with `notification.status` `REVOKED` and the artefact ids in `notification.consentArtefacts`.
2. Your system acknowledges it with `m3_post_consent_v3_request_hiu_on_notify` and gets `202`.
3. `m3_post_consent_v3_fetch` for a revoked artefact returns `202`, then `on-fetch` arrives with `consent.status` `REVOKED`.
4. The call log holds no `m3_post_data_flow_v3_health_information_request` under that artefact after the notify.

Screen check: the records fetched under that consent are no longer shown. The consent list shows the consent as revoked, with the time of revocation.

### 3. Expiry of Consent Request

Applies to: HIU. Mandatory.

Loop limit: 3 passes per test case.

#### HIU_FLOW_301, an expired consent shows no records. Mandatory. `human`, `sandbox`, `screen`

Raise a fresh request. Stop and ask the patient to grant it with the shortest expiry the PHR app allows. Fetch the records once as in HIU_FLOW_106. Wait past the expiry.

Exit condition: `m3_post_consent_v3_fetch` for the artefact returns `202`, then `on-fetch` arrives with `consent.status` `EXPIRED`. If a `notify` arrives with `notification.status` `EXPIRED`, paste it too and acknowledge it as in HIU_FLOW_105. After the expiry, the call log holds no `m3_post_data_flow_v3_health_information_request` under that artefact.

Screen check: the records are no longer shown, and the consent list shows the consent as expired, with the time of expiry.

A request the patient never answers expires too. That is the request window, not the consent's validity. `m3_post_consent_v3_request_status` then answers on `on-status` with `consentRequest.status` `EXPIRED`. It is worth a run, but it is not this case.

## When the last case is recorded

Write the manifest. It is the whole report. Case ids to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no private keys, no client secret, no decrypted records.

```json
{
  "skill": "abdm-m3",
  "set": "M3 Building HIU, NHA, August 2022 sheet",
  "entity": "private",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "HIU_FLOW_102", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c...", "2d7a..."],
     "observed": ["init 202, on-init consentRequest.id present", "init without purpose.code 400 [0].error.code=ABDM-9999"]},
    {"id": "HIU_FLOW_104", "outcome": "passed", "evidence": "screen",
     "attachment": "consent-list-2026-10-01.png", "rule": "hiecm.concept.consent-artefact"},
    {"id": "HIU_FLOW_108", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["4e19...", "c3a0..."],
     "observed": ["health-information/request 202, on-request transactionId present", "push entries 1, checksum matched", "health-information/notify 202 sessionStatus=RECEIVED"]},
    {"id": "HIU_FLOW_202", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "revocation is the patient's step in the PHR app; nobody present"},
    {"id": "HIU_FLOW_201", "outcome": "not-run", "reason": "applies to PHR apps"}
  ]
}
```

Then say three lines. First, how many cases passed, failed, need a human and were not run. Second, which mandatory cases are not `passed`; the fetch cases count as passed when at least one of them is. Third, the one case to fix first.
