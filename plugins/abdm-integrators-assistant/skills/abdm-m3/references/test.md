# HIE-CM m3 test

Walks the ABDM M3 functional test cases, Health Information User, against the system you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every M3 test case against your system and the sandbox, one case at a time: raising a consent request, the patient's grant, denial, revocation or expiry, and fetching and showing the records
- Records, for each case, the acknowledgement and the callback that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your HIU service id | Your registration. It is the `X-HIU-ID` header and `consent.hiu.id` in the request |
| A public callback URL, reachable from the internet | Your deployment, or a tunnel to a local build. Register it with `gateway_patch_gateway_v3_bridge_url`. Every M3 answer arrives there as a POST. A 202 alone never passes a case |
| A data push URL, reachable from the internet | The URL you send as `hiRequest.dataPushUrl`. The HIP posts the encrypted records to it directly |
| A test patient with an ABHA address ending `@sbx`, and a PHR app on their phone | Present at the desk for the run. Every grant, denial and revocation is theirs to make in that app, and the skill stops for each |
| A HIP that holds records for that patient, of each HI type you claim | Your own M2 build or any sandbox HIP the patient is linked to. A mandatory fetch case whose type no linked HIP holds is recorded `needs-human` |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the sandbox directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's test case workbook for this module, if results go into it | The workbook NHA sent you, copied into `abdm-ft/`. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |

## Say one of these

- "Walk the M3 test cases against my sandbox and log each one."
- "Run only the consent cases, HIU_FLOW_102 and HIU_FLOW_103."
- "Re-run HIU_FLOW_108, the prescription fetch failed yesterday."
- "Write a terminal script that runs the M3 test cases and asks me when the patient has approved."

## What happens first

These runs are API functional tests, the `ft` run type: your system against the sandbox, judged on calls and callbacks. One question: which cases. All of them, one function group, or a list of ids. Then the preconditions for the first case are checked before anything is sent. They are a fresh session token, the bridge URL registered, and a POST from outside your network arriving at your callback URL. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

**Readiness check.** The run does not start until every row of "What it needs from you" that the chosen cases use is confirmed. Ask for each one in the terminal, one at a time. Record each in the run log's header as `ready`, `missing` or `not needed`, never the value itself.

| Row | Ready when |
|---|---|
| Credentials | They are set in the environment or typed at a hidden prompt, and the first session call the cases use returns its token |
| Your system | It answers on the address you gave, against the sandbox hosts |
| People and devices | Each is named for this run: who receives the OTPs, who approves in the PHR app, which device scans |
| Entity type and claimed capabilities | Answered, because they decide which cases are mandatory |
| The run log | Its folder exists and can be written: `abdm-ft/` in your repository unless you name another |
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. `not needed` when no workbook was given |

A `missing` row that a mandatory case needs stops the run before the first call. Say what is missing and ask the one question that would fix it.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last acknowledgement, the last callback body, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

M3 calls are asynchronous. The gateway answers `202` with no body, and the answer arrives later as a POST to your callback URL. An exit condition names both. `hiecm.concept.asynchronous-callbacks`

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim: the acknowledgement and the callback body | The callback was not pasted. A 202 with no callback is not a pass |
| `failed` | Three passes and the exit condition was not observed, or the sandbox sent the answer the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached a grant, a denial or a revocation in the PHR app, and the patient was not there or did not act. Or a mandatory fetch case found no linked HIP holding a record of its HI type | Ever as a substitute for a fail you can see |
| `not-run` | The case does not apply to your entity, you do not claim an optional HI type, or ABDM publishes no operation for it | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one or more of these. They decide what the manifest carries.

