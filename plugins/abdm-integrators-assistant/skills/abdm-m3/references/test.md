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
| For a `ui` run: your application's URL | Your deployment, reachable from the browser on this machine |
| For a `ui` run: a tester login for your application | A test account in your application, read from an environment variable you name or typed at a hidden prompt. It is never written to the run log, the evidence or the workbook |
| For a `ui` run: Node 18 or later, the Playwright MCP server and Chromium | The integrators plugin declares the Playwright MCP server, and `/abdm-test-setup` lists what is missing. Without the plugin, the section "Running a case as a UI test" lists each install command |
| For a `ui` run: one PHR app screenshot for each case that passes through the PHR app | The person with the PHR app sends it, showing the consent granted or the record visible. The agent does not drive the PHR app. It checks your application's side on screen |

## Say one of these

- "Walk the M3 test cases against my sandbox and log each one."
- "Run only the consent cases, HIU_FLOW_102 and HIU_FLOW_103."
- "Re-run HIU_FLOW_108, the prescription fetch failed yesterday."
- "Write a terminal script that runs the M3 test cases and asks me when the patient has approved."
- "Run the M3 test cases as UI tests against my HIU application and fill NHA's workbook."

## What happens first

The first question is the run type. `ft` is the API functional test: your system against the sandbox, judged on calls and callbacks. `ui` is the UI test: an agent drives your application's screens, as the section "Running a case as a UI test" below sets out. `all` runs `ft` for the chosen cases, then `ui`. The second question: which cases. All of them, one function group, or a list of ids. Then the preconditions for the first case are checked before anything is sent. They are a fresh session token, the bridge URL registered, and a POST from outside your network arriving at your callback URL. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

**Readiness check.** The run does not start until every row of "What it needs from you" that the chosen cases use is confirmed. Ask for each one in the terminal, one at a time. Record each in the run log's header as `ready`, `missing` or `not needed`, never the value itself.

| Row | Ready when |
|---|---|
| Credentials | They are set in the environment or typed at a hidden prompt, and the first session call the cases use returns its token |
| Your system | It answers on the address you gave, against the sandbox hosts |
| People and devices | Each is named for this run: who receives the OTPs, who approves in the PHR app, which device scans |
| Entity type and claimed capabilities | Answered, because they decide which cases are mandatory |
| The run log | Its folder exists and can be written: `abdm-ft/` in your repository unless you name another |
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. `not needed` when no workbook was given |
| UI readiness, for a `ui` or `all` run | Every row of the readiness check in "Running a case as a UI test" is `ready`: Node, the Playwright tools, a browser, the application URL and the tester login, and the person who sends the PHR app screenshots. `not needed` for an `ft` run |

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

## Running a case as a UI test

Read this section when the run type is `ui` or `all`. Its readiness check joins the one above, and every rule above still holds.

### In plain words

A test section runs each case in one of three run types. The tester picks one at the start.

| Run type | What it drives | Judged on |
|---|---|---|
| `ft` | Your system's calls against the sandbox. No browser | Calls, responses and callbacks |
| `ui` | Your application's screens: a web application through the Playwright MCP server, a PHR app on Android through Maestro | What the screen shows at each step of the sheet |
| `all` | `ft` for every chosen case first, then `ui` for the same cases | Each type on its own, in its own columns |

`all` runs `ft` first so a backend fault shows before the slower `ui` run starts. A case that has no meaning in a run type, such as a "Create ABHA option is visible" case in an `ft` run, is recorded `not-run` with the run type as the reason.

In a `ui` run, a `screen` case is observed, not attested: the screenshot and the matching line of the page snapshot are its evidence.

### Before you start

The `ui` readiness check runs before the first case. Check every row the chosen cases need, in order. Record each as `ready`, `missing` or `not needed`, never the value itself.

| Need | Ready when | Install command to print when missing |
|---|---|---|
| Node 18 or later | `node --version` prints `v18` or higher | Install the LTS release from https://nodejs.org |
| The Playwright MCP server, connected | Your tool list holds `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_console_messages` and `browser_network_requests`. These are the names the server publishes. Read your own tool list for the exact names, which some agents prefix with the server name | Claude Code with the integrators plugin: restart Claude Code, the plugin declares it. Claude Code without it: `claude mcp add playwright npx @playwright/mcp@latest`. Any other agent: an MCP server with command `npx` and argument `@playwright/mcp@latest` |
| A browser | `browser_navigate` to the application URL returns a page, not an error naming a missing browser | `npx playwright install chromium`. When the error names Chrome, the server's default channel, `npx playwright install chrome` |
| The application URL | `browser_navigate` to it and `browser_snapshot` shows your application's first screen | Ask the tester for it |
| A tester login | Read from an environment variable the tester names, or typed at a hidden prompt, and the login screen accepts it | Ask the tester for it |
| The server log command, optional | The tester gave a command that prints your server's log for a time window, such as `docker logs --since <start> --until <end> <container>` | `not needed` when none is given |
| For a PHR app on Android: a device | `adb devices` lists one line ending in `device` | Android Studio's emulator from https://developer.android.com/studio, or a phone with USB debugging on |
| For a PHR app on Android: the app | `adb shell pm list packages <package>` prints `package:<package>` | `adb install <path to the APK>` |
| For a PHR app on Android: Maestro | `maestro --version` prints a version | `curl -fsSL "https://get.maestro.mobile.dev" \| bash` |

