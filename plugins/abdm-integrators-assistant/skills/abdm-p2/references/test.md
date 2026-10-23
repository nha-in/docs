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
| NHA's PHR test case workbook, if results go into it | The workbook NHA sent you, copied into `abdm-ft/`. It has one tab per PHR milestone and no case ids; the script adds a Test Case ID column with the ids this skill uses. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
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
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. `not needed` when no workbook was given |
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

One rule above changes in a `ui` run, and only this one. In an `ft` run a `screen` case is attested: the tester answers `passed? y/n` and names the screenshot. In a `ui` run the agent observes the screen itself, and its screenshot plus the literal on-screen text it matched replace the tester's attestation. Every other rule above still holds in a `ui` run.

### Before you start

The `ui` readiness check runs before the first case. Check every row the chosen cases need, in order. Record each as `ready`, `missing` or `not needed`, never the value itself.

| Need | Ready when | Install command to print when missing |
|---|---|---|
| Node 18 or later | `node --version` prints `v18` or higher | Install the LTS release from https://nodejs.org |
| The Playwright MCP server, connected | Your tool list holds `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests` and `browser_network_request`. These are the names the server publishes. Read your own tool list for the exact names, which some agents prefix with the server name | Claude Code with the integrators plugin: restart Claude Code. The plugin starts `@playwright/mcp@0.0.83`, and the first start downloads that version with `npx`. Claude Code without it: `claude mcp add playwright npx @playwright/mcp@0.0.83`. Any other agent: an MCP server with command `npx` and argument `@playwright/mcp@0.0.83` |
| A browser | `browser_navigate` to the application URL returns a page, not an error naming a missing browser | Install the browser the server's error names, and only that one: `npx playwright install chrome` when it names Chrome, `npx playwright install chromium` when it names Chromium |
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
   | Web | `browser_take_screenshot` with `filename` `abdm-ft/evidence/<case id>/<n>.png`. The server resolves that name against its workspace root, which need not be your repository, so save or move the file to `abdm-ft/evidence/<case id>/<n>.png` and check that the file exists there | `browser_snapshot` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |
   | PHR app | `- takeScreenshot: abdm-ft/evidence/<case id>/<n>` in the flow | `maestro hierarchy` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |

   The screen text shows what was typed into each field. Before saving it, replace the value of every field you typed an OTP, a password or an Aadhaar number into with `[redacted]`. For an OTP step, take the screenshot only after the field is submitted or cleared. Never save a snapshot or screenshot that shows an OTP, password or full Aadhaar number.

4. An OTP, a password, a captcha or an approval stops the case and asks the tester in the terminal, as in every run type. Read it with input hidden, type it with `browser_type`, and hold it only for that step. The tool's reply repeats what was typed. Never paste that reply into the run log, the evidence or the workbook. Write `<OTP typed>` or `<password typed>` in its place.
5. Judge the case. The pass condition is the case's exit condition and screen check in this skill, not the sheet's prose. The case is `passed` when the screen holds both. Paste into the run record the exact on-screen text or element you matched for each. When one holds and the other does not, the pass failed: say which one is missing. When the skill's case gives no literal for the screen, quote the on-screen text you believe satisfies the sheet's Expected Result, and record the case `needs-human` with `tester to confirm` in Remarks. Never record such a case `passed`.
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
| 2 | Failed network responses | `browser_network_requests` lists the requests. For each with a status of 400 or above, `browser_network_request` with its number shows the body. When it shows no body, take the error code from the on-screen message or from the `ft` replay at order 4 | The HTTP status and an ABDM error code such as `ABDM-1204` |
| 3 | Browser console errors | `browser_console_messages` | A script error that stopped the screen |
| 4 | One replay of the case's `ft` calls | The same skill's case, run once as `ft`, when the sandbox credentials are ready | The ABDM error code. Diagnosis only: the `ui` outcome stays as observed |
| 5 | Your server log for the case's time window | The command from the readiness check, with the case's start and end times | A backend exception such as `NullPointerException`, which usually appears nowhere else |

```json
{"id": "CRT_ABHA_105", "outcome": "failed", "response": "Screen: Invalid OTP. POST /v3/enrollment/request/otp HTTP 400 ABDM-1204", "iterations": 3, "remarks": "OTP field sent empty; server log: NullPointerException in OtpService.verify"}
```

### How you know it worked