- **sandbox.** A call the gateway sees. Evidence is the `202`, the REQUEST-ID, and the callback body that answered it, pasted. The exit condition is a literal in the callback. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. A screen case is attested, not observed, and the manifest marks it so.
- **human.** A step only the patient can do in their PHR app. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Fresh `REQUEST-ID` on every call, logged before sending. The callback carries it back as `response.requestId`, and after a failure it is the only handle on the call.
- Paste the response and the callback. A step with no pasted output is not done.
- The set decides the outcome. A refusal the set asks for, such as a wrong OTP where the case names one, is part of the pass. A refusal the set does not ask for is labelled "Extra check, not in the set" in the case: run it, log it, and never let it decide the outcome.
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

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/m3-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case chosen gets a row before the first call, each `pending`.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# M3 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| HIU_FLOW_102 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| HIU_FLOW_103 | needs-human | b7a1... | patient asked to look in the PHR app, no answer |
| HIU_FLOW_104 | running | | |
| HIU_FLOW_105 | pending | | |
```

### Authentication is never skipped

Every step that needs someone to authenticate stops and asks in the terminal. That covers the session token, every OTP, a password or PIN, a captcha, a biometric scan, a hosted login page, and a consent or subscription the person approves in their PHR app.

| Do | Never |
|---|---|
| Prompt at the moment the case needs it, naming what is needed and where it went, such as "the OTP sent to the mobile ending 1234" | Skip the step and go on to the next call |
| Read OTPs, passwords and secrets with input hidden, and hold them only for that call | Use a fixed, test or default OTP, or one from an earlier run |
| Fetch a fresh session token at the start of the run from the credentials in the readiness check | Hard code a token, or reuse one from an earlier run |
| Wait while the person approves on their phone, then observe the callback or status that proves it | Mock, stub or replay a response so the case can carry on |
| Record `needs-human` only after the prompt was shown and left blank | Record any outcome for an authentication step that was never asked |

A runner that reaches an authenticated call without asking is broken, not finished. Stop, fix the runner, and run the case again.

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Before the first case, run the readiness check and create the run log | A run that starts without its credentials, people or devices fails cases for the wrong reason |
| Every step in "Authentication is never skipped" is a terminal prompt, read with input hidden | A skipped login proves nothing, and a runner that never asks reaches no success path |
| Update the run log after every case, then write the manifest beside it at the end | The person follows the run as it happens, and a stopped run resumes from the log |
| Name every check by its case id from this skill, such as `HIU_FLOW_102`. Never invent a numbering such as `TC01` | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| The runner listens on the callback URL, or reads your callback log, and matches each callback to its call by `response.requestId` | Every M3 answer is a callback. A runner that only reads the 202 sees nothing |
| At each `human` step, stop and prompt in the terminal: "Approve the request in the PHR app, then press Enter, or leave blank if nobody is here" | Every grant, denial and revocation is the patient's. A runner that never asks never reaches one |
| Never write a private key, a token or a decrypted record to disk, a log or the manifest, and never hard code one | They belong to the patient and to that request, not to the run |
| Run each `sandbox` case's success path and each refusal its exit condition names, as separate checks. Run a refusal labelled "Extra check, not in the set" too, and log it on its own line | The outcome is decided only by what the set asks. An extra check is logged, and never passes or fails the case |
| Compare the status and the callback literal the exit condition names, such as `202` then `notification.status` `GRANTED`, or `400` with an array element whose `error.code` is `ABDM-9999` | A status alone never passes a check. A `202` alone never passes one |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| Wait for a callback for a stated time, such as 60 seconds, then record what was observed | A callback that never comes is a fail to escalate, not a pass to assume |
| At the end, print one line per case id with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this.

```text
HIU_FLOW_102  init  REQUEST-ID 6f1c...  HTTP 202
HIU_FLOW_102  on-init  response.requestId 6f1c...  consentRequest.id present  matched
HIU_FLOW_102  extra check, not in the set: init, no purpose.code  REQUEST-ID 2d7a...  HTTP 400  error.code ABDM-9999 in the array  logged
HIU_FLOW_102  passed
HIU_FLOW_106  Approve the request in the PHR app, then press Enter, or leave blank if nobody is here:
HIU_FLOW_106  notify  notification.status GRANTED  consentArtefacts 2  matched
HIU_FLOW_106  on-notify  REQUEST-ID 81b0...  HTTP 202
HIU_FLOW_106  fetch x2  on-fetch consent.status GRANTED x2  matched
HIU_FLOW_106  passed
```

Nudge: calls with a malformed `consentRequestId`, an unknown `consentId` or a stale token test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts. The callback reachability check before the run is a `preflight` too.

## Test cases

The ids, the mandatory marks and the wording of each check are ABDM's, from the M3 Building HIU set NHA revised on 21 October 2026. The sections are grouped and numbered as the set groups them; the set numbers two groups 3. The operation ids are the ones in `references/integrate.md`, which carries the host, the headers and a full request.

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

#### HIU_FLOW_102, raise a consent request for a registered patient. Mandatory. `sandbox`, `screen`

The user enters the ABHA address of a patient already registered in your system, a purpose, a date range, a consent expiry and one or more of the eight HI types, and submits the request.

Calls: `m3_post_consent_v3_request_init` with `consent.purpose.code` from the published list (`CAREMGT` for care), `consent.patient.id`, `consent.hiu.id`, `consent.requester`, `consent.hiTypes`, and `consent.permission` with `accessMode`, `dateRange.from`, `dateRange.to`, `dataEraseAt` and `frequency`.

Exit condition: the init returns `202`, then a POST arrives at your `on-init` URL with `consentRequest.id` present, `error` absent or null, and `response.requestId` equal to the REQUEST-ID you sent. Store `consentRequest.id`.

Extra check, not in the set: the same init with `consent.purpose.code` left out returns `400` with an element of the array with `error.code` `ABDM-9999` and `error.message` `Consent purpose code cannot be null`. Your screen shows that message. Log it; it does not decide the outcome.

Screen check alongside: the form offers the eight HI types as ABDM lists them, and the date range and expiry are entered, not defaulted silently. After submitting, your system shows the request with the patient's name, ABHA address, ABHA number, HI types, purpose, from and to dates, consent expiry, the status `Requested`, and the date and time it was raised.

#### HIU_FLOW_103, the request reaches the patient's PHR app. Mandatory. `human`, `sandbox`

Stop and ask the patient: "Do you see a consent request from this HIU in your PHR app, and does it show the requester, the purpose, the date range, the HI types and the expiry you asked for?" Their yes is the human observation. Do not let them approve or deny yet.

Then call `m3_post_consent_v3_request_status` with the stored `consentRequestId`.

Exit condition: the status call returns `202`, then a POST arrives at your `on-status` URL with `consentRequest.id` equal to the stored id and `consentRequest.status` `REQUESTED`. If nobody is there to look at the app, record `needs-human` with the init's REQUEST-ID.

The set also says the patient may edit the request before granting, and the edited values then show in your system. HIU_FLOW_106 checks that.

#### HIU_FLOW_104, the list of consent requests. Mandatory. `screen`

Your system lists the consent requests raised for a patient. Each row shows the ABHA number or address, the patient's name, the date the request was created, its expiry, and its status.

Evidence: the list after HIU_FLOW_102, showing the new request as `REQUESTED`, and the same list again once the later cases have run, showing each request as granted, denied, expired or revoked with the date and time of that change. The status on screen comes from the last `on-status` or `notify` body your system received, not from a value it assumed. `hiecm.concept.consent-artefact`

### 3. Consent Request Denied

Applies to: HIU.

Loop limit: 3 passes per test case.

#### HIU_FLOW_105, a denied request fetches nothing. Mandatory. `human`, `sandbox`, `screen`

Raise a fresh request as in HIU_FLOW_102. Stop and ask the patient to deny it in the PHR app.

Exit condition: a POST arrives at your `notify` URL with `notification.consentRequestId` equal to the stored id and `notification.status` `DENIED`. Your system acknowledges it with `m3_post_consent_v3_request_hiu_on_notify`, `response.requestId` set to the notify's REQUEST-ID, which returns `202`. After that, the call log holds no `m3_post_consent_v3_fetch` and no `m3_post_data_flow_v3_health_information_request` for this request.

Screen check: the request shows as denied, with the time of the denial, and no record is shown for it.

### 3. Consent Request Granted

Applies to: HIU.

Loop limit: 3 passes per test case.

#### HIU_FLOW_106, a granted request, as the patient edited it. Mandatory. `human`, `sandbox`, `screen`

Raise a fresh request as in HIU_FLOW_102. Stop and ask the patient to approve it, changing at least one of the HI types, the from date, the to date or the expiry before they grant.

Exit condition, in order:

1. A POST arrives at your `notify` URL with `notification.status` `GRANTED` and `notification.consentArtefacts` holding at least one `id`. Store every id.
2. Your system sends `m3_post_consent_v3_request_hiu_on_notify` with one `acknowledgement[]` entry per artefact, `status` `OK` and its `consentId`, and gets `202`.
3. For each artefact, `m3_post_consent_v3_fetch` with `consentId` returns `202`, then a POST arrives at your `on-fetch` URL with `consent.status` `GRANTED` and `consent.consentDetail.consentId` equal to that id.

Screen check: the request shows as granted, with the time of the grant. Your system shows what the patient granted, read from `consent.consentDetail`: `hiTypes`, `permission.dateRange.from`, `permission.dateRange.to` and `dataEraseAt`, which differ from what you requested. Records of a type the patient did not grant are never shown.

#### Fetching and showing the records, shared by the next eight cases

Each fetch case runs this under an artefact from HIU_FLOW_106 that covers its HI type. `sandbox`, then `screen`.

1. Generate a fresh Curve25519 key pair and nonce for this request.
2. Send `m3_post_data_flow_v3_health_information_request` with `hiRequest.consent.id`, a `hiRequest.dateRange` inside the granted range, your `hiRequest.dataPushUrl`, and `hiRequest.keyMaterial`: `cryptoAlg` `ECDH`, `curve` `curve25519`, `dhPublicKey.expiry`, `dhPublicKey.parameters`, `dhPublicKey.keyValue` and `nonce`. It returns `202`.
3. A POST arrives at your `on-request` URL with `hiRequest.transactionId` present and `error` absent or null. Store the `transactionId` against the private key.
4. The HIP posts to your data push URL with the same `transactionId` and `entries[]`. Each entry carries `content`, `media` `application/fhir+json`, `checksum` and `careContextReference`, beside the HIP's `keyMaterial`.
5. Your system decrypts each entry with the private key it generated for this request, the HIP's `keyMaterial.dhPublicKey.keyValue`, and both nonces. The MD5 of the decrypted content equals `checksum`, and the content parses as a FHIR bundle.
6. Your system sends `m3_post_data_flow_v3_health_information_notify` with `notification.transactionId`, `notification.notifier.type` `HIU`, `statusNotification.sessionStatus` `RECEIVED` and one `statusResponses[]` entry per care context with `hiStatus` `OK`. It returns `202`.

Optional: `m3_get_data_flow_v3_health_information_request_status_tra_550104` with the `transactionId` returns `200` with `status` present. Paste it.

Exit condition: steps 2 to 6 observed and pasted, and the screen shows the decrypted record of that HI type. Never paste decrypted content into the run record; paste the checksum match.

The set marks each fetch case mandatory for private integrators and optional for government ones. For a private integrator, if no linked HIP holds a record of the type, record the case `needs-human` with the reason "no linked HIP holds a <type> record". It still shows as a mandatory case not passed: find a HIP that holds the type and run it again. For a government integrator, a fetch case for a type you do not claim is `not-run`.

| Case | HI type in the set | `hiTypes` value | Exit condition beyond the shared steps |
|---|---|---|---|
| HIU_FLOW_107 | Diagnostic report, structured or unstructured | `DiagnosticReport` | The diagnostic report is shown, with its FHIR bundle |
| HIU_FLOW_108 | Prescription, structured or unstructured | `Prescription` | The prescription is shown, with its FHIR bundle |
| HIU_FLOW_109 | Discharge summary, structured or unstructured | `DischargeSummary` | The discharge summary is shown, with its FHIR bundle |
| HIU_FLOW_110 | Consultation note, structured or unstructured | `OPConsultation` | The consultation note is shown, with its FHIR bundle |
| HIU_FLOW_111 | Immunization record, structured or unstructured | `ImmunizationRecord` | The immunization record is shown, with its FHIR bundle |
| HIU_FLOW_112 | Health record, structured or unstructured | `HealthDocumentRecord` | The health document is shown, with its FHIR bundle |
| HIU_FLOW_113 | Wellness record, structured or unstructured | `WellnessRecord` | The wellness record is shown, with its FHIR bundle |
| HIU_FLOW_114 | Invoice, structured | `Invoice` | The invoice is shown, with its FHIR bundle |

### 4. Consent Request Expired

Applies to: HIU.

Loop limit: 3 passes per test case.

#### HIU_FLOW_301, a request nobody answers expires. Mandatory. `human`, `sandbox`, `screen`

Raise a fresh request as in HIU_FLOW_102 with the shortest expiry your form allows, such as two minutes. Tell the patient not to act on it in the PHR app. Wait past the expiry.

Exit condition: `m3_post_consent_v3_request_status` with the stored `consentRequestId` returns `202`, then a POST arrives at your `on-status` URL with `consentRequest.id` equal to the stored id and `consentRequest.status` `EXPIRED`. If a `notify` arrives with `notification.status` `EXPIRED`, paste it too and acknowledge it as in HIU_FLOW_105. The call log holds no `m3_post_consent_v3_fetch` and no `m3_post_data_flow_v3_health_information_request` for this request.

Screen check: the request shows as expired without anyone changing it by hand, with the time of expiry, and no record is shown for it.

A consent the patient granted also expires, at its `dataEraseAt`. That is the consent's validity, not this case. Once it passes, `m3_post_consent_v3_fetch` answers on `on-fetch` with `consent.status` `EXPIRED`, and your system stops showing the records. It is worth a run, but the set does not ask for it.

### 5. Consent Request Revoked

Applies to: HIU.

Loop limit: 3 passes per test case.

#### HIU_FLOW_201, the patient revokes a granted consent in the PHR app. Mandatory. `human`, `sandbox`, `screen`

Start from a consent granted in HIU_FLOW_106 whose records your system has shown. Stop and ask the patient to open the consents in their PHR app, select the one granted to your HIU, and revoke it. `hiecm.concept.consent-in-a-phr-app`

Exit condition: a POST arrives at your `notify` URL with `notification.status` `REVOKED` and the artefact ids in `notification.consentArtefacts`, and your system acknowledges it with `m3_post_consent_v3_request_hiu_on_notify`, which returns `202`. If nobody is there to revoke, record `needs-human`.

Screen check: your consent list shows the consent as revoked, with the time of revocation.

#### HIU_FLOW_202, a revoked consent shows no records. Mandatory. `sandbox`, `screen`

Runs after HIU_FLOW_201, on the same consent.

Exit condition, in order:

1. `m3_post_consent_v3_fetch` for a revoked artefact returns `202`, then `on-fetch` arrives with `consent.status` `REVOKED`.
2. The call log holds no `m3_post_data_flow_v3_health_information_request` under that artefact after the notify.

Screen check: open the revoked consent in your system and try to view its records. The records fetched under it are no longer shown, and your system says the consent was revoked rather than showing an empty record.

## Writing results into NHA's workbook

Ask for the workbook in the readiness check, and save the script below as `abdm-ft/abdm_workbook.py` before that check, because the check runs it. With a workbook, every case ends by writing its result into the sheet as below, after the run log row is updated. Without one, the run log and the manifest are the record, as before.

### In plain words

NHA publishes each module's functional test cases as a workbook, one row per
case id. A test run writes its result into that same workbook: the status, the
response or error code that decided it, how many passes the case took, and a
remark. The run log and the manifest stay as they are. The workbook is what a
reviewer reads.

A run is one of two types, and each writes to its own columns, so one never
overwrites the other:

| Run type | What it tests | Columns it fills |
|---|---|---|
| `ft`, API functional test | Your system against the sandbox, judged on calls and callbacks | `FT Status`, `FT Response with Code`, `FT Iterations`, `FT Remarks`, added after the last column |
| `ui`, UI test | Your screens, driven by an agent | NHA's own `Status(PASS/FAIL)`, `Response of Request with Code`, `Iterations`, `Remarks`, the first of each where a sheet has two. A sheet without one gets it added. Where NHA already wrote in that cell, such as the consent language in HPR's Remarks, NHA's text stays and the value goes in an added `<column> (run)` column |

| Outcome | Status written | Remarks written |
|---|---|---|
| `passed` | `PASS` | what matched |
| `failed` | `FAIL` | the reason: the HTTP status and ABDM error code, the missing callback, or the exception from your server log |
| `needs-human` | blank | `Needs tester:` and the step that was left |
| `not-run` | `NA` | why it does not apply |

### Before you start

- The workbook for the module, as NHA published it, in your repository beside the run log, such as `abdm-ft/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx`. M4 has two, HFR and HPR: each is its own workbook with its own results file.
- Python 3.9 or later with `openpyxl` and `Pillow`: `pip install openpyxl pillow`. Pillow is what keeps the sheet's logos when it is saved.
- The script below, saved as `abdm-ft/abdm_workbook.py` before the readiness check, which runs it.

```python
"""Read NHA's functional test case workbook and write a run's results into it.

  python3 abdm_workbook.py cases  WORKBOOK
  python3 abdm_workbook.py write  WORKBOOK --run ft|ui --results RESULTS.json
  python3 abdm_workbook.py open   WORKBOOK --run ft|ui

Needs openpyxl and Pillow (pip install openpyxl pillow); Pillow keeps the
sheet's logos when it is saved.
"""
import argparse, json, re, shutil, sys
from copy import copy
from datetime import date
from pathlib import Path