When a row is `missing`: stop, print its install command exactly as above, and wait for the tester to say it is done. Then check the row again. Never install anything yourself. After 3 checks of the same row still `missing`, stop the run and ask one question about that row.

### What happens

For each chosen case, at most 3 passes. Record the number of passes the case took, whether it ended passed or failed.

1. Read the case's Steps and Expected Result from its workbook row, and its exit condition from the skill's case.
2. Follow the Steps in order, on the surface the step names: the web application, or the PHR app.
   - Web: `browser_navigate`, `browser_click`, `browser_type`, reading `browser_snapshot` before each action to find the element.
   - PHR app: write the steps as a Maestro flow at `abdm-ft/maestro/<case id>.yaml` and run `maestro test abdm-ft/maestro/<case id>.yaml`.
3. After step `n`, save one screenshot and the screen's text:

   | Surface | Screenshot | Screen text |
   |---|---|---|
   | Web | `browser_take_screenshot` with `filename` set to `abdm-ft/evidence/<case id>/<n>.png`, which the server resolves against your repository root | `browser_snapshot` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |
   | PHR app | `- takeScreenshot: abdm-ft/evidence/<case id>/<n>` in the flow | `maestro hierarchy` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |

4. An OTP, a password, a captcha or an approval stops the case and asks the tester in the terminal, as in every run type. Read it with input hidden, type it with `browser_type`, and hold it only for that step. The tool's reply repeats what was typed. Never paste that reply into the run log, the evidence or the workbook. Write `<OTP typed>` or `<password typed>` in its place.
5. Judge the case. It is `passed` when the last step's screen text holds both the skill's exit condition and what the sheet's Expected Result names. Paste the matching line into the run log. When one holds and the other does not, the pass failed: say which one is missing.
6. Write the result into the workbook, as `shared.concept.test-workbook-write-back` sets out, with `--run ui`. A `ui` run fills NHA's own columns:

   ```bash
   python3 abdm-ft/abdm_workbook.py write <workbook> --run ui --results abdm-ft/<workbook name>-ui-results.json --executed-by "<tester>" --application "<your application>"
   ```

#### The PHR proof rule

When the run is for an HMIS, an EMR or another HIP, or for an HIU, and a step happens in the PHR app (logging in, approving or denying a consent, pulling records), do not drive the PHR app.

1. Ask the tester for one PHR app screenshot that shows the consent granted or the record visible.
2. Save it as `abdm-ft/evidence/<case id>/phr.png`.
3. Check your application's side of the same step on screen, as in step 3 above.

The case passes only when the PHR screenshot shows the step and your application's screen holds the exit condition. No screenshot from the tester is `needs-human`, with `Needs tester: PHR screenshot` in Remarks.

#### Finding the reason for a failure

Collect the reason in this order, and stop at the first one that names it. The Remarks value carries the reason and the code or exception.

| Order | Look at | How | What it gives |
|---|---|---|---|
| 1 | The error on screen | `browser_snapshot` | The message your application shows |
| 2 | Failed network responses | `browser_network_requests`, then the status and body of each response of 400 or above | The HTTP status and an ABDM error code such as `ABDM-1204` |
| 3 | Browser console errors | `browser_console_messages` | A script error that stopped the screen |
| 4 | One replay of the case's `ft` calls | The same skill's case, run once as `ft`, when the sandbox credentials are ready | The ABDM error code. Diagnosis only: the `ui` outcome stays as observed |
| 5 | Your server log for the case's time window | The command from the readiness check, with the case's start and end times | A backend exception such as `NullPointerException`, which usually appears nowhere else |

```json
{"id": "CRT_ABHA_105", "outcome": "failed", "response": "Screen: Invalid OTP. POST /v3/enrollment/request/otp HTTP 400 ABDM-1204", "iterations": 3, "remarks": "OTP field sent empty; server log: NullPointerException in OtpService.verify"}
```

### How you know it worked

