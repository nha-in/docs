---
name: hiecm-m3-test
description: "Use when walking the ABDM M3 functional test cases (Health Information User: consent request, the patient's decision, fetching and showing records) against an integrator's own system and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, and writes NHA's workbook, the manifest of request ids a reviewer checks against the gateway, and the final test report."
---
# HIE-CM m3 test

Walks the ABDM M3 functional test cases, Health Information User, against the system you built and the sandbox. Each case ends in one of five recorded outcomes, never in an opinion.

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
| A HIP that holds records for that patient, of each HI type you claim | Your own M2 build or any sandbox HIP the patient is linked to. A mandatory fetch case whose type no linked HIP holds is recorded `needs-human`, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the sandbox directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's test case workbook for this module, required: the results and the report are built from it | It ships with this skill, in its `workbook/` folder (on the docs site, `/skills/abdm-m3/workbook/`): copy it into `abdm-ft/` before the run, and never use another copy, so the sheet matches the cases below. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your application's URL | Your deployment, reachable from the browser on this machine |
| For a `ui` run: a tester login for your application | A test account in your application, read from an environment variable you name or typed at a hidden prompt. It is never written to the run log, the evidence or the workbook |
| For a `ui` run: Node 18 or later, the Playwright MCP server and a browser | The integrators plugin starts `@playwright/mcp@0.0.83`, which the first start downloads with `npx`. Install the browser the server reports missing, chrome or chromium. `/abdm-test-setup` lists what is missing. Without the plugin, the section "Running a case as a UI test" lists each install command |
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
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. Required: without it there are no results in the sheet and no report, so ask for it before the first case |
| UI readiness, for a `ui` or `all` run | Every row of the readiness check in "Running a case as a UI test" is `ready`: Node, the Playwright tools, a browser, the application URL and the tester login, and the person who sends the PHR app screenshots. `not needed` for an `ft` run |

A `missing` row that a mandatory case needs stops the run before the first call. Say what is missing and ask the one question that would fix it.

**Ask for every input the cases need.** In the readiness check, ask for each input a chosen case needs beyond the rows above, such as a second mobile, a mobile that holds no ABHA, an Aadhaar that holds no ABHA, a second ABHA address, a fingerprint or face device, the ABHA app, a counter QR code or a public callback URL. Record each as `ready` or `missing`. Ask again for a `missing` one when the run reaches the case that needs it. Only when the tester says they cannot provide it in this run is that case `needs-human`, with what was asked in Remarks.

**The case plan.** Before the first case, run `python3 abdm-ft/abdm_report.py plan <workbook> --run <ft or ui> --entity <government or private>`, as "Writing the test report" sets out. It lists every case in the workbook, in sheet order, with its group, what it is for your entity type and its status so far. The run log's rows are made from that list. No case may be dropped: a case that cannot run is `needs-human` with its need named, after asking, or `not-run` with the rule that makes it not apply. Before the tester leaves, run `python3 abdm-ft/abdm_workbook.py open <workbook> --run <ft or ui> --entity <government or private>` and read the list out, including every `NA on a mandatory case` line, so every case still waiting for them is done, or asked about, while they are there.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last acknowledgement, the last callback body, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

M3 calls are asynchronous. The gateway answers `202` with no body, and the answer arrives later as a POST to your callback URL. An exit condition names both. `hiecm.concept.asynchronous-callbacks`

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The five outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim: the acknowledgement and the callback body | The callback was not pasted. A 202 with no callback is not a pass |
| `conditional-pass` | The Expected Result is met and observed as for `passed`, with a gap beside it, such as a point in the sheet's Suggestions for the Functional Tester column not met. Remarks name the condition | The Expected Result is not met. That is `failed`. A Suggestions gap alone never makes a FAIL |
| `failed` | Three passes and the exit condition was not observed, or the sandbox sent the answer the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached a grant, a denial or a revocation in the PHR app, and the patient was not there or did not act. Or a mandatory fetch case found no linked HIP holding a record of its HI type | Ever as a substitute for a fail you can see, or before the tester was asked for what the case needs and said they cannot provide it in this run |
| `not-run` | The case does not apply to your entity, you do not claim an optional HI type, or ABDM publishes no operation for it | To skip a mandatory case that applies to you, or for a case waiting on a person, a device or test data. That is `needs-human` |

### Judging a case

- The sheet's Expected Result column decides the outcome. Its Steps To Be Executed say what to do. Its Suggestions for the Functional Tester column is guidance: a gap against it, with the Expected Result met, is a `conditional-pass`, never on its own a FAIL.
- A message that means the same as the one the sheet quotes is a PASS. Quote both in the run record.
- A case with several steps records a result for each step, in its result's `steps`. The case is `failed` only when a step's expected result fails. When every step run passes and a step could not be run, the case is `needs-human`, naming that step and what it needs.
- A case waiting on a person, a device or test data is `needs-human` only after the tester was asked for it, at the readiness check and again at the case, and said they cannot provide it in this run. Remarks name what was asked. Such a case is never `not-run` and never blank. `not-run` is only for a case that does not apply: the entity type, an optional capability you do not offer, or no published operation for it.

### The three kinds of evidence

Every case names one or more of these. They decide what the manifest carries.

- **sandbox.** A call the gateway sees. Evidence is the `202`, the REQUEST-ID, and the callback body that answered it, pasted. The exit condition is a literal in the callback. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
- **human.** A step only the patient can do in their PHR app. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there after two asks.

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
- Every case `plan` lists gets a row before the first call, each `pending`, in the order `plan` prints them. A case outside the ones chosen for this run stays `pending`, so the log always shows what is still open.
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
| Record `needs-human` only after the prompt was shown, asked again naming the field, and the tester said they cannot provide it in this run or stayed silent after the second ask. Remarks name what was asked | Record any outcome for an authentication step that was never asked |

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
| A blank answer at a prompt asks once more, naming the field. A second blank, or the tester saying they cannot provide it in this run, records the case `needs-human` with what was asked in Remarks, and moves to the next case | Nobody present is neither a pass nor a fail |
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

The set marks each fetch case mandatory for private integrators and optional for government ones. For a private integrator, if no linked HIP holds a record of the type, ask the tester for one at readiness and again at the case; when they say they cannot provide it in this run, record the case `needs-human` with the reason "no linked HIP holds a <type> record, asked at readiness and at the case". It still shows as a mandatory case not passed: find a HIP that holds the type and run it again. For a government integrator, a fetch case for a type you do not claim is `not-run`.

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

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case ids to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no private keys, no client secret, no decrypted records. The run log and the manifest are written on every run. The manifest is not the report. Every run ends with a PDF, written as the section "Writing the test report" sets out: run its `check`; when it exits 0, build the report; when it does not, build the draft with `--draft`. Never end a run without one, and say where it is in the three lines below.

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

Then say three lines. First, how many cases passed, passed with a condition, failed, need a human and were not run. Second, which mandatory cases are not `passed`; for a private integrator that includes every fetch case, HIU_FLOW_107 to 114. Third, the one case to fix first.