import openpyxl

# Where each result goes. A ui run fills NHA's own columns, an ft run its own
# four, so neither overwrites the other. The first column a name matches is
# used; a field no name matches gets a column added after the last header.
COLUMNS = {
    "ui": {"status": ["Status(PASS/FAIL)", "Status"], "response": ["Response of Request with Code"],
           "iterations": ["Iterations"], "remarks": ["Remarks", "Remark"]},
    "ft": {"status": ["FT Status"], "response": ["FT Response with Code"],
           "iterations": ["FT Iterations"], "remarks": ["FT Remarks"]},
}
STATUS = {"passed": "PASS", "failed": "FAIL", "needs-human": "", "not-run": "NA"}
CLOSED = {"PASS", "NA"}
HEADER_BLOCK = {"Test Executed by:": "executed_by", "Test Execution date:": "date",
                "Application/ System Name:": "application"}


def norm(text):
    return re.sub(r"\s+", " ", str(text or "")).strip()


def load(path):
    # rich_text keeps the bold and coloured runs inside NHA's cells.
    return openpyxl.load_workbook(path, rich_text=True)


def header_row(ws):
    """The header row and, for each name, the first column carrying it."""
    for row in ws.iter_rows(min_row=1, max_row=15):
        names = [norm(c.value) for c in row]
        if "Test Case ID" in names:
            cols = {}
            for name, cell in zip(names, row):
                if name:
                    cols.setdefault(name, cell.column)
            return row[0].row, cols
    return None, {}