- `abdm-ft/evidence/<case id>/` holds one `<n>.png` and one `<n>.txt` for every step run, and `phr.png` for a case under the PHR proof rule.
- The run log pastes, for every `passed` case, the snapshot line that matched.
- `write` exits `0`, and the workbook row shows `PASS`, `FAIL`, `NA` or blank in `Status(PASS/FAIL)`, a number from 1 to 3 in `Iterations`, and the reason in `Remarks`.
- No OTP, password, token or Aadhaar number appears in the run log, the evidence text, the results file or the workbook.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| No `browser_navigate` in the tool list | The Playwright MCP server is not connected | Print the install command from the readiness table, wait, check again |
| `browser_navigate` fails naming a browser that is not installed | No browser installed | Print the install command from the readiness table, wait, check again |
| The screenshot shows the login screen mid case | The tester's session expired | Log in again, count it as a new pass |
| `adb devices` lists nothing, or `unauthorized` | No emulator running, or the phone has not accepted the computer | Start the emulator, or accept the prompt on the phone |
| `maestro: command not found` | Maestro is not installed or not on the path | Print its install command, wait, check again |
| A step's element is not in the snapshot | The screen differs from the sheet's Steps | Record the pass as failed with the snapshot line nearest to it. Never invent a step |
| The reason is still unknown after all five sources | The fault leaves no trace a `ui` run can see | Record `failed` with what each source showed, and ask the tester for the server log command |

From `shared.concept.test-ui-run`.

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

- The workbook for the module, as NHA published it, in your repository beside the run log, such as `abdm-ft/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx`. M4 has two, HFR and HPR: each is its own workbook with its own results file. The PHR workbook has no case ids: the script builds them from each tab and row, `PHR_ADDR_302` for row 3.2 of the ABHA address creation tab, exactly as the test case page shows them, and its first write adds a `Test Case ID` column holding them.
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
# NHA's PHR sheet numbers its rows but gives them no ids. Each tab is one PHR
# milestone, and a case's id is built the way the HMIS ids are: row 3.2 of the
# P1 tab is PHR_ADDR_302, row 5.1.1 of P2 is PHR_APP_50101, a row numbered 9
# alone is 900. The test case page builds the same ids from the same rows.
PHR_TABS = {"ABHA address creation": "ADDR", "PHR App Functionality": "APP",
            "Building HIU Service for PHR": "HIU", "Locker": "LOCKER"}
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
        if "Test Case ID" in names or (norm(ws.title) in PHR_TABS and any(
                re.fullmatch(r"s\.\s*no", n.lower()) for n in names)):
            cols = {}
            for name, cell in zip(names, row):
                if name:
                    cols.setdefault(name, cell.column)
            return row[0].row, cols
    return None, {}


def lost_zero(number, last):
    """A cell typed 2.10 is stored as 2.1, so after 2.9 a row reading 2.1 is 2.10."""
    parts, before = number.split("."), last.split(".")
    if len(parts) == 2 and len(before) == 2 and parts[0] == before[0]:
        if before[1] == str(int(parts[1]) * 10 - 1):
            return f"{parts[0]}.{int(parts[1]) * 10}"
    return number


def phr_cases(ws, top):
    """PHR case ids, from the row numbers, by the same rules as the page."""
    head = [norm(c.value).lower() for c in ws[top]]
    number = next(i for i, n in enumerate(head) if re.fullmatch(r"s\.\s*no", n)) + 1
    content = [i + 1 for i, n in enumerate(head)
               if n.startswith(("test case", "test scenario")) or "steps" in n or "expected" in n]
    down = {}  # a value merged down one column belongs to every row it spans
    for rng in ws.merged_cells.ranges:
        if rng.min_col == rng.max_col and rng.max_row > rng.min_row:
            for r in range(rng.min_row + 1, rng.max_row + 1):
                down[(r, rng.min_col)] = ws.cell(rng.min_row, rng.min_col).value
    found, last = {}, ""
    for r in range(top + 1, ws.max_row + 1):
        # A number merged down marks one case over several rows: only its first row counts.
        num = "" if (r, number) in down else norm(ws.cell(r, number).value)
        filled = any(norm(down.get((r, c), ws.cell(r, c).value)) for c in content)
        if filled and re.fullmatch(r"\d+(\.\d+)*", num):
            num = lost_zero(num, last)
            last = num
            parts = num.split(".")
            digits = parts[0] + ("".join(p.zfill(2) for p in parts[1:]) if len(parts) > 1 else "00")
            found[f"PHR_{PHR_TABS[norm(ws.title)]}_{digits}"] = r
    return found


def cases(ws):
    """Case id to its first row. A repeated id gets #2, #3, as the page does."""
    top, cols = header_row(ws)
    if top is None:
        return {}
    if "Test Case ID" not in cols:
        return phr_cases(ws, top)
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
        if "Test Case ID" not in cols:
            # The PHR sheet has no id column: add one, so the sheet carries the ids it is read by.
            ids = cases(ws)
            col = add_column(ws, top, cols, "Test Case ID")
            for case, row in ids.items():
                ws.cell(row, col).value = case
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

