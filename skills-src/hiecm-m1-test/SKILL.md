---
name: hiecm-m1-test
description: "Use when walking the ABDM M1 functional test cases (ABHA creation and verification) against an integrator's own system and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, and writes NHA's workbook, the manifest of request ids a reviewer checks against the gateway, and the final test report."
---
# HIE-CM m1 test

Walks the ABDM M1 functional test cases, ABHA creation and verification, against the system you built and the sandbox. Each case ends in one of five recorded outcomes, never in an opinion.

## What this skill does

- Runs every M1 test case in the ABHA creation, verification, scan and share set, as revised on 21 October 2026, against your system and the sandbox, one case at a time
- Records, for each case, the sandbox response and REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case ids to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your system running against the sandbox hosts | Your deployment or a local build. The skill drives your system, not the sandbox directly |
| A way to trigger each journey in your system | A screen, an API or a script. Say which at the start |
| A person with an Aadhaar linked mobile, for OTP cases | Present at the desk for the run. Every OTP is a human step and the skill stops for it |
| An Aadhaar that holds no ABHA, for the full ABHA creation journey | The tester. Say this before the run: the creation cases need an Aadhaar with no ABHA on it. An existing ABHA can be deleted on the ABHA sandbox portal, https://abhasbx.abdm.gov.in/abha/v3, to free that Aadhaar, as NHA recommends. A tester who keeps the existing ABHA still runs most creation cases, as "An existing ABHA is not a stop" below sets out |
| A fingerprint or face device, for the biometric cases | Only if you claim those cases. A claimed case with no device present is recorded `needs-human`, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run |
| A public callback URL and a facility QR code for each of two counters, for SHARE_PATIENT_PROFILE_701 and 702 | Your deployment, registered with the bridge. The profile share arrives there |
| Whether you are a government or a private integrator | The set marks some cases mandatory for one and optional for the other |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's test case workbook for this module, required: the results and the report are built from it | It ships with this skill, in its `workbook/` folder (on the docs site, `/skills/abdm-m1/workbook/`): copy it into `abdm-ft/` before the run, and never use another copy, so the sheet matches the cases below. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your application's URL | Your deployment, reachable from the browser on this machine |
| For a `ui` run: a tester login for your application | A test account in your application, read from an environment variable you name or typed at a hidden prompt. It is never written to the run log, the evidence or the workbook |
| For a `ui` run: Node 18 or later, the Playwright MCP server and a browser | The integrators plugin starts `@playwright/mcp@0.0.83`, which the first start downloads with `npx`. Install the browser the server reports missing, chrome or chromium. `/abdm-test-setup` lists what is missing. Without the plugin, the section "Running a case as a UI test" lists each install command |

## Say one of these

- "Walk the M1 test cases against my sandbox and log each one."
- "Run only the ABHA verification cases, VRFY_ABHA_101 to 405."
- "Re-run CRT_ABHA_112, the address suggestion case failed yesterday."
- "Write a terminal script that runs the M1 test cases and asks me for the Aadhaar number and each OTP."
- "Run the M1 test cases as UI tests against my app and fill NHA's workbook."

## What happens first

The first question is the run type. `ft` is the API functional test: your system against the sandbox, judged on calls and callbacks. `ui` is the UI test: an agent drives your application's screens, as the section "Running a case as a UI test" below sets out. `all` runs `ft` for the chosen cases, then `ui`. The second question: which cases. All of them, one function group, or a list of ids. Then the preconditions for the first case are checked before anything is sent. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

**Readiness check.** The run does not start until every row of "What it needs from you" that the chosen cases use is confirmed. Ask for each one in the terminal, one at a time. Record each in the run log's header as `ready`, `missing` or `not needed`, never the value itself.

| Row | Ready when |
|---|---|
| Credentials | They are set in the environment or typed at a hidden prompt, and the first session call the cases use returns its token |
| Your system | It answers on the address you gave, against the sandbox hosts |
| People and devices | Each is named for this run: who receives the OTPs, who approves in the PHR app, which device scans |
| Entity type and claimed capabilities | Answered, because they decide which cases are mandatory |
| An Aadhaar with no ABHA | The tester was told, before the first case, that the full creation journey needs an Aadhaar that holds no ABHA, and that an existing ABHA can be deleted on https://abhasbx.abdm.gov.in/abha/v3 to free it, as NHA recommends. Record `ready` when they have one, or `existing ABHA kept` when they keep theirs |
| The run log | Its folder exists and can be written: `abdm-ft/` in your repository unless you name another |
| The workbook | `python3 abdm-ft/abdm_workbook.py cases <workbook>` lists the case ids, and every case chosen is among them. Required: without it there are no results in the sheet and no report, so ask for it before the first case |
| UI readiness, for a `ui` or `all` run | Every row of the readiness check in "Running a case as a UI test" is `ready`: Node, the Playwright tools, a browser, the application URL and the tester login. `not needed` for an `ft` run |

A `missing` row that a mandatory case needs stops the run before the first call. Say what is missing and ask the one question that would fix it.

**Ask for every input the cases need.** In the readiness check, ask for each input a chosen case needs beyond the rows above, such as a second mobile, a mobile that holds no ABHA, an Aadhaar that holds no ABHA, a second ABHA address, a fingerprint or face device, the ABHA app, a counter QR code or a public callback URL. Record each as `ready` or `missing`. Ask again for a `missing` one when the run reaches the case that needs it. Only when the tester says they cannot provide it in this run is that case `needs-human`, with what was asked in Remarks.

**The case plan.** Before the first case, run `python3 abdm-ft/abdm_report.py plan <workbook> --run <ft or ui> --entity <government or private>`, as "Writing the test report" sets out. It lists every case in the workbook, in sheet order, with its group, what it is for your entity type and its status so far. The run log's rows are made from that list. No case may be dropped: a case that cannot run is `needs-human` with its need named, after asking, or `not-run` with the rule that makes it not apply. Before the tester leaves, run `python3 abdm-ft/abdm_workbook.py open <workbook> --run <ft or ui> --entity <government or private>` and read the list out, including every `NA on a mandatory case` line, so every case still waiting for them is done, or asked about, while they are there.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The five outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim | The response was not pasted. A pass with no output is a fail |
| `conditional-pass` | The Expected Result is met and observed as for `passed`, with a gap beside it, such as a point in the sheet's Suggestions for the Functional Tester column not met. Remarks name the condition | The Expected Result is not met. That is `failed`. A Suggestions gap alone never makes a FAIL |
| `failed` | Three passes and the exit condition was not observed, or the sandbox returned the refusal the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached an OTP, a biometric scan, an operator's document check, or a person or device that was not there | Ever as a substitute for a fail you can see, or before the tester was asked for what the case needs and said they cannot provide it in this run |
| `not-run` | The case does not apply to your entity, you do not claim the optional capability, or ABDM publishes no operation for it | To skip a mandatory case that applies to you, or for a case waiting on a person, a device or test data. That is `needs-human` |

### Judging a case