def cases(ws):
    """Case id to its first row. A repeated id gets #2, #3, as the page does."""
    top, cols = header_row(ws)
    if top is None:
        return {}
    found, col = {}, cols["Test Case ID"]
    for r in range(top + 1, ws.max_row + 1):
        value = norm(ws.cell(r, col).value)
        if not value:
            continue
        base = key = value.replace(" ", "")
        n = 2
        while key in found:
            key, n = base + "#" + str(n), n + 1
        found[key] = r
    return found


def anchor(ws, row, col):
    """A value written inside a merged range belongs in its top left cell."""
    for rng in ws.merged_cells.ranges:
        if rng.min_row <= row <= rng.max_row and rng.min_col <= col <= rng.max_col:
            return ws.cell(rng.min_row, rng.min_col)
    return ws.cell(row, col)


def add_column(ws, top, cols, name):
    last = max(cols.values())
    new = last + 1
    head = ws.cell(top, new, name)
    model = ws.cell(top, last)
    for attr in ("font", "fill", "border", "alignment"):
        setattr(head, attr, copy(getattr(model, attr)))
    letter = openpyxl.utils.get_column_letter
    ws.column_dimensions[letter(new)].width = ws.column_dimensions[letter(last)].width or 18
    cols[name] = new
    return new


def column(ws, top, cols, names):
    for name in names:
        if name in cols:
            return cols[name]
    return add_column(ws, top, cols, names[0])