## Writing the test report

When the last case is recorded, save the script below as `abdm-ft/abdm_report.py` and run `check`. Run `build` only when `check` exits 0.

### In plain words

A functional test run ends with NHA's workbook filled in, one row per case.
The test report is the document a reviewer signs off: who tested what, when,
with which tools, the status of every case, and the evidence for each one. It
is built from the workbook, not written by hand, so the report and the sheet
always agree.

The report is written only when the run has passed. Its gate is every
mandatory case that applies to your entity type, government or private, with
status `PASS` in the run type's column. A mandatory case that is `FAIL`,
`NA` or blank stops it.

| Run type | Report | Evidence per case |
|---|---|---|
| `ui` | The exit report NHA asks for | The screenshots under `abdm-ft/evidence/<case id>/` |
| `ft` | The same structure | The `FT Response with Code` value in place of screenshots |

The report has thirteen sections, in this order: cover, document control,
executive summary, ABDM details, scope, test environment and tools, approach
and methodology, test data, results summary, evidence, failures and iterations
log, conclusion, annexures. Every table comes from the workbook or from
`meta.json`. The only prose you write is the one line finding per case, in
`meta.json`; the executive summary and the conclusion are built from the
counts.

How the `Mandatory/ Optional` column is read:

| Marking in the sheet | Government entity | Private entity |
|---|---|---|
| `Mandatory`, `Yes` | Mandatory | Mandatory |
| `No`, `Optional`, `Non-Mandatory` | Optional | Optional |
| `Mandatory for Private` | Optional | Mandatory |
| `Mandatory for Government` | Mandatory | Optional |
| `Mandatory for Private /Government (Optional only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| `Either of the test cases X or Y is mandatory for Government` | X or Y must pass; one passing satisfies both | The row carrying it is optional; the other case keeps its own marking |
| `Yes (if ...)`, `Yes, if ...`, `Yes(only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| Blank or anything else | Mandatory, flagged unrecognised | Mandatory, flagged unrecognised |

A conditional case your system does not offer still blocks the report until
it is recorded. Record it `not-run` only after NHA agrees it does not apply,
and say so in its remarks: the gate counts `NA` on a mandatory case as not
passed, and the check prints every case it treated as conditional so the
person signing off sees them.

### Before you start

- The workbook the run wrote into, with its results, as `shared.concept.test-workbook-write-back` leaves it.
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `python-docx`, `openpyxl` and `Pillow`: `pip install python-docx openpyxl pillow`. All three are open source (MIT, MIT and the HPND licence).
- LibreOffice, if you want a PDF beside the Word file. Without it, export the PDF from Word or LibreOffice yourself.
- The script below, saved as `abdm-ft/abdm_report.py`.
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`.

```json
{
  "organisation": "<YOUR ORGANISATION'S REGISTERED NAME>",
  "product": "<YOUR PRODUCT NAME>",
  "milestone": "M1",
  "api_version": "V3",
  "category": "HMIS",
  "entity_type": "private",
  "role": "HIP",
  "executed_by": "<TESTER NAME>",
  "test_dates": {"start": "2026-10-20", "end": "2026-10-23"},
  "applications": [{"name": "<YOUR PRODUCT NAME> web", "url": "https://<YOUR TEST HOST>/"}],
  "environment": {
    "browser": "Chromium",
    "browser_version": "<VERSION PLAYWRIGHT REPORTS>",
    "playwright": "<PLAYWRIGHT VERSION>",
    "phr_app": "ABHA app",
    "phr_app_version": "<VERSION ON THE TEST DEVICE>",
    "emulator": "<EMULATOR NAME AND ANDROID VERSION>",
    "model": "<MODEL THAT RAN THE AGENT>"
  },
  "test_data": [
    {"item": "ABHA number used", "value": "XX-XXXX-XXXX-1234"},
    {"item": "ABHA address used", "value": "<TEST ABHA ADDRESS>@sbx"}
  ],
  "document": {
    "id": "FT-M1",
    "version": "1.0",
    "release_date": "2026-10-24",
    "prepared_by": "<NAME, ROLE>",
    "reviewed_by": "<NAME, ROLE>",
    "approved_by": "<NAME, ROLE>",
    "released_by": "<NAME, ROLE>",
    "change_history": [{"version": "1.0", "date": "2026-10-24", "by": "<NAME>", "change": "First issue"}],
    "distribution": [{"name": "<NAME>", "organisation": "<ORGANISATION>", "role": "<ROLE>"}]
  },
  "findings": {"CRT_ABHA_101": "The Create ABHA option opens the Aadhaar consent screen."},
  "recordings": [{"title": "M1 ui run, full trace", "link": "<LINK TO THE RECORDING>"}]
}
```

```python
"""Check that a functional test run may be reported, and write the report.

  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.docx

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. Needs python-docx, openpyxl and Pillow
(pip install python-docx openpyxl pillow). With LibreOffice's soffice on PATH,
build also writes a PDF.
"""
import argparse, json, re, shutil, subprocess, sys
from datetime import date
from pathlib import Path

import openpyxl

# The workbook layout shared.concept.test-workbook-write-back writes: the first
# column a name matches, with a "<column> (run)" column where NHA had text.
COLUMNS = {
    "ui": {"status": ["Status(PASS/FAIL)", "Status"], "response": ["Response of Request with Code"],
           "iterations": ["Iterations"], "remarks": ["Remarks", "Remark"]},
    "ft": {"status": ["FT Status"], "response": ["FT Response with Code"],
           "iterations": ["FT Iterations"], "remarks": ["FT Remarks"]},
}
MARKING = ["Mandatory/ Optional", "Mandatory/Optional", "Mandatory / Optional"]
TITLE = ["Functionality", "Feature"]
OPTIONAL = ("no", "optional", "non-mandatory", "non mandatory", "not mandatory")
FORBIDDEN = re.compile(r"pass(word|wd)|secret|token|credential|api[_ -]?key|private[_ -]?key", re.I)
IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
RUN_NAME = {"ui": "UI functional test", "ft": "API functional test"}
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Scope",
            "Test environment and tools", "Approach and methodology", "Test data",
            "Results summary", "Evidence", "Failures and iterations log", "Conclusion", "Annexures"]