- `abdm-ft/evidence/<case id>/` holds one `<n>.png` and one `<n>.txt` for every step run, and `phr.png` for a case under the PHR proof rule.
- The run log pastes, for every `passed` case, the exact on-screen text or element that matched the exit condition and the screen check.
- A case whose screen check has no literal in the skill is `needs-human` with `tester to confirm`, never `passed`.
- `write` exits `0`, and the workbook row shows `PASS`, `FAIL`, `NA` or blank in `Status(PASS/FAIL)`, a number from 1 to 3 in `Iterations`, and the reason in `Remarks`.
- No OTP, password, token or full Aadhaar number appears in the run log, a screenshot, the evidence text, the results file or the workbook. Every typed OTP, password or Aadhaar field in a `.txt` file reads `[redacted]`.

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
    path = Path(path)
    wb = load(path)
    backup = path.with_name(f"{path.stem}.before-abdm-run{path.suffix}")
    original = load(backup) if backup.exists() else None
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        col = next((cols[n] for n in COLUMNS[run]["status"] if n in cols), None)
        if col is None:
            print(case)
            continue
        cell = anchor(ws, row, col)
        run_col = cols.get(f"{norm(ws.cell(top, col).value)} (run)")
        if run_col and original is not None and norm(original[ws.title][cell.coordinate].value):
            # NHA wrote in this cell, so the run's status is only in the "(run)" column.
            status = status_of(ws, row, run_col)
        else:
            status = norm(cell.value)
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
status `PASS` in the run type's column. A mandatory case that is `FAIL` or
blank stops it, and so does one that is `NA` unless NHA agreed it is not run.

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

How the marking column is read. It is the first column whose name holds both
`Mandatory` and `Optional`, in any case and spacing: `Mandatory/ Optional` on
the HMIS and HPR sheets, `Optional / Mandatory` on the PHR sheet.