def index(wb):
    rows, twice = {}, []
    for ws in wb.worksheets:
        for case, row in cases(ws).items():
            if case in rows:
                twice.append(case)
            rows.setdefault(case, (ws, row))
    if twice:
        sys.exit("case id on more than one tab: " + ", ".join(twice))
    return rows


def write(path, run, results, meta):
    path = Path(path)
    backup = path.with_name(f"{path.stem}.before-abdm-run{path.suffix}")
    if not backup.exists():
        shutil.copy2(path, backup)
    original = load(backup)
    wb = load(path)
    rows = index(wb)
    where = {}
    for ws in wb.worksheets:
        top, cols = header_row(ws)
        if top is None:
            continue
        where[ws.title] = (top, cols, {k: column(ws, top, cols, names) for k, names in COLUMNS[run].items()})
        # The header block above the table: tester, date, application.
        for line in ws.iter_rows(min_row=1, max_row=top - 1):
            for cell in line:
                text = norm(cell.value)
                for label, key in HEADER_BLOCK.items():
                    if text.startswith(label) and meta.get(key):
                        cell.value = f"{label} {meta[key]}"
    missing = []
    for r in results:
        if r["id"] not in rows:
            missing.append(r["id"])
            continue
        if r["outcome"] not in STATUS:
            sys.exit(f"{r['id']}: outcome must be one of {', '.join(STATUS)}")
        ws, row = rows[r["id"]]
        top, cols, fields = where[ws.title]
        remarks = r.get("remarks", "")
        if r["outcome"] == "needs-human":
            remarks = f"Needs tester: {remarks}".strip()
        values = {"status": STATUS[r["outcome"]], "response": r.get("response", ""),
                  "iterations": r.get("iterations", ""), "remarks": remarks}
        for key, value in values.items():
            cell = anchor(ws, row, fields[key])
            if norm(original[ws.title][cell.coordinate].value):
                # NHA wrote in this cell. Its text stays; the value goes beside it.
                name = f"{norm(ws.cell(top, fields[key]).value)} (run)"
                cell = anchor(ws, row, cols.get(name) or add_column(ws, top, cols, name))
            cell.value = value
    wb.save(path)
    return missing