def norm(text):
    return re.sub(r"\s+", " ", str(text if text is not None else "")).strip()


def mask(text):
    """ABHA numbers to XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234."""
    text = re.sub(r"(?<!\d)\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XX-XXXX-XXXX-\1", str(text))
    return re.sub(r"(?<!\d)\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XXXX XXXX \1", text)


def load(path):
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
    """Case id to its first row. A repeated id gets #2, #3, as the writer does."""
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
    for rng in ws.merged_cells.ranges:
        if rng.min_row <= row <= rng.max_row and rng.min_col <= col <= rng.max_col:
            return ws.cell(rng.min_row, rng.min_col)
    return ws.cell(row, col)


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


def value(ws, row, top, cols, names):
    """The run's value: its "(run)" column when that holds one, else the column."""
    col = next((cols[n] for n in names if n in cols), None)
    if col is None:
        return ""
    run_col = cols.get(norm(ws.cell(top, col).value) + " (run)")
    if run_col:
        got = norm(anchor(ws, row, run_col).value)
        if got:
            return got
    return norm(anchor(ws, row, col).value)


def classify(text, entity):
    """(kind, label, note, pair ids) for one marking and entity type."""
    t = norm(text)
    low = t.lower()
    if not t:
        return "mandatory", "Mandatory", "no marking: treated as mandatory", None
    if low.startswith("either"):
        ids = [i.replace(" ", "") for i in re.findall(r"\b[A-Z][A-Z0-9]*(?: ?_[A-Z0-9]+)+\b", t)]
        gov, priv = "gov" in low, "priv" in low
        if (entity == "government" and gov) or (entity == "private" and priv) or not (gov or priv):
            return "pair", "Either " + " or ".join(ids), "either rule: one of " + " or ".join(ids) + " must pass", ids
        return "optional", "Optional", "either rule names the other entity type: optional for " + entity, None
    if low in OPTIONAL or low.startswith(("optional", "non-mandatory", "non mandatory", "not mandatory", "no ")):
        return "optional", "Optional", None, None
    m = re.match(r"(mandatory|yes)\b[\s,:]*(.*)$", low)
    if not m:
        return "mandatory", "Mandatory", "unrecognised marking: treated as mandatory", None
    rest = m.group(2)
    if not rest:
        return "mandatory", "Mandatory", None, None
    conditional = "(" in rest or re.search(r"\bif\b", rest) is not None
    who = re.match(r"for\s+(.*)$", rest)
    if who and m.group(1) == "mandatory":
        head = who.group(1).split("(")[0]
        gov, priv = "gov" in head, "priv" in head
        if (gov or priv) and not ((entity == "government" and gov) or (entity == "private" and priv)):
            return "optional", "Optional", "mandatory for the other entity type only: optional for " + entity, None
        if conditional:
            return "mandatory", "Mandatory (conditional)", "conditional: treated as mandatory", None
        return "mandatory", "Mandatory", "mandatory for " + entity, None
    if conditional:
        return "mandatory", "Mandatory (conditional)", "conditional: treated as mandatory", None
    return "mandatory", "Mandatory", "unrecognised marking: treated as mandatory", None