| Marking in the sheet | Government entity | Private entity |
|---|---|---|
| `Mandatory`, `Yes` | Mandatory | Mandatory |
| `Mandatory` then a list of mandatory and optional fields, as on PHR's profile cases | Mandatory | Mandatory |
| `No`, `Optional`, `Non-Mandatory` | Optional | Optional |
| `Mandatory for Private` | Optional | Mandatory |
| `Mandatory for Government` | Mandatory | Optional |
| `Mandatory for Private /Government (Optional only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| `Either of the test cases X or Y is mandatory for Government` | X or Y must pass; one passing satisfies both | The row carrying it is optional; the other case keeps its own marking |
| `Yes (if ...)`, `Yes, if ...`, `Yes(only if ...)` | Mandatory, flagged conditional | Mandatory, flagged conditional |
| Blank | Mandatory, flagged not marked | Mandatory, flagged not marked |
| Anything else, such as a note in the marking cell | Mandatory, flagged unrecognised | Mandatory, flagged unrecognised |

A mandatory case can have no meaning in a run type, such as a screen only case
in an `ft` run, or be a conditional case your system does not offer. Record it
`not-run` only after NHA agrees it does not apply, and say so in its remarks.
Then add it to `agreed_not_run` in `meta.json`, with who at NHA agreed and
when: `"agreed_not_run": {"<case id>": "<who at NHA agreed, and when>"}`. The gate passes a mandatory `NA` case only when it is listed there, and
the report lists every such case with its agreement in the results summary and
in the failures and iterations log. An unlisted mandatory `NA` still blocks.
The check also prints every case it treated as conditional, so the person
signing off sees them.

### Before you start

- The workbook the run wrote into, with its results, as `shared.concept.test-workbook-write-back` leaves it.
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `openpyxl`, `Pillow` and `python-docx`: `pip install openpyxl pillow python-docx`. All three are open source (MIT, the HPND licence and MIT).
- LibreOffice, if you want a PDF beside the Word file. Without it, export the PDF from Word or LibreOffice yourself.
- The script below, saved as `abdm-ft/abdm_report.py`.
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`, and any value that holds a token or a credential's label with its value, such as `client secret: ...`. `agreed_not_run` is only for mandatory cases NHA agreed are not run; leave it `{}` otherwise.

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
  "agreed_not_run": {},
  "recordings": [{"title": "M1 ui run, full trace", "link": "<LINK TO THE RECORDING>"}]
}
```

```python
"""Check that a functional test run may be reported, and write the report.

  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private [--meta meta.json]
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.docx

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. A mandatory case NA passes only when meta.json's agreed_not_run names it.
Needs openpyxl, Pillow and python-docx (pip install openpyxl pillow python-docx). With LibreOffice's soffice on PATH,
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
# Header names vary by sheet and spacing: "Mandatory/ Optional" on HMIS and
# HPR, "Optional / Mandatory" on PHR; "Functionality", "Feature" or "Test Title".
TITLE = ["functionality", "feature", "test title"]
OPTIONAL = ("no", "optional", "non-mandatory", "non mandatory", "not mandatory")
FORBIDDEN = re.compile(r"pass(word|wd)|secret|token|credential|api[_ -]?key|private[_ -]?key", re.I)
# A JWT: three base64url segments, the first a JSON header, so starting eyJ.
JWT = re.compile(r"\beyJ[\w-]+\.[\w-]+\.[\w-]*")
SECRET_WORDS = r"pass(?:word|wd)|secret|token|otp|credentials?|api[ _-]?key|private[ _-]?key"


def labelled(words):
    """A value after a label naming a secret: "client secret: x", "OTP 482913", "otp":"482913"."""
    return re.compile(
        r"(\b[\w-]*(?:" + words + r")[\w-]*['\"]?\s*[:=]\s*['\"]?)([^\s'\",;}]+)"
        r"|(\b(?:" + words + r")\b\s+(?:is\s+)?)((?=[^\s,;]*\d)[^\s,;]{4,})", re.I)


LABELLED = labelled(SECRET_WORDS)
# What meta.json may never hold as a value. An OTP is masked, not refused: it
# has expired by the time a report is written, and findings name the OTP step.
LABELLED_CREDENTIAL = labelled(r"pass(?:word|wd)|secret|token|credentials?|api[ _-]?key|private[ _-]?key")
LABEL = re.compile(r"\b(?:" + SECRET_WORDS + r")\b", re.I)
IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".bmp")
RUN_NAME = {"ui": "UI functional test", "ft": "API functional test"}
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Scope",
            "Test environment and tools", "Approach and methodology", "Test data",
            "Results summary", "Evidence", "Failures and iterations log", "Conclusion", "Annexures"]


def norm(text):
    return re.sub(r"\s+", " ", str(text if text is not None else "")).strip()


def mask(text):
    """A JWT to [token], a value after a secret's label to [redacted], ABHA numbers to
    XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234, a mobile to XXXXXX1234."""
    text = JWT.sub("[token]", str(text))
    text = LABELLED.sub(lambda m: (m.group(1) or m.group(3)) + "[redacted]", text)
    text = re.sub(r"(?<!\d)\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XX-XXXX-XXXX-\1", text)
    text = re.sub(r"(?<!\d)\d{4}[ -]?\d{4}[ -]?(\d{4})(?!\d)", r"XXXX XXXX \1", text)
    return re.sub(r"(?<!\d)[6-9]\d{4}[ -]?\d(\d{4})(?!\d)", r"XXXXXX\1", text)


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


def find(cols, words):
    """The first column, in sheet order, whose name holds one of the words."""
    for word in words:
        for name, col in sorted(cols.items(), key=lambda x: x[1]):
            if word in name.lower() and not name.endswith(" (run)"):
                return col
    return None


def marking_col(cols):
    return next((col for name, col in sorted(cols.items(), key=lambda x: x[1])
                 if "mandatory" in name.lower() and "optional" in name.lower()), None)


def value(ws, row, top, cols, names, original):
    """The run's value. Where NHA's own cell had text, the writer put the run's value
    in "<column> (run)", and only that column is read for the row, even when blank."""
    col = next((cols[n] for n in names if n in cols), None)
    if col is None:
        return ""
    cell = anchor(ws, row, col)
    run_col = cols.get(norm(ws.cell(top, col).value) + " (run)")
    if run_col:
        if original is None:
            sys.exit("the workbook has a (run) column but no .before-abdm-run copy beside it, so NHA's "
                     "text cannot be told from the run's: restore the copy the writer made")
        nha = original[ws.title][cell.coordinate].value if ws.title in original.sheetnames else None
        if norm(nha):
            return norm(anchor(ws, row, run_col).value)
    return norm(cell.value)


def classify(text, entity):
    """(kind, label, note, pair ids) for one marking and entity type."""
    t = norm(text)
    low = t.lower()
    if not t:
        return "mandatory", "Not marked, treated as mandatory", "no marking: treated as mandatory", None
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
        return "mandatory", "Unrecognised, treated as mandatory", "unrecognised marking: treated as mandatory", None
    rest = m.group(2)
    if not rest:
        return "mandatory", "Mandatory", None, None
    if rest.startswith("•"):
        # PHR's profile cases: "Mandatory" then a bullet list of the mandatory and optional fields.
        return "mandatory", "Mandatory", "lists mandatory and optional fields: the case is mandatory", None
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
    return "mandatory", "Unrecognised, treated as mandatory", "unrecognised marking: treated as mandatory", None


def iterations(text):
    try:
        return int(float(text))
    except (TypeError, ValueError):
        return 0


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    path = Path(path)
    # The copy the writer made before its first write: what NHA's own cells held.
    backup = path.with_name(path.stem + ".before-abdm-run" + path.suffix)
    original = load(backup) if backup.exists() else None
    out = []
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        mcol = marking_col(cols)
        marking = norm(anchor(ws, row, mcol).value) if mcol else ""
        tcol = find(cols, TITLE)
        title = norm(anchor(ws, row, tcol).value) if tcol else ""
        kind, label, note, pair = classify(marking, entity)
        rec = {"id": case, "sheet": ws.title, "title": title or case, "marking": marking,
               "kind": kind, "label": label, "note": note, "pair": pair}
        for key, names in COLUMNS[run].items():
            rec[key] = value(ws, row, top, cols, names, original)
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


def gate(recs, groups, agreed):
    """Mandatory cases not PASS. NA passes only on a case NHA agreed not to run."""
    blocking = []
    by_id = {r["id"]: r for r in recs}

    def through(r):
        return r["status"] == "PASS" or (r["status"] == "NA" and r["id"] in agreed)

    for r in recs:
        if r["kind"] == "mandatory" and not through(r):
            blocking.append(r["id"] + ": " + (r["status"] or "blank"))
    for ids in groups:
        present = [by_id[i] for i in ids if i in by_id]
        if present and not any(through(r) for r in present):
            blocking.append(" or ".join(r["id"] for r in present) + ": " +
                            ", ".join(r["status"] or "blank" for r in present))
    return blocking


def agreed_cases(meta):
    """meta.json's agreed_not_run: case id to who at NHA agreed it is not run, and when."""
    agreed = meta.get("agreed_not_run") or {}
    if not isinstance(agreed, dict) or not all(isinstance(v, str) and v.strip() for v in agreed.values()):
        sys.exit('agreed_not_run must map each case id to who at NHA agreed and when, such as '
                 '{"CRT_ABHA_101": "<NAME>, NHA, email of 2026-10-21"}')
    return {norm(k).replace(" ", ""): norm(v) for k, v in agreed.items()}


