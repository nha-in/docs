---
name: hiecm-p2-test
description: "Use when walking the ABDM P2 functional test cases (PHR consents management: linking records, sharing a profile, the consents tabs and the profile) against an integrator's own PHR app and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, and writes NHA's workbook, the manifest of request ids a reviewer checks against the gateway, and the final test report."
---
# HIE-CM p2 test

Walks the ABDM P2 functional test cases against the PHR app you built and the sandbox: linking records, sharing a profile, the consents tabs and the profile. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P2 case in the PHR app set against your app and the sandbox, one case at a time
- Records, for each case, the sandbox response or callback and the REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your PHR app running against the sandbox hosts, with its bridge callback URL registered | Your build and your bridge. Linking and sharing answer on your callback, so a callback that never arrives fails those cases |
| A person logged in to your app with an ABHA address | The P1 login. The skill uses that person's user token |
| A sandbox HIP with a record for that person, and a sandbox HIU that raises consent requests | A partner or your own test facility. Without one, the linking and consent cases are `needs-human` |
| The person present with their phone | Every OTP, every consent tap and every QR scan is a human step and the skill stops for it |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's PHR test case workbook, required: the results and the report are built from it | It ships with this skill, in its `workbook/` folder (on the docs site, `/skills/abdm-p2/workbook/`): copy it into `abdm-ft/` before the run, and never use another copy, so the sheet matches the cases below. It has one tab per PHR milestone and no case ids; the script adds a Test Case ID column with the ids this skill uses. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your PHR app's APK, installed on an Android emulator or a device over adb | Your build. Android Studio's emulator, or a phone with USB debugging on |
| For a `ui` run: Maestro, to drive the app | https://maestro.mobile.dev, Apache 2.0. `/abdm-test-setup` lists what is missing and prints the install command |
| For a `ui` run: a test ABHA address and its login | A sandbox ABHA address the tester holds, typed at the app's own login when the run reaches it, never stored |

## Say one of these

- "Walk the P2 test cases against my PHR app and log each one."
- "Run only the linking cases, PHR_APP_101 to PHR_APP_111."
- "Re-run PHR_APP_1505, linking the ABHA number failed yesterday."
- "Write a terminal script that runs the P2 test cases and asks me for each OTP and each consent tap."

## What happens first

The first question is the run type. `ft` is the API functional test: your PHR app's backend against the sandbox, judged on calls and callbacks. `ui` is the UI test: an agent drives your PHR app on an Android emulator or device with Maestro, as the section "Running a case as a UI test" below sets out. `all` runs `ft` for the chosen cases, then `ui`. The second question: which cases. All of them, one group, or a list of case ids. Then the preconditions for the first case are checked before anything is sent. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

**Readiness check.** The run does not start until every row of "What it needs from you" that the chosen cases use is confirmed. Ask for each one in the terminal, one at a time. Record each in the run log's header as `ready`, `missing` or `not needed`, never the value itself.

| Row | Ready when |
|---|---|
| Credentials | They are set in the environment or typed at a hidden prompt, and the first session call the cases use returns its token |
| Your system | It answers on the address you gave, against the sandbox hosts |
| People and devices | Each is named for this run: who receives the OTPs, who approves in the PHR app, which device scans |
| Entity type and claimed capabilities | Answered, because they decide which cases are mandatory |
| The run log | Its folder exists and can be written: `abdm-ft/` in your repository unless you name another |
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. Required: without it there are no results in the sheet and no report, so ask for it before the first case |
| UI readiness, for a `ui` or `all` run | Every row of the readiness check in "Running a case as a UI test" is `ready`: the emulator or device, the APK installed, Maestro, and the tester present. `not needed` for an `ft` run |

A `missing` row that a mandatory case needs stops the run before the first call. Say what is missing and ask the one question that would fix it.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last callback, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim | The response or the callback was not pasted. A pass with no output is a fail |
| `failed` | Three passes and the exit condition was not observed, or the sandbox returned the refusal the case expects you to handle and your app did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached an OTP, a consent tap, a QR scan, a facility partner or a person who was not there | Ever as a substitute for a fail you can see |
| `not-run` | The case is optional and you do not claim it, or no P specification publishes the operation it needs | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one of these. It decides what the manifest carries.