def iterations(text):
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return 0


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    out = []
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        mcol = next((cols[n] for n in MARKING if n in cols), None)
        marking = norm(anchor(ws, row, mcol).value) if mcol else ""
        tcol = next((cols[n] for n in TITLE if n in cols), None)
        title = norm(anchor(ws, row, tcol).value) if tcol else ""
        kind, label, note, pair = classify(marking, entity)
        rec = {"id": case, "sheet": ws.title, "title": title or case, "marking": marking,
               "kind": kind, "label": label, "note": note, "pair": pair}
        for key, names in COLUMNS[run].items():
            rec[key] = value(ws, row, top, cols, names)
        rec["status"] = rec["status"].upper()
        rec["iterations"] = iterations(rec["iterations"])
        out.append(rec)
    # The either rule binds every case it names, whatever their own marking.
    groups = {}
    for rec in out:
        if rec["kind"] == "pair":
            groups[tuple(sorted(rec["pair"]))] = rec["pair"]
    by_id = {rec["id"]: rec for rec in out}
    for ids in groups.values():
        for i in ids:
            if i in by_id:
                other = [x for x in ids if x != i]
                by_id[i].update(kind="pair", pair=ids, label="Either, with " + " or ".join(other),
                                note="either rule: one of " + " or ".join(ids) + " must pass")
    return out, list(groups.values())


def gate(recs, groups):
    blocking = []
    by_id = {r["id"]: r for r in recs}
    for r in recs:
        if r["kind"] == "mandatory" and r["status"] != "PASS":
            blocking.append(r["id"] + ": " + (r["status"] or "blank"))
    for ids in groups:
        present = [by_id[i] for i in ids if i in by_id]
        if present and not any(r["status"] == "PASS" for r in present):
            blocking.append(" or ".join(r["id"] for r in present) + ": " +
                            ", ".join(r["status"] or "blank" for r in present))
    return blocking


def run_check(path, run, entity):
    recs, groups = read_cases(path, run, entity)
    if not recs:
        sys.exit("no Test Case ID column with ids in " + Path(path).name + ": nothing to report on")
    for r in recs:
        if r["note"]:
            print("marking " + r["id"] + ' "' + r["marking"] + '": ' + r["note"])
    blocking = gate(recs, groups)
    for line in blocking:
        print("not passed " + line)
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    print(str(len(blocking)) + " of " + str(mandatory) + " mandatory case(s) for a " + entity +
          " entity not PASS in the " + run + " run")
    return recs, groups, blocking


def forbidden(meta, where="meta.json"):
    found = []
    if isinstance(meta, dict):
        for k, v in meta.items():
            if FORBIDDEN.search(str(k)):
                found.append(where + "." + str(k))
            found += forbidden(v, where + "." + str(k))
    elif isinstance(meta, list):
        for n, v in enumerate(meta):
            found += forbidden(v, where + "[" + str(n) + "]")
    return found


