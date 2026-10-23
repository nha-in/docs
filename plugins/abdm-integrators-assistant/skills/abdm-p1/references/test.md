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
| NHA's PHR test case workbook, if results go into it | The workbook NHA sent you, copied into `abdm-ft/`. It has one tab per PHR milestone and no case ids; the script adds a Test Case ID column with the ids this skill uses. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
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
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. `not needed` when no workbook was given |
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

The report is a Word document. Every page carries the report title in its
header and `Confidential, page N of M` in its footer. Its parts come in this
order, each from a fixed source, so two reports for the same milestone read
the same way.

| Part | What it holds | Comes from |
|---|---|---|
| Cover | Title, product, organisation, milestone, run type, document id, version, release date, a confidentiality line | `meta.json`, `--run` |
| Contents | A Word contents field over every section and every case id, which Word fills in on opening | The headings below |
| 1. Document control | Document title, id, version, prepared, reviewed, approved and released by, release date; change history; distribution list by name, organisation and role | `meta.json` `document` |
| 2. Executive summary | The run in one paragraph: cases, PASS, FAIL, NA, no result, whether every mandatory case holds, how many took more than one pass | The workbook's counts |
| 3. ABDM details | Entity, product, category, role, entity type, milestone, API version, run type, dates, days, most passes any case took, executed by, recordings | `meta.json`, the workbook |
| 4. Results summary | A counts table, a table by the workbook's Function column, and one row per case with marking, status and iterations; any mandatory case NHA agreed is not run, with the agreement | The workbook, `agreed_not_run` |
| 5. Scope and limitations | Applications and URLs; role, entity type, run type, workbook, tabs, cases; optional cases not passed; the limitation that results hold for the build tested on those dates, and any `limitations` | `meta.json`, the workbook |
| 6. Flow details | For linking and consent flows: the ABHA address used and the HI types created or tested | `meta.json` `flows` |
| 7. Test environment and tools | Browser, Playwright, PHR app, emulator, the model that ran the agent, with versions | `meta.json` `environment` |
| 8. Test team | Name, role and qualifications of each tester, reviewer and approver | `meta.json` `team` |
| 9. Approach and methodology | How the agent ran cases, the three pass limit, how OTPs and consents were given, the run type, REQUEST-IDs, and what PASS, FAIL, NA and no result mean | Fixed text, `--run` |
| 10. Test data | The ABHA numbers and addresses used, masked | `meta.json` `test_data` |
| 11. Evidence | Per case, a heading with its id and title, then one table of test case ID, title, marking, expected result, observed, status, iterations, failure reason with any error code, and request ids; then the response with its code; then each screenshot with a numbered caption naming the case and step | The workbook, `findings`, `--manifest`, the evidence folder |
| 12. Failures and iterations log | Every case not PASS or that took more than one pass, with its failure reason and error code | The workbook |
| 13. Conclusion and sign-off | The result in one paragraph, then a sign-off table for preparer, reviewer and approver with date and signature | The counts, `meta.json` `document` |
| 14. Annexures | Recording links, the completed workbook, the REQUEST-ID manifest, the evidence folder | `meta.json`, the arguments |

The only prose you write is the one line finding per case, in `meta.json`.
The observed value is that finding, else the Remarks value; the response
with its code follows the table. A failure reason is the Remarks value, else the response,
with any `ABDM-` or `MIS-` code, HTTP 4xx or 5xx status or exception named in them. Request
ids come from the run's manifest JSON, the file the test skill writes beside
the run log, given with `--manifest`. A request id that is a UUID is printed as
it is, so a reviewer can look it up in the gateway's record; anything else in
that field is masked like the rest of the report.

