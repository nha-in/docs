# HIE-CM m2 test

Walks the ABDM M2 functional test cases, Health Information Provider, against the system you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every M2 test case in the Building HIP set against your system and the sandbox, one case at a time
- Records, for each case, the call and the callback that prove it with their REQUEST-IDs, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

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
| At least one record per HI type you claim, as a FHIR bundle | Your own system. The sharing case sends it |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's test case workbook for this module, if results go into it | The workbook NHA sent you, copied into `abdm-ft/`. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your application's URL | Your deployment, reachable from the browser on this machine |
| For a `ui` run: a tester login for your application | A test account in your application, read from an environment variable you name or typed at a hidden prompt. It is never written to the run log, the evidence or the workbook |
| For a `ui` run: Node 18 or later, the Playwright MCP server and Chromium | The integrators plugin declares the Playwright MCP server, and `/abdm-test-setup` lists what is missing. Without the plugin, the section "Running a case as a UI test" lists each install command |
| For a `ui` run: one PHR app screenshot for each case that passes through the PHR app | The person with the PHR app sends it, showing the consent granted or the record visible. The agent does not drive the PHR app. It checks your application's side on screen |

## Say one of these

- "Walk the M2 test cases against my sandbox and log each one."
- "Run only the user initiated linking cases."
- "Re-run HIP_INTI_LINK_505, the on_carecontext callback never came yesterday."
- "Write a terminal script that runs the M2 test cases and stops for each PHR app step."
- "Run the M2 test cases as UI tests against my HMIS and fill NHA's workbook."

## What happens first

The first question is the run type. `ft` is the API functional test: your system against the sandbox, judged on calls and callbacks. `ui` is the UI test: an agent drives your application's screens, as the section "Running a case as a UI test" below sets out. `all` runs `ft` for the chosen cases, then `ui`. The second question: which cases. All of them, one group, or a list of ids. Then the preflight below runs, and the preconditions for the first case are checked before anything is sent. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

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
- A retry is a duplicate. A refused link token request is remembered, and the same request again returns `ABDM-1092`, which the M2 error list in `errors/m2.yaml` documents rather than the operation's specification. Change the input or wait before the next pass. `hiecm.concept.m2-retry-is-a-duplicate`
- Send the headers each operation lists in the specification: `X-CM-ID` `sbx` on calls to the sandbox gateway, and `X-HIP-ID` where the operation lists it. `REQUEST-ID` and `TIMESTAMP` go on every call.
- Paste the response and the callback. A step with no pasted output is not done.
- The set decides the outcome. A refusal the set asks for, such as a wrong OTP where the case names one, is part of the pass. A refusal the set does not ask for is labelled "Extra check, not in the set" in the case: run it, log it, and never let it decide the outcome.
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

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/m2-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case chosen gets a row before the first call, each `pending`.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# M2 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| Health_RECORD_CREATION_101 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| HIP_INTI_LINK_504 | passed | b7a1... | linkToken present, pasted below |
| HIP_INTI_LINK_505 | running | | |
| HIP_INTI_LINK_506 | pending | | |
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

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing and it listens on your callback URL. Every rule above still holds.

| Rule | Why |
|---|---|
| Before the first case, run the readiness check and create the run log | A run that starts without its credentials, people or devices fails cases for the wrong reason |
| Every step in "Authentication is never skipped" is a terminal prompt, read with input hidden | A skipped login proves nothing, and a runner that never asks reaches no success path |
| Update the run log after every case, then write the manifest beside it at the end | The person follows the run as it happens, and a stopped run resumes from the log |
| Name every check by its case id from this skill, such as `HIP_INTI_LINK_504`. Never invent a numbering such as `TC01` | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal: log in to the PHR app, approve the consent, enter the OTP there, pull the records. Wait for the person to answer | Every M2 linking and sharing path passes through a person. A runner that never asks never reaches one |
| Never write a typed value, an OTP or a record body to disk, a log or the manifest, and never hard code one | They belong to the person, not the run |
| Run each `sandbox` case's success path and each refusal its exit condition names, as separate checks. Run a refusal labelled "Extra check, not in the set" too, and log it on its own line | The outcome is decided only by what the set asks. An extra check is logged, and never passes or fails the case |
| Compare the callback literal the exit condition names, such as `linkToken` present, or `status` `Successfully Linked care context`. An extra check compares its literal the same way, such as `error.code` `ABDM-1037` | A status alone never passes a check, and a 202 never does |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| Run the preflight first, label it `preflight`, and keep it out of the case counts | It tests your setup, not a case |
| At the end, print one line per case id with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this.

