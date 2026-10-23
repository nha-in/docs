---
name: hiecm-p1-test
description: "Use when walking the ABDM P1 functional test cases (PHR registration and login with an ABHA address) against an integrator's own PHR app and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, and writes NHA's workbook, the manifest of request ids a reviewer checks against the gateway, and the final test report."
---
# HIE-CM p1 test

Walks the ABDM P1 functional test cases, registration and login with an ABHA address, against the PHR app you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P1 case in the PHR app set against your app and the sandbox, one case at a time
- Records, for each case, the sandbox response and REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your PHR app running against the sandbox hosts | Your build on a device or an emulator. The skill drives your app, not the sandbox directly |
| A way to trigger each journey in your app | A screen, an API or a script. Say which at the start |
| A person with a mobile number, for the self declared cases | Present for the run. Every OTP and every password is a human step and the skill stops for it |
| A person who holds an ABHA number with an Aadhaar linked mobile, for the KYC cases | Present for the run. Without one the ABHA number and Aadhaar cases are `needs-human` |
| An ABHA address that already exists, with a password set | For the login and reset password cases |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's PHR test case workbook, required: the results and the report are built from it | The workbook NHA sent you, copied into `abdm-ft/`. It has one tab per PHR milestone and no case ids; the script adds a Test Case ID column with the ids this skill uses. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your PHR app's APK, installed on an Android emulator or a device over adb | Your build. Android Studio's emulator, or a phone with USB debugging on |
| For a `ui` run: Maestro, to drive the app | https://maestro.mobile.dev, Apache 2.0. `/abdm-test-setup` lists what is missing and prints the install command |
| For a `ui` run: a test ABHA address and its login | A sandbox ABHA address the tester holds, typed at the app's own login when the run reaches it, never stored |

## Say one of these

- "Walk the P1 test cases against my PHR app and log each one."
- "Run only the login cases, PHR_ADDR_601 to PHR_ADDR_903."
- "Re-run PHR_ADDR_111, the address suggestion case failed yesterday."
- "Write a terminal script that runs the P1 test cases and asks me for each OTP and the password."

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

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim | The response was not pasted. A pass with no output is a fail |
| `failed` | Three passes and the exit condition was not observed, or the sandbox returned the refusal the case expects you to handle and your app did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached an OTP, a password, a consent tap or a person who was not there | Ever as a substitute for a fail you can see |
| `not-run` | The case is optional and you do not claim it, or no P specification publishes the operation it needs | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one of these. It decides what the manifest carries.

