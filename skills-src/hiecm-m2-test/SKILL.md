---
name: hiecm-m2-test
description: "Use when walking the ABDM M2 functional test cases (Health Information Provider: health records, linking care contexts, consent notifications and sharing records) against an integrator's own system and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, including the callback that answers each call, and writes NHA's workbook, the manifest of request ids a reviewer checks against the gateway, and the final test report."
---
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
| For a `ui` run: Node 18 or later, the Playwright MCP server and a browser | The integrators plugin starts `@playwright/mcp@0.0.83`, which the first start downloads with `npx`. Install the browser the server reports missing, chrome or chromium. `/abdm-test-setup` lists what is missing. Without the plugin, the section "Running a case as a UI test" lists each install command |
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
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the rule it satisfies. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
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

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case ids to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no access tokens, no link tokens, no OTPs, no record content, no client secret. The run log and the manifest are written on every run. The manifest is not the final report: the section "Writing the test report" writes that, once its `check` exits 0.

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