- The sheet's Expected Result column decides the outcome. Its Steps To Be Executed say what to do. Its Suggestions for the Functional Tester column is guidance: a gap against it, with the Expected Result met, is a `conditional-pass`, never on its own a FAIL.
- A message that means the same as the one the sheet quotes is a PASS. Quote both in the run record.
- A case with several steps records a result for each step, in its result's `steps`. The case is `failed` only when a step's expected result fails. When every step run passes and a step could not be run, the case is `needs-human`, naming that step and what it needs.
- A case waiting on a person, a device or test data is `needs-human` only after the tester was asked for it, at the readiness check and again at the case, and said they cannot provide it in this run. Remarks name what was asked. Such a case is never `not-run` and never blank. `not-run` is only for a case that does not apply: the entity type, an optional capability you do not offer, or no published operation for it.

### The three kinds of evidence

Every case names one of these. It decides what the manifest carries.

- **sandbox.** A call the gateway sees. Evidence is the HTTP status, the body and the REQUEST-ID, pasted. The exit condition is a literal in the body. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your system shows or stores, which no call proves. Evidence is one screenshot or a short recording and the design rule it satisfies. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
- **human.** A step only a person can do. Evidence is the observation just before it and the outcome `needs-human` when nobody was there after two asks.

### Rules that hold for every case