- **sandbox.** A call the gateway sees. Evidence is the HTTP status, the body and the REQUEST-ID, pasted. The exit condition is a literal in the body. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
- **human.** A step only a person can do. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Search before create. A mobile number or an ABHA number goes through the OTP first, and the `users` array it returns decides whether the person logs in or creates. An app that creates on every entry gives one person a second address they did not want. `hiecm.concept.m1-avoiding-duplicate-abha`
- Tokens as the specification requires. The gateway access token goes in `Authorization` on every call. Choosing an address after a login verify sends the transaction token in `T-token`. Profile calls send the user token in `X-token`.
- Fresh `REQUEST-ID` on every call, logged before sending. A reused id is refused, and after a failure the id is the only handle on the call.
- Paste the response. A step with no pasted output is not done.
- Sensitive values travel encrypted: mobile, Aadhaar number, ABHA number, OTP and password. Read the key and the algorithm from `p1_get_v3_phr_app_login_public_certificate` rather than hard coding them. `hiecm.concept.input-encryption`
- Read the body, not only the status. A wrong OTP on a login verify returns 200 with `authResult` `failed`. Status alone never passes a case here.
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: PHR_ADDR_104   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /abha/api/v3/phr/app/enrollment/verify  REQUEST-ID 6f1c...  HTTP 200
body: {"txnId":"...","message":"OTP Verified Successfully","authResult":"success","users":[...],"tokens":{"token":"<redacted>",...}}
matched: exit condition for PHR_ADDR_104
next: PHR_ADDR_105
```

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/p1-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case chosen gets a row before the first call, each `pending`.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# P1 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| PHR_ADDR_101 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| PHR_ADDR_102 | needs-human | b7a1... | OTP prompt shown, left blank |
| PHR_ADDR_103 | running | | |
| PHR_ADDR_104 | pending | | |
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
| Name every check by its case name from this skill, such as `PHR_ADDR_104`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal for the value: mobile, ABHA number, Aadhaar number, OTP, password, the chosen address. Read it from stdin, encrypt it, send it | Every P1 success path passes through an OTP or a password. A runner that never asks never reaches one |
| Never write a typed value to disk, a log or the manifest, and never hard code one | A mobile number, an OTP and a password belong to the person, not the run |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the status and the body literal the exit condition names, such as `200` with `authResult` `success`, or `400` with `code` `ABDM-9999: ` and the message `This ABHA Address already exists. Please create with unique ABHA address` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| At the end, print one line per case name with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case name, not by script step |

A run reads like this. The person's values are typed at the prompts and never echoed back.

```text
PHR_ADDR_103  POST /abha/api/v3/phr/app/enrollment/request/otp  REQUEST-ID 3b9e...  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 2425, or leave blank if nobody is here:
PHR_ADDR_104  wrong OTP  REQUEST-ID 7c02...  HTTP 400  code ABDM-1006  message Invalid OTP Request  matched
PHR_ADDR_104  right OTP  REQUEST-ID 9a41...  HTTP 200  authResult success  matched
PHR_ADDR_104  passed
```

Nudge: calls with a bad `scope`, a bad `loginHint` or a made up `txnId` test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

NHA's PHR sheet numbers its rows but gives them no ids, so each case here has an id built the way the HMIS ids are, from the PHR milestone and the row: row P1 3.2 is `PHR_ADDR_302`, and P2, P3 and P4 rows are `PHR_APP_`, `PHR_HIU_` and `PHR_LOCKER_`. The test case page shows each id with its row. Use the id in the run log, the manifest and the workbook.

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, ABHA address creation tab. The sections are grouped as the sheet groups them. Every operation id below is in the P1 or P2 specification, which carries the host, the headers and a full request.

### PHR_ADDR_101 to PHR_ADDR_114: register an ABHA address with a mobile number, self declared

Mandatory unless marked. This is the group the ABHA number group repeats, so it is written in full and the other states what differs.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. The certificate from `p1_get_v3_phr_app_login_public_certificate`. A person present with the mobile.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_101 | `screen` | A Register control starts address creation | The screen after Register offers the creation methods. Evidence: the screen |
| PHR_ADDR_102 | `screen` | Mobile Number can be chosen, and Continue leads to the mobile entry | The mobile entry screen after Continue. Evidence: the screen |
| PHR_ADDR_103 | `sandbox` | The mobile is sent for an OTP. `p1_post_v3_phr_app_enrollment_request_otp` with `scope` `["abha-address-enroll","mobile-verify"]`, `loginHint` `mobile-number`, `otpSystem` `abdm` | 200 with `txnId` present and a `message` naming the masked mobile, such as `OTP is sent to Mobile number ending with ******2425` |
| PHR_ADDR_104 | `sandbox`, `human` | The person enters the OTP. `p1_post_v3_phr_app_enrollment_verify` with the same scope and the `txnId` | Two observations. A wrong OTP returns 400 with `code` `ABDM-1006: ` and `message` `Invalid OTP Request`, and the screen says so. The right OTP returns 200 with `authResult` `success` |
| PHR_ADDR_105 | `screen`, `sandbox` | Resend is disabled for 60 seconds after a send, then sends again | A recording or timestamped screens: disabled at send, enabled at 60 seconds. The log holds a second `p1_post_v3_phr_app_enrollment_request_otp` 200 at least 60 seconds after the first, and PHR_ADDR_104 then passes on the new OTP |
| PHR_ADDR_106 | `sandbox`, `screen` | Every address on the mobile is listed to choose from | The 200 from PHR_ADDR_104 carries `users`. The screen lists one row per entry, by `abhaAddress` and `fullName`. Read the array as plural; a screen that shows only the first fails |
| PHR_ADDR_107 | `screen` | "Still want to create a new ABHA address" leads to the profile form, with no second OTP | The form after the tap, and no new `request/otp` call in the log |
| PHR_ADDR_108 | `screen` | The form marks First Name, Year of birth, Gender, Address, State, District and Pin Code mandatory, and Middle Name, Last Name, Day and Month optional | Continue stays disabled until every mandatory field is filled. Evidence: the form empty and the form filled |
| PHR_ADDR_109 | `screen` | The User Information Agreement checkbox is required before Continue, and your app stores that it was ticked | Continue disabled while unticked, and the stored record for this run |
| PHR_ADDR_110 | `sandbox`, `screen` | The address follows the address policy and is created | `p1_get_v3_phr_app_enrollment_isexists` for the chosen address returns 200 with body `false`. `p1_post_v3_phr_app_enrollment_enrol` returns 200 with `message` `ABHA Address Created Successfully` and `phrDetails.abhaAddress` equal to the chosen address. Screen check: an address beginning with a digit, or beginning or ending with a dot, is refused in the form before any call. `hiecm.concept.abha-address-policy` |
| PHR_ADDR_111 | `sandbox`, `screen`, optional | Addresses are suggested, and a taken address is refused | `p1_post_v3_phr_app_enrollment_suggestion` with the `txnId` and the name returns 200 with `abhaAddressList` holding at least one entry, shown on screen. An address already held makes `p1_post_v3_phr_app_enrollment_enrol` return 400 with `code` `ABDM-9999: ` and `message` `This ABHA Address already exists. Please create with unique ABHA address`, and the screen says the address is taken. Record `not-run` if you do not claim it |
| PHR_ADDR_112 | `sandbox`, `human` | The password follows the password policy, travels encrypted in `phrDetails.password`, and logs in | The screen refuses a password that breaks the policy and a confirmation that differs. The person types it. Then `p1_post_v3_phr_app_login_verify` with `scope` `["abha-address-login","password-verify"]` and `authMethods` `["password"]` returns 200 with `message` `Password verified successfully` and `authResult` `success` |
| PHR_ADDR_113 | `screen` | The congratulations screen names the new address, and Login leads to the login screen | Evidence: the screen. The login itself is the PHR_ADDR_112 exit condition |
| PHR_ADDR_114 | `screen`, `human` | On first login the Personal Data Processing Consent Form is shown, and login completes only after I Agree | The form, the home screen after I Agree, and your stored record of the agreement. The person taps I Agree |

The policy the sheet prints for PHR_ADDR_110:

```text
minimum length 8
letters, digits and dot (.)
a digit cannot come first
a dot cannot come first or last
```

Nudge: the sheet prints a minimum of 8 here and 4 in PHR_ADDR_210 and PHR_ADDR_314. Do not make your form stricter than ABDM's own check. Let `isExists` and the enrol call refuse what they refuse, and show their message.

### PHR_ADDR_201 to PHR_ADDR_214: register an ABHA address with an ABHA number

Mandatory unless marked. Same as PHR_ADDR_101 to PHR_ADDR_114, with these differences. Run each as its counterpart and record the counterpart's evidence.

Loop limit: 3 passes per test case.

**Preconditions.** A person present who holds an ABHA number and the mobile linked to it.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_201 | `screen` | As PHR_ADDR_101 | As PHR_ADDR_101 |
| PHR_ADDR_202 | `screen` | ABHA number can be chosen, and Continue leads to the number entry | The number entry screen. Evidence: the screen |
| PHR_ADDR_203 | `sandbox` | The 14 digit number is sent for an OTP. `p1_post_v3_phr_app_enrollment_request_otp` with `loginHint` `abha-number` and either `scope` `["abha-login","mobile-verify"]` with `otpSystem` `abdm`, or `scope` `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar` | 200 with `txnId` and a `message` naming the masked mobile. A malformed number returns 400 with `code` `ABDM-1006: ` and `message` `Invalid ABHA Number` |
| PHR_ADDR_204 | `sandbox`, `human` | The OTP verifies the number, by Aadhaar OTP and by mobile OTP | `p1_post_v3_phr_app_enrollment_verify` with the matching scope returns 200 with `authResult` `success`. A wrong OTP returns 400 with `code` `ABDM-1006: ` and `message` `Invalid OTP Request`. Run both OTP systems; each needs the person |
| PHR_ADDR_205 | `screen`, `sandbox` | As PHR_ADDR_105, for each OTP system | As PHR_ADDR_105 |
| PHR_ADDR_206 | `sandbox`, `screen` | Every address on the ABHA number is listed | As PHR_ADDR_106, from the PHR_ADDR_204 response |
| PHR_ADDR_207 | `screen` | As PHR_ADDR_107 | As PHR_ADDR_107 |
| PHR_ADDR_208 | `sandbox`, `screen` | The form is filled from the ABHA record, not typed | The PHR_ADDR_204 response carries `accounts`. The form shows `firstName`, `middleName`, `lastName`, `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `gender`, `mobile`, `address`, `stateName`, `districtName` and `pincode` from it, with nothing typed. `hiecm.concept.m1-confirm-the-filled-form` |
| PHR_ADDR_209 | `screen` | As PHR_ADDR_109 | As PHR_ADDR_109 |
| PHR_ADDR_210 | `sandbox`, `screen` | As PHR_ADDR_110. The sheet prints a minimum length of 4 for this group | As PHR_ADDR_110 |
| PHR_ADDR_211 | `sandbox`, `screen`, optional | As PHR_ADDR_111 | As PHR_ADDR_111 |
| PHR_ADDR_212 | `sandbox`, `human` | As PHR_ADDR_112 | As PHR_ADDR_112 |
| PHR_ADDR_213 | `screen` | The congratulations screen names the created address, and Login works | The screen. The sheet's text reads `name@abdm`; in sandbox the suffix is `@sbx`. The login is the PHR_ADDR_112 exit condition |
| PHR_ADDR_214 | `screen`, `human` | As PHR_ADDR_114 | As PHR_ADDR_114 |

