# HIE-CM p1 test

Walks the ABDM P1 functional test cases, registration and login with an ABHA address, against the PHR app you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P1 case in the PHR app set against your app and the sandbox, one case at a time
- Records, for each case, the sandbox response and REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your PHR app running against the sandbox hosts | Your build on a device or an emulator. The skill drives your app, not the sandbox directly |
| A way to trigger each journey in your app | A screen, an API or a script. Say which at the start |
| A person with a mobile number, for the self declared cases | Present for the run. Every OTP and every password is a human step and the skill stops for it |
| A person who holds an ABHA number with an Aadhaar linked mobile, for the KYC cases | Present for the run. Without one the ABHA number and Aadhaar cases are `needs-human` |
| An ABHA address that already exists, with a password set | For the login and reset password cases |

## Say one of these

- "Walk the P1 test cases against my PHR app and log each one."
- "Run only the login cases, P1 6.1 to P1 9.3."
- "Re-run P1 1.11, the address suggestion case failed yesterday."
- "Write a terminal script that runs the P1 test cases and asks me for each OTP and the password."

## What happens first

One question: which cases. All of them, one group, or a list of case names. Then the preconditions for the first case are checked before anything is sent. Nothing else is asked until a case needs a human.

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
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so.
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
case: P1 1.4   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /abha/api/v3/phr/app/enrollment/verify  REQUEST-ID 6f1c...  HTTP 200
body: {"txnId":"...","message":"OTP Verified Successfully","authResult":"success","users":[...],"tokens":{"token":"<redacted>",...}}
matched: exit condition for P1 1.4
next: P1 1.5
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case name from this skill, such as `P1 1.4`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
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
P1 1.3  POST /abha/api/v3/phr/app/enrollment/request/otp  REQUEST-ID 3b9e...  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 2425, or leave blank if nobody is here:
P1 1.4  wrong OTP  REQUEST-ID 7c02...  HTTP 400  code ABDM-1006  message Invalid OTP Request  matched
P1 1.4  right OTP  REQUEST-ID 9a41...  HTTP 200  authResult success  matched
P1 1.4  passed
```

Nudge: calls with a bad `scope`, a bad `loginHint` or a made up `txnId` test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, ABHA address creation tab. That sheet carries no case ids, so each case here is named by its milestone and row, such as `P1 1.1`. Read the functional testing report against those names. The sections are grouped as the sheet groups them. Every operation id below is in the P1 or P2 specification, which carries the host, the headers and a full request.

### P1 1.1 to 1.14: register an ABHA address with a mobile number, self declared

Mandatory unless marked. This is the group the ABHA number group repeats, so it is written in full and the other states what differs.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. The certificate from `p1_get_v3_phr_app_login_public_certificate`. A person present with the mobile.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 1.1 | `screen` | A Register control starts address creation | The screen after Register offers the creation methods. Evidence: the screen |
| P1 1.2 | `screen` | Mobile Number can be chosen, and Continue leads to the mobile entry | The mobile entry screen after Continue. Evidence: the screen |
| P1 1.3 | `sandbox` | The mobile is sent for an OTP. `p1_post_v3_phr_app_enrollment_request_otp` with `scope` `["abha-address-enroll","mobile-verify"]`, `loginHint` `mobile-number`, `otpSystem` `abdm` | 200 with `txnId` present and a `message` naming the masked mobile, such as `OTP is sent to Mobile number ending with ******2425` |
| P1 1.4 | `sandbox`, `human` | The person enters the OTP. `p1_post_v3_phr_app_enrollment_verify` with the same scope and the `txnId` | Two observations. A wrong OTP returns 400 with `code` `ABDM-1006: ` and `message` `Invalid OTP Request`, and the screen says so. The right OTP returns 200 with `authResult` `success` |
| P1 1.5 | `screen`, `sandbox` | Resend is disabled for 60 seconds after a send, then sends again | A recording or timestamped screens: disabled at send, enabled at 60 seconds. The log holds a second `p1_post_v3_phr_app_enrollment_request_otp` 200 at least 60 seconds after the first, and P1 1.4 then passes on the new OTP |
| P1 1.6 | `sandbox`, `screen` | Every address on the mobile is listed to choose from | The 200 from P1 1.4 carries `users`. The screen lists one row per entry, by `abhaAddress` and `fullName`. Read the array as plural; a screen that shows only the first fails |
| P1 1.7 | `screen` | "Still want to create a new ABHA address" leads to the profile form, with no second OTP | The form after the tap, and no new `request/otp` call in the log |
| P1 1.8 | `screen` | The form marks First Name, Year of birth, Gender, Address, State, District and Pin Code mandatory, and Middle Name, Last Name, Day and Month optional | Continue stays disabled until every mandatory field is filled. Evidence: the form empty and the form filled |
| P1 1.9 | `screen` | The User Information Agreement checkbox is required before Continue, and your app stores that it was ticked | Continue disabled while unticked, and the stored record for this run |
| P1 1.10 | `sandbox`, `screen` | The address follows the address policy and is created | `p1_get_v3_phr_app_enrollment_isexists` for the chosen address returns 200 with body `false`. `p1_post_v3_phr_app_enrollment_enrol` returns 200 with `message` `ABHA Address Created Successfully` and `phrDetails.abhaAddress` equal to the chosen address. Screen check: an address beginning with a digit, or beginning or ending with a dot, is refused in the form before any call. `hiecm.concept.abha-address-policy` |
| P1 1.11 | `sandbox`, `screen`, optional | Addresses are suggested, and a taken address is refused | `p1_post_v3_phr_app_enrollment_suggestion` with the `txnId` and the name returns 200 with `abhaAddressList` holding at least one entry, shown on screen. An address already held makes `p1_post_v3_phr_app_enrollment_enrol` return 400 with `code` `ABDM-9999: ` and `message` `This ABHA Address already exists. Please create with unique ABHA address`, and the screen says the address is taken. Record `not-run` if you do not claim it |
| P1 1.12 | `sandbox`, `human` | The password follows the password policy, travels encrypted in `phrDetails.password`, and logs in | The screen refuses a password that breaks the policy and a confirmation that differs. The person types it. Then `p1_post_v3_phr_app_login_verify` with `scope` `["abha-address-login","password-verify"]` and `authMethods` `["password"]` returns 200 with `message` `Password verified successfully` and `authResult` `success` |
| P1 1.13 | `screen` | The congratulations screen names the new address, and Login leads to the login screen | Evidence: the screen. The login itself is the P1 1.12 exit condition |
| P1 1.14 | `screen`, `human` | On first login the Personal Data Processing Consent Form is shown, and login completes only after I Agree | The form, the home screen after I Agree, and your stored record of the agreement. The person taps I Agree |

The policy the sheet prints for P1 1.10:

```text
minimum length 8
letters, digits and dot (.)
a digit cannot come first
a dot cannot come first or last
```

Nudge: the sheet prints a minimum of 8 here and 4 in P1 2.10 and P1 3.14. Do not make your form stricter than ABDM's own check. Let `isExists` and the enrol call refuse what they refuse, and show their message.

### P1 2.1 to 2.14: register an ABHA address with an ABHA number

Mandatory unless marked. Same as P1 1.1 to 1.14, with these differences. Run each as its counterpart and record the counterpart's evidence.

Loop limit: 3 passes per test case.

**Preconditions.** A person present who holds an ABHA number and the mobile linked to it.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 2.1 | `screen` | As P1 1.1 | As P1 1.1 |
| P1 2.2 | `screen` | ABHA number can be chosen, and Continue leads to the number entry | The number entry screen. Evidence: the screen |
| P1 2.3 | `sandbox` | The 14 digit number is sent for an OTP. `p1_post_v3_phr_app_enrollment_request_otp` with `loginHint` `abha-number` and either `scope` `["abha-login","mobile-verify"]` with `otpSystem` `abdm`, or `scope` `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar` | 200 with `txnId` and a `message` naming the masked mobile. A malformed number returns 400 with `code` `ABDM-1006: ` and `message` `Invalid ABHA Number` |
| P1 2.4 | `sandbox`, `human` | The OTP verifies the number, by Aadhaar OTP and by mobile OTP | `p1_post_v3_phr_app_enrollment_verify` with the matching scope returns 200 with `authResult` `success`. A wrong OTP returns 400 with `code` `ABDM-1006: ` and `message` `Invalid OTP Request`. Run both OTP systems; each needs the person |
| P1 2.5 | `screen`, `sandbox` | As P1 1.5, for each OTP system | As P1 1.5 |
| P1 2.6 | `sandbox`, `screen` | Every address on the ABHA number is listed | As P1 1.6, from the P1 2.4 response |
| P1 2.7 | `screen` | As P1 1.7 | As P1 1.7 |
| P1 2.8 | `sandbox`, `screen` | The form is filled from the ABHA record, not typed | The P1 2.4 response carries `accounts`. The form shows `firstName`, `middleName`, `lastName`, `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `gender`, `mobile`, `address`, `stateName`, `districtName` and `pincode` from it, with nothing typed. `hiecm.concept.m1-confirm-the-filled-form` |
| P1 2.9 | `screen` | As P1 1.9 | As P1 1.9 |
| P1 2.10 | `sandbox`, `screen` | As P1 1.10. The sheet prints a minimum length of 4 for this group | As P1 1.10 |
| P1 2.11 | `sandbox`, `screen`, optional | As P1 1.11 | As P1 1.11 |
| P1 2.12 | `sandbox`, `human` | As P1 1.12 | As P1 1.12 |
| P1 2.13 | `screen` | The congratulations screen names the created address, and Login works | The screen. The sheet's text reads `name@abdm`; in sandbox the suffix is `@sbx`. The login is the P1 1.12 exit condition |
| P1 2.14 | `screen`, `human` | As P1 1.14 | As P1 1.14 |