```text
preflight          GET /api/hiecm/gateway/v3/bridge-services  REQUEST-ID 0c7e...  HTTP 200  bridge.url matches  ok
HIP_INTI_LINK_504  POST /api/hiecm/v3/token/generate-token  REQUEST-ID 4d2a...  HTTP 202
  waiting up to 60 s for /api/v3/hip/token/on-generate-token
HIP_INTI_LINK_504  callback response.requestId 4d2a...  linkToken present  matched
HIP_INTI_LINK_505  count 1, one care context  REQUEST-ID 8b17...  HTTP 202
HIP_INTI_LINK_505  callback /api/v3/link/on_carecontext  status Successfully Linked care context  matched
HIP_INTI_LINK_505  extra check, not in the set: count 2, one care context  REQUEST-ID 91b0...  HTTP 202
HIP_INTI_LINK_505  extra check  callback /api/v3/link/on_carecontext  error.code ABDM-1037  logged
HIP_INTI_LINK_505  passed
HIP_INTI_LINK_506  Ask the person to pull records in the PHR app. Is the visit listed? y/n, or blank if nobody is here:
```

## Test cases

The ids, the mandatory marks and the wording of each check are ABDM's, from the M2 Building HIP set revised on 21 October 2026. The set has 13 cases in five groups, and the sections below keep its groups and its order. Every case is mandatory and applies to every HIP. Where the set names an API, the operation id here is the one in `references/integrate.md` and the M2 specification, which carry the host, the headers and a full request.

The set also links a page of the sandbox documentation site against most cases. It is a reference, not an operation, so no case here calls it.

HIP initiated linking is tested by demographic details only, through a link token. The set has no case of its own for a granted, revoked or expired consent. Your HIP still has to store each consent it is sent before it can share records, so HIP_INIT_SHARE_CARECONTEXT observes the consent notify that the person's "Get data" produces.

### Group 1: health record creation

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

#### Health_RECORD_CREATION_101, digital health records are created. Mandatory. `screen`

Your system creates digital health records for the HI types that apply to your participant category. ABDM requires only that what you share is a FHIR bundle, so the evidence is the record in your system and the FHIR bundle it produces for one visit of each claimed HI type. Name the HI types in the manifest, using the values the specification lists: `DiagnosticReport`, `DischargeSummary`, `HealthDocumentRecord`, `ImmunizationRecord`, `OPConsultation`, `Prescription`, `WellnessRecord`, `Invoice`.

The set also asks you to code clinical data with SNOMED CT or LOINC. Screen check: the coded elements in each bundle carry a SNOMED CT or LOINC code.

Screen check alongside: each bundle is stored against a visit, so a care context can name it. A bundle no care context names cannot be shared. `hiecm.concept.m2-care-context-and-records`

### Group 2: HIP initiated linking by demographic details

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 20 minutes old, from the preflight. The person's ABHA address, already verified in your system, and their name, gender and year of birth. Your system reads these from the verified ABHA profile rather than asking again. `hiecm.concept.m1-never-ask-twice` A care context in your system for them, with a record behind it, and no link token stored for them yet.

#### HIP_INTI_LINK_504, a link token is generated, or a valid one reused. Mandatory. `sandbox` and `screen`

Before it asks for a link token, your system checks whether it already holds a valid one for this patient. If it does, it reuses that token. The specification gives a link token a life of six months.

Calls: `m2_post_v3_token_generate_token`, then wait for `m2_post_v3_hip_token_on_generate_token`.

Exit condition: three observations, all pasted.

1. `m2_post_v3_token_generate_token`, sent with `abhaAddress` or `abhaNumber`, `name`, `gender` and `yearOfBirth`, returns 202. Then the callback `m2_post_v3_hip_token_on_generate_token` arrives with `linkToken` present, `abhaAddress` equal to the one sent, and `response.requestId` equal to your `REQUEST-ID`. Paste the token with its value masked.
2. Screen: your system stores the token against the patient and the ABHA address it was issued for.
3. Reuse: link a second care context for the same patient. Your system sends no new `m2_post_v3_token_generate_token`, and the `m2_post_hip_v3_link_carecontext` it sends carries the stored token in `X-LINK-TOKEN`. Paste your outbound call log for the second link.