### PHR_ADDR_301 to PHR_ADDR_316: create an ABHA number with KYC inside the PHR app

Mandatory unless the sheet leaves a case unmarked. Creating an ABHA number is an M1 enrolment. No P specification publishes the Aadhaar OTP, the enrolment or the card call, so the cases that need them are `not-run` here, each with its M1 counterpart named. Run those counterparts with `hiecm-m1-test` and quote both names in the report.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_301 | `screen` | A "Create Now" entry for an ABHA number exists | The screen with the entry |
| PHR_ADDR_302 | `screen` | The creation methods are offered, Aadhaar among them | The method screen. ABDM's M1 specification publishes no enrolment by driving licence |
| PHR_ADDR_303 | not-run | The Aadhaar number is sent for an OTP | `not-run`: needs `m1_post_v3_enrollment_request_otp_aadhaar_otp`, which no P specification publishes. M1 counterpart: CRT_ABHA_105 |
| PHR_ADDR_304 | not-run | The Aadhaar OTP and the communication mobile are verified | `not-run`: needs `m1_post_v3_enrollment_enrol_byaadhaar_otp`. M1 counterpart: CRT_ABHA_107 |
| PHR_ADDR_305 | not-run | Resend Aadhaar OTP after 60 seconds | `not-run`: the resend repeats the M1 OTP call. M1 counterpart: CRT_ABHA_106 |
| PHR_ADDR_306 | `screen` | Photo, name, date of birth, gender, mobile, address, state, district, pin code, ABHA number and existing addresses are filled from the record | The filled screen. For a person new to ABHA, the address field is hidden or shows N/A |
| PHR_ADDR_307 | `screen` | Tapping the existing ABHA address control shows the addresses already held | The screen after the tap |
| PHR_ADDR_308 | not-run | The ABHA number card is generated and downloads | `not-run`: needs `m1_get_v3_profile_account_abha_card`. M1 counterpart: CRT_ABHA_114 |
| PHR_ADDR_309 | not-run | Second flow: the Aadhaar number is entered for a person whose communication mobile differs | `not-run`: as PHR_ADDR_303. M1 counterpart: CRT_ABHA_105 |
| PHR_ADDR_310 | not-run | The Aadhaar OTP and a second OTP on the other mobile are verified | `not-run`: needs `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb`. M1 counterpart: CRT_ABHA_109 |
| PHR_ADDR_311 | not-run | Resend Aadhaar OTP after 60 seconds, second flow | `not-run`: as PHR_ADDR_305 |
| PHR_ADDR_312 | `screen` | As PHR_ADDR_306, second flow | As PHR_ADDR_306 |
| PHR_ADDR_313 | `screen` | "Still want to create a new ABHA address?" leads to address creation | The screen after the tap |
| PHR_ADDR_314 | not-run | An address is created for the new ABHA number under the address policy | `not-run`: inside this flow the address is created on the M1 transaction with `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp`. M1 counterpart: CRT_ABHA_112. If your app instead creates it through the ABHA number route, record the PHR_ADDR_210 evidence here |
| PHR_ADDR_315 | not-run, optional | Addresses are suggested and a taken one is refused | `not-run`: as PHR_ADDR_314, with `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`. If created through the ABHA number route, record the PHR_ADDR_211 evidence |
| PHR_ADDR_316 | not-run | The ABHA number card downloads, with every field from the Aadhaar KYC | `not-run`: as PHR_ADDR_308 |