- Search before create. Every identifier goes to the login path first, and only ABDM-1114 on the verify says nobody holds an account. Creating on any other answer gives the patient two numbers, which nothing merges. `hiecm.concept.m1-avoiding-duplicate-abha`
- Never ask twice. A value the transaction already holds, the Aadhaar number, the mobile, the txnId, is carried, not re-entered. `hiecm.concept.m1-never-ask-twice`
- Two tokens. The gateway access token goes in `Authorization`. The user token an enrolment or a login returns goes in `X-token`. Profile calls need both.
- Fresh `REQUEST-ID` on every call, logged before sending. A reused id is refused, and after a failure the id is the only handle on the call.
- Paste the response. A step with no pasted output is not done.
- The set decides the outcome. A refusal the set asks for, such as a wrong OTP where the case names one, is part of the pass. A refusal the set does not ask for is labelled "Extra check, not in the set" in the case: run it, log it, and never let it decide the outcome.
- Sensitive values travel encrypted: Aadhaar, mobile, email, OTP. Read the algorithm from the certificate call rather than hard coding a padding.
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: CRT_ABHA_101   pass: 1 of 3   at: 2026-09-29T10:14:02Z
observed: POST /abha/api/v3/enrollment/enrol/byAadhaar  REQUEST-ID 6f1c...  HTTP 200
body: {"message":"Account created successfully","txnId":"...","tokens":{"token":"<X-token>",...},"ABHAProfile":{"ABHANumber":"91-...",...}}
matched: exit condition for CRT_ABHA_101, step 2
next: CRT_ABHA_113
```

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/m1-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case `plan` lists gets a row before the first call, each `pending`, in the order `plan` prints them. A case outside the ones chosen for this run stays `pending`, so the log always shows what is still open.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# M1 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| CRT_ABHA_101 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| CRT_ABHA_105 | needs-human | b7a1... | OTP asked for twice, no answer |
| CRT_ABHA_106 | running | | |
| CRT_ABHA_107 | pending | | |
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
| Name every check by its case id from this skill, such as `CRT_ABHA_101`. Never invent a numbering such as `TC01` | The functional testing report quotes these ids. A check with no case id answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal for the value: Aadhaar number, mobile, OTP, the chosen address. Read it from stdin, encrypt it, send it | Every M1 success path passes through an OTP. A runner that never asks never reaches one |
| Never write a typed value to disk, a log or the manifest, and never hard code one | An Aadhaar number and an OTP belong to the person, not the run |
| Run each `sandbox` case's success path and each refusal its exit condition names, as separate checks. Run a refusal labelled "Extra check, not in the set" too, and log it on its own line | The outcome is decided only by what the set asks. An extra check is logged, and never passes or fails the case |
| Compare the status and the body literal the exit condition names, such as `200` with `tokens.token` present, or `422` with `error.code` `ABDM-1204` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt asks once more, naming the field. A second blank, or the tester saying they cannot provide it in this run, records the case `needs-human` with what was asked in Remarks, and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| At the end, print one line per case id with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case id, not by script step |

A run reads like this. The person's values are typed at the prompts and never echoed back.

```text
CRT_ABHA_105  POST /v3/enrollment/request/otp  REQUEST-ID 3b9e...  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 1234, or leave blank if nobody is here:
CRT_ABHA_107  wrong OTP  REQUEST-ID 7c02...  HTTP 422  error.code ABDM-1204  matched
CRT_ABHA_107  right OTP  REQUEST-ID 9a41...  HTTP 200  tokens.token present  matched
CRT_ABHA_107  passed
```

Nudge: calls with a bad `scope`, a bad `loginHint` or a made up `txnId` test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The ids and the wording of each check are ABDM's, from the M1 ABHA creation, verification, scan and share set as revised on 21 October 2026. What each case is for your entity type is read from that set, not from this text. Where the set names an operation, the operation id here is a call in the same functionality's Calls section, which carries the host, the headers and the full request. Where the set lists no API for a case and ABDM publishes one, the operation id is named so the case can still be observed.

### CRT_ABHA_101 to 116: create an ABHA by Aadhaar OTP

This is the group every other creation group repeats with a different authentication step, so it is written in full and the others state only what differs.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. A person present with an Aadhaar linked mobile. Their Aadhaar number searched first on the login path and not found, so the run creates rather than duplicates.

**A fresh Aadhaar, said before the run.** The full creation journey needs an Aadhaar that holds no ABHA. Tell the tester so at the readiness check, before the first case: an existing ABHA can be deleted on the ABHA sandbox portal, https://abhasbx.abdm.gov.in/abha/v3, to free that Aadhaar, as NHA recommends.

**An existing ABHA is not a stop.** If the tester keeps the existing ABHA, run the cases anyway. For an Aadhaar that already holds an ABHA, `m1_post_v3_enrollment_enrol_byaadhaar_otp` answers 200 with `message` `This account already exist` and `isNew` `false`, and still returns the account's `txnId`, `tokens` with `token` and `refreshToken`, and the full `ABHAProfile`, with `ABHANumber`, `phrAddress` and the masked `mobile`. So these still run on that response:

| Case | Runs on |
|---|---|
| CRT_ABHA_112, the address step | The same `txnId`. A person can create more than one ABHA address for the same ABHA number |
| CRT_ABHA_113, the profile shown | `ABHAProfile`, and the address from CRT_ABHA_112 |
| CRT_ABHA_114, the card | `m1_get_v3_profile_account_abha_card`, sent with `tokens.token` as `X-token` |

Only a case that truly needs a brand new ABHA waits for a fresh Aadhaar, and is `needs-human` with `an Aadhaar with no ABHA` in Remarks after the tester was asked for one. If your application offers no address step for an existing account, that is your application's FAIL on CRT_ABHA_112, not a `not-run`.

#### CRT_ABHA_101, the option exists. `sandbox`

Your system offers ABHA creation by Aadhaar OTP, and the journey completes. Drive it end to end through your screen or API.

Calls, in order: `m1_post_v3_enrollment_request_otp_aadhaar_otp`, `m1_post_v3_enrollment_enrol_byaadhaar_otp`, the optional mobile and email verifications, `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`, `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp`, then `m1_get_v3_profile_account` and `m1_get_v3_profile_account_abha_card`.

Exit condition: three literals, all pasted.

1. `m1_post_v3_enrollment_enrol_byaadhaar_otp` returns 200 with `tokens.token` present and `ABHAProfile.ABHANumber` present.
2. `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp` returns 200 with `healthIdNumber` and `preferredAbhaAddress`.
3. `m1_get_v3_profile_account`, sent with that `X-token`, returns 200 with the same `ABHANumber`.

Nudge: read `message` and `isNew` on step 1. `Account created successfully` with `isNew` `true` is a new account. `This account already exist` with `isNew` `false` is a 200 too, and is not a failure: the Aadhaar already holds an ABHA. Your application must carry on from that response to the profile, the card and the address step, as "An existing ABHA is not a stop" above sets out. Say in the run log that the account existed, and that steps 1 to 3 ran on it.

#### CRT_ABHA_104, an invalid Aadhaar number is refused before any call. `screen`

Enter fewer than 12 digits, more than 12 digits, letters and special characters. Your system refuses each with the message "Aadhaar Number is not valid", and sends nothing. Evidence: the refusal on screen and an empty call log for that attempt. Your own check has to be the strict one here; the sandbox's refusal for a bad number is not the one this case is about. The set recommends showing the Aadhaar number masked once entered. `hiecm.concept.m1-honest-screen-states`

#### CRT_ABHA_102, consent is shown and recorded. `screen`

Your system shows the published ABDM consent text before the Aadhaar number is asked for, and stores that the person agreed, with when. The person agrees with an "I Agree" checkbox or another approved mechanism. Evidence: the consent screen, and the stored record for this run. `hiecm.concept.m1-screen-contract`

#### CRT_ABHA_103, consent in another language. `screen`

The same consent offered in at least one language other than English. Evidence: the screen in that language. Record `not-run` if you do not claim it.

#### CRT_ABHA_105, the Aadhaar OTP is requested and can be entered. `sandbox`, then `human`

Exit condition: `m1_post_v3_enrollment_request_otp_aadhaar_otp` returns 200 with a `txnId` and a `message` that names the masked mobile. Paste it. Then stop: the OTP arrives on the person's phone and only they enter it. If they are not there, ask again naming the OTP field; only when the tester says they cannot provide it in this run, or stays silent after the second ask, record `needs-human` with what was asked and the txnId, and do not mark the case passed or failed.

Screen checks alongside: the prompt tells the person the OTP went to the mobile linked with Aadhaar and shows the last digits, which the `message` carries. The OTP field accepts only six digits. An incomplete, wrong or expired OTP shows the message the API returned.

#### CRT_ABHA_106, resend OTP. `screen`

The resend control is disabled for 60 seconds after each send and works at most twice. A third attempt shows "Maximum OTP resend attempts reached. Please try again after 30 mins". An OTP counter is visible. Evidence: a recording or timestamped screenshots: disabled at send, enabled after 60 seconds, disabled after the second resend, and the message on the third. A resend that works reuses the `txnId`; a fresh `txnId` is a new request, not a resend.

#### CRT_ABHA_107, the OTP is verified, and a wrong OTP is refused. `sandbox`, `human`

Two observations, both needed.

1. A wrong OTP: `m1_post_v3_enrollment_enrol_byaadhaar_otp` returns 422 with `error.code` `ABDM-1204` and a message naming an invalid Aadhaar OTP value, and your screen shows that error and lets the person retry without re-entering the Aadhaar number.
2. The right OTP: the 200 from CRT_ABHA_101 step 1.

The person enters both OTPs. Stop for each.

#### CRT_ABHA_108, the communication mobile is the Aadhaar mobile. `sandbox`

When the mobile the person gives is the Aadhaar linked one, your system goes on to ABHA creation with no second OTP. Drive that path. Exit condition: the journey reaches the ABHA address step with no `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb` call in the log.

#### CRT_ABHA_109, a different communication mobile is verified. `sandbox`, `human`

Give a mobile that is not the Aadhaar linked one. Exit condition: `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb` returns 200 with a `txnId`, the person enters the OTP, and `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285` returns 200. A wrong OTP here is refused on screen and the person can retry.

Screen checks alongside: resend as in CRT_ABHA_106. The communication mobile, whether the Aadhaar one or another, is the one the ABHA card shows.

#### CRT_ABHA_112, the ABHA address is suggested and validated. `sandbox` and `screen`

Optional only for a programme that creates a default address by demographic authentication.

Exit condition: `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp` returns 200 with `abhaAddressList` holding at least three entries, and `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp` returns 200 with `preferredAbhaAddress` equal to the one chosen.

Screen checks: at least three suggestions are shown, and a free field with these rules printed beside it. Each rule shows green when it is met and red when it is not. An address already taken shows "ABHA address already exists." and offers two choices: proceed with the existing address, or create a new one.

```text
length 8 to 18, including @sbx or @abdm
letters, digits, or both
at most one dot and at most one underscore, neither first nor last
```

#### CRT_ABHA_113, the ABHA number is displayed. `screen`

The 14 digit ABHA number and the ABHA address from CRT_ABHA_112 are shown together with the profile after creation. Evidence: the screen, with the number matching `healthIdNumber` from the pasted response.

#### CRT_ABHA_114, the ABHA card can be viewed and downloaded. `sandbox` and `screen`

For an integrator that shows the ABHA card. Exit condition: `m1_get_v3_profile_account_abha_card` returns 200 with content type `image/png`, sent with the `X-token` from creation. Screen check: the card is shown as the API returned it, with the demographic details it carries, and can be downloaded. A non-KYC ABHA address cannot download a card; the details have to be KYC verified first.

#### CRT_ABHA_115, your own card carries the ABHA details. `screen`

For an integrator that prints its own programme or scheme card instead. A government integrator passes one of CRT_ABHA_114 and CRT_ABHA_115. The card shows the ABHA number and the ABHA address, both required, and your system stores both against your own patient id. Evidence: the card and the stored record.

#### CRT_ABHA_116, a returning patient is matched, not registered again. `screen`

After a creation or a verification, your system searches its own records by mobile, name, gender and age, and by your own beneficiary id such as an MRD or UHID number when one is given. A full match links this visit to the existing beneficiary id. A mismatch in any critical demographic field creates a new one. Evidence: run the same person twice; the second visit is linked to the first beneficiary id and your database holds one row. `hiecm.concept.m1-avoiding-duplicate-abha`

### CRT_ABHA_101_FA to 117_FA: create an ABHA by Aadhaar face authentication

The set lists no API for this group. ABDM publishes the face authentication creation flow, so the operation ids below are the ones that observe it. `hiecm.flow.m1-create-abha-face-auth`

Face authentication is a `human` step on a device. The person scans a QR code from your screen with the ABHA app, logged out, and captures their face in the ABHA Face RD app on their phone. Ask for that phone and that person at readiness and again at each case. Without them, record every case from CRT_ABHA_106_FA on that you claim as `needs-human`, naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`, because the whole group is optional.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. A person present with their Aadhaar number and a phone with the ABHA app installed and logged out. Their Aadhaar number searched first on the login path and not found.