def days(start, end):
    try:
        return (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
    except (TypeError, ValueError):
        return ""


def build(path, run, meta, evidence, out, recs, groups):
    from docx import Document
    from docx.enum.text import WD_BREAK
    from docx.shared import Pt
    from PIL import Image

    doc = Document()
    sec = doc.sections[0]
    width = sec.page_width - sec.left_margin - sec.right_margin
    height = sec.page_height - sec.top_margin - sec.bottom_margin
    dm = meta.get("document", {})
    dates = meta.get("test_dates", {})
    milestone = meta.get("milestone", "")
    entity = meta["entity_type"]

    def table(rows, header=None):
        t = doc.add_table(rows=0, cols=len(header or rows[0]))
        t.style = "Table Grid"
        for n, row in enumerate(([header] if header else []) + rows):
            cells = t.add_row().cells
            for cell, text in zip(cells, row):
                cell.text = str(text if text is not None else "")
                if header and n == 0:
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.bold = True
        return t

    def heading(text):
        doc.add_heading(text, level=1)

    n = len(recs)
    passed = sum(1 for r in recs if r["status"] == "PASS")
    failed = sum(1 for r in recs if r["status"] == "FAIL")
    na = sum(1 for r in recs if r["status"] == "NA")
    blank = n - passed - failed - na
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    retried = [r for r in recs if r["iterations"] > 1]
    log = [r for r in recs if r["iterations"] > 1 or r["status"] != "PASS"]
    label = RUN_NAME[run]

    # 1. Cover
    doc.add_heading(milestone + " " + label + " report", level=0)
    table([["Product", meta.get("product", "")], ["Organisation", meta.get("organisation", "")],
           ["Milestone", milestone], ["Report type", label + " (run type " + run + ")"],
           ["Document id", dm.get("id", "FT-" + milestone)], ["Release date", dm.get("release_date", "")]])
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # 2. Document control
    heading(SECTIONS[0])
    table([["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
           ["Prepared by", dm.get("prepared_by", "")], ["Reviewed by", dm.get("reviewed_by", "")],
           ["Approved by", dm.get("approved_by", "")], ["Released by", dm.get("released_by", "")],
           ["Release date", dm.get("release_date", "")]])
    doc.add_heading("Change history", level=2)
    history = dm.get("change_history", [])
    table([[h.get("version", ""), h.get("date", ""), h.get("by", ""), h.get("change", "")] for h in history]
          or [["", "", "", ""]], header=["Version", "Date", "By", "Change"])
    doc.add_heading("Distribution", level=2)
    dist = dm.get("distribution", [])
    table([[d.get("name", ""), d.get("organisation", ""), d.get("role", "")] if isinstance(d, dict)
           else [str(d), "", ""] for d in dist] or [["", "", ""]], header=["Name", "Organisation", "Role"])

    # 3. Executive summary
    heading(SECTIONS[1])
    doc.add_paragraph(
        "This report records the " + label + " run of " + meta.get("product", "") + " by " +
        meta.get("organisation", "") + " against ABDM " + milestone + ", API version " +
        meta.get("api_version", "V3") + ", from " + dates.get("start", "") + " to " + dates.get("end", "") +
        ". The workbook " + Path(path).name + " holds " + str(n) + " cases. " + str(passed) + " are PASS, " +
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result. All " + str(mandatory) +
        " mandatory cases that apply to a " + entity + " entity are PASS. " + str(len(retried)) +
        " cases took more than one pass.")

    # 4. ABDM details
    heading(SECTIONS[2])
    table([["Entity name", meta.get("organisation", "")], ["Product name", meta.get("product", "")],
           ["Category", meta.get("category", "")], ["Milestone", milestone],
           ["API version", meta.get("api_version", "V3")],
           ["Test execution dates", dates.get("start", "") + " to " + dates.get("end", "")],
           ["Number of days for testing", meta.get("test_days", days(dates.get("start"), dates.get("end")))],
           ["Most passes any case took", max([r["iterations"] for r in recs] or [0])],
           ["Test executed by", meta.get("executed_by", "")]])

    # 5. Scope
    heading(SECTIONS[3])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    doc.add_paragraph("")
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Role", meta.get("role", "")], ["Entity type", entity],
           ["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)], ["Cases", n]])

    # 6. Test environment and tools
    heading(SECTIONS[4])
    env = dict(meta.get("environment", {}))
    names = [("browser", "Browser"), ("browser_version", "Browser version"), ("playwright", "Playwright"),
             ("phr_app", "PHR app"), ("phr_app_version", "PHR app version"), ("emulator", "Emulator"),
             ("model", "Model that ran the agent")]
    rows = [[title, env.pop(key, "Not used")] for key, title in names]
    rows += [[key, val] for key, val in env.items()]
    table(rows, header=["Tool", "Version or value"])

    # 7. Approach and methodology
    heading(SECTIONS[5])
    for line in [
        "An agent ran every case in the workbook's order, following the module's test skill, and wrote each "
        "result into the workbook as the case ended.",
        "Each case had at most three passes. Iterations is the number of passes a case took, whether it ended "
        "PASS or FAIL.",
        "A person entered every OTP and gave every consent or approval the case needed. The agent waited for "
        "each of these steps and did not perform them.",
        "For a case that passes through the PHR app, the proof is one PHR app screenshot showing the consent "
        "granted or the record visible. The agent checked the application side.",
        ("Run type ui: the agent drove the application's screens with Playwright and kept a screenshot per step."
         if run == "ui" else
         "Run type ft: each case was judged on the calls to the ABDM sandbox and the callbacks received. The "
         "evidence for each case is the response with its code."),
    ]:
        doc.add_paragraph(line, style="List Bullet")

    # 8. Test data
    heading(SECTIONS[6])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 9. Results summary
    heading(SECTIONS[7])
    table([[r["id"], r["title"], r["label"], r["status"] or "Not recorded", r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])

    # 10. Evidence
    heading(SECTIONS[8])
    findings = meta.get("findings", {})
    for r in recs:
        doc.add_heading(r["id"] + ": " + r["title"], level=2)
        doc.add_paragraph("Status: " + (r["status"] or "Not recorded") + ". Finding: " +
                          (findings.get(r["id"]) or r["remarks"] or "None recorded."))
        if run == "ft":
            if r["response"]:
                p = doc.add_paragraph()
                code = p.add_run(r["response"])
                code.font.name = "Courier New"
                code.font.size = Pt(9)
            continue
        folder = Path(evidence) / r["id"]
        shots = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
        for shot in shots:
            with Image.open(shot) as im:
                w, h = im.size
            # Page width, unless that makes a tall phone screenshot overrun the page.
            if h * width > 0.85 * height * w:
                doc.add_picture(str(shot), height=int(0.85 * height))
            else:
                doc.add_picture(str(shot), width=width)
            doc.add_paragraph(shot.name)

    # 11. Failures and iterations log
    heading(SECTIONS[9])
    if log:
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "", r["remarks"]] for r in log],
              header=["Test case ID", "Status", "Iterations", "Remarks"])
    else:
        doc.add_paragraph("No case failed and no case took more than one pass.")

    # 12. Conclusion
    heading(SECTIONS[10])
    doc.add_paragraph(
        "All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS in the " +
        run + " run of " + meta.get("product", "") + " for " + milestone + ". Of " + str(n) + " cases, " +
        str(passed) + " are PASS, " + str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) +
        " have no result.")

    # 13. Annexures
    heading(SECTIONS[11])
    recs_links = meta.get("recordings", [])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recs_links]
          or [["", ""]], header=["Recording", "Link"])
    doc.add_paragraph("The completed workbook: " + Path(path).name)

    # Mask every run of text the document holds, tables included.
    def paragraphs(container):
        for p in container.paragraphs:
            yield p
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    for p in paragraphs(cell):
                        yield p
    for p in paragraphs(doc):
        for r in p.runs:
            if r.text:
                r.text = mask(r.text)

    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out))
    print("wrote " + str(out))
    if shutil.which("soffice"):
        subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(out.parent), str(out)],
                       check=False)
        print("wrote " + str(out.with_suffix(".pdf")))
    else:
        print("soffice is not on PATH: export the PDF from Word or LibreOffice")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["check", "build"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"], required=True)
    p.add_argument("--entity", choices=["government", "private"])
    p.add_argument("--meta")
    p.add_argument("--evidence", default="abdm-ft/evidence")
    p.add_argument("--out")
    a = p.parse_args()
    meta = {}
    if a.action == "build":
        if not (a.meta and a.out):
            sys.exit("build needs --meta and --out")
        meta = json.loads(Path(a.meta).read_text())
        bad = forbidden(meta)
        if bad:
            sys.exit("meta.json carries a field named like a credential, which never goes in a report: " +
                     ", ".join(bad))
        meta["entity_type"] = a.entity or meta.get("entity_type")
    entity = a.entity or meta.get("entity_type")
    if entity not in ("government", "private"):
        sys.exit("--entity, or entity_type in meta.json, must be government or private")
    recs, groups, blocking = run_check(a.workbook, a.run, entity)
    if blocking:
        if a.action == "build":
            print("no report: every mandatory case must be PASS first", file=sys.stderr)
        sys.exit(1)
    if a.action == "build":
        build(a.workbook, a.run, meta, a.evidence, a.out, recs, groups)


if __name__ == "__main__":
    main()
```

### What happens

1. When the last case is recorded and written into the workbook, run the gate for the run type and your entity type:

   ```bash
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private
   ```

   It prints one `marking` line for every case whose marking is entity specific, conditional, an either rule or unrecognised, with how it was treated. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

2. If it exits `1`, the run is not finished. Rerun the cases it lists, as `open` in `shared.concept.test-workbook-write-back` does, and run `check` again. Do not run `build`.

3. Only when `check` exits `0`, write the one line findings into `meta.json` under `findings`, keyed by case id. A case without one gets its Remarks value. Then build:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --out abdm-ft/report-m1.docx
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails.

4. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

5. With `soffice` on PATH, `build` also writes `report-m1.pdf`. Otherwise it prints that the PDF can be exported from Word or LibreOffice.

### How you know it worked

- `check` exits `0` and its last line reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`.
- `build` prints `wrote abdm-ft/report-m1.docx` and exits `0`.
- The document opens with the cover, then the twelve headings from Document control to Annexures, in order. The results summary has one row per case in the workbook. Each case's evidence section holds its screenshots in name order, or its response for an `ft` report.
- No 12 digit number appears anywhere in it: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'docx'` | python-docx is not installed | `pip install python-docx openpyxl pillow` |
| `not passed CRT_ABHA_105: FAIL` | A mandatory case failed | Fix the cause the Remarks name, rerun the case, write it back, run `check` again |
| `not passed <id>: NA` | A mandatory case was recorded not run | Run it, or agree with NHA that it does not apply and keep the reason in its remarks. The gate still counts it until it is PASS |
| `not passed <id>: blank` | The case needs a tester step, or never ran | Finish it with the tester, then write it back |
| `marking <id> "...": unrecognised marking: treated as mandatory` | NHA used a marking the script does not know | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a field named like a credential` | `meta.json` has a password, secret, token or credentials field | Delete the field. A report never carries a credential |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as the PHR workbook does not yet | Wait for the version of the workbook with ids. A report without them has nothing to stand on |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |

From `shared.concept.test-report`.

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