### PHR_ADDR_402 to PHR_ADDR_405: log in with a mobile number

Mandatory. The sheet numbers this group from 4.2.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_402 | `sandbox` | The mobile linked with an address is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-address-login","mobile-verify"]`, `loginHint` `mobile-number`, `otpSystem` `abdm` | 200 with `txnId` and `message` naming the masked mobile |
| PHR_ADDR_403 | `sandbox`, `human` | The OTP logs in. `p1_post_v3_phr_app_login_verify` with the same scope | The right OTP returns 200 with `authResult` `success` and `users` holding at least one entry. A wrong OTP returns 200 with `authResult` `failed` and `message` `Entered OTP is incorrect. Kindly re-enter valid OTP.`, and the screen says so and allows a retry |
| PHR_ADDR_404 | `screen`, `sandbox` | As PHR_ADDR_105, on the login OTP | A second `p1_post_v3_phr_app_login_request_otp` 200 at least 60 seconds after the first, and PHR_ADDR_403 then passes |
| PHR_ADDR_405 | `sandbox`, `screen` | Every address on the mobile is listed, and the chosen one logs in | The screen lists every entry in `users`. `p1_post_v3_phr_app_login_verify_user` with the chosen `abhaAddress`, the `txnId` and the verify's token in `T-token` returns 200 with `token` present |