#### CRT_ABHA_101_FA, the face authentication option exists. `screen`

Your ABHA creation screen offers face authentication as a way to authenticate the Aadhaar number. Evidence: the screen with the option.

#### CRT_ABHA_102_FA, an invalid Aadhaar number is refused before a QR code. `screen`

As CRT_ABHA_104, with blank input as well. No QR code is generated for an invalid number, so no `m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33` call is in the log for that attempt.

#### CRT_ABHA_103_FA, consent comes before the QR code. `screen`

As CRT_ABHA_102. Your system does not generate the face authentication QR code until consent is recorded. Evidence: the consent screen, the stored record, and no init call before it in the log. `hiecm.concept.m1-screen-contract`

#### CRT_ABHA_104_FA, consent in another language. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_105_FA, the face authentication QR code is generated. `sandbox` and `screen`

After the Aadhaar number and consent, your system generates a transaction and shows it as a QR code.

Exit condition: `m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33` returns 200 with a `txnId`. Screen check: the QR code is shown clearly, and the person is told to scan it with the scanner on the logged out ABHA app's landing page.

#### CRT_ABHA_106_FA, the QR code is scanned in the ABHA app. `human`

The person opens the ABHA app logged out, taps the scanner at the top left of the landing page, and scans your QR code. The ABHA app starts face authentication and opens the ABHA Face RD app. No call of yours proves the scan. Evidence: the phone screen after the scan, and the `status` from `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` pasted at that moment.

#### CRT_ABHA_107_FA, the ABHA Face RD app is not installed. `human`

On a phone without the ABHA Face RD app, the scan sends the person to the Play Store or App Store to install it, and they can then continue or restart. This is the ABHA app's behaviour, not your system's. Evidence: the phone screen at the store. If you claim the case and no such phone is available, record `needs-human` naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run.

#### CRT_ABHA_108_FA, face authentication succeeds. `sandbox`, `human`

The person captures their face. Poll the status every 5 to 10 seconds while they do.

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` returns 200 with `status` `COMPLETE`. Screen check: the phone shows success, and your system moves on to the communication mobile step.

#### CRT_ABHA_109_FA, a failed face authentication is refused. `sandbox`, `human`

The person does a scan that fails: another face, a poor capture, or a timeout.

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` returns 200 with `status` `FAILED` and a `message`. Your screen shows that message, does not go on to the mobile step or creation, and lets the person retry or generate a new QR code.

#### CRT_ABHA_110_FA, the communication mobile is collected after face authentication. `sandbox`, `human`

Your system asks for the communication mobile after face authentication, checks its format, and sends an OTP to it. The set asks for the OTP whether or not this is the Aadhaar linked mobile.

Exit condition: two literals, both pasted.

1. `m1_post_v3_enrollment_enrol_byaadhaar_face`, sent with the `txnId` from CRT_ABHA_108_FA and that mobile, returns 200 with `tokens.token` present and `ABHAProfile.ABHANumber` present.
2. `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_6474ce` returns 200 with a `txnId` and a `message` naming the masked mobile.

#### CRT_ABHA_111_FA, the communication mobile OTP is verified. `sandbox`, `human`

Two observations, both needed. The person enters both OTPs. Stop for each.

1. A wrong OTP: `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_b555fb` returns 400 with `description` naming an invalid OTP value, and your screen shows that error.
2. The right OTP: the same call returns 200 with `authResult` `success`.

Screen check: the OTP field accepts only six digits.

#### CRT_ABHA_112_FA, resend the communication mobile OTP. `screen`

As CRT_ABHA_106, for the communication mobile OTP.

#### CRT_ABHA_113_FA, the ABHA address is suggested and validated. `sandbox` and `screen`

As CRT_ABHA_112, with the face flow's calls. Exit condition: `m1_get_v3_enrollment_enrol_suggestion_create_abha_face_au_848b26` returns 200 with `abhaAddressList` holding at least three entries, and `m1_post_v3_enrollment_enrol_abha_address_create_abha_face_4b1f33` returns 200 with `preferredAbhaAddress` equal to the one chosen.

#### CRT_ABHA_114_FA, the ABHA number is displayed. `sandbox` and `screen`

As CRT_ABHA_113. Exit condition: `m1_get_v3_profile_account`, sent with the `X-token` from CRT_ABHA_110_FA, returns 200 with the same `ABHANumber` and a masked `mobile` ending in the digits of the mobile verified in CRT_ABHA_111_FA.

#### CRT_ABHA_115_FA, the ABHA card can be viewed and downloaded. `sandbox` and `screen`

As CRT_ABHA_114.

#### CRT_ABHA_116_FA, your own card carries the ABHA details. `screen`

As CRT_ABHA_115.

#### CRT_ABHA_117_FA, a returning patient is matched, not registered again. `screen`

As CRT_ABHA_116, for a person created by face authentication.

### CRT_ABHA_201 to 211: create an ABHA by Aadhaar biometric, fingerprint or iris

Each case runs as its counterpart in CRT_ABHA_101 to 116 and records the counterpart's evidence, with the differences stated.

The creation call is `m1_post_v3_enrollment_enrol_byaadhaar_fingerprint` or `m1_post_v3_enrollment_enrol_byaadhaar_iris`. The calls after it are the same flow's: for fingerprint `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_64b04e`, `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_3b237a`, `m1_get_v3_enrollment_enrol_suggestion_create_abha_fingerprint` and `m1_post_v3_enrollment_enrol_abha_address_create_abha_fingerprint`; for iris `m1_post_v3_enrollment_request_otp_mobile_verify_create_abha_iris`, `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_abha_iris`, `m1_get_v3_enrollment_enrol_suggestion_create_abha_iris` and `m1_post_v3_enrollment_enrol_abha_address_create_abha_iris`.

If you do not claim biometric creation, the whole group is `not-run`. If you claim it and no registered fingerprint or iris device is at hand, record each case that scans as `needs-human`, naming the device, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run.

Loop limit: 3 passes per test case.

#### CRT_ABHA_201, the option exists. `sandbox`

As CRT_ABHA_101, with the creation call above. Exit condition: it returns 200 with `tokens.token` and `ABHAProfile.ABHANumber`.

#### CRT_ABHA_204, an invalid Aadhaar number is refused before any call. `screen`

As CRT_ABHA_104.