def status_of(ws, row, col):
    return norm(anchor(ws, row, col).value)


def still_open(path, run):
    """Cases that are not yet PASS or NA in this run type's status column."""
    wb = load(path)
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        col = next((cols[n] for n in COLUMNS[run]["status"] if n in cols), None)
        if col is None:
            print(case)
            continue
        status = status_of(ws, row, col)
        run_col = cols.get(f"{norm(ws.cell(top, col).value)} (run)")
        if run_col and status not in CLOSED:
            status = status_of(ws, row, run_col)
        if status not in CLOSED:
            print(case)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["cases", "write", "open"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"])
    p.add_argument("--results")
    p.add_argument("--executed-by", default="")
    p.add_argument("--application", default="")
    a = p.parse_args()
    if a.action == "cases":
        wb = load(a.workbook)
        print(json.dumps({ws.title: list(cases(ws)) for ws in wb.worksheets}, indent=1))
    elif a.action == "open":
        still_open(a.workbook, a.run or sys.exit("--run is needed"))
    else:
        if not (a.run and a.results):
            sys.exit("write needs --run and --results")
        meta = {"executed_by": a.executed_by, "application": a.application,
                "date": date.today().isoformat()}
        missing = write(a.workbook, a.run, json.loads(Path(a.results).read_text()), meta)
        for case in missing:
            print(f"not in the workbook: {case}", file=sys.stderr)
        sys.exit(1 if missing else 0)


if __name__ == "__main__":
    main()
```

### What happens

1. Before the first case, list the case ids the workbook holds:

   ```bash
   python3 abdm-ft/abdm_workbook.py cases <workbook>
   ```

   Run the cases in that list. A case id the skill carries that the workbook lacks is a different version of the set: say so before the run starts.

2. After every case, append its result to `abdm-ft/<workbook name>-<run type>-results.json`, one file per workbook, one object per case:

   ```json
   {"id": "CRT_ABHA_105", "outcome": "failed", "response": "POST /v3/enrollment/request/otp HTTP 400 ABDM-1204", "iterations": 3, "remarks": "Invalid OTP value; OTP read from the wrong field"}
   ```

   `id` is the id `cases` printed. A sheet that repeats an id lists the repeat as `<id>#2`, such as HFR's second bridge linkage, `HFR-118#2` to `HFR-123#2`, and the result for that row uses that id. `iterations` is the number of loop passes the case took, whether it ended passed or failed. Never put a token, OTP, Aadhaar number or full mobile in any field.

3. Then write it into the workbook, so a stopped run loses nothing:

   ```bash
   python3 abdm-ft/abdm_workbook.py write <workbook> --run ft --results abdm-ft/<workbook name>-ft-results.json --executed-by "<tester>" --application "<your system>"
   ```

   The first write copies the workbook to `<name>.before-abdm-run.xlsx` beside it, and every later write reads that copy to tell NHA's text from the run's. Every write rewrites the result cells of every case in the file, so writing again is safe. The header block above the table gets the tester, the date and the application, and a later write updates them. When NHA sends a new version of the workbook, delete the old `.before-abdm-run.xlsx` before the first write to it.

4. To resume, list the cases whose status for the run type is neither `PASS` nor `NA`, and run only those:

   ```bash
   python3 abdm-ft/abdm_workbook.py open <workbook> --run ft
   ```

### How you know it worked

- `write` exits `0` and prints nothing. It exits `1` and prints `not in the workbook: <id>` for any case id the workbook does not hold.
- Opened again, each case's row shows the status, response, iterations and remark you wrote. Every cell NHA filled holds what NHA put there, with its formatting, and the logos, merged cells, column widths and frozen panes are as NHA sent them. Two parts of the file are not kept: printer settings and SharePoint metadata, neither of which a reader sees.
- `open` lists exactly the cases whose status is neither `PASS` nor `NA`.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'openpyxl'` | Not installed | `pip install openpyxl pillow` |
| The logos are gone after a write | Pillow is missing, so the images were not read | Install Pillow, copy `<name>.before-abdm-run.xlsx` back over the workbook, and write again |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts. The script writes neither until it is resolved |
| `not in the workbook: <id>` | The workbook is another version of the set, or the id was typed with a space | Check the id against `cases`. Never rename a case to fit |
| `outcome must be one of` | An outcome outside the four | Use `passed`, `failed`, `needs-human` or `not-run` |
| The workbook will not open in Excel while the run writes | Excel holds a lock on it | Close it in Excel; the next write catches up |

From `shared.concept.test-workbook-write-back`.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It is the whole report. Case ids to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no private keys, no client secret, no decrypted records.

```json
{
  "skill": "abdm-m3",
  "set": "M3 Building HIU, NHA, revised 21 October 2026",
  "entity": "private",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "HIU_FLOW_102", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c...", "2d7a..."],
     "observed": ["init 202, on-init consentRequest.id present", "extra check, not in the set: init without purpose.code 400, error.code=ABDM-9999 in the array"]},
    {"id": "HIU_FLOW_104", "outcome": "passed", "evidence": "screen",
     "attachment": "consent-list-2026-10-01.png", "rule": "hiecm.concept.consent-artefact"},
    {"id": "HIU_FLOW_108", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["4e19...", "c3a0..."],
     "observed": ["health-information/request 202, on-request transactionId present", "push entries 1, checksum matched", "health-information/notify 202 sessionStatus=RECEIVED"]},
    {"id": "HIU_FLOW_201", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "revocation is the patient's step in the PHR app; nobody present"},
    {"id": "HIU_FLOW_114", "outcome": "needs-human", "reason": "no linked HIP holds an Invoice record"}
  ]
}
```

Then say three lines. First, how many cases passed, failed, need a human and were not run. Second, which mandatory cases are not `passed`; for a private integrator that includes every fetch case, HIU_FLOW_107 to 114. Third, the one case to fix first.