### PHR_ADDR_501 to PHR_ADDR_503: log in with an email address, optional

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_501 | not-run, optional | Email OTP login | `not-run`: the P1 specification publishes no email `loginHint` for login, only an email verification link |
| PHR_ADDR_502 | not-run, optional | Resend email OTP after 60 seconds | `not-run`: as PHR_ADDR_501 |
| PHR_ADDR_503 | not-run, optional | Every address on the email is listed | `not-run`: as PHR_ADDR_501 |

### PHR_ADDR_601 to PHR_ADDR_604: log in with an easy to remember ABHA address

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_601 | `sandbox`, `screen` | The address is looked up and only its methods are offered. `p1_post_v3_phr_app_login_search` with `abhaAddress` | 200 with `abhaAddress` and `authMethods`, such as `["MOBILE_OTP","PASSWORD","EMAIL_OTP"]`. The screen offers those methods and no others. An unknown address returns 400 with `code` `ABDM-1211` and `message` `User not found.`, and the screen says so |
| PHR_ADDR_602 | `sandbox`, `human` | Login by password | As PHR_ADDR_112: 200 with `message` `Password verified successfully` and `authResult` `success`. A wrong password returns 200 with `authResult` `failed` and `message` `Password did not match, please try again` |
| PHR_ADDR_603 | `sandbox`, `human` | Login by OTP as the address's methods allow | `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-address-login","mobile-verify"]` and `loginHint` `abha-address` returns 200 with `txnId`. `p1_post_v3_phr_app_login_verify` then returns 200 with `authResult` `success`. The P1 specification publishes no email OTP or Aadhaar OTP login on an address; record which methods ran |
| PHR_ADDR_604 | `screen`, `sandbox` | As PHR_ADDR_105, on the address OTP | As PHR_ADDR_404 |

### PHR_ADDR_701 to PHR_ADDR_703: log in with the default ABHA address

Mandatory. The default address is the 14 digit number with the suffix.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_701 | `sandbox` | The default address is looked up | As PHR_ADDR_601, with `healthIdNumber` present in the 200 |
| PHR_ADDR_702 | `sandbox`, `human` | Login by OTP | As PHR_ADDR_603. An Aadhaar OTP on an address is not in the P1 specification; to log in by Aadhaar OTP, the person uses the number, PHR_ADDR_802 |
| PHR_ADDR_703 | `screen`, `sandbox` | As PHR_ADDR_105 | As PHR_ADDR_404 |