### P1 3.1 to 3.16: create an ABHA number with KYC inside the PHR app

Mandatory unless the sheet leaves a case unmarked. Creating an ABHA number is an M1 enrolment. No P specification publishes the Aadhaar OTP, the enrolment or the card call, so the cases that need them are `not-run` here, each with its M1 counterpart named. Run those counterparts with `hiecm-m1-test` and quote both names in the report.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 3.1 | `screen` | A "Create Now" entry for an ABHA number exists | The screen with the entry |
| P1 3.2 | `screen` | The creation methods are offered, Aadhaar among them | The method screen. ABDM's M1 specification publishes no enrolment by driving licence |
| P1 3.3 | not-run | The Aadhaar number is sent for an OTP | `not-run`: needs `m1_post_v3_enrollment_request_otp_aadhaar_otp`, which no P specification publishes. M1 counterpart: CRT_ABHA_105 |
| P1 3.4 | not-run | The Aadhaar OTP and the communication mobile are verified | `not-run`: needs `m1_post_v3_enrollment_enrol_byaadhaar_otp`. M1 counterpart: CRT_ABHA_107 |
| P1 3.5 | not-run | Resend Aadhaar OTP after 60 seconds | `not-run`: the resend repeats the M1 OTP call. M1 counterpart: CRT_ABHA_106 |
| P1 3.6 | `screen` | Photo, name, date of birth, gender, mobile, address, state, district, pin code, ABHA number and existing addresses are filled from the record | The filled screen. For a person new to ABHA, the address field is hidden or shows N/A |
| P1 3.7 | `screen` | Tapping the existing ABHA address control shows the addresses already held | The screen after the tap |
| P1 3.8 | not-run | The ABHA number card is generated and downloads | `not-run`: needs `m1_get_v3_profile_account_abha_card`. M1 counterpart: CRT_ABHA_114 |
| P1 3.9 | not-run | Second flow: the Aadhaar number is entered for a person whose communication mobile differs | `not-run`: as P1 3.3. M1 counterpart: CRT_ABHA_105 |
| P1 3.10 | not-run | The Aadhaar OTP and a second OTP on the other mobile are verified | `not-run`: needs `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb`. M1 counterpart: CRT_ABHA_109 |
| P1 3.11 | not-run | Resend Aadhaar OTP after 60 seconds, second flow | `not-run`: as P1 3.5 |
| P1 3.12 | `screen` | As P1 3.6, second flow | As P1 3.6 |
| P1 3.13 | `screen` | "Still want to create a new ABHA address?" leads to address creation | The screen after the tap |
| P1 3.14 | not-run | An address is created for the new ABHA number under the address policy | `not-run`: inside this flow the address is created on the M1 transaction with `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp`. M1 counterpart: CRT_ABHA_112. If your app instead creates it through the ABHA number route, record the P1 2.10 evidence here |
| P1 3.15 | not-run, optional | Addresses are suggested and a taken one is refused | `not-run`: as P1 3.14, with `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`. If created through the ABHA number route, record the P1 2.11 evidence |
| P1 3.16 | not-run | The ABHA number card downloads, with every field from the Aadhaar KYC | `not-run`: as P1 3.8 |