Nudge: a callback with an `error` object and no `linkToken` means the details sent did not match the ABHA. Check name, gender and year of birth against the profile before the next pass, and paste the code that came back.

Nudge: change the input before you retry. A second identical request returns `ABDM-1092`, "Duplicate Link token request", which hides the real cause. The code is documented in the M2 error list, `errors/m2.yaml`, not in this operation's specification. `hiecm.concept.m2-retry-is-a-duplicate`

Nudge: a synchronous 400 with `ABDM-1035` is your HIP id, not the patient. Fix `X-HIP-ID` and the bridge linkage before the next pass.

#### HIP_INTI_LINK_505, the care context is linked. Mandatory. `sandbox`

Your system sends the link request on its own once a record is saved, with no click at the desk.

Exit condition: three observations, all pasted.

1. `m2_post_hip_v3_link_carecontext`, sent with the link token in `X-LINK-TOKEN`, returns 202. The callback `m2_post_v3_link_on_carecontext` arrives with `status` `Successfully Linked care context`, `abhaAddress` equal to the one linked, and `response.requestId` equal to your `REQUEST-ID`.
2. An update: add a record to the linked care context. `m2_post_hip_v3_link_context_notify` returns 202, and the callback `m2_post_v3_links_context_on_notify` arrives with `acknowledgement.status` `SUCCESS`.

Extra check, not in the set. Send the same call with `patient[].count` not equal to the number of `careContexts`. The callback arrives with `error.code` `ABDM-1037`, and your system does not mark the care context linked. Log it; it does not decide the outcome.

The pull in the PHR app that the set also asks for is HIP_INTI_LINK_506.

Nudge: `ABDM-1038` in the callback is a link token issued for another ABHA address.

#### HIP_INTI_LINK_506, the linked records can be pulled. Mandatory. `human` and `screen`

The person opens the PHR app and taps "Pull Records" for your facility; stop for that.

Exit condition: after the pull, the person sees the care context linked in HIP_INTI_LINK_505. Evidence: a screenshot from the PHR app.

### Group 3: user initiated linking

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** Your HIP listed as active, from the preflight. The person present with the PHR app and an ABHA. A patient in your system registered without any ABHA details, whose mobile, name, gender and year of birth match that ABHA, with at least one unlinked care context. A patient registered with valid ABHA details is linked by HIP initiated linking on its own, so user initiated linking is not tested on one.

The cases run in the set's order: 601, 602, 603, 606, 604, 605, 607.

#### USER_INIT_LINK_601, the person logs in to the PHR app. Mandatory. `human`

The person logs in to the ABDM sandbox PHR app; stop for that. Evidence: their confirmation, or `needs-human`. No call of yours proves this step.

#### USER_INIT_LINK_602, your facility can be found. Mandatory. `human` and `screen`

In the PHR app, the person opens the linked facilities tab, taps "Link New facility", searches for your facility and selects it. Evidence: a screenshot with your facility listed. If it is missing, check the preflight's `services` entry before anything else.

#### USER_INIT_LINK_603, the profile reaches your HIP. Mandatory. `sandbox`

Exit condition: an inbound POST arrives at your URL for `m2_post_v3_hip_patient_care_context_discover`, with `transactionId`, `patient.id` and `patient.verifiedIdentifiers` present. Paste it in full. Your system searches its records on the verified identifiers, using the mobile number, and narrows a mobile match by name, gender and year of birth.

#### USER_INIT_LINK_606, your HIP finds the patient by demographic details. Mandatory. `sandbox` and `screen`

Your system finds the record from the details the person shared: mobile, name, gender, and a year of birth within five years either side of the one sent.

Exit condition: your `m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340` for the discover from USER_INIT_LINK_603 returns 202, sent with `matchedBy` holding `MOBILE` and `patient[].careContexts` holding the matched record. Screen check: the matched patient has the discover's mobile and `patient.gender`, and a year of birth within 5 of `patient.yearOfBirth`. Paste both bodies.