### PHR_ADDR_801 to PHR_ADDR_803: log in with an ABHA number

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_801 | `sandbox` | The 14 digit number is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `loginHint` `abha-number` and `scope` `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar`, or `["abha-login","mobile-verify"]` with `otpSystem` `abdm` | 200 with `txnId`. The Aadhaar route's `message` names the Aadhaar registered mobile. A malformed number returns 400 with `code` `ABDM-1006: ` and `message` `Invalid ABHA Number` |
| PHR_ADDR_802 | `sandbox`, `human` | The OTP logs in | `p1_post_v3_phr_app_login_verify` returns 200 with `authResult` `success` and `users`, then PHR_ADDR_405's verify user call returns 200 with `token`. A wrong mobile OTP returns 200 with `authResult` `failed` and `message` `Please enter a valid OTP. Entered OTP is either expired or incorrect.` |
| PHR_ADDR_803 | `screen`, `sandbox` | As PHR_ADDR_105 | As PHR_ADDR_404 |

### PHR_ADDR_901 to PHR_ADDR_903: log in with an Aadhaar number

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_901 | `sandbox` | The 12 digit Aadhaar number is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-login","aadhaar-verify","aadhaar-otp-verify"]`, `loginHint` `aadhaar`, `otpSystem` `aadhaar` | 200 with `txnId` and a `message` naming the Aadhaar registered mobile |
| PHR_ADDR_902 | `sandbox`, `human` | The Aadhaar OTP logs in | `p1_post_v3_phr_app_login_verify` with the same scope returns 200 with `authResult` `success` and `users` |
| PHR_ADDR_903 | `screen`, `sandbox` | After the OTP, the terms and conditions are shown with every address on the Aadhaar | The screen lists every entry in the PHR_ADDR_902 `users`. The sheet's check for this row is a resend after 60 seconds; record that as PHR_ADDR_404 evidence on the Aadhaar OTP |

### PHR_ADDR_1001 to PHR_ADDR_1005: reset the password

Mandatory. The password change call is published in the P2 specification.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_ADDR_1001 | `sandbox` | The person is logged in by any mode | One login 200 with `authResult` `success` from PHR_ADDR_403, 6.2, 6.3, 7.2, 8.2 or 9.2, with its REQUEST-ID |
| PHR_ADDR_1002 | `screen` | Reset password sits in the settings menu | The menu |
| PHR_ADDR_1003 | `screen` | The new password follows the password policy | A password that breaks the policy is refused in the form, with the rule shown |
| PHR_ADDR_1004 | `screen` | The password is created only after the same value is confirmed | A different confirmation is refused |
| PHR_ADDR_1005 | `sandbox`, `human` | "Your password is successfully changed" is shown, and the new password logs in | `p2_post_v3_phr_app_login_profile_verify` with `scope` `["abha-address-profile","password-verify"]`, `authMethods` `["password"]` and `X-token` returns 200 with `message` `Password updated successfully` and `authResult` `success`. Then PHR_ADDR_602 with the new password returns 200 with `authResult` `success`. A blank password returns 400 with `code` `ABDM-1006: ` and `message` `Invalid Password` |

The password policy the sheet prints for PHR_ADDR_112, PHR_ADDR_212 and PHR_ADDR_1003:

```text
8 characters or longer
at least one A-Z, one a-z, one 0-9 and one symbol
no space
no more than 2 consecutive characters or keyboard keys
```

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case names to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no OTPs, no passwords, no mobile or Aadhaar numbers, no client secret. The run log and the manifest are written on every run. The manifest is not the report. Every run ends with a PDF, written as the section "Writing the test report" sets out: run its `check`; when it exits 0, build the report; when it does not, build the draft with `--draft`. Never end a run without one, and say where it is in the three lines below.

```json
{
  "skill": "abdm-p1",
  "set": "PHR mobile app test cases, NHA, ABHA address creation tab",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "PHR_ADDR_104", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["7c02...", "9a41..."],
     "observed": ["enrollment/verify 400 code=ABDM-1006 Invalid OTP Request", "enrollment/verify 200 authResult=success"]},
    {"id": "PHR_ADDR_109", "outcome": "passed", "evidence": "screen",
     "attachment": "user-information-agreement-2026-10-01.png"},
    {"id": "PHR_ADDR_802", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "OTP arrives on the person's phone; nobody present"},
    {"id": "PHR_ADDR_501", "outcome": "not-run", "reason": "no email loginHint for login in the P1 specification"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