#### CRT_ABHA_202, consent is shown and recorded. `screen`

As CRT_ABHA_102.

#### CRT_ABHA_203, consent in another language. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_205, the biometric is verified, and a failed scan is refused. `sandbox`, `human`

The person scans a fingerprint or an iris. Exit condition: the creation call returns 200 as in CRT_ABHA_201. For a failed scan, the specification documents a 422 with `error.code` `ABDM-1204` and a `message` carrying the UIDAI error code. Your screen shows the message the API returned and lets the person scan again. Paste what the sandbox returned.

#### CRT_ABHA_206, the communication mobile is the Aadhaar mobile. `sandbox`

As CRT_ABHA_108, with the mobile verify call of the flow you ran.

#### CRT_ABHA_207, a different communication mobile is verified. `sandbox`, `human`

As CRT_ABHA_109, with the mobile verify calls of the flow you ran.

#### CRT_ABHA_208, the ABHA address is suggested and validated. `sandbox` and `screen`

As CRT_ABHA_112, with the suggestion and address calls of the flow you ran.

#### CRT_ABHA_209, the ABHA number is displayed. `screen`

As CRT_ABHA_113.

#### CRT_ABHA_210, the ABHA card can be viewed and downloaded. `sandbox` and `screen`

As CRT_ABHA_114.

#### CRT_ABHA_211, your own card carries the ABHA details. `screen`

As CRT_ABHA_115.

### CRT_ABHA_301 to 309: create an ABHA by demographic authentication

A private integrator records the group `not-run`: it applies to government entities only.

Loop limit: 3 passes per test case.

#### CRT_ABHA_301, the option exists. `screen`

Your landing or registration screen offers "Create ABHA using Demographics", and it starts the demographic flow. Evidence: the screen with the option and the screen it opens.

#### CRT_ABHA_302, consent is shown and recorded. `screen`

As CRT_ABHA_102.

#### CRT_ABHA_303, consent in another language. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_304, an invalid Aadhaar number is refused before any call. `screen`

As CRT_ABHA_104.

#### CRT_ABHA_305, the demographic details are checked against Aadhaar. `sandbox`

One call, `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d`, with the name, date of birth, gender, Aadhaar number and mobile as they read on the Aadhaar card. Exit condition: 200 with `healthIdNumber`, `healthId` and `kycVerified` `true`.

Then the mismatch: send the same call with the date of birth changed. Exit condition: 422 with `error.code` `ABDM-1207` and a message that the information does not match the details on record with Aadhaar, and your screen says so without creating anything. Both observations, both pasted.

Screen check: name, date of birth and gender are filled and not editable; address, email, mobile, state, district and profile photo stay editable.

Nudge: the same mobile on a seventh account is refused with ABDM-1124. That is a mobile limit, not a demographic mismatch. Read `error.message`.

#### CRT_ABHA_306, the profile is completed from the response, not typed. `screen`

Your system fills name, date of birth, gender, Aadhaar number, mobile, address, state, district and ABHA number from the response. Name, date of birth and gender are not editable. Address, email, mobile, state, district and profile photo are editable. The person completes the rest and submits without an error. Evidence: the form after creation and after submission. `hiecm.concept.m1-confirm-the-filled-form`

#### CRT_ABHA_307, the ABHA number is displayed. `screen`

As CRT_ABHA_113, matching `healthIdNumber` and `healthId` from CRT_ABHA_305.

#### CRT_ABHA_308, the ABHA card can be viewed. `sandbox` and `screen`

As CRT_ABHA_114, sent with the `token` from CRT_ABHA_305 as `X-token`. The card carries the ABHA number, the QR code, date of birth, gender and the ABHA address. The photo is optional.

#### CRT_ABHA_309, your own card carries the ABHA details. `screen`

As CRT_ABHA_115.

### CRT_ABHA_401 to 411: create an ABHA by driving licence

The set names `/abha/api/v3/enrollment/enrol/byDocument` for every case in this group. ABDM's M1 specification does not publish that operation, so there is no operation id to call. Record every case in this group `not-run` with that reason, until an operation is published. Do not improvise a call. Each heading names the evidence the case will need once an operation exists.

Loop limit: 3 passes per test case.

#### CRT_ABHA_401, the option exists. `screen`

The set checks that your system offers creation by driving licence.

#### CRT_ABHA_402, consent is shown and recorded. `screen`

The set checks consent for sharing the driving licence details, as CRT_ABHA_102.

#### CRT_ABHA_403, the communication mobile is collected. `screen`

#### CRT_ABHA_404, the mobile is verified by OTP. `sandbox`, `human`

#### CRT_ABHA_405, the driving licence is verified. `sandbox`

The set describes an enrolment number returned after the licence, name, date of birth and gender are checked, which the person takes to an ABDM facility.

#### CRT_ABHA_406, the licence front and back are uploaded. `screen`

#### CRT_ABHA_407, an operator checks the documents and approves or rejects. `human`

#### CRT_ABHA_408, the ABHA number is displayed. `screen`

#### CRT_ABHA_410, the ABHA card can be viewed. `sandbox` and `screen`

#### CRT_ABHA_411, your own card carries the ABHA details. `screen`

### VRFY_ABHA_101 and 201: log in with an ABHA number

Loop limit: 3 passes per test case.

**Preconditions.** A person present with an ABHA, the Aadhaar linked mobile and the ABHA linked mobile.

#### VRFY_ABHA_101, by ABHA number and Aadhaar OTP. `sandbox`, `human`