- **sandbox.** A call or a callback the gateway sees. Evidence is the HTTP status, the body and the REQUEST-ID, pasted. For an asynchronous call it is the 202 and then the callback carrying the named field. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
- **human.** A step only a person can do. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Tokens as the specification requires. The gateway access token goes in `Authorization` on every call. Profile calls send the person's user token in `X-token`. Gateway calls about the person send their login token in `X-AUTH-TOKEN` and the consent manager in `X-CM-ID`, `sbx` in sandbox.
- A 202 is a receipt, not a result. The answer arrives on your callback. Log the whole callback body before you parse it. `hiecm.concept.asynchronous-callbacks`
- Fresh `REQUEST-ID` on every call, logged before sending. A reused id is refused, and after a failure the id is the only handle on the call.
- Paste the response. A step with no pasted output is not done.
- Sensitive values travel encrypted: mobile, ABHA number, OTP. Read the key and the algorithm from the certificate call rather than hard coding them. `hiecm.concept.input-encryption`
- Read plural as plural. Discovery returns many care contexts, and one consent request yields one artefact per HIP. `hiecm.concept.m3-plural-artefacts-and-codes`
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: PHR_APP_105   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover  REQUEST-ID 6f1c...  HTTP 202
callback: POST /api/v3/hiu/patient/care-context/on-discover  response.requestId 6f1c...
body: {"transactionId":"...","patient":[{"referenceNumber":"...","careContexts":[...],"hiType":"Prescription","count":1}],...}
matched: exit condition for PHR_APP_105
next: PHR_APP_106
```

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/p2-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case chosen gets a row before the first call, each `pending`.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# P2 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| PHR_APP_101 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| PHR_APP_102 | needs-human | b7a1... | OTP prompt shown, left blank |
| PHR_APP_103 | running | | |
| PHR_APP_104 | pending | | |
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
| Name every check by its case name from this skill, such as `PHR_APP_105`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal: the OTP, "approve the request on the phone, then press enter", "scan the QR, then press enter". Read any value from stdin, encrypt it, send it | Linking, sharing and consent all pass through a person. A runner that never asks never reaches one |
| Never write a typed value to disk, a log or the manifest, and never hard code one | An OTP and a mobile number belong to the person, not the run |
| For an asynchronous call, wait on your callback with a timeout, and match its `response.requestId` to the REQUEST-ID you sent | The 202 alone proves only that the gateway took the request |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the status and the body literal the exit condition names, such as `202` and then `status` `GRANTED`, or `200` with `authResult` `failed` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| At the end, print one line per case name with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case name, not by script step |

A run reads like this. The person's values are typed at the prompts and never echoed back.

```text
PHR_APP_1503  POST /abha/api/v3/phr/app/login/profile/request/otp  REQUEST-ID 3b9e...  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 2425, or leave blank if nobody is here:
PHR_APP_1503  wrong OTP  REQUEST-ID 7c02...  HTTP 200  authResult failed  matched
PHR_APP_1503  right OTP  REQUEST-ID 9a41...  HTTP 200  authResult success  matched
PHR_APP_1505  POST /abha/api/v3/phr/app/login/profile/link  REQUEST-ID 4d10...  HTTP 200  message ABHA number is securely linked to ABHA address  matched
PHR_APP_1505  passed
```

Nudge: calls with a bad `scope`, a missing `X-AUTH-TOKEN` or a made up transaction id test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

NHA's PHR sheet numbers its rows but gives them no ids, so each case here has an id built the way the HMIS ids are, from the PHR milestone and the row: row P1 3.2 is `PHR_ADDR_302`, and P2, P3 and P4 rows are `PHR_APP_`, `PHR_HIU_` and `PHR_LOCKER_`. The test case page shows each id with its row. Use the id in the run log, the manifest and the workbook.

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, PHR App Functionality tab. The sections are grouped as the sheet groups them. Every operation id below is in a P specification, which carries the host, the headers and a full request.

Fetching health data is the health information request, `m3_post_data_flow_v3_health_information_request`. No P specification publishes it, so every case whose result is records fetched is `not-run` here with that reason.

### PHR_APP_101 to PHR_APP_111: link and view records from a health facility, user initiated

Mandatory unless marked. The programme group repeats this one, so it is written in full.

Loop limit: 3 passes per test case.

**Preconditions.** The person logged in. A sandbox HIP holding a record whose name, year of birth, gender and mobile match the person's profile. Your callback reachable.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_101 | `screen` | "Link my Health Records" in My Records, and "+" in Linked Facility, open the facility search | The search screen after each tap |
| PHR_APP_102 | `sandbox` | The person types part of a facility name and the facility is found | `p2_get_gateway_v3_providers` with `name` returns 200 with entries carrying `identifier.name`, `identifier.id` and `isHIP` `true`, and the screen lists them with the address. A name with no match returns 204 with `error.code`, and the screen says nothing was found |
| PHR_APP_103 | `screen` | The person's verified mobile, ABHA address, ABHA number, patient id field, full name, year of birth and gender are shown after choosing the facility | The screen |
| PHR_APP_104 | `sandbox` | An entered patient id narrows the match | `p2_post_user_initiated_linking_v3_patient_care_context_discover` with an `unverifiedIdentifiers` entry of `type` `MR` returns 202, and the `p2_post_v3_hiu_patient_care_context_on_discover` callback carries `patient` with that record |
| PHR_APP_105 | `sandbox` | Fetch Records discovers by name, year of birth, gender and mobile, and leaves out what is already linked | The discover call returns 202 with `hip.id` set. The on-discover callback carries `transactionId` and `patient[].careContexts`. No care context in it appears in `p2_get_hip_v3_link_patient_links` `Patient.links[].careContexts` |
| PHR_APP_106 | `sandbox`, `human` | The discovered records are shown with their type, the person selects some, and only those link | `p2_post_user_initiated_linking_v3_link_care_context_init` with the `transactionId` and the selected care contexts returns 202. The `p2_post_v3_hiu_patient_care_context_on_init` callback carries `link.referenceNumber`. After PHR_APP_107, the on-confirm `patient.careContexts` holds the selected ones and no other |
| PHR_APP_107 | `sandbox`, `human`, optional | The OTP the HIP sends completes the link, and "Records are successfully linked" is shown | The person enters the OTP. `p2_post_user_initiated_linking_v3_link_care_context_confirm` with `linkRefNumber` and `token` returns 202, and the `p2_post_v3_hiu_patient_care_context_on_confirm` callback carries `patient.careContexts`. A wrong OTP brings the callback with `error.code`, and the screen shows the error. Record `not-run` if you do not claim it |
| PHR_APP_108 | not-run | Pull Records sends a data request within 5 minutes and records arrive | `not-run`: needs `m3_post_data_flow_v3_health_information_request`, which no P specification publishes. The screen check that the facility shows in Linked Facility is PHR_APP_1201 |
| PHR_APP_109 | `screen`, optional | An "i" control in My Records says fetching can take time, and a status shows while it does | The message and the status. Record `not-run` if you do not claim it |
| PHR_APP_110 | `screen`, optional | A record shows facility name, visit type, prescriber, date and its attachment | The record screen. Record `not-run` if you do not claim it |
| PHR_APP_111 | `screen`, optional | The attachment opens on the device | The opened record. Record `not-run` if you do not claim it |

### PHR_APP_201 to PHR_APP_211: link and view records from a health programme, user initiated

Same as PHR_APP_101 to PHR_APP_111, with these differences. Run each as its counterpart and record the counterpart's evidence.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_201 | `screen` | As PHR_APP_101 | As PHR_APP_101 |
| PHR_APP_202 | `sandbox` | The person selects an integrated government programme | `p2_get_gateway_v3_govt_programs` returns 200 with entries carrying `identifier.name` and `identifier.id`, and the screen lists them |
| PHR_APP_203 | `screen` | As PHR_APP_103, with the programme's own label in place of patient id | The screen |
| PHR_APP_204 | `sandbox` | An entered programme id, such as a PM-JAY id, narrows the match | As PHR_APP_104 |
| PHR_APP_205 | `sandbox` | As PHR_APP_105 | As PHR_APP_105, with the programme's id in `hip.id` |
| PHR_APP_206 | `sandbox`, `human` | As PHR_APP_106. The records show as the programme names them, such as each vaccine dose | As PHR_APP_106 |
| PHR_APP_207 | `sandbox`, `human`, optional | As PHR_APP_107, with the OTP sent by the programme | As PHR_APP_107 |
| PHR_APP_208 | not-run | As PHR_APP_108 | `not-run`: as PHR_APP_108 |
| PHR_APP_209 | `screen`, optional | As PHR_APP_109 | As PHR_APP_109 |
| PHR_APP_210 | `screen`, optional | As PHR_APP_110 | As PHR_APP_110 |
| PHR_APP_211 | `screen`, optional | As PHR_APP_111 | As PHR_APP_111 |

### PHR_APP_300: records linked by the facility, HIP initiated

Mandatory. The facility links the record with `m2_post_hip_v3_link_carecontext`, an M2 call your app does not make.

Loop limit: 3 passes per test case.

#### PHR_APP_300, linked records appear in the app. `sandbox` and `screen`

A facility links a record to the person's address. Exit condition: `p2_get_hip_v3_link_patient_links` returns 200 with `Patient.links[]` holding that HIP's `hip` and the linked `careContexts`, and Linked Facility shows the facility. Viewing the record needs the fetch in PHR_APP_108, which is `not-run` here.

### PHR_APP_400: an HIU views data under an approved consent

Mandatory. `not-run`: the HIU's fetch is `m3_post_data_flow_v3_health_information_request`, which no P specification publishes. The approval half is PHR_APP_1001.

Loop limit: 3 passes per test case.

### PHR_APP_50101 to PHR_APP_50103: share the profile by QR from the app

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_50101 | `sandbox`, `human` | The app shows the person's QR code in Profile, and the facility scans it | `p2_get_v3_phr_app_login_profile_qrcode` returns 202, as the specification states, and the screen shows the QR. The facility's scan is a human step. Screen check: after the scan the person sees the profile, the consent text, and Share and Cancel |
| PHR_APP_50102 | `sandbox`, `human` | Share sends the profile to the facility's system and a notification confirms it. Cancel sends nothing | Share: `p2_post_patient_share_v3_share` with `intent` `PROFILE_SHARE` and `metaData.hipId` returns 202, and the `p2_post_v3_hiu_patient_on_share` callback carries `acknowledgement.status` and `acknowledgement.abhaAddress`. Cancel: no share call in the log |
| PHR_APP_50103 | `sandbox`, `human` | The person scans the facility's counter QR with Scan in Profile, confirms, and shares | The person scans. As PHR_APP_50102, with `metaData.context` from the QR, and the callback carries `acknowledgement.profile.tokenNumber`, which the screen shows |

### PHR_APP_50201 to PHR_APP_50211: share the profile when the QR is scanned with the phone camera

Mandatory unless the sheet leaves a case unmarked. The camera, the app chooser and the store are the phone's, so each step is a person's.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_50201 | `screen`, `human` | App installed, person logged out: the scan offers the installed PHR apps and yours launches when chosen | A recording from scan to launch |
| PHR_APP_50202 | `screen` | Logged out, the app opens on the login page | The login page after launch |
| PHR_APP_50203 | `screen` | After login, the app opens the share profile page | The share profile page |
| PHR_APP_50204 | `sandbox`, `human` | Share sends the profile, Cancel does not | As PHR_APP_50102 |
| PHR_APP_50205 | `screen`, `human` | App installed, person logged in: the scan launches your app | A recording from scan to launch |
| PHR_APP_50206 | `screen` | The app opens the share profile page | The share profile page |
| PHR_APP_50207 | `sandbox`, `human` | As PHR_APP_50204 | As PHR_APP_50102 |
| PHR_APP_50208 | `screen`, `human` | App not installed: the scan opens a browser on the deep link page | A recording from scan to the page |
| PHR_APP_50209 | `screen`, `human` | The deep link page lists the ABDM compliant PHR apps, yours among them, and choosing one opens its store page | The page and the store page |
| PHR_APP_50210 | `sandbox`, `human` | After install, the person registers or logs in and lands on share profile | A P1 registration or login 200, such as `p1_post_v3_phr_app_enrollment_enrol` with `message` `ABHA Address Created Successfully`, then the share profile page |
| PHR_APP_50211 | `sandbox`, `human` | As PHR_APP_50204 | As PHR_APP_50102 |

### PHR_APP_600: profile details with KYC verified or self declared

Mandatory. `sandbox` and `screen`.

Loop limit: 3 passes per test case.

#### PHR_APP_600, the profile shows its status

`p2_get_v3_phr_app_login_profile` with `X-token` returns 200 with `abhaAddress`, `fullName`, `gender`, `mobile` and `kycStatus`. Screen check: every filled field is shown, with "KYC Verified" and a green tick when `kycStatus` is `VERIFIED`, and "Self-Declared" otherwise.

### PHR_APP_700: download the ABHA address card

Mandatory. `sandbox` and `screen`.

Loop limit: 3 passes per test case.

#### PHR_APP_700, the card shares and downloads

`p2_get_v3_phr_app_login_profile_phrcard` with `X-token` returns 202, as the specification states. Screen check: the card carries the photo, full name, ABHA address, mobile, and the ABHA number when one is linked, and it can be shared and saved.

### PHR_APP_901 to PHR_APP_903: the Requests section of the Consents tab

Mandatory. Each list covers consent, subscription and locker requests. `p4_get_subscription_requests_v3_patients_requests` with `X-AUTH-TOKEN` returns both consents and subscriptions, filtered by `status`.

Loop limit: 3 passes per test case.

**Preconditions.** A sandbox HIU has raised at least one consent request to the person's address with `m3_post_consent_v3_request_init`, an M3 call your app does not make.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_901 | `sandbox`, `screen` | Requests not yet acted on show under Requested | `p2_get_consent_v3_request` returns 200 with `requests[].status` `REQUESTED` for the request, and the screen lists it under Requested |
| PHR_APP_902 | `sandbox`, `human` | A denied request shows under Denied | The person taps Deny. `p2_post_consent_v3_request_request_id_deny` returns 202, then `p2_get_consent_v3_request_request_id` returns 200 with `status` `DENIED`, and the screen lists it under Denied |
| PHR_APP_903 | `sandbox`, `screen` | A request left past its expiry shows under Expired, never under Denied | `p2_get_consent_v3_request_request_id` returns 200 with `status` `EXPIRED`, and the screen lists it under Expired. `hiecm.concept.consent-in-a-phr-app` |

### PHR_APP_1001 and 10.2: the Approved section of the Consents tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1001 | `sandbox`, `human` | A granted request shows under Granted | The person taps Approve. `p2_post_consent_v3_request_request_id_approve` returns 202 with `consentIds[].id`, then `p2_get_consent_v3_request_request_id` returns 200 with `status` `GRANTED`, and the screen lists it under Granted |
| PHR_APP_1002 | `sandbox`, `human` | A revoked consent shows under Revoked | The person taps Revoke. `p2_post_consent_v3_revoke` returns 202 with `message`, then `p2_get_consent_v3_artefact_artefact_id` returns 200 with `status` `REVOKED`, and the screen lists it under Revoked |

### PHR_APP_1101 to PHR_APP_1103: the My Records tab

Mandatory. Each needs a fetched record, which PHR_APP_108 cannot produce here. Attest on a record your app already holds.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1101 | `screen` | Tapping a fetched record opens its details | The details screen |
| PHR_APP_1102 | `screen` | The details show HI type, date, time and the doctor or facility, with the attachment | The details screen |
| PHR_APP_1103 | `screen` | The attachment opens on the device | The opened report |

### PHR_APP_1201: the Linked Facility tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1201 | `sandbox`, `screen` | Every linked provider is listed with Pull Records beside it | `p2_get_hip_v3_link_patient_links` returns 200 with one `Patient.links[]` entry per linked facility or programme, and `p4_get_subscription_requests_v3_patients_lockers` returns 200 with each locker. The screen lists every one, each with Pull Records |

### PHR_APP_1300 and PHR_APP_1400: edit a subscription, disable auto approval

Mandatory. These repeat PHR_HIU_10105 and PHR_HIU_10203. One run can serve both; quote both names.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1300 | `sandbox`, `human` | A granted subscription's HI types, visit types and period can be edited and saved | The person edits and taps Save Changes. `p3_put_subscription_requests_v3_patients_subscription_id` returns 202 with `subscriptionId`, then `p3_get_subscription_requests_v3_subscription_id` returns 200 with `includedSources[].hiTypes` and `includedSources[].period` as saved |
| PHR_APP_1400 | `sandbox`, `human` | A granted auto approval policy can be disabled | The person taps Disable. `p2_post_consent_v3_auto_approve_auto_approval_id_disable` returns 202 with `message`, then the next request from that HIU shows `status` `REQUESTED` until the person acts |

### PHR_APP_1501 to PHR_APP_1506: link an ABHA number to the ABHA address

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1501 | `screen` | A self declared profile shows "Link ABHA Number" beside "Self Declared" on home | The home screen |
| PHR_APP_1502 | `screen` | The 14 digit number is entered, and a malformed one is refused in the form | The entry screen and the refusal |
| PHR_APP_1503 | `sandbox`, `human` | The number is verified by Aadhaar OTP and by mobile OTP | `p2_post_v3_phr_app_login_profile_request_otp` with `loginHint` `abha-number` and `scope` `["abha-login","mobile-verify"]` with `otpSystem` `abdm`, or `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar`, returns 200 with `txnId`. `p2_post_v3_phr_app_login_profile_verify` then returns 200 with `authResult` `success`. A wrong mobile OTP returns 200 with `authResult` `failed` and `message` `Please enter a valid OTP. Entered OTP is either expired or incorrect.` Run both OTP systems |
| PHR_APP_1504 | `screen`, `sandbox` | Resend is offered after 60 seconds for both OTPs | A second request OTP 200 at least 60 seconds after the first, and PHR_APP_1503 then passes |
| PHR_APP_1505 | `sandbox`, `screen` | The link succeeds, the message says so, and the profile takes the ABHA number's details | `p2_post_v3_phr_app_login_profile_link` with `action` `LINK` and the `transactionId` returns 200 with `message` `ABHA number is securely linked to ABHA address` and `authResult` `success`. Then `p2_get_v3_phr_app_login_profile` returns 200 with `abhaNumber` present. Screen check: the congratulations message, the number on profile and home, and "Self-Declared" gone |
| PHR_APP_1506 | `screen` | "Go back to home screen" returns home | The home screen |

### PHR_APP_1701 and 17.3: edit a KYC verified profile

Mandatory. The sheet has no 17.2.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1701 | `sandbox`, `human` | The mobile is updated after an OTP on the new number | `p2_post_v3_phr_app_login_profile_request_otp` with `scope` `["abha-address-profile","mobile-verify"]` and `loginHint` `mobile-number` returns 200 with `txnId`. `p2_post_v3_phr_app_login_profile_verify` returns 200 with `message` `Mobile Number linked successfully` and `authResult` `success`. A wrong OTP returns 200 with `authResult` `failed` and `message` `Entered OTP is incorrect. Kindly re-enter valid OTP.` |
| PHR_APP_1703 | `sandbox` | Address line, district, state and pin code are updated | `p2_post_v3_phr_app_login_profile_updateprofile` returns 200 with `address`, `districtName`, `stateName` and `pinCode` equal to the values sent |

### PHR_APP_1801 to PHR_APP_1807: edit a self declared profile

Mandatory. The sheet has no 18.6.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1801 | `sandbox`, `screen` | The photo is updated from the camera or the gallery | `p2_post_v3_phr_app_login_profile_updateprofile` with `profilePhoto` returns 200. The response carries no photo field, so the screen check is the new photo on the profile |
| PHR_APP_1802 | `sandbox` | First, middle and last name are updated | The same call returns 200 with `firstName`, `middleName` and `lastName` as sent |
| PHR_APP_1803 | `sandbox` | Gender is updated | 200 with `gender` as sent |
| PHR_APP_1804 | `sandbox` | Day, month and year of birth are updated | 200 with `dayOfBirth`, `monthOfBirth` and `yearOfBirth` as sent |
| PHR_APP_1805 | `sandbox`, `human` | As PHR_APP_1701 | As PHR_APP_1701 |
| PHR_APP_1807 | `sandbox` | As PHR_APP_1703 | As PHR_APP_1703 |

### PHR_APP_1901 to PHR_APP_1908: the deep link flow

Mandatory. The facility's notice and the SMS are not your app's calls.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_APP_1901 | `human` | The person is registered at a facility that holds a record but no ABHA address for them | A facility partner confirms it. Without one, `needs-human` |
| PHR_APP_1902 | not-run | The facility notifies ABDM of the new record with the mobile and its HIP code | `not-run`: the notice is `m2_post_hip_v3_link_patient_links_sms_notify2`, an M2 call no P specification publishes |
| PHR_APP_1903 | `human` | ABDM sends the SMS with the deep link | The SMS on the person's phone, read out or photographed |
| PHR_APP_1904 | `screen`, `human` | The link opens the list of ABDM compliant PHR apps, yours among them | The list |
| PHR_APP_1905 | `screen`, `human` | App not installed: choosing it opens the store to install it | A recording from the list to the installed app |
| PHR_APP_1906 | `sandbox`, `human` | After install, a new person registers an address and password | As PHR_APP_50210. The sheet also names registration by email, which the P1 specification does not publish |
| PHR_APP_1907 | `sandbox`, `screen` | App installed: it launches into user initiated linking for that facility | The app opens on discovery, and `p2_post_user_initiated_linking_v3_patient_care_context_discover` returns 202 with `hip.id` equal to the HIP code in the link, followed by the on-discover callback as PHR_APP_105 |
| PHR_APP_1908 | `sandbox`, `human` | Scanning the facility QR gets a token number, and the records link as in PHR_APP_101 to PHR_APP_111 | The person scans. As PHR_APP_50103, with `acknowledgement.profile.tokenNumber` shown. Then PHR_APP_105 and PHR_APP_106 on that facility |

### PHR_APP_2001: scan and share with no PHR app installed

Mandatory. `sandbox` and `human`.

Loop limit: 3 passes per test case.

#### PHR_APP_2001, the token is shown after sharing

The person scans the facility QR with the phone camera, installs the app and logs in. Exit condition: `p2_post_patient_share_v3_share` returns 202 and the `p2_post_v3_hiu_patient_on_share` callback carries `acknowledgement.profile.tokenNumber`. Screen check: the consent statement before Share, the notification that the profile went to the hospital, and the token number after OK. `p2_get_patient_share_v3_profile_gettokendetails` then returns 200 with an entry holding that `tokenNumber` and the facility's `hipId`.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case names to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no OTPs, no mobile or ABHA numbers, no client secret. The run log and the manifest are written on every run. The manifest is not the report. Every run ends with a PDF, written as the section "Writing the test report" sets out: run its `check`; when it exits 0, build the report; when it does not, build the draft with `--draft`. Never end a run without one, and say where it is in the three lines below.

```json
{
  "skill": "abdm-p2",
  "set": "PHR mobile app test cases, NHA, PHR App Functionality tab",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "PHR_APP_105", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c..."],
     "observed": ["discover 202", "on-discover patient[].careContexts 2 entries, none already linked"]},
    {"id": "PHR_APP_110", "outcome": "passed", "evidence": "screen",
     "attachment": "record-details-2026-10-01.png"},
    {"id": "PHR_APP_1001", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "approval is the person's tap; nobody present"},
    {"id": "PHR_APP_108", "outcome": "not-run", "reason": "health information request is M3; no P specification publishes it"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