What the report never holds: a login, password, client secret, token or OTP,
an unmasked Aadhaar number, ABHA number or mobile, and anyone's email or phone
number. The team and distribution tables take a name, a role and an
organisation only.

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
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`, and any value that holds a token or a credential's label with its value, such as `client secret: ...`. `agreed_not_run` is only for mandatory cases NHA agreed are not run; leave it `{}` otherwise. `flows` is for M2 and M3 linking and consent flows; leave it `[]` for M1. `team` and `distribution` carry no email or phone number.
- For request ids in the report, the run's manifest JSON, which the test skill writes beside the run log at the end of the run. It is optional: without it each case reads `No manifest given`. The script refuses a manifest that holds a credential, as it does `meta.json`.

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
  "team": [{"name": "<TESTER NAME>", "role": "Tester", "qualifications": "<QUALIFICATIONS, OR LEAVE EMPTY>"}],
  "flows": [{"name": "<FLOW, SUCH AS HIP INITIATED LINKING>", "abha_addresses": ["<TEST ABHA ADDRESS>@sbx"], "hi_types": ["<HI TYPE, SUCH AS PRESCRIPTION>"]}],
  "limitations": [],
  "findings": {"CRT_ABHA_101": "The Create ABHA option opens the Aadhaar consent screen."},
  "agreed_not_run": {},
  "recordings": [{"title": "M1 ui run, full trace", "link": "<LINK TO THE RECORDING>"}]
}
```