#### USER_INIT_LINK_604, the records found are returned. Mandatory. `sandbox`, `human`

Exit condition: your `m2_post_user_initiated_linking_v3_patient_care_context_on_8c9340` returns 202, sent with `transactionId` equal to the discover's, `response.requestId` equal to the discover's `REQUEST-ID`, `patient[].careContexts` holding at least one entry, and `matchedBy` naming the identifier you matched on. The person then sees those care contexts in the PHR app and selects the ones to link; stop for that.

Extra check, not in the set: run a discover for a person your system does not hold. Your on-discover carries an `error` object and no `patient`, and the PHR app says no records were found. The specification names no single code for no match, so paste the code your system sent. Log it; it does not decide the outcome.

Nudge: return only unlinked care contexts. The specification documents `ABDM-1056`, "This care contexts has been already linked", only on this user initiated path, on `m2_post_v3_hip_link_care_context_init`.

#### USER_INIT_LINK_605, the person links with an OTP your HIP sends. Mandatory. `sandbox`, `human`

Three observations, all pasted.

1. An inbound `m2_post_v3_hip_link_care_context_init` arrives with `transactionId`, `abhaAddress` and the selected `patient[].careContexts`. Your `m2_post_user_initiated_linking_v3_link_care_context_on_init` returns 202, sent with `link.referenceNumber`, `link.authenticationType` `DIRECT` and `link.meta.communicationMedium` `MOBILE`.
2. Your system, not the gateway, sends the OTP to the person's mobile. The person enters it in the PHR app; stop for that. An inbound `m2_post_v3_hip_link_care_context_confirm` arrives with `confirmation.linkRefNumber` equal to your `link.referenceNumber` and `confirmation.token`.
3. Your `m2_post_user_initiated_linking_v3_link_care_context_on_confirm` returns 202, sent with `patient[].careContexts` holding only the care contexts selected in step 1.

Extra check, not in the set: a wrong OTP. Your on-confirm carries an `error` object and no `patient`, and the PHR app says the link failed and lets the person retry. Log it; it does not decide the outcome.

Screen check: the linked records appear under "Linked Facilities" in the PHR app.

#### USER_INIT_LINK_607, the linked records can be pulled. Mandatory. `human` and `screen`

As HIP_INTI_LINK_506, for the care contexts linked in USER_INIT_LINK_605: the person taps "Pull Records" and sees them.

### Group 4: notifying a patient by SMS with a deep link

Applies to every HIP. Mandatory. This case covers a patient who gave a mobile and no ABHA address at registration.

Loop limit: 3 passes per test case.

#### HIP_INIT_NOTIFY_HIECM, a new record triggers the SMS. Mandatory. `sandbox` and `human`

Create a new record, such as a diagnostic report or a prescription, in your system for a patient with a mobile and no ABHA address.

Exit condition: three observations.

1. Your system calls `m2_post_hip_v3_link_patient_links_sms_notify2` on its own, sending only `notification.phoneNo` and `notification.hip`. It returns 202.
2. The callback `m2_post_v3_patients_sms_on_notify` arrives with `acknowledgement.status` `SUCCESS` and `response.requestId` equal to your `REQUEST-ID`. Paste both.
3. The person receives the SMS with the deep link on that mobile; stop for that.

The set's steps go on: the person opens the link, opens a PHR app of their choice and discovers your facility, and the new record must be discoverable. If the person continues, that discover is USER_INIT_LINK_603, and the new record must be among the care contexts returned.

Nudge: the specification lists no `X-HIP-ID` header on this call. The HIP id travels in `notification.hip.id`.

### Group 5: data transfer and share

Applies to every HIP. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A care context linked to the person, from HIP_INTI_LINK_505 or USER_INIT_LINK_605. The person present with the PHR app. Records behind that care context for the HI types you claim. The set asks for all eight HI types: structured and PDF for OP Consultation, Wellness Record, Prescription, Discharge Summary, Diagnostic Record, Immunization Record and Health Document Record, and structured for Invoice. Each PDF carries the patient's name, age, gender, mobile, ABHA number and ABHA address, and the doctor's name and speciality where they apply.

#### HIP_INIT_SHARE_CARECONTEXT, records are shared on request. Mandatory. `human`, `sandbox` and `screen`