### P1 4.2 to 4.5: log in with a mobile number

Mandatory. The sheet numbers this group from 4.2.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 4.2 | `sandbox` | The mobile linked with an address is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-address-login","mobile-verify"]`, `loginHint` `mobile-number`, `otpSystem` `abdm` | 200 with `txnId` and `message` naming the masked mobile |
| P1 4.3 | `sandbox`, `human` | The OTP logs in. `p1_post_v3_phr_app_login_verify` with the same scope | The right OTP returns 200 with `authResult` `success` and `users` holding at least one entry. A wrong OTP returns 200 with `authResult` `failed` and `message` `Entered OTP is incorrect. Kindly re-enter valid OTP.`, and the screen says so and allows a retry |
| P1 4.4 | `screen`, `sandbox` | As P1 1.5, on the login OTP | A second `p1_post_v3_phr_app_login_request_otp` 200 at least 60 seconds after the first, and P1 4.3 then passes |
| P1 4.5 | `sandbox`, `screen` | Every address on the mobile is listed, and the chosen one logs in | The screen lists every entry in `users`. `p1_post_v3_phr_app_login_verify_user` with the chosen `abhaAddress`, the `txnId` and the verify's token in `T-token` returns 200 with `token` present |

### P1 5.1 to 5.3: log in with an email address, optional

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 5.1 | not-run, optional | Email OTP login | `not-run`: the P1 specification publishes no email `loginHint` for login, only an email verification link |
| P1 5.2 | not-run, optional | Resend email OTP after 60 seconds | `not-run`: as P1 5.1 |
| P1 5.3 | not-run, optional | Every address on the email is listed | `not-run`: as P1 5.1 |