Calls: `m1_post_v3_profile_login_request_otp_abha_number_aadhaar_otp`, the OTP, `m1_post_v3_profile_login_verify_abha_number_aadhaar_otp`, then `m1_get_v3_profile_account` with the returned token as `X-token`.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts[0].ABHANumber`, and the profile call returns 200 with the same `ABHANumber`. A wrong OTP returns 400 with `otpValue` naming an invalid OTP value, and your screen says the verification failed.

Screen checks alongside: resend as in CRT_ABHA_106; name, date of birth and gender shown not editable, and address, email, mobile, state, district and city editable; the profile stored against your own patient id after verification. When the mobile in your own record differs from the ABHA one, your system offers a Yes or No choice to update the ABHA mobile, which PROF_ABHA_601 runs.

Nudge: the accounts array already carries the whole registration form. Fill the form from it before the profile call, so the person reads back rather than types.

#### VRFY_ABHA_201, by ABHA number and the ABHA linked mobile OTP. `sandbox`, `human`

As VRFY_ABHA_101 with `m1_post_v3_profile_login_request_otp_abha_number_abha_otp` and `m1_post_v3_profile_login_verify_abha_number_abha_otp`. Same exit condition, same screen checks.

### VRFY_ABHA_102 and 202: log in with an ABHA address

Loop limit: 3 passes per test case.

**Preconditions.** A person present with an ABHA address, the Aadhaar linked mobile and the ABHA linked mobile.

#### VRFY_ABHA_102, by ABHA address and Aadhaar OTP. `sandbox`, `human`

Calls: `m1_post_v3_phr_web_login_abha_search_abha_address_login_a_de8184`, `m1_post_v3_phr_web_login_abha_request_otp_aadhaar_otp`, the OTP, `m1_post_v3_phr_web_login_abha_verify_aadhaar_otp`, then `m1_get_v3_phr_web_login_profile_abha_profile_abha_address_c04e83`.

Exit condition: the search returns 200 with `authMethods`, the verify returns 200 with a token, and the profile call returns 200 carrying the ABHA number and the address searched for. Paste all three.

Screen checks alongside: the ways to log in that your screen offers are the ones `authMethods` returned, not a fixed list. Resend, the not editable fields, the stored record and the mobile update offer as in VRFY_ABHA_101.

#### VRFY_ABHA_202, by ABHA address and the ABHA linked mobile OTP. `sandbox`, `human`

As VRFY_ABHA_102 with `m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f`, `m1_post_v3_phr_web_login_abha_request_otp_mobile_otp`, `m1_post_v3_phr_web_login_abha_verify_mobile_otp` and `m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4`. Same exit condition, same screen checks.

### VRFY_ABHA_301 to 308: find an ABHA by the communication mobile and OTP

This is the lookup that costs no Aadhaar OTP, so it is the one your desk should run first.

Calls, in order: `m1_post_v3_profile_account_abha_search_find_abha_mobile_otp`, `m1_post_v3_profile_login_request_otp_find_abha_mobile` with the chosen account's `index` and the search `txnId`, the OTP, `m1_post_v3_profile_login_verify_find_abha_mobile`, then `m1_get_v3_profile_account` with the returned `token` as `X-token`. `hiecm.flow.m1-find-abha`

Loop limit: 3 passes per test case.

#### VRFY_ABHA_301, an invalid mobile is refused. `screen`

Fewer than ten digits, more than ten, letters, special characters and blank input are each refused on screen with "Please enter a valid mobile number.", and no search is sent.

#### VRFY_ABHA_302, every ABHA on this mobile is listed. `sandbox` and `screen`

Exit condition: the search returns 200 with a top level array. `[0].txnId` is present, and `[0].ABHA[]` holds the accounts, each entry carrying `index`, `ABHANumber` and `name`. Paste it.

The specification also carries a saved example without the `ABHA` array, an object with `txnId` and `message`, marked for confirmation with NHA. A run that sees that shape pastes it and records the difference in the run log.

Screen checks: every account in the array is listed, with enough to tell them apart, such as the masked ABHA number and the name. No OTP is requested before the person picks one.

Nudge: read the array as plural. One mobile can hold up to six accounts, and a screen that shows the first one silently links the wrong person.

#### VRFY_ABHA_303, no ABHA on this mobile. `sandbox`

Exit condition: the search returns 404 with `error.code` `ABDM-1114`. Your screen says "ABHA details not found. We did not find any ABHA number linked to this mobile number. Please use an ABHA-linked mobile number.", and opens no OTP screen. If your business flow supports creation, the screen also offers to create a new ABHA. `hiecm.concept.m1-journey-completes-without-abha`

#### VRFY_ABHA_304, the chosen ABHA gets the OTP. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_request_otp_find_abha_mobile` returns 200 with a `txnId` and a `message` naming the masked mobile, sent only after the person picked an account. Screen checks: the OTP screen opens, the chosen account stays selected until verification, and resend works as in CRT_ABHA_106.

#### VRFY_ABHA_305, the OTP is verified and the chosen ABHA opens. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_find_abha_mobile` returns 200 with `authResult` `success`, `token`, and `accounts` holding the chosen `ABHANumber`; the profile call returns 200 with that `ABHANumber`. Screen check: only the chosen profile is shown, with name, date of birth or age, gender, mobile, ABHA number, ABHA address, state, district, photo and address as the API returned them.

#### VRFY_ABHA_306, the registration form is filled from the profile. `screen`

After VRFY_ABHA_305, your registration or linking form is filled from the profile. Name, date of birth or age and gender are not editable. Address, email, mobile, state, district and city are editable. After registration, the ABHA number and ABHA address are linked to your beneficiary id. Evidence: the form, and the stored link. `hiecm.concept.m1-confirm-the-filled-form`

#### VRFY_ABHA_307, a wrong OTP is refused. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_find_abha_mobile` returns 400 with `otpValue` naming an invalid OTP value. Your screen shows an error such as "Invalid OTP. Please enter a valid OTP.", opens no profile, and allows a retry without re-entering the mobile.

#### VRFY_ABHA_308, the chosen ABHA is already linked in your system. `screen`

Pick an account already linked to one of your patients. After VRFY_ABHA_305 your screen says "This ABHA profile is already linked to HMIS Beneficiary ID.", shows the ABHA details and your stored details side by side, and creates no second registration. Evidence: the screen and one row in your database. `hiecm.concept.m1-avoiding-duplicate-abha`

### VRFY_ABHA_301_FA to 309_FA: find an ABHA by the communication mobile and face authentication

The set lists no API for this group. ABDM publishes the find by face flow: `m1_post_v3_profile_account_abha_search_find_abha_face`, `m1_post_v3_profile_login_request_otp_find_abha_face` with the chosen account's `index` and the search `txnId`, `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` polled every 5 to 10 seconds, then `m1_post_v3_profile_login_verify_find_abha_face`. `hiecm.flow.m1-find-abha`

Face authentication is a `human` step on a device, as in CRT_ABHA_101_FA to 117_FA. Without a phone with the ABHA app and the person, record every case from VRFY_ABHA_305_FA on that you claim as `needs-human`, naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_301_FA, an invalid mobile is refused. `screen`

As VRFY_ABHA_301. No search and no QR code follow an invalid mobile.

#### VRFY_ABHA_302_FA, every ABHA on this mobile is listed. `sandbox` and `screen`

As VRFY_ABHA_302, with `m1_post_v3_profile_account_abha_search_find_abha_face`. No QR code is generated before the person picks an account.

#### VRFY_ABHA_303_FA, no ABHA on this mobile. `sandbox`

As VRFY_ABHA_303, with `m1_post_v3_profile_account_abha_search_find_abha_face`. No QR code is generated.

#### VRFY_ABHA_304_FA, the chosen ABHA gets a face authentication QR code. `sandbox` and `screen`

Exit condition: `m1_post_v3_profile_login_request_otp_find_abha_face` returns 200 with a `txnId`, sent only after the person picked an account. Screen check: the QR code is shown clearly for scanning, and the chosen account stays selected until authentication ends.

#### VRFY_ABHA_305_FA, the QR code is scanned in the ABHA app. `human`

As CRT_ABHA_106_FA, with the `status` from `m1_post_v3_enrollment_enrol_capturepid_find_abha_face`.

#### VRFY_ABHA_306_FA, the ABHA Face RD app is not installed. `human`

As CRT_ABHA_107_FA.