The person starts "Get data" for the linked care context in the PHR app. Stop for that. It produces the consent notify and then the data request to your HIP. The specification also makes the HIP responsible for tracking expiry, and forbids serving a request on an expired consent.

Exit condition: seven observations, all pasted.

1. An inbound POST arrives at your URL for `m2_post_v3_consent_request_hip_notify` with `notification.status` `GRANTED`, `notification.consentDetail.consentId` present, and `notification.consentDetail.hip.id` equal to your HIP id.
2. Your `m2_post_consent_v3_request_hip_on_notify` returns 202, sent with `acknowledgement.consentId` equal to that consent id, `acknowledgement.status` `OK` and `response.requestId` equal to the notify's `REQUEST-ID`. Screen: your system shows the consent stored against the patient, with its HI types, date range, purpose and expiry.
3. An inbound `m2_post_v3_hip_health_information_request` arrives with `transactionId`, `hiRequest.consent.id`, `hiRequest.dateRange`, `hiRequest.dataPushUrl` and `hiRequest.keyMaterial`.
4. Your `m2_post_data_flow_v3_health_information_hip_on_request` returns 202, sent with `hiRequest.transactionId` equal to it and `hiRequest.sessionStatus` `ACKNOWLEDGED`.
5. Your `m2_post_health_information_transfer` POST to the `dataPushUrl` returns 202, with each `entries[].media` `application/fhir+json` and your own `keyMaterial` carrying `cryptoAlg` `ECDH`, `curve` `Curve25519` and `nonce`.
6. Every `entries[].careContextReference` you pushed in step 5 is among the `notification.consentDetail.careContexts[].careContextReference` values stored from step 1. The request's `hiRequest.dateRange.from` and `hiRequest.dateRange.to` lie inside the stored `notification.consentDetail.permission.dateRange.from` and `notification.consentDetail.permission.dateRange.to`. Paste both comparisons.
7. Your `m2_post_data_flow_v3_health_information_notify` returns 202, sent with `notification.notifier.type` `HIP`, `statusNotification.sessionStatus` `TRANSFERRED` and each `statusResponses[].hiStatus` `DELIVERED`.

Then the person sees the records in the PHR app, decrypted and in the FHIR document types NRCeS defines; stop for that, and take the screenshot.

Extra check, not in the set. The person revokes the consent in the PHR app; stop for that. An inbound `m2_post_v3_consent_request_hip_notify` arrives with `notification.status` `REVOKED` and `notification.consentId` equal to the stored consent, and your on-notify returns 202 with that `acknowledgement.consentId`. Your system marks the stored consent revoked. Log it; it does not decide the outcome.

Nudge: store `consentDetail` whole. Step 6 compares the pushed care contexts and the date range against it.

Nudge: the PHR app decrypts with its own private key, and the public key and nonce you sent in `keyMaterial`. Derive the shared secret from the requester's `dhPublicKey`, never from a key of your own pair alone.

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

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It is the whole report. Case ids to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no access tokens, no link tokens, no OTPs, no record content, no client secret.

```json
{
  "skill": "abdm-m2",
  "set": "M2 Building HIP, NHA, revised 21 October 2026",
  "entity": "private",
  "hip_id": "<your HIP id>",
  "callback_url": "<your registered callback URL>",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T12:03:11Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "HIP_INTI_LINK_504", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["4d2a...", "e81f..."],
     "observed": ["generate-token 202", "on-generate-token linkToken present, response.requestId 4d2a...", "second link sent the stored token, no generate-token"]},
    {"id": "HIP_INTI_LINK_505", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["91b0...", "8b17...", "c3d9..."],
     "observed": ["on_carecontext status Successfully Linked care context", "links/context/on-notify acknowledgement.status SUCCESS", "extra check, not in the set: on_carecontext error.code ABDM-1037"]},
    {"id": "Health_RECORD_CREATION_101", "outcome": "passed", "evidence": "screen",
     "attachment": "op-consultation-bundle.png", "rule": "hiecm.concept.m2-care-context-and-records"},
    {"id": "HIP_INIT_SHARE_CARECONTEXT", "outcome": "needs-human", "evidence": "human",
     "request_ids": [], "reason": "Get data is started in the PHR app; nobody present"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases for your entity are not `passed`; and the one case to fix first.