### P1 6.1 to 6.4: log in with an easy to remember ABHA address

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 6.1 | `sandbox`, `screen` | The address is looked up and only its methods are offered. `p1_post_v3_phr_app_login_search` with `abhaAddress` | 200 with `abhaAddress` and `authMethods`, such as `["MOBILE_OTP","PASSWORD","EMAIL_OTP"]`. The screen offers those methods and no others. An unknown address returns 400 with `code` `ABDM-1211` and `message` `User not found.`, and the screen says so |
| P1 6.2 | `sandbox`, `human` | Login by password | As P1 1.12: 200 with `message` `Password verified successfully` and `authResult` `success`. A wrong password returns 200 with `authResult` `failed` and `message` `Password did not match, please try again` |
| P1 6.3 | `sandbox`, `human` | Login by OTP as the address's methods allow | `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-address-login","mobile-verify"]` and `loginHint` `abha-address` returns 200 with `txnId`. `p1_post_v3_phr_app_login_verify` then returns 200 with `authResult` `success`. The P1 specification publishes no email OTP or Aadhaar OTP login on an address; record which methods ran |
| P1 6.4 | `screen`, `sandbox` | As P1 1.5, on the address OTP | As P1 4.4 |

### P1 7.1 to 7.3: log in with the default ABHA address

Mandatory. The default address is the 14 digit number with the suffix.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 7.1 | `sandbox` | The default address is looked up | As P1 6.1, with `healthIdNumber` present in the 200 |
| P1 7.2 | `sandbox`, `human` | Login by OTP | As P1 6.3. An Aadhaar OTP on an address is not in the P1 specification; to log in by Aadhaar OTP, the person uses the number, P1 8.2 |
| P1 7.3 | `screen`, `sandbox` | As P1 1.5 | As P1 4.4 |