#### VRFY_ABHA_307_FA, face authentication succeeds. `sandbox`, `human`

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` returns 200 with `status` `COMPLETE`, then `m1_post_v3_profile_login_verify_find_abha_face` returns 200 with `authResult` `success`. Screen check: the phone shows success.

#### VRFY_ABHA_308_FA, the chosen ABHA opens. `sandbox` and `screen`

Exit condition: the verify in VRFY_ABHA_307_FA carries `accounts` with the chosen account's `ABHANumber`, and `m1_get_v3_profile_account`, sent with the returned `token` as `X-token`, returns 200 with that `ABHANumber`. Screen check: as VRFY_ABHA_305. No other account's details are shown.

#### VRFY_ABHA_309_FA, a failed face authentication is refused. `sandbox`, `human`

The person does a scan that fails. Exit condition: one of the two refusals the specification documents, pasted. `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` returns 200 with `status` `FAILED`, or `m1_post_v3_profile_login_verify_find_abha_face` returns 422 with `error.code` `ABDM-1204` and a `message` carrying the UIDAI error code. Your screen shows the code and message the API returned, fills no profile, and lets the person retry or generate a new QR code.

### VRFY_ABHA_601 to 603: find an ABHA by the communication mobile and a biometric

The set names `/abha/api/v3/profile/account/abha/search`, `/abha/api/v3/profile/login/request/otp` and a verify path on the production host. Run the sandbox operations of the published find by fingerprint flow instead: `m1_post_v3_profile_account_abha_search_find_abha_fingerprint`, `m1_post_v3_profile_login_request_otp_find_abha_fingerprint` and `m1_post_v3_profile_login_verify_find_abha_fingerprint`. For iris, `m1_post_v3_profile_account_abha_search_find_abha_iris`, `m1_post_v3_profile_login_request_otp_find_abha_iris` and `m1_post_v3_profile_login_verify_find_abha_iris`. `hiecm.flow.m1-find-abha`

Without a registered fingerprint or iris device, the cases that scan and that you claim are `needs-human`, naming the device, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_601, an invalid mobile is refused. `screen`

As VRFY_ABHA_301. No biometric step starts.

#### VRFY_ABHA_602, no ABHA on this mobile. `sandbox`

As VRFY_ABHA_303, with the search operation of the flow you ran.

#### VRFY_ABHA_603, the chosen ABHA is verified by biometric. `sandbox`, `human`

The search lists the accounts as in VRFY_ABHA_302, the person picks one, the request call returns 200 with a `txnId`, and the person scans.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts` holding the chosen `ABHANumber`. Screen checks: the profile is shown with name, age, gender, mobile, ABHA number, ABHA address, state and district; an account already linked in your system says so, as in VRFY_ABHA_308, and one not yet linked can be registered and linked; the card can be downloaded as in CRT_ABHA_114 where the account is KYC verified.

### VRFY_ABHA_701: benefit programmes linked to an ABHA number

A private integrator records it `not-run`: the group applies to government entities only.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_701, the benefit programmes are listed. `sandbox`

Call `m1_get_v3_profile_benefit_abha_abhanumber` with a valid ABHA number. Exit condition: 200 with `abhaNumber` equal to the one sent and a `programme` array, each entry carrying `benefitName`. Screen check: your system shows the list.

### VRFY_ABHA_401 to 405: log in with an Aadhaar number and OTP

Loop limit: 3 passes per test case.

#### VRFY_ABHA_401, an invalid Aadhaar is refused. `screen`

As CRT_ABHA_104, on the login screen. The message may read "Invalid LoginId" or "Aadhaar Number is not valid". The set recommends the masked format and the current consent text here too.

#### VRFY_ABHA_402, a wrong OTP is refused. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_aadhaar_otp` returns 400 with `otpValue` naming an invalid OTP value, and your screen shows an error and goes no further.

#### VRFY_ABHA_403, no ABHA on this Aadhaar. `sandbox`, `human`

Calls: `m1_post_v3_profile_login_request_otp_aadhaar`, the OTP, `m1_post_v3_profile_login_verify_aadhaar_otp`.

Exit condition: the request returns 200 with a `message` naming the masked Aadhaar mobile, the person enters the OTP, and the verify returns 404 with `error.code` `ABDM-1114` and a message that no ABHA user is registered with this Aadhaar number. Your screen says so and offers creation, and the creation path does not ask for the Aadhaar number again. `hiecm.concept.m1-never-ask-twice`

#### VRFY_ABHA_404, an ABHA exists on this Aadhaar. `sandbox`, `human`