```python
"""Check that a functional test run may be reported, and write the report.

  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private [--meta meta.json]
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.docx [--manifest RUN.json]

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. A mandatory case NA passes only when meta.json's agreed_not_run names it.
--manifest is the run's manifest of case ids to REQUEST-IDs, printed per case.
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
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Results summary",
            "Scope and limitations", "Flow details", "Test environment and tools", "Test team",
            "Approach and methodology", "Test data", "Evidence", "Failures and iterations log",
            "Conclusion and sign-off", "Annexures"]
# The fixed fields of each case's evidence table, in order.
CASE_FIELDS = ["Test case ID", "Title", "Marking", "Expected result", "Observed", "Status",
               "Iterations", "Failure reason", "Request IDs"]
# A REQUEST-ID is a UUID. Only a UUID is printed as it is; anything else is masked.
UUID = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
# An error code or exception named in a response or remark.
ERROR = re.compile(r"\b(?:ABDM|MIS|HIS|HIU|HIP|CM|PHR|UHI)-\d{3,5}\b|\bHTTP [45]\d{2}\b|\b[A-Z]\w*(?:Exception|Error)\b")


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
        ecol = find(cols, ["expected result"])
        fcol = cols.get("Function")
        kind, label, note, pair = classify(marking, entity)
        rec = {"id": case, "sheet": ws.title, "title": title or case, "marking": marking,
               "kind": kind, "label": label, "note": note, "pair": pair,
               "expected": norm(anchor(ws, row, ecol).value) if ecol else "",
               "function": (norm(anchor(ws, row, fcol).value) if fcol else "") or ws.title}
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


def request_ids(path):
    """The run's manifest: case id to its REQUEST-IDs. Takes {"<id>": [..]}, {"<id>": "<rid>"},
    {"<id>": {"request_ids": [..]}}, the same under "cases", or a list of {"id": .., "request_ids": [..]}."""
    if not path:
        return None
    data = json.loads(Path(path).read_text())
    bad = forbidden(data, "manifest")
    if bad:
        sys.exit("the manifest carries a credential, which never goes in a report: " + ", ".join(bad))
    if isinstance(data, dict) and isinstance(data.get("cases"), (dict, list)):
        data = data["cases"]
    if isinstance(data, list):
        data = {str(x.get("id") or x.get("case") or ""): x for x in data if isinstance(x, dict)}
    out = {}
    for case, ids in (data.items() if isinstance(data, dict) else []):
        if isinstance(ids, dict):
            ids = ids.get("request_ids") or ids.get("requestIds") or ids.get("request_id") or []
        if isinstance(ids, str):
            ids = [ids]
        out[norm(case).replace(" ", "")] = [norm(i) for i in ids if norm(i)]
    return out


def days(start, end):
    try:
        return (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
    except (TypeError, ValueError):
        return ""


def build(path, run, meta, evidence, out, recs, groups, manifest=None):
    from docx import Document
    from docx.enum.text import WD_BREAK
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
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
    label = RUN_NAME[run]
    title = milestone + " " + label + " report"
    rids = request_ids(manifest)
    safe = set()  # text printed unmasked: a list of REQUEST-IDs that are all UUIDs

    def field(paragraph, code, placeholder=""):
        """A Word field, such as PAGE or a TOC, that Word fills in when the document opens."""
        def char(kind):
            r = paragraph.add_run()
            el = OxmlElement("w:fldChar")
            el.set(qn("w:fldCharType"), kind)
            r._r.append(el)
        char("begin")
        r = paragraph.add_run()
        instr = OxmlElement("w:instrText")
        instr.set(qn("xml:space"), "preserve")
        instr.text = " " + code + " "
        r._r.append(instr)
        char("separate")
        paragraph.add_run(placeholder)
        char("end")

    def table(rows, header=None):
        t = doc.add_table(rows=0, cols=len(header or rows[0]))
        t.style = "Table Grid"
        for n, row in enumerate(([header] if header else []) + rows):
            cells = t.add_row().cells
            # A value beside a label naming a secret, such as "OTP used", is never shown.
            secret = len(row) == 2 and not (header and n == 0) and LABEL.search(str(row[0] or ""))
            for c, (cell, text) in enumerate(zip(cells, row)):
                cell.text = "[redacted]" if secret and c == 1 and text else str(text if text is not None else "")
                if (header and n == 0) or (len(row) == 2 and c == 0 and not header):
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.bold = True
            if header and n == 0:
                # The header row repeats on every page the table runs to.
                tr = t.rows[0]._tr.get_or_add_trPr()
                el = OxmlElement("w:tblHeader")
                el.set(qn("w:val"), "true")
                tr.append(el)
        return t

    def heading(text):
        doc.add_heading(text, level=1)

    def page_break():
        doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    def codes(*texts):
        found = []
        for text in texts:
            for c in ERROR.findall(text or ""):
                if c not in found:
                    found.append(c)
        return ", ".join(found)

    n = len(recs)
    passed = sum(1 for r in recs if r["status"] == "PASS")
    failed = sum(1 for r in recs if r["status"] == "FAIL")
    na = sum(1 for r in recs if r["status"] == "NA")
    blank = n - passed - failed - na
    mandatory = sum(1 for r in recs if r["kind"] == "mandatory") + len(groups)
    retried = [r for r in recs if r["iterations"] > 1]
    log = [r for r in recs if r["iterations"] > 1 or r["status"] != "PASS"]
    agreed = [r for r in recs if r.get("agreed")]
    findings = meta.get("findings", {})
    if agreed:
        held = (" All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS, except " +
                str(len(agreed)) + " NA that NHA agreed not to run, listed in the results summary.")
    else:
        held = " All " + str(mandatory) + " mandatory cases that apply to a " + entity + " entity are PASS."

    def reason(r):
        """Why a case failed, or what an earlier pass hit: the remark, else the response, with its codes."""
        if r.get("agreed"):
            return "Agreed not run: " + r["agreed"]
        if r["status"] == "PASS" and r["iterations"] <= 1:
            return "None"
        text = r["remarks"] or r["response"] or "Not recorded"
        if r["status"] == "PASS":
            text = "Passed on pass " + str(r["iterations"]) + ". Earlier passes: " + text
        return text

    def rid_text(r):
        if rids is None:
            return "No manifest given"
        ids = rids.get(r["id"], [])
        if not ids:
            return "None in the manifest"
        text = ", ".join(ids)
        if all(UUID.fullmatch(i) for i in ids):
            safe.add(text)
        return text

    # Page header and footer on every page: the report title; Confidential and page N of M.
    sec.header.paragraphs[0].text = title
    foot = sec.footer.paragraphs[0]
    foot.add_run("Confidential, page ")
    field(foot, "PAGE", "1")
    foot.add_run(" of ")
    field(foot, "NUMPAGES", "1")

    # Cover
    doc.add_heading(title, level=0)
    table([["Product", meta.get("product", "")], ["Organisation", meta.get("organisation", "")],
           ["Milestone", milestone], ["Report type", label + " (run type " + run + ")"],
           ["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
           ["Release date", dm.get("release_date", "")]])
    doc.add_paragraph("Confidential. Aadhaar, ABHA and mobile numbers are masked, and the report "
                      "holds no credential, token or OTP.")
    page_break()

    # Contents: a Word TOC field over the headings below.
    p = doc.add_paragraph()
    p.add_run("Contents").bold = True
    field(doc.add_paragraph(), 'TOC \\o "1-2" \\h \\z \\u',
          "Open in Word and update fields to build the contents.")
    settings = doc.settings.element
    upd = OxmlElement("w:updateFields")
    upd.set(qn("w:val"), "true")
    settings.append(upd)
    page_break()

    # 1. Document control
    heading(SECTIONS[0])
    table([["Document title", title], ["Document id", dm.get("id", "FT-" + milestone)],
           ["Version", dm.get("version", "")], ["Prepared by", dm.get("prepared_by", "")],
           ["Reviewed by", dm.get("reviewed_by", "")], ["Approved by", dm.get("approved_by", "")],
           ["Released by", dm.get("released_by", "")], ["Release date", dm.get("release_date", "")]])
    doc.add_heading("Change history", level=2)
    history = dm.get("change_history", [])
    table([[h.get("version", ""), h.get("date", ""), h.get("by", ""), h.get("change", "")] for h in history]
          or [["", "", "", ""]], header=["Version", "Date", "By", "Change"])
    doc.add_heading("Distribution", level=2)
    dist = dm.get("distribution", [])
    table([[d.get("name", ""), d.get("organisation", ""), d.get("role", "")] if isinstance(d, dict)
           else [str(d), "", ""] for d in dist] or [["", "", ""]], header=["Name", "Organisation", "Role"])

    # 2. Executive summary
    heading(SECTIONS[1])
    doc.add_paragraph(
        "This report records the " + label + " run of " + meta.get("product", "") + " by " +
        meta.get("organisation", "") + " against ABDM " + milestone + ", API version " +
        meta.get("api_version", "V3") + ", from " + dates.get("start", "") + " to " + dates.get("end", "") +
        ". The workbook " + Path(path).name + " holds " + str(n) + " cases. " + str(passed) + " are PASS, " +
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result." + held + " " +
        str(len(retried)) + " cases took more than one pass.")

    # 3. ABDM details
    heading(SECTIONS[2])
    recordings = meta.get("recordings", [])
    table([["Entity name", meta.get("organisation", "")], ["Product name", meta.get("product", "")],
           ["Category", meta.get("category", "")], ["Role", meta.get("role", "")], ["Entity type", entity],
           ["Milestone", milestone], ["API version", meta.get("api_version", "V3")],
           ["Run type", run + ", " + label],
           ["Test execution dates", dates.get("start", "") + " to " + dates.get("end", "")],
           ["Number of days for testing", meta.get("test_days", days(dates.get("start"), dates.get("end")))],
           ["Most passes any case took", max([r["iterations"] for r in recs] or [0])],
           ["Test executed by", meta.get("executed_by", "")],
           ["Recordings", str(len(recordings)) + " listed in the annexures" if recordings else "None"]])

    # 4. Results summary: counts, then by function, then one row per case.
    heading(SECTIONS[3])
    table([["Cases in the workbook", n], ["PASS", passed], ["FAIL", failed], ["NA", na], ["No result", blank],
           ["Mandatory for a " + entity + " entity", mandatory], ["Took more than one pass", len(retried)]],
          header=["Measure", "Count"])
    doc.add_heading("Results by function", level=2)
    functions = []
    for r in recs:
        if r["function"] not in functions:
            functions.append(r["function"])
    rows = []
    for fn in functions:
        these = [r for r in recs if r["function"] == fn]
        rows.append([fn, len(these), sum(1 for r in these if r["status"] == "PASS"),
                     sum(1 for r in these if r["status"] == "FAIL"), sum(1 for r in these if r["status"] == "NA"),
                     sum(1 for r in these if r["kind"] == "mandatory" and r["status"] != "PASS" and not r.get("agreed"))])
    table(rows, header=["Function", "Cases", "PASS", "FAIL", "NA", "Mandatory not PASS"])
    doc.add_heading("Results by case", level=2)
    table([[r["id"], r["title"], r["label"], (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed")
            else ""), r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])
    if agreed:
        doc.add_heading("Mandatory cases NHA agreed not to run", level=2)
        table([[r["id"], r["title"], r["agreed"]] for r in agreed], header=["Test case ID", "Title", "Agreed by and when"])

    # 5. Scope and limitations
    heading(SECTIONS[4])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    doc.add_paragraph("")
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Role", meta.get("role", "")], ["Entity type", entity], ["Run type", run],
           ["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)], ["Cases", n]])
    skipped = [r for r in recs if r["kind"] == "optional" and r["status"] != "PASS"]
    doc.add_heading("Optional cases not passed", level=2)
    if skipped:
        table([[r["id"], r["title"], r["status"] or "Not recorded"] for r in skipped],
              header=["Test case ID", "Title", "Status"])
    else:
        doc.add_paragraph("Every optional case is PASS.")
    doc.add_heading("Limitations", level=2)
    for line in (["The results hold for the build and configuration tested from " + dates.get("start", "") +
                  " to " + dates.get("end", "") + ". A later change to the code or the configuration can change them."]
                 + [str(x) for x in meta.get("limitations", [])]):
        doc.add_paragraph(line, style="List Bullet")

    # 6. Flow details
    heading(SECTIONS[5])
    flows = meta.get("flows", [])
    if flows:
        table([[f.get("name", ""), ", ".join(f.get("abha_addresses", [])), ", ".join(f.get("hi_types", []))]
               for f in flows if isinstance(f, dict)],
              header=["Flow", "ABHA address used", "HI types created or tested"])
    else:
        doc.add_paragraph("No linking or consent flow in this milestone.")

    # 7. Test environment and tools
    heading(SECTIONS[6])
    env = dict(meta.get("environment", {}))
    names = [("browser", "Browser"), ("browser_version", "Browser version"), ("playwright", "Playwright"),
             ("phr_app", "PHR app"), ("phr_app_version", "PHR app version"), ("emulator", "Emulator"),
             ("model", "Model that ran the agent")]
    rows = [[name, env.pop(key, "Not used")] for key, name in names]
    rows += [[key, val] for key, val in env.items()]
    table(rows, header=["Tool", "Version or value"])

    # 8. Test team
    heading(SECTIONS[7])
    team = meta.get("team", [])
    table([[m.get("name", ""), m.get("role", ""), m.get("qualifications", "")] for m in team if isinstance(m, dict)]
          or [[meta.get("executed_by", ""), "Tester", ""]], header=["Name", "Role", "Qualifications"])

    # 9. Approach and methodology
    heading(SECTIONS[8])
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
        "Every call carried a fresh REQUEST-ID. Where a manifest is given, each case lists its REQUEST-IDs, which "
        "a reviewer can look up in the gateway's own record.",
    ]:
        doc.add_paragraph(line, style="List Bullet")
    table([["PASS", "The case's expected result was observed."],
           ["FAIL", "The expected result was not observed in three passes. The failure reason says what was."],
           ["NA", "The case was not run: optional and not offered, or mandatory with NHA's agreement."],
           ["Not recorded", "The case has no result in the workbook."]], header=["Status", "Meaning"])

    # 10. Test data
    heading(SECTIONS[9])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 11. Evidence: per case a fixed table, the response with its code, then captioned screenshots.
    heading(SECTIONS[10])
    figure = 0
    for r in recs:
        doc.add_heading(r["id"] + ": " + r["title"], level=2)
        observed = findings.get(r["id"]) or r["remarks"] or "None recorded."
        err = codes(r["response"], r["remarks"]) if r["status"] != "PASS" or r["iterations"] > 1 else ""
        values = [r["id"], r["title"], r["label"], r["expected"] or "Not given in the workbook", observed,
                  (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed") else ""),
                  r["iterations"] or "", reason(r) + (" Error code: " + err + "." if err else ""), rid_text(r)]
        table([[k, v] for k, v in zip(CASE_FIELDS, values)], header=["Field", "Value"])
        if r["response"]:
            p = doc.add_paragraph()
            p.add_run("Response with code: ").bold = True
            code = p.add_run(r["response"])
            code.font.name = "Courier New"
            code.font.size = Pt(9)
        if run == "ft":
            continue
        folder = Path(evidence) / r["id"]
        shots = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
        for step, shot in enumerate(shots, 1):
            with Image.open(shot) as im:
                w, h = im.size
            # Page width, unless that makes a tall phone screenshot overrun the page.
            if h * width > 0.75 * height * w:
                doc.add_picture(str(shot), height=int(0.75 * height))
            else:
                doc.add_picture(str(shot), width=width)
            figure += 1
            doc.add_paragraph("Figure " + str(figure) + ": " + r["id"] + ", step " + str(step) + " (" + shot.name + ")",
                              style="Caption")

    # 12. Failures and iterations log
    heading(SECTIONS[11])
    if log:
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "", reason(r),
                codes(r["response"], r["remarks"]) or "None found"] for r in log],
              header=["Test case ID", "Status", "Iterations", "Failure reason", "Error code"])
    else:
        doc.add_paragraph("No case failed and no case took more than one pass.")

    # 13. Conclusion and sign-off
    heading(SECTIONS[12])
    doc.add_paragraph(
        "In the " + run + " run of " + meta.get("product", "") + " for " + milestone + "," +
        held.replace(" All", " all", 1) + " Of " + str(n) + " cases, " +
        str(passed) + " are PASS, " + str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) +
        " have no result.")
    table([["Prepared by", dm.get("prepared_by", ""), "", ""], ["Reviewed by", dm.get("reviewed_by", ""), "", ""],
           ["Approved by", dm.get("approved_by", ""), "", ""]], header=["Sign-off", "Name", "Date", "Signature"])

    # 14. Annexures
    heading(SECTIONS[13])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recordings]
          or [["", ""]], header=["Recording", "Link"])
    doc.add_paragraph("")
    table([["Completed workbook", Path(path).name],
           ["REQUEST-ID manifest", Path(manifest).name if manifest else "Not given"],
           ["Evidence folder", (str(evidence) if run == "ui" else "Not used: the responses are the evidence")]],
          header=["Annexure", "File"])

    # Mask every run of text the document holds, tables, header and footer included.
    def paragraphs(container):
        for p in container.paragraphs:
            yield p
        for t in container.tables:
            for row in t.rows:
                for cell in row.cells:
                    for p in paragraphs(cell):
                        yield p
    for part in (doc, sec.header, sec.footer):
        for p in paragraphs(part):
            for r in p.runs:
                if r.text and r.text not in safe:
                    masked = mask(r.text)
                    if masked != r.text:
                        r.text = masked

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
    p.add_argument("--manifest")
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
        build(a.workbook, a.run, meta, a.evidence, a.out, recs, groups, a.manifest)


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
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/report-m1.docx
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails. `--manifest` is optional.

4. Open the report in Word or LibreOffice and accept the prompt to update fields. That fills in the contents and the page count. A screenshot that needs a highlight box gets it before it goes in the evidence folder.

5. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

6. With `soffice` on PATH, `build` also writes `report-m1.pdf`. Otherwise it prints that the PDF can be exported from Word or LibreOffice.

### How you know it worked

- `check` exits `0` and its last line reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`.
- `build` prints `wrote abdm-ft/report-m1.docx` and exits `0`.
- The document opens with the cover and the contents, then the fourteen headings from Document control to Annexures, in order. Every page has the report title at the top and `Confidential, page N of M` at the bottom.
- The results summary has one row per case in the workbook. Each case's evidence section starts with its nine row table, then its response, then its screenshots in name order, each captioned `Figure <n>: <case id>, step <k> (<file>)`.
- With `--manifest`, each case's Request IDs row lists the REQUEST-IDs the manifest gives it, or reads `None in the manifest`.
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
| `the manifest carries a credential` | The manifest JSON holds a token, secret or password field or value | Write the manifest as the test skill does, case ids to request ids and nothing else |
| The contents page reads `Open in Word and update fields` | The fields have not been updated since the script wrote them | Open the file in Word or LibreOffice and update fields, then save |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |

From `shared.concept.test-report`.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case names to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no OTPs, no passwords, no mobile or Aadhaar numbers, no client secret. The run log and the manifest are written on every run. The manifest is not the final report: the section "Writing the test report" writes that, once its `check` exits 0.

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