### P1 8.1 to 8.3: log in with an ABHA number

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 8.1 | `sandbox` | The 14 digit number is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `loginHint` `abha-number` and `scope` `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar`, or `["abha-login","mobile-verify"]` with `otpSystem` `abdm` | 200 with `txnId`. The Aadhaar route's `message` names the Aadhaar registered mobile. A malformed number returns 400 with `code` `ABDM-1006: ` and `message` `Invalid ABHA Number` |
| P1 8.2 | `sandbox`, `human` | The OTP logs in | `p1_post_v3_phr_app_login_verify` returns 200 with `authResult` `success` and `users`, then P1 4.5's verify user call returns 200 with `token`. A wrong mobile OTP returns 200 with `authResult` `failed` and `message` `Please enter a valid OTP. Entered OTP is either expired or incorrect.` |
| P1 8.3 | `screen`, `sandbox` | As P1 1.5 | As P1 4.4 |

### P1 9.1 to 9.3: log in with an Aadhaar number

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 9.1 | `sandbox` | The 12 digit Aadhaar number is sent for an OTP. `p1_post_v3_phr_app_login_request_otp` with `scope` `["abha-login","aadhaar-verify","aadhaar-otp-verify"]`, `loginHint` `aadhaar`, `otpSystem` `aadhaar` | 200 with `txnId` and a `message` naming the Aadhaar registered mobile |
| P1 9.2 | `sandbox`, `human` | The Aadhaar OTP logs in | `p1_post_v3_phr_app_login_verify` with the same scope returns 200 with `authResult` `success` and `users` |
| P1 9.3 | `screen`, `sandbox` | After the OTP, the terms and conditions are shown with every address on the Aadhaar | The screen lists every entry in the P1 9.2 `users`. The sheet's check for this row is a resend after 60 seconds; record that as P1 4.4 evidence on the Aadhaar OTP |

### P1 10.1 to 10.5: reset the password

Mandatory. The password change call is published in the P2 specification.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P1 10.1 | `sandbox` | The person is logged in by any mode | One login 200 with `authResult` `success` from P1 4.3, 6.2, 6.3, 7.2, 8.2 or 9.2, with its REQUEST-ID |
| P1 10.2 | `screen` | Reset password sits in the settings menu | The menu |
| P1 10.3 | `screen` | The new password follows the password policy | A password that breaks the policy is refused in the form, with the rule shown |
| P1 10.4 | `screen` | The password is created only after the same value is confirmed | A different confirmation is refused |
| P1 10.5 | `sandbox`, `human` | "Your password is successfully changed" is shown, and the new password logs in | `p2_post_v3_phr_app_login_profile_verify` with `scope` `["abha-address-profile","password-verify"]`, `authMethods` `["password"]` and `X-token` returns 200 with `message` `Password updated successfully` and `authResult` `success`. Then P1 6.2 with the new password returns 200 with `authResult` `success`. A blank password returns 400 with `code` `ABDM-1006: ` and `message` `Invalid Password` |

The password policy the sheet prints for P1 1.12, P1 2.12 and P1 10.3:

```text
8 characters or longer
at least one A-Z, one a-z, one 0-9 and one symbol
no space
no more than 2 consecutive characters or keyboard keys
```

## When the last case is recorded

Write the manifest. It is the whole report. Case names to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no OTPs, no passwords, no mobile or Aadhaar numbers, no client secret.

```json
{
  "skill": "abdm-p1",
  "set": "PHR mobile app test cases, NHA, ABHA address creation tab",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "P1 1.4", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["7c02...", "9a41..."],
     "observed": ["enrollment/verify 400 code=ABDM-1006 Invalid OTP Request", "enrollment/verify 200 authResult=success"]},
    {"id": "P1 1.9", "outcome": "passed", "evidence": "screen",
     "attachment": "user-information-agreement-2026-10-01.png"},
    {"id": "P1 8.2", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "OTP arrives on the person's phone; nobody present"},
    {"id": "P1 5.1", "outcome": "not-run", "reason": "no email loginHint for login in the P1 specification"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