Same calls with an Aadhaar that holds an account, then `m1_get_v3_profile_account`.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts[0].ABHANumber`; the profile call returns 200 with the same number. Screen checks: the profile is shown, the card can be downloaded as in CRT_ABHA_114 where the account is KYC verified, and the account is registered and linked to your patient id if it was not already.

#### VRFY_ABHA_405, resend OTP. `screen`

As CRT_ABHA_106, on the login screen.

### VRFY_ABHA_801 to 804: log in with an Aadhaar number and a biometric

The set names `/abha/api/v3/profile/login/request/otp` and `/abha/api/v3/profile/login/verify`. In the published specification the fingerprint use of those two paths takes an ABHA number, not an Aadhaar number. The login that takes an encrypted Aadhaar number with a biometric is `m1_post_v3_1_profile_login_verify_fingerprint`, or `m1_post_v3_1_profile_login_verify_iris`, one call each. Run that, and say in the run log that it is the v3.1 call.

A claimed case that scans waits on a registered fingerprint or iris device. With none present after both asks, and the tester unable to provide one in this run, it is `needs-human`, naming the device. An unclaimed case is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_801, an invalid Aadhaar is refused. `screen`

As VRFY_ABHA_401.

#### VRFY_ABHA_802, the biometric is verified, and a failed scan is refused. `sandbox`, `human`

Exit condition: the v3.1 call returns 200 with `authResult` `success` and `token`. A failed scan is refused with the error the API returned; your screen shows it and lets the person scan again. Paste what the sandbox returned.

#### VRFY_ABHA_803, no ABHA on this Aadhaar. `sandbox`, `human`

Exit condition: the v3.1 call returns 404 with `error.code` `ABDM-1114`. Your screen says no ABHA user is registered with this Aadhaar number and offers creation, as in VRFY_ABHA_403.

#### VRFY_ABHA_804, an ABHA exists on this Aadhaar. `sandbox`, `human`

As VRFY_ABHA_404, with the v3.1 call in place of the OTP verify: 200 with `accounts[0].ABHANumber`, then `m1_get_v3_profile_account` with the returned `token` as `X-token`, 200 with the same number.

### PROF_ABHA_601: profile update


Loop limit: 3 passes per test case.

#### PROF_ABHA_601, the mobile is updated. `sandbox`, `human`

Calls: `m1_post_v3_profile_account_request_otp_update_mobile`, the OTP, `m1_post_v3_profile_account_verify_update_mobile`. The person enters the OTP on the new mobile, and the password or OTP on the old one when asked. Stop for each.

Exit condition: the verify returns 200 with `authResult` `success` and a message that the mobile number was linked; `m1_get_v3_profile_account` then shows the new masked `mobile`.

### VRFY_ABHA_501: read the ABHA QR code


Loop limit: 3 passes per test case.

#### VRFY_ABHA_501, the ABHA QR code fills registration. `screen`

No call. Your system scans a person's ABHA QR code and fills name, date of birth, gender, mobile and the other details into registration from it. Evidence: the filled form after a scan, with nothing typed. `hiecm.concept.m1-two-routes-to-the-profile`

### TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER: one ABHA per patient id

Loop limit: 3 passes per test case.

#### TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER, one ABHA maps to one patient id. `screen`

Your system checks whether an ABHA number already exists in its database before it creates a patient id, on both the creation and the verification paths. Not yet linked, it tags the ABHA to the patient id. Already linked, it creates no new patient id. So one ABHA never maps to two of your patients and one of your patients never holds two ABHAs.

Evidence: verify the same ABHA twice in a run. The second time, the screen says the record is already linked and names your patient id, and the database holds one row. `hiecm.concept.m1-avoiding-duplicate-abha`

### SHARE_PATIENT_PROFILE_701 and 702: share a profile by scanning the facility QR

The set marks this group for the PHR app, but the call that proves each case lands on your HIP. The person acts in the ABDM sandbox PHR app. Your system receives the share and answers it with a queue token. Both operations are in the scan and register specification.

Calls: the inbound `scan-and-register_post_v3_hip_patient_share` at your callback URL, which your system answers with HTTP 200. Then your `scan-and-register_post_patient_share_v3_on_share`, which returns 202.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. Your callback URL registered with the bridge and reachable from the internet. A facility QR code for one of your counters, and for SHARE_PATIENT_PROFILE_702 a second QR code for a different counter. The person present with the ABDM sandbox PHR app, an ABHA number, and a second ABHA address on that ABHA number for SHARE_PATIENT_PROFILE_702.

#### SHARE_PATIENT_PROFILE_701, the profile is shared and the patient registered. `sandbox`, `human` and `screen`

Use a person your system has not registered. The person logs in to the PHR app, scans your facility QR code, taps "Get Token", reads their profile and the consent message, and taps "I Agree". Stop for that.

Exit condition: three observations, all pasted.

1. An inbound POST arrives at your URL for `scan-and-register_post_v3_hip_patient_share` with `intent` `PROFILE_SHARE`, `metaData.hipId` equal to your HIP id, `metaData.context` equal to the counter id of the QR code scanned, and `profile.patient.abhaAddress`, `profile.patient.name`, `profile.patient.gender` and `profile.patient.yearOfBirth` present. Your system answers it with HTTP 200. Paste the body in full, with `profile.patient.phoneNumber` masked.
2. Your `scan-and-register_post_patient_share_v3_on_share` returns 202. It was sent with `acknowledgement.status` `SUCCESS`, `acknowledgement.abhaAddress` equal to `profile.patient.abhaAddress`, `acknowledgement.profile.context` equal to `metaData.context`, `acknowledgement.profile.tokenNumber` and `acknowledgement.profile.expiry` present, and `response.requestId` equal to the share's `REQUEST-ID`. Paste the body you sent.
3. Human: the PHR app shows the token number you sent. The set says the token is valid for 60 minutes.

Screen check: your system registered the person from the shared details with nothing typed. A new beneficiary id holds the ABHA number, ABHA address, name, gender, date of birth, mobile and address as `profile.patient` carried them. Evidence: the stored record for this run.

Nudge: answer the inbound share with 200 first. Register the person and send the on-share after that.

#### SHARE_PATIENT_PROFILE_702, a returning patient is matched. `sandbox`, `human` and `screen`

Runs after SHARE_PATIENT_PROFILE_701, with the same person. Each step below is a fresh scan: the person scans, taps "Get Token" and taps "I Agree". Stop for each. Every scan must show observations 1 and 2 of SHARE_PATIENT_PROFILE_701, pasted, for the QR code scanned in that step.

Your system matches on name, mobile, gender, ABHA number and ABHA address. A person with no match is a new registration, which SHARE_PATIENT_PROFILE_701 already observed.

Exit condition: four steps, each with its share and on-share pasted and its screen check attested.

1. A revisit. Close the queue entry from SHARE_PATIENT_PROFILE_701 in your system, then the person scans the same QR code with the same ABHA address. The share carries the same `profile.patient.abhaNumber` and `profile.patient.abhaAddress`. Screen: your system reuses the beneficiary id from SHARE_PATIENT_PROFILE_701, creates the care context under it, and still holds one row for the person.
2. Another ABHA address. The person scans with their second ABHA address. The share carries the same `profile.patient.abhaNumber` and a different `profile.patient.abhaAddress`. Your on-share carries the new address in `acknowledgement.abhaAddress`. Screen: your system updates the ABHA address on the existing beneficiary id and creates no new one. Evidence: the record before and after, one row.
3. A repeat scan while a queue entry is active. Straight after step 2, the person scans the same QR code with the same ABHA address as step 2. The share carries the same `metaData.context`. Screen: your system creates no new queue entry, and the existing queue association is unchanged. A new token number is issued only if your queue rules issue one. Evidence: the queue for that counter before and after, with one entry for the person.
4. A different counter. The person scans the second QR code. The share carries a `metaData.context` different from step 3, and your on-share carries that context in `acknowledgement.profile.context` with an `acknowledgement.profile.tokenNumber` for that queue. Screen: your system creates a new queue entry on that counter, with the same beneficiary id and patient details. Evidence: both queues.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case ids to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no OTPs, no Aadhaar numbers, no client secret. The run log and the manifest are written on every run. The manifest is not the report. Every run ends with a PDF, written as the section "Writing the test report" sets out: run its `check`; when it exits 0, build the report; when it does not, build the draft with `--draft`. Never end a run without one, and say where it is in the three lines below.

```json
{
  "skill": "abdm-m1",
  "set": "M1 ABHA creation, verification, scan and share, NHA, revised 21 October 2026",
  "entity": "private",
  "run_started": "2026-09-29T10:12:40Z",
  "run_finished": "2026-09-29T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "CRT_ABHA_101", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c...", "a02d...", "c9e4..."],
     "observed": ["byAadhaar 200 message=Account created successfully", "abha-address 200 healthIdNumber", "profile/account 200 ABHANumber"]},
    {"id": "CRT_ABHA_102", "outcome": "passed", "evidence": "screen",
     "attachment": "consent-2026-09-29.png", "rule": "hiecm.concept.m1-screen-contract"},
    {"id": "CRT_ABHA_105", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "OTP arrives on the person's phone; nobody present"},
    {"id": "CRT_ABHA_401", "outcome": "not-run", "reason": "no enrolment by document operation in the M1 specification"}
  ]
}
```

Then say, in three lines: how many cases passed, passed with a condition, failed, need a human and were not run; which mandatory cases for your entity are not `passed`; and the one case to fix first.