def run_check(path, run, entity, agreed):
    recs, groups = read_cases(path, run, entity)
    if not recs:
        sys.exit("no Test Case ID column with ids in " + Path(path).name + ": nothing to report on")
    for r in recs:
        if r["note"]:
            print("marking " + r["id"] + ' "' + r["marking"] + '": ' + r["note"])
        r["agreed"] = agreed.get(r["id"]) if r["status"] == "NA" and r["kind"] in ("mandatory", "pair") else None
        if r["agreed"]:
            print("agreed not run " + r["id"] + ": " + mask(r["agreed"]))
    blocking = gate(recs, groups, agreed)
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
    elif isinstance(meta, str):
        # A value holding a token, or a credential's label with its value, such as "client secret: x".
        if JWT.search(meta) or LABELLED_CREDENTIAL.search(meta) or (
                re.search(r"\bclient[ _-]?secret\b", meta, re.I)):
            found.append(where + " (its value)")
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
            # A value beside a label naming a secret, such as "OTP used", is never shown.
            secret = len(row) == 2 and not (header and n == 0) and LABEL.search(str(row[0] or ""))
            for c, (cell, text) in enumerate(zip(cells, row)):
                cell.text = "[redacted]" if secret and c == 1 and text else str(text if text is not None else "")
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
    agreed = [r for r in recs if r.get("agreed")]
    label = RUN_NAME[run]
    if agreed:
        held = (" All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS, except " +
                str(len(agreed)) + " NA that NHA agreed not to run, listed in the results summary.")
    else:
        held = " All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS."

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
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result." + held + " " +
        str(len(retried)) + " cases took more than one pass.")

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
        "Every OTP and every consent or approval came from a person at the moment the case needed it. Where "
        "a screen took a typed OTP, the agent entered the OTP the person gave it into that screen and never "
        "stored it.",
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
    table([[r["id"], r["title"], r["label"], (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed")
            else ""), r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])
    if agreed:
        doc.add_heading("Mandatory cases NHA agreed not to run", level=2)
        table([[r["id"], r["title"], r["agreed"]] for r in agreed], header=["Test case ID", "Title", "Agreed by and when"])

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
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "",
                ("Agreed not run: " + r["agreed"] + ". " if r.get("agreed") else "") + r["remarks"]] for r in log],
              header=["Test case ID", "Status", "Iterations", "Remarks"])
    else:
        doc.add_paragraph("No case failed and no case took more than one pass.")

    # 12. Conclusion
    heading(SECTIONS[10])
    doc.add_paragraph(
        "In the " + run + " run of " + meta.get("product", "") + " for " + milestone + "," +
        held.replace(" All", " all", 1) + " Of " + str(n) + " cases, " +
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
    if a.action == "build" and not (a.meta and a.out):
        sys.exit("build needs --meta and --out")
    if a.meta:
        meta = json.loads(Path(a.meta).read_text())
        bad = forbidden(meta)
        if bad:
            sys.exit("meta.json carries a credential, a field named like one or a value holding one, "
                     "which never goes in a report: " + ", ".join(bad))
        meta["entity_type"] = a.entity or meta.get("entity_type")
    entity = a.entity or meta.get("entity_type")
    if entity not in ("government", "private"):
        sys.exit("--entity, or entity_type in meta.json, must be government or private")
    recs, groups, blocking = run_check(a.workbook, a.run, entity, agreed_cases(meta))
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
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private --meta abdm-ft/meta.json
   ```

   `--meta` is optional for `check`: it is read for `agreed_not_run`. The script prints one `marking` line for every case whose marking is entity specific, conditional, an either rule, a field list, blank or unrecognised, with how it was treated, and one `agreed not run <id>: <agreement>` line per mandatory `NA` case `agreed_not_run` lets through. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

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
- No 12 digit number appears anywhere in it: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept. A 10 digit mobile reads `XXXXXX1234`.
- No token or secret appears in it: a JWT reads `[token]`, and a value after a label naming a password, secret, token, OTP, credential, API key or private key reads `[redacted]`. This covers the workbook's Response and Remarks values and the findings, as well as `meta.json`.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'docx'` | python-docx is not installed | `pip install openpyxl pillow python-docx` |
| `not passed CRT_ABHA_105: FAIL` | A mandatory case failed | Fix the cause the Remarks name, rerun the case, write it back, run `check` again |
| `not passed <id>: NA` | A mandatory case was recorded not run, and `agreed_not_run` does not list it | Run it, or agree with NHA that it does not apply, keep the reason in its remarks, and add it to `agreed_not_run` with who agreed and when. Pass `--meta` to `check` |
| `agreed_not_run must map each case id` | An entry has no agreement text | Write who at NHA agreed and when for every case listed |
| `not passed <id>: blank` | The case needs a tester step, or never ran | Finish it with the tester, then write it back |
| `marking <id> "...": unrecognised marking: treated as mandatory`, or `no marking` | NHA used a marking the script does not know, such as PHR's note on row P1 3.6, or left it blank | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a credential` | `meta.json` has a password, secret, token or credentials field, or a value holding a JWT or a credential's label with its value | Delete the field or the value. A report never carries a credential |
| `the workbook has a (run) column but no .before-abdm-run copy` | The writer's copy of NHA's workbook was moved or deleted | Put it back beside the workbook. Without it the script cannot tell NHA's text from the run's |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as NHA's PHR workbook does not, and no write has added them yet | Write the run's results with `shared.concept.test-workbook-write-back` first: its first write adds the `Test Case ID` column |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |

From `shared.concept.test-report`.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case names to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no OTPs, no mobile or ABHA numbers, no client secret. The run log and the manifest are written on every run. The manifest is not the final report: the section "Writing the test report" writes that, once its `check` exits 0.

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
