# HIE-CM m1 test

## Read this first: this run is never hands-off

A tester sits with this run from the first case to the last. Every Aadhaar number, mobile number, OTP, ABHA number or address, password, document number, biometric and approval is entered by that person, at the moment the case needs it. You never type one, never make one up, and never mock a response to get past one. This rule outranks every other rule in this file.

### In plain words

A functional test run is done with a tester at the keyboard. The agent drives
the steps; the tester enters everything that belongs to a real person. When a
step needs one of the values below, the agent stops, says exactly what is
needed and where, and waits for the tester.

| Value | Who enters it |
|---|---|
| Aadhaar number | The tester |
| Mobile number, including the communication mobile | The tester |
| Any OTP: Aadhaar OTP, mobile OTP, linking OTP | The tester |
| ABHA number, ABHA address, and the password or PIN of either | The tester |
| Name, date of birth, gender, email or address being enrolled or verified | The tester |
| Driving licence or any document number | The tester |
| A fingerprint, iris or face capture | The tester, on the device |
| A consent, link or subscription approval in a PHR app | The tester, in the app |
| A captcha | The tester |

The agent never types any of these, in any run type. A value the agent did
not get from the tester at that moment does not exist.

This holds for a deliberately wrong value too. A case that checks your
screen's own format rule, such as an 11 digit Aadhaar number or letters in a
mobile field, still has the tester type it: the agent says what to type ("an
11 digit number") and the tester types it.

### Before you start

- The tester is present for the whole run, with the phone that receives the Aadhaar and mobile OTPs.
- For a `ui` run the browser is visible on the tester's screen, never headless, so the tester can type into it. The Playwright MCP server opens a visible browser unless it was started with `--headless`; if it was, stop and ask the tester to restart it without that flag.
- For a PHR app, the emulator window or the phone is in front of the tester.

### What happens

Before every field, ask one question: does this field take a person's identity, a document number, a code sent to a person, or an approval? If yes, it is a tester's step.

**A field that already holds a value.** Look at the field before you ask. If it already holds something when the case reaches it, because the app kept it from an earlier case or screen, or the browser filled it from its saved form data, do not go on with that value. Ask the tester to clear the field and type the value this case needs, which may be the same one, and write `field was pre-filled: <field>, tester cleared and typed` in the run record. Within one case, a value the app carries from one step to the next, such as the Aadhaar number from the OTP request to the OTP check, is the app not asking twice, and stays as it is.

**In a `ui` run (browser or emulator):**

1. Bring the field into view and click it, so the cursor is in it.
2. Stop and say, in one line, what to enter and where:

   ```text
   CRT_ABHA_104: type your Aadhaar number into the "Aadhaar Number" field in the browser window, then reply done.
   CRT_ABHA_105: an OTP has been sent to the Aadhaar linked mobile. Type it into the "Enter OTP" field in the browser, then reply done.
   ```

3. Wait for the tester's reply. Do not ask them to tell you the value; they type it into the screen, so it never passes through you.
4. After `done`, take the snapshot, with that field's value replaced by `[redacted]`, and go on with the next step yourself.
5. No reply, `skip`, or the tester not present: ask once more, naming the field. If the tester says they cannot provide it in this run, record the case `needs-human` with `Needs tester: <the field>, asked at <the step>`, and go to the next case. If they stay silent after the second ask, record the same `needs-human`, with `Needs tester: <the field>, asked at <the step>, no answer after two asks`.

**In an `ft` run (terminal):** prompt in the terminal with input hidden, name what is needed and where it came from ("the OTP sent to the mobile ending 1234"), send it once, and hold it only for that call. Never write it to the run log, the results file or the workbook.

**Never repeat an identity.** Reading a page, a snapshot or a network response puts a person's values in front of you. Never repeat an Aadhaar number, mobile number, ABHA number, ABHA address or a person's name read from a page or a response: not in chat, the run log, Remarks, a command or a file.

| Instead of | Write |
|---|---|
| The tester's own identity | Its last four characters: "ABHA ending 8219", "the mobile ending 1234", "the ABHA address ending r7k2@sbx" |
| Another patient's data, such as a row in the app's patient list | Nothing from it at all. Say "another patient's row" and go on |
| Asking the tester to enter a value | The field's name, never the value: "type the ABHA address into the ABHA Address field" |

**Ask before a case is left untested.** Every input a case needs is asked for in the readiness check, and asked again when the run reaches that case: a second mobile, a mobile that holds no ABHA, an Aadhaar that holds no ABHA, a second ABHA address, a fingerprint or face device, the ABHA app, a counter QR code, a public callback URL. A case is recorded `needs-human` only after the tester has said they cannot provide it in this run, and its Remarks name what was asked, such as `Needs tester: a second ABHA address, asked at readiness and at the case`. Never record such a case `not-run`, and never leave it blank. `not-run` is only for a case that does not apply: the entity type, an optional capability you do not offer, or no published operation for it.

**Never, in any run type:**

| Never | Why |
|---|---|
| Type a made-up, sample or placeholder value, such as `1234 5678 9012`, `999999999999`, `9999999999`, `123456` or `000000` | The sandbox checks Aadhaar and mobile against UIDAI and sends a real OTP. A made-up value fails every case for a reason that is not the integrator's |
| Use an example value from the workbook, a test case page or this skill | Examples show the format, not a person |
| Reuse a value from an earlier case or an earlier run | An OTP is valid once; an identity is the tester's to give each time |
| Generate an OTP, guess one, or read one from a log or an SMS tool | Only the tester enters an OTP |
| Skip the step and carry on | Every later step then tests nothing |
| Mock, stub, intercept or replay a sandbox response, or route the browser's network to a fake | The run then tests the mock, not the integration |
| Run the browser headless | The tester cannot type into it |

### How you know it worked

- At every identity, code or approval step, the run log shows the prompt that was given to the tester and their `done`, or the case is `needs-human`.
- No value from the "Never" table appears in any field the agent typed into: `browser_type` was never called on an identity, document, code or password field.
- No case is `failed` because of a value the agent supplied.
- No Aadhaar number, mobile, ABHA number, ABHA address or name read from a page or a response appears in chat, the run log, Remarks or a command: only last four characters, such as "ABHA ending 8219".
- Every `needs-human` case names in Remarks what the tester was asked for, and no case waiting on a person, device or value is `not-run` or blank.

### When it goes wrong

| Observed | Do |
|---|---|
| You are about to type an Aadhaar number, mobile number, OTP or other identity value yourself | Stop. Click the field and ask the tester to type it, as above |
| The tester asks you to make up a value so the run can go faster | Refuse, and say why in one line: the sandbox needs a real person's values, and a made-up one fails the case |
| You find that a value was typed by the agent, made up or reused, earlier in this run | Stop the run. Every case from that point is void: do not write those results to the workbook, mark them `pending` in the run log with `void: agent entered <value type>`, tell the tester, and run those cases again with the tester entering the value |
| The OTP never arrives | Ask the tester to use the screen's resend option once, then wait. Still nothing: `needs-human` with `Needs tester: OTP not received` |
| The browser is headless or not on the tester's screen | Stop before the first case and ask the tester to restart the Playwright server without `--headless` |
| You are about to repeat an Aadhaar number, mobile, ABHA number, ABHA address or name you read on a page or in a response, in chat, the run log, Remarks, a command or a file | Stop. Write the last four characters only, such as "ABHA ending 8219". If it is another patient's data, write nothing from it |
| A case needs an input the run does not have, such as a second ABHA address or a mobile with no ABHA | Ask the tester for it now, even if it was asked at readiness. Only after they say they cannot provide it in this run, record `needs-human` naming what was asked |
| An identity field already holds a value at the start of a case | The app kept it from an earlier case, or the browser autofilled it. Ask the tester to clear it and type the value for this case; note it in the run record. Never run a case on a value the tester did not enter for it |

From `shared.concept.test-human-entry`.

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

The ids, the mandatory marks and the wording of each check are ABDM's, from the M1 ABHA creation, verification, scan and share set as revised on 21 October 2026. The sections are grouped and ordered as the set groups them, and the cases inside a group follow the set's order. Where the set names an operation, the operation id here is the one in `references/integrate.md`, which carries the host, the headers and a full request. Where the set lists no API for a case and ABDM publishes one, the operation id is named so the case can still be observed.

### CRT_ABHA_101 to 116: create an ABHA by Aadhaar OTP

Applies to every integrator. Mandatory unless marked. This is the group every other creation group repeats with a different authentication step, so it is written in full and the others state only what differs.

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

#### CRT_ABHA_101, the option exists. Mandatory. `sandbox`

Your system offers ABHA creation by Aadhaar OTP, and the journey completes. Drive it end to end through your screen or API.

Calls, in order: `m1_post_v3_enrollment_request_otp_aadhaar_otp`, `m1_post_v3_enrollment_enrol_byaadhaar_otp`, the optional mobile and email verifications, `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp`, `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp`, then `m1_get_v3_profile_account` and `m1_get_v3_profile_account_abha_card`.

Exit condition: three literals, all pasted.

1. `m1_post_v3_enrollment_enrol_byaadhaar_otp` returns 200 with `tokens.token` present and `ABHAProfile.ABHANumber` present.
2. `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp` returns 200 with `healthIdNumber` and `preferredAbhaAddress`.
3. `m1_get_v3_profile_account`, sent with that `X-token`, returns 200 with the same `ABHANumber`.

Nudge: read `message` and `isNew` on step 1. `Account created successfully` with `isNew` `true` is a new account. `This account already exist` with `isNew` `false` is a 200 too, and is not a failure: the Aadhaar already holds an ABHA. Your application must carry on from that response to the profile, the card and the address step, as "An existing ABHA is not a stop" above sets out. Say in the run log that the account existed, and that steps 1 to 3 ran on it.

#### CRT_ABHA_104, an invalid Aadhaar number is refused before any call. Mandatory. `screen`

Enter fewer than 12 digits, more than 12 digits, letters and special characters. Your system refuses each with the message "Aadhaar Number is not valid", and sends nothing. Evidence: the refusal on screen and an empty call log for that attempt. Your own check has to be the strict one here; the sandbox's refusal for a bad number is not the one this case is about. The set recommends showing the Aadhaar number masked once entered. `hiecm.concept.m1-honest-screen-states`

#### CRT_ABHA_102, consent is shown and recorded. Mandatory. `screen`

Your system shows the published ABDM consent text before the Aadhaar number is asked for, and stores that the person agreed, with when. The person agrees with an "I Agree" checkbox or another approved mechanism. Evidence: the consent screen, and the stored record for this run. `hiecm.concept.m1-screen-contract`

#### CRT_ABHA_103, consent in another language. Optional. `screen`

The same consent offered in at least one language other than English. Evidence: the screen in that language. Record `not-run` if you do not claim it.

#### CRT_ABHA_105, the Aadhaar OTP is requested and can be entered. Mandatory. `sandbox`, then `human`

Exit condition: `m1_post_v3_enrollment_request_otp_aadhaar_otp` returns 200 with a `txnId` and a `message` that names the masked mobile. Paste it. Then stop: the OTP arrives on the person's phone and only they enter it. If they are not there, ask again naming the OTP field; only when the tester says they cannot provide it in this run, or stays silent after the second ask, record `needs-human` with what was asked and the txnId, and do not mark the case passed or failed.

Screen checks alongside: the prompt tells the person the OTP went to the mobile linked with Aadhaar and shows the last digits, which the `message` carries. The OTP field accepts only six digits. An incomplete, wrong or expired OTP shows the message the API returned.

#### CRT_ABHA_106, resend OTP. Mandatory. `screen`

The resend control is disabled for 60 seconds after each send and works at most twice. A third attempt shows "Maximum OTP resend attempts reached. Please try again after 30 mins". An OTP counter is visible. Evidence: a recording or timestamped screenshots: disabled at send, enabled after 60 seconds, disabled after the second resend, and the message on the third. A resend that works reuses the `txnId`; a fresh `txnId` is a new request, not a resend.

#### CRT_ABHA_107, the OTP is verified, and a wrong OTP is refused. Mandatory. `sandbox`, `human`

Two observations, both needed.

1. A wrong OTP: `m1_post_v3_enrollment_enrol_byaadhaar_otp` returns 422 with `error.code` `ABDM-1204` and a message naming an invalid Aadhaar OTP value, and your screen shows that error and lets the person retry without re-entering the Aadhaar number.
2. The right OTP: the 200 from CRT_ABHA_101 step 1.

The person enters both OTPs. Stop for each.

#### CRT_ABHA_108, the communication mobile is the Aadhaar mobile. Mandatory. `sandbox`

When the mobile the person gives is the Aadhaar linked one, your system goes on to ABHA creation with no second OTP. Drive that path. Exit condition: the journey reaches the ABHA address step with no `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb` call in the log.

#### CRT_ABHA_109, a different communication mobile is verified. Mandatory. `sandbox`, `human`

Give a mobile that is not the Aadhaar linked one. Exit condition: `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_1b66bb` returns 200 with a `txnId`, the person enters the OTP, and `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_091285` returns 200. A wrong OTP here is refused on screen and the person can retry.

Screen checks alongside: resend as in CRT_ABHA_106. The communication mobile, whether the Aadhaar one or another, is the one the ABHA card shows.

#### CRT_ABHA_112, the ABHA address is suggested and validated. Mandatory for private and government. `sandbox` and `screen`

Optional only for a programme that creates a default address by demographic authentication.

Exit condition: `m1_get_v3_enrollment_enrol_suggestion_create_abha_aadhaar_otp` returns 200 with `abhaAddressList` holding at least three entries, and `m1_post_v3_enrollment_enrol_abha_address_create_abha_aadhaar_otp` returns 200 with `preferredAbhaAddress` equal to the one chosen.

Screen checks: at least three suggestions are shown, and a free field with these rules printed beside it. Each rule shows green when it is met and red when it is not. An address already taken shows "ABHA address already exists." and offers two choices: proceed with the existing address, or create a new one.

```text
length 8 to 18, including @sbx or @abdm
letters, digits, or both
at most one dot and at most one underscore, neither first nor last
```

#### CRT_ABHA_113, the ABHA number is displayed. Mandatory. `screen`

The 14 digit ABHA number and the ABHA address from CRT_ABHA_112 are shown together with the profile after creation. Evidence: the screen, with the number matching `healthIdNumber` from the pasted response.

#### CRT_ABHA_114, the ABHA card can be viewed and downloaded. Mandatory for private. `sandbox` and `screen`

For an integrator that shows the ABHA card. Exit condition: `m1_get_v3_profile_account_abha_card` returns 200 with content type `image/png`, sent with the `X-token` from creation. Screen check: the card is shown as the API returned it, with the demographic details it carries, and can be downloaded. A non-KYC ABHA address cannot download a card; the details have to be KYC verified first.

#### CRT_ABHA_115, your own card carries the ABHA details. Mandatory for government, either this or CRT_ABHA_114. `screen`

For an integrator that prints its own programme or scheme card instead. A government integrator passes one of CRT_ABHA_114 and CRT_ABHA_115. The card shows the ABHA number and the ABHA address, both required, and your system stores both against your own patient id. Evidence: the card and the stored record.

#### CRT_ABHA_116, a returning patient is matched, not registered again. Mandatory. `screen`

After a creation or a verification, your system searches its own records by mobile, name, gender and age, and by your own beneficiary id such as an MRD or UHID number when one is given. A full match links this visit to the existing beneficiary id. A mismatch in any critical demographic field creates a new one. Evidence: run the same person twice; the second visit is linked to the first beneficiary id and your database holds one row. `hiecm.concept.m1-avoiding-duplicate-abha`

### CRT_ABHA_101_FA to 117_FA: create an ABHA by Aadhaar face authentication

Applies to every integrator. Optional, every case. The set lists no API for this group. ABDM publishes the face authentication creation flow, so the operation ids below are the ones that observe it. `hiecm.flow.m1-create-abha-face-auth`

Face authentication is a `human` step on a device. The person scans a QR code from your screen with the ABHA app, logged out, and captures their face in the ABHA Face RD app on their phone. Ask for that phone and that person at readiness and again at each case. Without them, record every case from CRT_ABHA_106_FA on that you claim as `needs-human`, naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`, because the whole group is optional.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. A person present with their Aadhaar number and a phone with the ABHA app installed and logged out. Their Aadhaar number searched first on the login path and not found.

#### CRT_ABHA_101_FA, the face authentication option exists. Optional. `screen`

Your ABHA creation screen offers face authentication as a way to authenticate the Aadhaar number. Evidence: the screen with the option.

#### CRT_ABHA_102_FA, an invalid Aadhaar number is refused before a QR code. Optional. `screen`

As CRT_ABHA_104, with blank input as well. No QR code is generated for an invalid number, so no `m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33` call is in the log for that attempt.

#### CRT_ABHA_103_FA, consent comes before the QR code. Optional. `screen`

As CRT_ABHA_102. Your system does not generate the face authentication QR code until consent is recorded. Evidence: the consent screen, the stored record, and no init call before it in the log. `hiecm.concept.m1-screen-contract`

#### CRT_ABHA_104_FA, consent in another language. Optional. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_105_FA, the face authentication QR code is generated. Optional. `sandbox` and `screen`

After the Aadhaar number and consent, your system generates a transaction and shows it as a QR code.

Exit condition: `m1_post_v3_enrollment_enrol_auth_init_create_abha_face_au_4dea33` returns 200 with a `txnId`. Screen check: the QR code is shown clearly, and the person is told to scan it with the scanner on the logged out ABHA app's landing page.

#### CRT_ABHA_106_FA, the QR code is scanned in the ABHA app. Optional. `human`

The person opens the ABHA app logged out, taps the scanner at the top left of the landing page, and scans your QR code. The ABHA app starts face authentication and opens the ABHA Face RD app. No call of yours proves the scan. Evidence: the phone screen after the scan, and the `status` from `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` pasted at that moment.

#### CRT_ABHA_107_FA, the ABHA Face RD app is not installed. Optional. `human`

On a phone without the ABHA Face RD app, the scan sends the person to the Play Store or App Store to install it, and they can then continue or restart. This is the ABHA app's behaviour, not your system's. Evidence: the phone screen at the store. If you claim the case and no such phone is available, record `needs-human` naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run.

#### CRT_ABHA_108_FA, face authentication succeeds. Optional. `sandbox`, `human`

The person captures their face. Poll the status every 5 to 10 seconds while they do.

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` returns 200 with `status` `COMPLETE`. Screen check: the phone shows success, and your system moves on to the communication mobile step.

#### CRT_ABHA_109_FA, a failed face authentication is refused. Optional. `sandbox`, `human`

The person does a scan that fails: another face, a poor capture, or a timeout.

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_create_abha_face_a_417d5e` returns 200 with `status` `FAILED` and a `message`. Your screen shows that message, does not go on to the mobile step or creation, and lets the person retry or generate a new QR code.

#### CRT_ABHA_110_FA, the communication mobile is collected after face authentication. Optional. `sandbox`, `human`

Your system asks for the communication mobile after face authentication, checks its format, and sends an OTP to it. The set asks for the OTP whether or not this is the Aadhaar linked mobile.

Exit condition: two literals, both pasted.

1. `m1_post_v3_enrollment_enrol_byaadhaar_face`, sent with the `txnId` from CRT_ABHA_108_FA and that mobile, returns 200 with `tokens.token` present and `ABHAProfile.ABHANumber` present.
2. `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_6474ce` returns 200 with a `txnId` and a `message` naming the masked mobile.

#### CRT_ABHA_111_FA, the communication mobile OTP is verified. Optional. `sandbox`, `human`

Two observations, both needed. The person enters both OTPs. Stop for each.

1. A wrong OTP: `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_b555fb` returns 400 with `description` naming an invalid OTP value, and your screen shows that error.
2. The right OTP: the same call returns 200 with `authResult` `success`.

Screen check: the OTP field accepts only six digits.

#### CRT_ABHA_112_FA, resend the communication mobile OTP. Optional. `screen`

As CRT_ABHA_106, for the communication mobile OTP.

#### CRT_ABHA_113_FA, the ABHA address is suggested and validated. Optional. `sandbox` and `screen`

As CRT_ABHA_112, with the face flow's calls. Exit condition: `m1_get_v3_enrollment_enrol_suggestion_create_abha_face_au_848b26` returns 200 with `abhaAddressList` holding at least three entries, and `m1_post_v3_enrollment_enrol_abha_address_create_abha_face_4b1f33` returns 200 with `preferredAbhaAddress` equal to the one chosen.

#### CRT_ABHA_114_FA, the ABHA number is displayed. Optional. `sandbox` and `screen`

As CRT_ABHA_113. Exit condition: `m1_get_v3_profile_account`, sent with the `X-token` from CRT_ABHA_110_FA, returns 200 with the same `ABHANumber` and a masked `mobile` ending in the digits of the mobile verified in CRT_ABHA_111_FA.

#### CRT_ABHA_115_FA, the ABHA card can be viewed and downloaded. Optional. `sandbox` and `screen`

As CRT_ABHA_114.

#### CRT_ABHA_116_FA, your own card carries the ABHA details. Optional. `screen`

As CRT_ABHA_115.

#### CRT_ABHA_117_FA, a returning patient is matched, not registered again. Optional. `screen`

As CRT_ABHA_116, for a person created by face authentication.

### CRT_ABHA_201 to 211: create an ABHA by Aadhaar biometric, fingerprint or iris

Applies to every integrator. Optional, every case. Each case runs as its counterpart in CRT_ABHA_101 to 116 and records the counterpart's evidence, with the differences stated.

The creation call is `m1_post_v3_enrollment_enrol_byaadhaar_fingerprint` or `m1_post_v3_enrollment_enrol_byaadhaar_iris`. The calls after it are the same flow's: for fingerprint `m1_post_v3_enrollment_request_otp_mobile_verify_create_ab_64b04e`, `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_ab_3b237a`, `m1_get_v3_enrollment_enrol_suggestion_create_abha_fingerprint` and `m1_post_v3_enrollment_enrol_abha_address_create_abha_fingerprint`; for iris `m1_post_v3_enrollment_request_otp_mobile_verify_create_abha_iris`, `m1_post_v3_enrollment_auth_byabdm_mobile_verify_create_abha_iris`, `m1_get_v3_enrollment_enrol_suggestion_create_abha_iris` and `m1_post_v3_enrollment_enrol_abha_address_create_abha_iris`.

If you do not claim biometric creation, the whole group is `not-run`. If you claim it and no registered fingerprint or iris device is at hand, record each case that scans as `needs-human`, naming the device, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run.

Loop limit: 3 passes per test case.

#### CRT_ABHA_201, the option exists. Optional. `sandbox`

As CRT_ABHA_101, with the creation call above. Exit condition: it returns 200 with `tokens.token` and `ABHAProfile.ABHANumber`.

#### CRT_ABHA_204, an invalid Aadhaar number is refused before any call. Optional. `screen`

As CRT_ABHA_104.

#### CRT_ABHA_202, consent is shown and recorded. Optional. `screen`

As CRT_ABHA_102.

#### CRT_ABHA_203, consent in another language. Optional. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_205, the biometric is verified, and a failed scan is refused. Optional. `sandbox`, `human`

The person scans a fingerprint or an iris. Exit condition: the creation call returns 200 as in CRT_ABHA_201. For a failed scan, the specification documents a 422 with `error.code` `ABDM-1204` and a `message` carrying the UIDAI error code. Your screen shows the message the API returned and lets the person scan again. Paste what the sandbox returned.

#### CRT_ABHA_206, the communication mobile is the Aadhaar mobile. Optional. `sandbox`

As CRT_ABHA_108, with the mobile verify call of the flow you ran.

#### CRT_ABHA_207, a different communication mobile is verified. Optional. `sandbox`, `human`

As CRT_ABHA_109, with the mobile verify calls of the flow you ran.

#### CRT_ABHA_208, the ABHA address is suggested and validated. Optional. `sandbox` and `screen`

As CRT_ABHA_112, with the suggestion and address calls of the flow you ran.

#### CRT_ABHA_209, the ABHA number is displayed. Optional. `screen`

As CRT_ABHA_113.

#### CRT_ABHA_210, the ABHA card can be viewed and downloaded. Optional. `sandbox` and `screen`

As CRT_ABHA_114.

#### CRT_ABHA_211, your own card carries the ABHA details. Optional. `screen`

As CRT_ABHA_115.

### CRT_ABHA_301 to 309: create an ABHA by demographic authentication

Government entities only. Mandatory for them unless marked. A private integrator records the group `not-run`.

Loop limit: 3 passes per test case.

#### CRT_ABHA_301, the option exists. Mandatory. `screen`

Your landing or registration screen offers "Create ABHA using Demographics", and it starts the demographic flow. Evidence: the screen with the option and the screen it opens.

#### CRT_ABHA_302, consent is shown and recorded. Mandatory. `screen`

As CRT_ABHA_102.

#### CRT_ABHA_303, consent in another language. Optional. `screen`

As CRT_ABHA_103.

#### CRT_ABHA_304, an invalid Aadhaar number is refused before any call. Mandatory. `screen`

As CRT_ABHA_104.

#### CRT_ABHA_305, the demographic details are checked against Aadhaar. Mandatory. `sandbox`

One call, `m1_post_v3_enrollment_enrol_byaadhaar_demo_auth_create_ab_81107d`, with the name, date of birth, gender, Aadhaar number and mobile as they read on the Aadhaar card. Exit condition: 200 with `healthIdNumber`, `healthId` and `kycVerified` `true`.

Then the mismatch: send the same call with the date of birth changed. Exit condition: 422 with `error.code` `ABDM-1207` and a message that the information does not match the details on record with Aadhaar, and your screen says so without creating anything. Both observations, both pasted.

Screen check: name, date of birth and gender are filled and not editable; address, email, mobile, state, district and profile photo stay editable.

Nudge: the same mobile on a seventh account is refused with ABDM-1124. That is a mobile limit, not a demographic mismatch. Read `error.message`.

#### CRT_ABHA_306, the profile is completed from the response, not typed. Mandatory. `screen`

Your system fills name, date of birth, gender, Aadhaar number, mobile, address, state, district and ABHA number from the response. Name, date of birth and gender are not editable. Address, email, mobile, state, district and profile photo are editable. The person completes the rest and submits without an error. Evidence: the form after creation and after submission. `hiecm.concept.m1-confirm-the-filled-form`

#### CRT_ABHA_307, the ABHA number is displayed. Mandatory. `screen`

As CRT_ABHA_113, matching `healthIdNumber` and `healthId` from CRT_ABHA_305.

#### CRT_ABHA_308, the ABHA card can be viewed. Mandatory. `sandbox` and `screen`

As CRT_ABHA_114, sent with the `token` from CRT_ABHA_305 as `X-token`. The card carries the ABHA number, the QR code, date of birth, gender and the ABHA address. The photo is optional. The 21 October set marks this case Mandatory, and CRT_ABHA_309 as its alternative for government. The set published on the sandbox site marks it Mandatory for Private, the same pattern as CRT_ABHA_114 and 115, and that is how it is read: mandatory for a private integrator; for a government one, either this case or CRT_ABHA_309.

#### CRT_ABHA_309, your own card carries the ABHA details. Mandatory for government, either this or CRT_ABHA_308. `screen`

As CRT_ABHA_115.

### CRT_ABHA_401 to 411: create an ABHA by driving licence

Optional for private and for government. The set names `/abha/api/v3/enrollment/enrol/byDocument` for every case in this group. ABDM's M1 specification does not publish that operation, so there is no operation id to call. Record every case in this group `not-run` with that reason, until an operation is published. Do not improvise a call. Each heading names the evidence the case will need once an operation exists.

Loop limit: 3 passes per test case.

#### CRT_ABHA_401, the option exists. Optional. `screen`

The set checks that your system offers creation by driving licence.

#### CRT_ABHA_402, consent is shown and recorded. Optional. `screen`

The set checks consent for sharing the driving licence details, as CRT_ABHA_102.

#### CRT_ABHA_403, the communication mobile is collected. Optional. `screen`

#### CRT_ABHA_404, the mobile is verified by OTP. Optional. `sandbox`, `human`

#### CRT_ABHA_405, the driving licence is verified. Optional. `sandbox`

The set describes an enrolment number returned after the licence, name, date of birth and gender are checked, which the person takes to an ABDM facility.

#### CRT_ABHA_406, the licence front and back are uploaded. Optional. `screen`

#### CRT_ABHA_407, an operator checks the documents and approves or rejects. Optional. `human`

#### CRT_ABHA_408, the ABHA number is displayed. Optional. `screen`

#### CRT_ABHA_410, the ABHA card can be viewed. Optional. `sandbox` and `screen`

#### CRT_ABHA_411, your own card carries the ABHA details. Optional. `screen`

### VRFY_ABHA_101 and 201: log in with an ABHA number

Applies to every integrator. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A person present with an ABHA, the Aadhaar linked mobile and the ABHA linked mobile.

#### VRFY_ABHA_101, by ABHA number and Aadhaar OTP. Mandatory. `sandbox`, `human`

Calls: `m1_post_v3_profile_login_request_otp_abha_number_aadhaar_otp`, the OTP, `m1_post_v3_profile_login_verify_abha_number_aadhaar_otp`, then `m1_get_v3_profile_account` with the returned token as `X-token`.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts[0].ABHANumber`, and the profile call returns 200 with the same `ABHANumber`. A wrong OTP returns 400 with `otpValue` naming an invalid OTP value, and your screen says the verification failed.

Screen checks alongside: resend as in CRT_ABHA_106; name, date of birth and gender shown not editable, and address, email, mobile, state, district and city editable; the profile stored against your own patient id after verification. When the mobile in your own record differs from the ABHA one, your system offers a Yes or No choice to update the ABHA mobile, which PROF_ABHA_601 runs.

Nudge: the accounts array already carries the whole registration form. Fill the form from it before the profile call, so the person reads back rather than types.

#### VRFY_ABHA_201, by ABHA number and the ABHA linked mobile OTP. Mandatory. `sandbox`, `human`

As VRFY_ABHA_101 with `m1_post_v3_profile_login_request_otp_abha_number_abha_otp` and `m1_post_v3_profile_login_verify_abha_number_abha_otp`. Same exit condition, same screen checks.

### VRFY_ABHA_102 and 202: log in with an ABHA address

Applies to every integrator. Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A person present with an ABHA address, the Aadhaar linked mobile and the ABHA linked mobile.

#### VRFY_ABHA_102, by ABHA address and Aadhaar OTP. Mandatory. `sandbox`, `human`

Calls: `m1_post_v3_phr_web_login_abha_search_abha_address_login_a_de8184`, `m1_post_v3_phr_web_login_abha_request_otp_aadhaar_otp`, the OTP, `m1_post_v3_phr_web_login_abha_verify_aadhaar_otp`, then `m1_get_v3_phr_web_login_profile_abha_profile_abha_address_c04e83`.

Exit condition: the search returns 200 with `authMethods`, the verify returns 200 with a token, and the profile call returns 200 carrying the ABHA number and the address searched for. Paste all three.

Screen checks alongside: the ways to log in that your screen offers are the ones `authMethods` returned, not a fixed list. Resend, the not editable fields, the stored record and the mobile update offer as in VRFY_ABHA_101.

#### VRFY_ABHA_202, by ABHA address and the ABHA linked mobile OTP. Mandatory. `sandbox`, `human`

As VRFY_ABHA_102 with `m1_post_v3_phr_web_login_abha_search_abha_address_login_m_27a20f`, `m1_post_v3_phr_web_login_abha_request_otp_mobile_otp`, `m1_post_v3_phr_web_login_abha_verify_mobile_otp` and `m1_get_v3_phr_web_login_profile_abha_profile_abha_address_b038c4`. Same exit condition, same screen checks.

### VRFY_ABHA_301 to 308: find an ABHA by the communication mobile and OTP

Applies to every integrator. Mandatory. This is the lookup that costs no Aadhaar OTP, so it is the one your desk should run first.

Calls, in order: `m1_post_v3_profile_account_abha_search_find_abha_mobile_otp`, `m1_post_v3_profile_login_request_otp_find_abha_mobile` with the chosen account's `index` and the search `txnId`, the OTP, `m1_post_v3_profile_login_verify_find_abha_mobile`, then `m1_get_v3_profile_account` with the returned `token` as `X-token`. `hiecm.flow.m1-find-abha`

Loop limit: 3 passes per test case.

#### VRFY_ABHA_301, an invalid mobile is refused. Mandatory. `screen`

Fewer than ten digits, more than ten, letters, special characters and blank input are each refused on screen with "Please enter a valid mobile number.", and no search is sent.

#### VRFY_ABHA_302, every ABHA on this mobile is listed. Mandatory. `sandbox` and `screen`

Exit condition: the search returns 200 with a top level array. `[0].txnId` is present, and `[0].ABHA[]` holds the accounts, each entry carrying `index`, `ABHANumber` and `name`. Paste it.

The specification also carries a saved example without the `ABHA` array, an object with `txnId` and `message`, marked for confirmation with NHA. A run that sees that shape pastes it and records the difference in the run log.

Screen checks: every account in the array is listed, with enough to tell them apart, such as the masked ABHA number and the name. No OTP is requested before the person picks one.

Nudge: read the array as plural. One mobile can hold up to six accounts, and a screen that shows the first one silently links the wrong person.

#### VRFY_ABHA_303, no ABHA on this mobile. Mandatory. `sandbox`

Exit condition: the search returns 404 with `error.code` `ABDM-1114`. Your screen says "ABHA details not found. We did not find any ABHA number linked to this mobile number. Please use an ABHA-linked mobile number.", and opens no OTP screen. If your business flow supports creation, the screen also offers to create a new ABHA. `hiecm.concept.m1-journey-completes-without-abha`

#### VRFY_ABHA_304, the chosen ABHA gets the OTP. Mandatory. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_request_otp_find_abha_mobile` returns 200 with a `txnId` and a `message` naming the masked mobile, sent only after the person picked an account. Screen checks: the OTP screen opens, the chosen account stays selected until verification, and resend works as in CRT_ABHA_106.

#### VRFY_ABHA_305, the OTP is verified and the chosen ABHA opens. Mandatory. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_find_abha_mobile` returns 200 with `authResult` `success`, `token`, and `accounts` holding the chosen `ABHANumber`; the profile call returns 200 with that `ABHANumber`. Screen check: only the chosen profile is shown, with name, date of birth or age, gender, mobile, ABHA number, ABHA address, state, district, photo and address as the API returned them.

#### VRFY_ABHA_306, the registration form is filled from the profile. Mandatory. `screen`

After VRFY_ABHA_305, your registration or linking form is filled from the profile. Name, date of birth or age and gender are not editable. Address, email, mobile, state, district and city are editable. After registration, the ABHA number and ABHA address are linked to your beneficiary id. Evidence: the form, and the stored link. `hiecm.concept.m1-confirm-the-filled-form`

#### VRFY_ABHA_307, a wrong OTP is refused. Mandatory. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_find_abha_mobile` returns 400 with `otpValue` naming an invalid OTP value. Your screen shows an error such as "Invalid OTP. Please enter a valid OTP.", opens no profile, and allows a retry without re-entering the mobile.

#### VRFY_ABHA_308, the chosen ABHA is already linked in your system. Mandatory. `screen`

Pick an account already linked to one of your patients. After VRFY_ABHA_305 your screen says "This ABHA profile is already linked to HMIS Beneficiary ID.", shows the ABHA details and your stored details side by side, and creates no second registration. Evidence: the screen and one row in your database. `hiecm.concept.m1-avoiding-duplicate-abha`

### VRFY_ABHA_301_FA to 309_FA: find an ABHA by the communication mobile and face authentication

Optional, every case. The set lists no API for this group. ABDM publishes the find by face flow: `m1_post_v3_profile_account_abha_search_find_abha_face`, `m1_post_v3_profile_login_request_otp_find_abha_face` with the chosen account's `index` and the search `txnId`, `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` polled every 5 to 10 seconds, then `m1_post_v3_profile_login_verify_find_abha_face`. `hiecm.flow.m1-find-abha`

Face authentication is a `human` step on a device, as in CRT_ABHA_101_FA to 117_FA. Without a phone with the ABHA app and the person, record every case from VRFY_ABHA_305_FA on that you claim as `needs-human`, naming what was asked, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_301_FA, an invalid mobile is refused. Optional. `screen`

As VRFY_ABHA_301. No search and no QR code follow an invalid mobile.

#### VRFY_ABHA_302_FA, every ABHA on this mobile is listed. Optional. `sandbox` and `screen`

As VRFY_ABHA_302, with `m1_post_v3_profile_account_abha_search_find_abha_face`. No QR code is generated before the person picks an account.

#### VRFY_ABHA_303_FA, no ABHA on this mobile. Optional. `sandbox`

As VRFY_ABHA_303, with `m1_post_v3_profile_account_abha_search_find_abha_face`. No QR code is generated.

#### VRFY_ABHA_304_FA, the chosen ABHA gets a face authentication QR code. Optional. `sandbox` and `screen`

Exit condition: `m1_post_v3_profile_login_request_otp_find_abha_face` returns 200 with a `txnId`, sent only after the person picked an account. Screen check: the QR code is shown clearly for scanning, and the chosen account stays selected until authentication ends.

#### VRFY_ABHA_305_FA, the QR code is scanned in the ABHA app. Optional. `human`

As CRT_ABHA_106_FA, with the `status` from `m1_post_v3_enrollment_enrol_capturepid_find_abha_face`.

#### VRFY_ABHA_306_FA, the ABHA Face RD app is not installed. Optional. `human`

As CRT_ABHA_107_FA.

#### VRFY_ABHA_307_FA, face authentication succeeds. Optional. `sandbox`, `human`

Exit condition: `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` returns 200 with `status` `COMPLETE`, then `m1_post_v3_profile_login_verify_find_abha_face` returns 200 with `authResult` `success`. Screen check: the phone shows success.

#### VRFY_ABHA_308_FA, the chosen ABHA opens. Optional. `sandbox` and `screen`

Exit condition: the verify in VRFY_ABHA_307_FA carries `accounts` with the chosen account's `ABHANumber`, and `m1_get_v3_profile_account`, sent with the returned `token` as `X-token`, returns 200 with that `ABHANumber`. Screen check: as VRFY_ABHA_305. No other account's details are shown.

#### VRFY_ABHA_309_FA, a failed face authentication is refused. Optional. `sandbox`, `human`

The person does a scan that fails. Exit condition: one of the two refusals the specification documents, pasted. `m1_post_v3_enrollment_enrol_capturepid_find_abha_face` returns 200 with `status` `FAILED`, or `m1_post_v3_profile_login_verify_find_abha_face` returns 422 with `error.code` `ABDM-1204` and a `message` carrying the UIDAI error code. Your screen shows the code and message the API returned, fills no profile, and lets the person retry or generate a new QR code.

### VRFY_ABHA_601 to 603: find an ABHA by the communication mobile and a biometric

Optional, every case. The set names `/abha/api/v3/profile/account/abha/search`, `/abha/api/v3/profile/login/request/otp` and a verify path on the production host. Run the sandbox operations of the published find by fingerprint flow instead: `m1_post_v3_profile_account_abha_search_find_abha_fingerprint`, `m1_post_v3_profile_login_request_otp_find_abha_fingerprint` and `m1_post_v3_profile_login_verify_find_abha_fingerprint`. For iris, `m1_post_v3_profile_account_abha_search_find_abha_iris`, `m1_post_v3_profile_login_request_otp_find_abha_iris` and `m1_post_v3_profile_login_verify_find_abha_iris`. `hiecm.flow.m1-find-abha`

Without a registered fingerprint or iris device, the cases that scan and that you claim are `needs-human`, naming the device, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_601, an invalid mobile is refused. Optional. `screen`

As VRFY_ABHA_301. No biometric step starts.

#### VRFY_ABHA_602, no ABHA on this mobile. Optional. `sandbox`

As VRFY_ABHA_303, with the search operation of the flow you ran.

#### VRFY_ABHA_603, the chosen ABHA is verified by biometric. Optional. `sandbox`, `human`

The search lists the accounts as in VRFY_ABHA_302, the person picks one, the request call returns 200 with a `txnId`, and the person scans.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts` holding the chosen `ABHANumber`. Screen checks: the profile is shown with name, age, gender, mobile, ABHA number, ABHA address, state and district; an account already linked in your system says so, as in VRFY_ABHA_308, and one not yet linked can be registered and linked; the card can be downloaded as in CRT_ABHA_114 where the account is KYC verified.

### VRFY_ABHA_701: benefit programmes linked to an ABHA number

Government entities only. Optional. A private integrator records it `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_701, the benefit programmes are listed. Optional. `sandbox`

Call `m1_get_v3_profile_benefit_abha_abhanumber` with a valid ABHA number. Exit condition: 200 with `abhaNumber` equal to the one sent and a `programme` array, each entry carrying `benefitName`. Screen check: your system shows the list.

### VRFY_ABHA_401 to 405: log in with an Aadhaar number and OTP

Applies to every integrator. Mandatory.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_401, an invalid Aadhaar is refused. Mandatory. `screen`

As CRT_ABHA_104, on the login screen. The message may read "Invalid LoginId" or "Aadhaar Number is not valid". The set recommends the masked format and the current consent text here too.

#### VRFY_ABHA_402, a wrong OTP is refused. Mandatory. `sandbox`, `human`

Exit condition: `m1_post_v3_profile_login_verify_aadhaar_otp` returns 400 with `otpValue` naming an invalid OTP value, and your screen shows an error and goes no further.

#### VRFY_ABHA_403, no ABHA on this Aadhaar. Mandatory. `sandbox`, `human`

Calls: `m1_post_v3_profile_login_request_otp_aadhaar`, the OTP, `m1_post_v3_profile_login_verify_aadhaar_otp`.

Exit condition: the request returns 200 with a `message` naming the masked Aadhaar mobile, the person enters the OTP, and the verify returns 404 with `error.code` `ABDM-1114` and a message that no ABHA user is registered with this Aadhaar number. Your screen says so and offers creation, and the creation path does not ask for the Aadhaar number again. `hiecm.concept.m1-never-ask-twice`

#### VRFY_ABHA_404, an ABHA exists on this Aadhaar. Mandatory. `sandbox`, `human`

Same calls with an Aadhaar that holds an account, then `m1_get_v3_profile_account`.

Exit condition: the verify returns 200 with `authResult` `success` and `accounts[0].ABHANumber`; the profile call returns 200 with the same number. Screen checks: the profile is shown, the card can be downloaded as in CRT_ABHA_114 where the account is KYC verified, and the account is registered and linked to your patient id if it was not already.

#### VRFY_ABHA_405, resend OTP. Mandatory. `screen`

As CRT_ABHA_106, on the login screen.

### VRFY_ABHA_801 to 804: log in with an Aadhaar number and a biometric

Optional, every case. The set names `/abha/api/v3/profile/login/request/otp` and `/abha/api/v3/profile/login/verify`. In the published specification the fingerprint use of those two paths takes an ABHA number, not an Aadhaar number. The login that takes an encrypted Aadhaar number with a biometric is `m1_post_v3_1_profile_login_verify_fingerprint`, or `m1_post_v3_1_profile_login_verify_iris`, one call each. Run that, and say in the run log that it is the v3.1 call.

Without a registered fingerprint or iris device, the cases that scan and that you claim are `needs-human`, naming the device, after it was asked for at readiness and again at the case, and the tester said they cannot provide it in this run. A case you do not claim is `not-run`.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_801, an invalid Aadhaar is refused. Optional. `screen`

As VRFY_ABHA_401.

#### VRFY_ABHA_802, the biometric is verified, and a failed scan is refused. Optional. `sandbox`, `human`

Exit condition: the v3.1 call returns 200 with `authResult` `success` and `token`. A failed scan is refused with the error the API returned; your screen shows it and lets the person scan again. Paste what the sandbox returned.

#### VRFY_ABHA_803, no ABHA on this Aadhaar. Optional. `sandbox`, `human`

Exit condition: the v3.1 call returns 404 with `error.code` `ABDM-1114`. Your screen says no ABHA user is registered with this Aadhaar number and offers creation, as in VRFY_ABHA_403.

#### VRFY_ABHA_804, an ABHA exists on this Aadhaar. Optional. `sandbox`, `human`

As VRFY_ABHA_404, with the v3.1 call in place of the OTP verify: 200 with `accounts[0].ABHANumber`, then `m1_get_v3_profile_account` with the returned `token` as `X-token`, 200 with the same number.

### PROF_ABHA_601: profile update

Applies to every integrator. Optional.

Loop limit: 3 passes per test case.

#### PROF_ABHA_601, the mobile is updated. Optional. `sandbox`, `human`

Calls: `m1_post_v3_profile_account_request_otp_update_mobile`, the OTP, `m1_post_v3_profile_account_verify_update_mobile`. The person enters the OTP on the new mobile, and the password or OTP on the old one when asked. Stop for each.

Exit condition: the verify returns 200 with `authResult` `success` and a message that the mobile number was linked; `m1_get_v3_profile_account` then shows the new masked `mobile`.

### VRFY_ABHA_501: read the ABHA QR code

Applies to every integrator. Optional.

Loop limit: 3 passes per test case.

#### VRFY_ABHA_501, the ABHA QR code fills registration. Optional. `screen`

No call. Your system scans a person's ABHA QR code and fills name, date of birth, gender, mobile and the other details into registration from it. Evidence: the filled form after a scan, with nothing typed. `hiecm.concept.m1-two-routes-to-the-profile`

### TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER: one ABHA per patient id

Applies to every integrator. Mandatory.

Loop limit: 3 passes per test case.

#### TAGGING_UNIQUEPATIENTID_UNIQUEABHANUMBER, one ABHA maps to one patient id. Mandatory. `screen`

Your system checks whether an ABHA number already exists in its database before it creates a patient id, on both the creation and the verification paths. Not yet linked, it tags the ABHA to the patient id. Already linked, it creates no new patient id. So one ABHA never maps to two of your patients and one of your patients never holds two ABHAs.

Evidence: verify the same ABHA twice in a run. The second time, the screen says the record is already linked and names your patient id, and the database holds one row. `hiecm.concept.m1-avoiding-duplicate-abha`

### SHARE_PATIENT_PROFILE_701 and 702: share a profile by scanning the facility QR

Mandatory. The set marks this group for the PHR app, but the call that proves each case lands on your HIP. The person acts in the ABDM sandbox PHR app. Your system receives the share and answers it with a queue token. Both operations are in the scan and register specification.

Calls: the inbound `scan-and-register_post_v3_hip_patient_share` at your callback URL, which your system answers with HTTP 200. Then your `scan-and-register_post_patient_share_v3_on_share`, which returns 202.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. Your callback URL registered with the bridge and reachable from the internet. A facility QR code for one of your counters, and for SHARE_PATIENT_PROFILE_702 a second QR code for a different counter. The person present with the ABDM sandbox PHR app, an ABHA number, and a second ABHA address on that ABHA number for SHARE_PATIENT_PROFILE_702.

#### SHARE_PATIENT_PROFILE_701, the profile is shared and the patient registered. Mandatory. `sandbox`, `human` and `screen`

Use a person your system has not registered. The person logs in to the PHR app, scans your facility QR code, taps "Get Token", reads their profile and the consent message, and taps "I Agree". Stop for that.

Exit condition: three observations, all pasted.

1. An inbound POST arrives at your URL for `scan-and-register_post_v3_hip_patient_share` with `intent` `PROFILE_SHARE`, `metaData.hipId` equal to your HIP id, `metaData.context` equal to the counter id of the QR code scanned, and `profile.patient.abhaAddress`, `profile.patient.name`, `profile.patient.gender` and `profile.patient.yearOfBirth` present. Your system answers it with HTTP 200. Paste the body in full, with `profile.patient.phoneNumber` masked.
2. Your `scan-and-register_post_patient_share_v3_on_share` returns 202. It was sent with `acknowledgement.status` `SUCCESS`, `acknowledgement.abhaAddress` equal to `profile.patient.abhaAddress`, `acknowledgement.profile.context` equal to `metaData.context`, `acknowledgement.profile.tokenNumber` and `acknowledgement.profile.expiry` present, and `response.requestId` equal to the share's `REQUEST-ID`. Paste the body you sent.
3. Human: the PHR app shows the token number you sent. The set says the token is valid for 60 minutes.

Screen check: your system registered the person from the shared details with nothing typed. A new beneficiary id holds the ABHA number, ABHA address, name, gender, date of birth, mobile and address as `profile.patient` carried them. Evidence: the stored record for this run.

Nudge: answer the inbound share with 200 first. Register the person and send the on-share after that.

#### SHARE_PATIENT_PROFILE_702, a returning patient is matched. Mandatory. `sandbox`, `human` and `screen`

Runs after SHARE_PATIENT_PROFILE_701, with the same person. Each step below is a fresh scan: the person scans, taps "Get Token" and taps "I Agree". Stop for each. Every scan must show observations 1 and 2 of SHARE_PATIENT_PROFILE_701, pasted, for the QR code scanned in that step.

Your system matches on name, mobile, gender, ABHA number and ABHA address. A person with no match is a new registration, which SHARE_PATIENT_PROFILE_701 already observed.

Exit condition: four steps, each with its share and on-share pasted and its screen check attested.

1. A revisit. Close the queue entry from SHARE_PATIENT_PROFILE_701 in your system, then the person scans the same QR code with the same ABHA address. The share carries the same `profile.patient.abhaNumber` and `profile.patient.abhaAddress`. Screen: your system reuses the beneficiary id from SHARE_PATIENT_PROFILE_701, creates the care context under it, and still holds one row for the person.
2. Another ABHA address. The person scans with their second ABHA address. The share carries the same `profile.patient.abhaNumber` and a different `profile.patient.abhaAddress`. Your on-share carries the new address in `acknowledgement.abhaAddress`. Screen: your system updates the ABHA address on the existing beneficiary id and creates no new one. Evidence: the record before and after, one row.
3. A repeat scan while a queue entry is active. Straight after step 2, the person scans the same QR code with the same ABHA address as step 2. The share carries the same `metaData.context`. Screen: your system creates no new queue entry, and the existing queue association is unchanged. A new token number is issued only if your queue rules issue one. Evidence: the queue for that counter before and after, with one entry for the person.
4. A different counter. The person scans the second QR code. The share carries a `metaData.context` different from step 3, and your on-share carries that context in `acknowledgement.profile.context` with an `acknowledgement.profile.tokenNumber` for that queue. Screen: your system creates a new queue entry on that counter, with the same beneficiary id and patient details. Evidence: both queues.

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
   - Web: `browser_navigate`, `browser_click`, `browser_type`, reading `browser_snapshot` before each action to find the element. `browser_type` is for fields that hold no person's value, such as a search term or a free text note. Every identity, document, code or password field is the tester's, as the rule at the top of this skill sets out.
   - PHR app: write the steps as Maestro flows at `abdm-ft/maestro/<case id>-<n>.yaml` and run each with `maestro test`. A flow ends at the field before any identity, code or approval step, the tester types it on the emulator or phone, and the next flow starts after it.
3. After step `n`, save one screenshot and the screen's text:

   | Surface | Screenshot | Screen text |
   |---|---|---|
   | Web | `browser_take_screenshot` with `filename` `abdm-ft/evidence/<case id>/<n>.png`. The server resolves that name against its workspace root, which need not be your repository, so save or move the file to `abdm-ft/evidence/<case id>/<n>.png` and check that the file exists there | `browser_snapshot` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |
   | PHR app | `- takeScreenshot: abdm-ft/evidence/<case id>/<n>` in the flow | `maestro hierarchy` output saved to `abdm-ft/evidence/<case id>/<n>.txt` |

   The screen text shows what was typed into each field. Before saving it, replace the value of every field the tester typed an identity value, an OTP or a password into with `[redacted]`. For an OTP step, take the screenshot only after the field is submitted or cleared. Never save a snapshot or screenshot that shows an OTP, password or full Aadhaar number.

4. An Aadhaar number, a mobile number, an OTP, an ABHA number or address, a password, a captcha, a document number, a biometric or an approval stops the case. Click the field, then ask the tester to type the value into the browser or the app themselves and reply `done`, as the rule at the top of this skill sets out. Never type it yourself, never ask the tester to tell you the value, and never put in a made-up, sample or earlier value. In the run log write `<Aadhaar entered by tester>`, `<OTP entered by tester>` and so on in its place.
5. Judge the case, by the rules in "Judging a case" below. The case's exit condition and screen check in this skill are how the sheet's Expected Result is observed. The case is `passed` when the screen holds both. Paste into the run record the exact on-screen text or element you matched for each. When one holds and the other does not, the pass failed: say which one is missing. When the skill's case gives no literal for the screen, quote the on-screen text you believe satisfies the sheet's Expected Result, and record the case `needs-human` with `tester to confirm` in Remarks. Never record such a case `passed`.
6. Write the result into the workbook, as `shared.concept.test-workbook-write-back` sets out, with `--run ui`. A `ui` run fills NHA's own columns:

   ```bash
   python3 abdm-ft/abdm_workbook.py write <workbook> --run ui --results abdm-ft/<workbook name>-ui-results.json --executed-by "<tester>" --application "<your application>"
   ```

#### Judging a case

The sheet has three columns that describe a case. Each has one job.

| Column | What it does |
|---|---|
| Expected Result | Decides the outcome. Met is a pass, not met is a FAIL |
| Steps To Be Executed | Says what to do. Follow them in order |
| Suggestions for the Functional Tester | Guidance. A gap against it, with the Expected Result met, is a `conditional-pass`, never on its own a FAIL |

| Situation | Outcome |
|---|---|
| The Expected Result is met, and nothing beside it falls short | `passed` |
| The Expected Result is met, with a gap beside it, such as a Suggestions point not met | `conditional-pass`, with the condition in Remarks: what was met, then the gap |
| The screen shows a message that means the same as the one the sheet quotes, in other words | `passed`. Quote both in the run record |
| The Expected Result is not met | `failed`, with the reason |
| A case with several steps: every step run passes, and a step could not be run | `needs-human`, naming that step and what it needs, after the tester was asked for it |
| A case with several steps: a step's expected result fails | `failed`, naming that step. Only a failing step makes the case FAIL |

A case with several steps records a result for each step in its result's `steps`, as `shared.concept.test-workbook-write-back` sets out, so the report shows which step held and which did not.

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
- Every `conditional-pass` names its condition in Remarks, and every multi step case lists its steps there.
- `write` exits `0`, and the workbook row shows `PASS`, `CONDITIONAL PASS`, `FAIL`, `NA` or blank in `Status(PASS/FAIL)`, a number from 1 to 3 in `Iterations`, and the reason in `Remarks`.
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
| You are about to record FAIL because a Suggestions for the Functional Tester point is not met | The Suggestions column is guidance, not the Expected Result | Check the Expected Result. Met: `conditional-pass` with the gap as the condition. Not met: `failed` |
| The screen's message reads differently from the one the sheet quotes | The wording differs, the meaning may not | Same meaning: `passed`, with both quoted. Different meaning: `failed` |
| A multi step case has a step that could not be run | A person, device or value the step needs is missing | Ask the tester for it. If they cannot provide it in this run, the case is `needs-human` naming the step; never collapse it to FAIL |
| The reason is still unknown after all five sources | The fault leaves no trace a `ui` run can see | Record `failed` with what each source showed, and ask the tester for the server log command |

From `shared.concept.test-ui-run`.

## Writing results into NHA's workbook

Ask for the workbook in the readiness check, and save the script below as `abdm-ft/abdm_workbook.py` before that check, because the check runs it. Every case ends by writing its result into the sheet as below, after the run log row is updated. The workbook is required: the report is built from it.

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
| `conditional-pass` | `CONDITIONAL PASS` | the condition: the Expected Result was met, and what beside it was not, such as a gap against the Suggestions for the Functional Tester column. Required: the writer refuses a conditional pass with empty remarks |
| `failed` | `FAIL` | the reason: the HTTP status and ABDM error code, the missing callback, or the exception from your server log |
| `needs-human` | blank | `Needs tester:`, the step that was left, and what the tester was asked for |
| `not-run` | `NA` | why it does not apply |

A case with more than one step can carry its step results. Each step is `passed`, `failed`, `needs-human` or `not-run`, with a short note, and the writer appends them to Remarks in one line, such as `Steps: 1 PASS; 2 needs tester (a second ABHA address); 3 PASS`. A step waiting on a person, a device or test data is `needs-human`, never `not-run`. The report shows the steps as a table in the case's evidence. The writer refuses steps that disagree with the case's outcome:

| Outcome | Its steps |
|---|---|
| `passed` | Every step `passed` |
| `conditional-pass` | No step `failed` |
| `failed` | Any steps; a case with a `failed` step is always `failed` |
| `needs-human` | At least one step `needs-human`, and no step `failed` |

The writer masks the Response and Remarks values before it writes them, with the same masking block as the report: a 12 digit Aadhaar number, with or without spaces or hyphens, reads `XXXX XXXX 1234`, a 14 digit ABHA number, with or without hyphens, `XX-XXXX-XXXX-1234`, a 10 digit mobile, with or without `0`, `91` or `+91` in front and spaces or hyphens inside, `XXXXXX1234`, an ABHA address ending `@sbx` or `@abdm` keeps the last four characters before the `@` with the rest as `x` (four or fewer are all `x`), a JWT reads `[token]`, a value after a password, secret, token or OTP label, and a `Bearer` credential, read `[redacted]`, and the value of a profile field (`firstName`, `middleName`, `lastName`, `fullName`, `name`, `dob`, `dayOfBirth`, `monthOfBirth`, `yearOfBirth`, `address`, `pinCode`, `photo`, `profilePhoto`, `kycPhoto`, `email`), in JSON or as `key: value` in any case, reads `[masked]` to the end of its clause, so `Name: asha verma, then` reads `Name: [masked], then`. A date of birth after `dob`, `DOB` or `date of birth` reads `[masked]`, and any date written dd/mm/yyyy reads `[date]`. Masking is the backstop, not the rule: never put an identity value in a result in the first place. A name written with no label, such as `asha verma saw the screen`, cannot be told from other words and is not masked: the agent never writes a name.

### Before you start

- The workbook for the module, copied from the test skill's own `workbook/` folder into your repository beside the run log, such as `abdm-ft/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx`. The skill ships the sheet its cases come from, so use that copy rather than another. M4 has two, HFR and HPR: each is its own workbook with its own results file. The PHR workbook has no case ids: the script builds them from each tab and row, `PHR_ADDR_302` for row 3.2 of the ABHA address creation tab, exactly as the test case page shows them, and its first write adds a `Test Case ID` column holding them.
- Python 3.9 or later with `openpyxl` and `Pillow`: `pip install openpyxl pillow`. Pillow is what keeps the sheet's logos when it is saved.
- The script below, saved as `abdm-ft/abdm_workbook.py` before the readiness check, which runs it.

```python
"""Read NHA's functional test case workbook and write a run's results into it.

  python3 abdm_workbook.py cases  WORKBOOK
  python3 abdm_workbook.py write  WORKBOOK --run ft|ui --results RESULTS.json
  python3 abdm_workbook.py open   WORKBOOK --run ft|ui [--entity government|private]

A result's outcome is passed, conditional-pass, failed, needs-human or not-run.
A conditional-pass needs remarks naming the condition. A result may carry
"steps": [{"step": 1, "outcome": "passed", "note": ""}], appended to Remarks.
Response and Remarks are masked before they are written: Aadhaar, ABHA number,
ABHA address, mobile, JWT and any value after a secret's label.

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
STATUS = {"passed": "PASS", "conditional-pass": "CONDITIONAL PASS", "failed": "FAIL",
          "needs-human": "", "not-run": "NA"}
CLOSED = {"PASS", "CONDITIONAL PASS", "NA"}
# A step of a multi step case, as Remarks shows it.
STEP_STATUS = {"passed": "PASS", "failed": "FAIL", "needs-human": "needs tester", "not-run": "not run"}
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


# Masking. This block is the same in abdm_workbook.py and abdm_report.py, so the
# sheet and the report hide the same things in the same way.
# A JWT: three base64url segments, the first a JSON header, so starting eyJ.
JWT = re.compile(r"\beyJ[\w-]+\.[\w-]+\.[\w-]*")
SECRET_WORDS = r"pass(?:word|wd)|secret|token|otp|credentials?|api[ _-]?key|private[ _-]?key"


def labelled(words):
    """A value after a label naming a secret: "client secret: x", "OTP 482913", "otp":"482913",
    "X-token: Bearer x". Only a value is taken, never the { or [ that opens an object or a list."""
    return re.compile(
        r"(\b[\w-]*(?:" + words + r")[\w-]*['\"]?\s*[:=]\s*['\"]?)(?![\[{])((?:Bearer\s+)?[^\s'\",;}]+)"
        r"|(\b(?:" + words + r")\b\s+(?:is\s+)?)((?=[^\s,;]*\d)[^\s,;]{4,})", re.I)


LABELLED = labelled(SECRET_WORDS)
BEARER = re.compile(r"\bBearer\s+(?!\[token\]|\[redacted\])[^\s'\",;}]+")
# A person's profile fields, by key, in JSON or in "key: value" and "key=value" text, in any case.
# A quoted value is taken whole; an unquoted one runs to the end of its clause: a comma, a
# semicolon, a full stop, a line end or a steps list.
PROFILE_KEYS = (r"firstName|middleName|lastName|fullName|name|dob|dayOfBirth|monthOfBirth|yearOfBirth|"
                r"address|pinCode|pincode|photo|profilePhoto|kycPhoto|email")
PROFILE = re.compile(
    r"(['\"]?\b(?i:" + PROFILE_KEYS + r")\b['\"]?\s*[:=]\s*)(?![\[{])"
    r"(\"(?:[^\"\\]|\\.)*\"|'[^']*'|[^\s,;}\]]+(?: (?!Steps:)[^\s,;.}\]]+)*)")
# A date of birth after its label, and any date written dd/mm/yyyy.
DATE = r"\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{4}-\d{2}-\d{2}"
BIRTH = re.compile(r"(\b(?i:dob|date of birth|birth ?date)\b['\"]?\s*[:=]?\s*['\"]?)(" + DATE + r")(?!\d)")
SLASHED = re.compile(r"(?<![\d/])\d{1,2}/\d{1,2}/\d{4}(?![\d/])")
ABHA_ADDRESS = re.compile(r"(?<![\w.-])([A-Za-z0-9._]+)@(sbx|abdm)\b(?!\.\w)", re.I)
# A digit run is not a number to mask when it is a segment of a UUID.
LEAD, TRAIL = r"(?<!\d)(?<![0-9a-fA-F]-)", r"(?!\d)(?!-[0-9a-fA-F])"
ABHA_NUMBER = re.compile(LEAD + r"\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})" + TRAIL)
AADHAAR = re.compile(LEAD + r"\d{4}[ -]?\d{4}[ -]?(\d{4})" + TRAIL)
MOBILE = re.compile(r"(?<![\d+])(?<![0-9a-fA-F]-)(?:\+91[ -]?|91[ -]?|0)?[6-9](?:[ -]?\d){5}"
                    r"[ -]?(\d)[ -]?(\d)[ -]?(\d)[ -]?(\d)" + TRAIL)


def profile(m):
    quote = m.group(2)[0] if m.group(2)[:1] in ("'", '"') else ""
    return m.group(1) + quote + "[masked]" + quote


def address(m):
    """An ABHA address keeps the last four characters before the @, the rest as x. Four or fewer: all x."""
    name = m.group(1)
    if len(name) <= 4:
        return "x" * len(name) + "@" + m.group(2)
    return "x" * (len(name) - 4) + name[-4:] + "@" + m.group(2)


def mask(text):
    """A JWT to [token], a secret's value and a Bearer credential to [redacted], a profile field's
    value and a date of birth to [masked], a dd/mm/yyyy date to [date], an ABHA address to
    xxxxxx1234@sbx, ABHA numbers to XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234,
    a mobile, with or without 0 or +91, to XXXXXX1234."""
    text = JWT.sub("[token]", str(text))
    text = LABELLED.sub(lambda m: (m.group(1) or m.group(3)) + "[redacted]", text)
    text = BEARER.sub("Bearer [redacted]", text)
    text = BIRTH.sub(lambda m: m.group(1) + "[masked]", text)
    text = PROFILE.sub(profile, text)
    text = SLASHED.sub("[date]", text)
    text = ABHA_ADDRESS.sub(address, text)
    text = ABHA_NUMBER.sub(r"XX-XXXX-XXXX-\1", text)
    text = AADHAAR.sub(r"XXXX XXXX \1", text)
    return MOBILE.sub(r"XXXXXX\1\2\3\4", text)
# End of the masking block.


def steps_text(case, steps):
    """A multi step case's steps as one line: "Steps: 1 PASS; 2 needs tester (what); 3 PASS"."""
    if not isinstance(steps, list):
        sys.exit(case + ": steps must be a list of {\"step\": n, \"outcome\": ..., \"note\": ...}")
    parts = []
    for s in steps:
        if not isinstance(s, dict) or s.get("outcome") not in STEP_STATUS:
            sys.exit(case + ": a step's outcome must be one of " + ", ".join(STEP_STATUS))
        note = mask(norm(s.get("note", ""))).replace(";", ",")
        parts.append(str(s.get("step", len(parts) + 1)) + " " + STEP_STATUS[s["outcome"]] +
                     (" (" + note + ")" if note else ""))
    return "Steps: " + "; ".join(parts) if parts else ""


def steps_agree(outcome, steps):
    """Why a case's outcome does not agree with its steps, or None when it does."""
    seen = [s.get("outcome") for s in steps if isinstance(s, dict)]
    if "failed" in seen and outcome != "failed":
        return "a failed step makes the case failed"
    if outcome == "passed" and any(x != "passed" for x in seen):
        return "a passed case needs every step passed"
    if outcome == "needs-human" and "needs-human" not in seen:
        return "a needs-human case needs a step that is needs-human"
    return None


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
        remarks = norm(r.get("remarks", ""))
        if r["outcome"] == "conditional-pass" and not remarks:
            sys.exit(f"{r['id']}: a conditional-pass needs remarks naming the condition")
        if r["outcome"] == "needs-human":
            remarks = f"Needs tester: {remarks}".strip()
        remarks = mask(remarks)
        if r.get("steps"):
            line = steps_text(r["id"], r["steps"])
            wrong = steps_agree(r["outcome"], r["steps"])
            if wrong:
                sys.exit(f"{r['id']}: steps disagree with the outcome {r['outcome']}: {wrong}")
            remarks = " ".join(x for x in (remarks, line) if x)
        values = {"status": STATUS[r["outcome"]], "response": mask(r.get("response") or ""),
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


# Which cases are mandatory for an entity type: the same reading of the marking
# column and the group's Applicable To as abdm_report.py's plan and check use.
OPTIONAL = ("no", "optional", "non-mandatory", "non mandatory", "not mandatory")


def marking_col(cols):
    return next((col for name, col in sorted(cols.items(), key=lambda x: x[1])
                 if "mandatory" in name.lower() and "optional" in name.lower()), None)



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



def group_applies(ws, top, cols):
    """Each case row's group Applicable To, carried down from the row that heads the group."""
    acol, icol = cols.get("Applicable To"), cols.get("Test Case ID")
    if not acol or not icol:
        return {}
    out, current = {}, ""
    for r in range(top + 1, ws.max_row + 1):
        applies = norm(anchor(ws, r, acol).value)
        if applies:
            current = applies
        if norm(ws.cell(r, icol).value):
            out[r] = current
    return out



def restricted_to(applies):
    """The one entity type a group is for, when it names only one: government or private."""
    low = applies.lower()
    gov, priv = "gov" in low, "priv" in low
    if "all" in low or "both" in low or gov == priv:
        return None
    return "government" if gov else "private"



def status_of(ws, row, col):
    return norm(anchor(ws, row, col).value)


def still_open(path, run, entity=None):
    """Cases not yet PASS, CONDITIONAL PASS or NA in this run type's status column. With an entity
    type, also an NA on a case mandatory for it, as the report's gate blocks one."""
    path = Path(path)
    wb = load(path)
    backup = path.with_name(f"{path.stem}.before-abdm-run{path.suffix}")
    original = load(backup) if backup.exists() else None
    found, applies_by = [], {}
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        col = next((cols[n] for n in COLUMNS[run]["status"] if n in cols), None)
        status = ""
        if col is not None:
            cell = anchor(ws, row, col)
            run_col = cols.get(f"{norm(ws.cell(top, col).value)} (run)")
            if run_col and original is not None and norm(original[ws.title][cell.coordinate].value):
                # NHA wrote in this cell, so the run's status is only in the "(run)" column.
                status = status_of(ws, row, run_col)
            else:
                status = norm(cell.value)
        kind, pair = "mandatory", None
        if entity:
            if ws.title not in applies_by:
                applies_by[ws.title] = group_applies(ws, top, cols)
            mcol = marking_col(cols)
            kind, _, _, pair = classify(norm(anchor(ws, row, mcol).value) if mcol else "", entity)
            only = restricted_to(applies_by[ws.title].get(row, ""))
            if only and only != entity:
                kind, pair = "optional", None
        found.append((case, status.upper(), kind, pair))
    passing = {case for case, status, _, _ in found if status in ("PASS", "CONDITIONAL PASS")}
    paired = {i for _, _, kind, pair in found if kind == "pair" for i in pair}
    for case, status, kind, pair in found:
        if status not in CLOSED:
            print(case)
        elif entity and status == "NA":
            if case in paired:
                ids = next((p for _, _, k, p in found if k == "pair" and case in p), [case])
                if not any(i in passing for i in ids):
                    print(case + " (NA on a mandatory case, either " + " or ".join(ids) + ")")
            elif kind == "mandatory":
                print(case + " (NA on a mandatory case)")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["cases", "write", "open"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"])
    p.add_argument("--results")
    p.add_argument("--executed-by", default="")
    p.add_argument("--application", default="")
    p.add_argument("--entity", choices=["government", "private"],
                   help="open: also list an NA on a case mandatory for this entity type")
    a = p.parse_args()
    if a.action == "cases":
        wb = load(a.workbook)
        print(json.dumps({ws.title: list(cases(ws)) for ws in wb.worksheets}, indent=1))
    elif a.action == "open":
        still_open(a.workbook, a.run or sys.exit("--run is needed"), a.entity)
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

   A case with steps adds them, and a conditional pass names its condition in `remarks`:

   ```json
   [{"id": "SHARE_PATIENT_PROFILE_702", "outcome": "needs-human", "iterations": 1, "remarks": "a second ABHA address, asked at readiness and at the case; the tester has none for this run", "steps": [{"step": 1, "outcome": "passed"}, {"step": 2, "outcome": "needs-human", "note": "a second ABHA address"}, {"step": 3, "outcome": "passed"}, {"step": 4, "outcome": "passed"}]},
    {"id": "CRT_ABHA_113", "outcome": "conditional-pass", "iterations": 1, "remarks": "Expected Result met: ABHA number and address shown with the profile. Condition: <the Suggestions for the Functional Tester point that was not met>"}]
   ```

   `id` is the id `cases` printed. A sheet that repeats an id lists the repeat as `<id>#2`, such as HFR's second bridge linkage, `HFR-118#2` to `HFR-123#2`, and the result for that row uses that id. `iterations` is the number of loop passes the case took, whether it ended passed or failed. Never put a token, OTP, Aadhaar number or full mobile in any field.

3. Then write it into the workbook, so a stopped run loses nothing:

   ```bash
   python3 abdm-ft/abdm_workbook.py write <workbook> --run ft --results abdm-ft/<workbook name>-ft-results.json --executed-by "<tester>" --application "<your system>"
   ```

   The first write copies the workbook to `<name>.before-abdm-run.xlsx` beside it, and every later write reads that copy to tell NHA's text from the run's. Every write rewrites the result cells of every case in the file, so writing again is safe. The header block above the table gets the tester, the date and the application, and a later write updates them. When NHA sends a new version of the workbook, delete the old `.before-abdm-run.xlsx` before the first write to it.

4. To resume, list the cases whose status for the run type is not `PASS`, `CONDITIONAL PASS` or `NA`, and run only those. With `--entity`, the list also holds every `NA` on a case mandatory for that entity type, marked `(NA on a mandatory case)`, because the report's gate blocks it unless NHA agreed it is not run. Read the list out before the tester leaves, so every case still waiting for them is done or asked about while they are there:

   ```bash
   python3 abdm-ft/abdm_workbook.py open <workbook> --run ft --entity private
   ```

### How you know it worked

- `write` exits `0` and prints nothing. It exits `1` and prints `not in the workbook: <id>` for any case id the workbook does not hold.
- Opened again, each case's row shows the status, response, iterations and remark you wrote. Every cell NHA filled holds what NHA put there, with its formatting, and the logos, merged cells, column widths and frozen panes are as NHA sent them. Two parts of the file are not kept: printer settings and SharePoint metadata, neither of which a reader sees.
- `open` lists exactly the cases whose status is not `PASS`, `CONDITIONAL PASS` or `NA`, in any case and spacing, and with `--entity` each `NA` on a mandatory case too.
- Every `CONDITIONAL PASS` row carries its condition in Remarks, and a case with steps reads `Steps: ...` at the end of its Remarks.
- No Aadhaar number, ABHA number, ABHA address, mobile, token or OTP appears in the Response or Remarks columns: each reads in its masked form.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'openpyxl'` | Not installed | `pip install openpyxl pillow` |
| The logos are gone after a write | Pillow is missing, so the images were not read | Install Pillow, copy `<name>.before-abdm-run.xlsx` back over the workbook, and write again |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts. The script writes neither until it is resolved |
| `not in the workbook: <id>` | The workbook is another version of the set, or the id was typed with a space | Check the id against `cases`. Never rename a case to fit |
| `outcome must be one of` | An outcome outside the five | Use `passed`, `conditional-pass`, `failed`, `needs-human` or `not-run` |
| `a conditional-pass needs remarks naming the condition` | A conditional pass with empty remarks | Write the condition in `remarks`: what was met, and the gap beside it |
| `a step's outcome must be one of` | A step outcome outside the four a step can have | Use `passed`, `failed`, `needs-human` or `not-run` for each step |
| `steps disagree with the outcome` | The case's outcome does not follow from its steps, such as `passed` with a step not passed | Set the outcome by the table above: a `failed` step makes the case `failed`; a step waiting on the tester makes it `needs-human` |
| `open` lists `<id> (NA on a mandatory case)` | A case mandatory for your entity type is recorded `NA` | Run it, or record why with NHA's agreement in `agreed_not_run` for the report |
| An identity value shows in clear in Remarks | It was written by an earlier version of the writer, or in a form the masking does not know | Correct the results file so it names the value by its last four characters, and write again |
| The workbook will not open in Excel while the run writes | Excel holds a lock on it | Close it in Excel; the next write catches up |

From `shared.concept.test-workbook-write-back`.

## Writing the test report

Save the script below as `abdm-ft/abdm_report.py` before the readiness check, and make the run log from its `plan`. When the last case is recorded, run `check`. Run `build` only when `check` exits 0.

### In plain words

A functional test run ends with NHA's workbook filled in, one row per case.
The test report is the document a reviewer signs off: who tested what, when,
with which tools, the status of every case, and the evidence for each one. It
is built from the workbook, not written by hand, so the report and the sheet
always agree.

The report is written only when the run has passed. Its gate is every
mandatory case that applies to your entity type, government or private, with
status `PASS` or `CONDITIONAL PASS` in the run type's column. A mandatory case
that is `FAIL` or blank stops it, and so does one that is `NA` unless NHA
agreed it is not run.

A conditional pass is a case whose Expected Result was met with a gap beside
it, such as a point in the sheet's Suggestions for the Functional Tester column
that was not met. It passes the gate only with its condition written in
Remarks, and the report counts it on its own and lists every one with its
condition, so a reviewer sees each gap.

The same script also plans the run. `plan` lists every case in the workbook,
in sheet order, with its group, what it is for your entity type and its status
so far. The run log is made from that list, so no case is ever dropped.

| Run type | Report | Evidence per case |
|---|---|---|
| `ui` | The exit report NHA asks for | The screenshots under `abdm-ft/evidence/<case id>/` |
| `ft` | The same structure | The `FT Response with Code` value in place of screenshots |

The report is a PDF, the file you submit, with a Word copy beside it that you
can edit. Both hold the same text. The PDF is drawn in the ABDM Sandbox design
system: a navy cover with the key facts in a ruled grid, a contents list with
page numbers, each section opened by a rule and a numbered label, and hairline
tables. Every page after the cover carries the report title in its header and
`Confidential` with `Page N of M` in its footer. Cases flow on from one another;
a case's heading and fields stay on the page with its first screenshot, and no
heading ends a page. Its parts come in
this order, each from a fixed source, so two reports for the same milestone
read the same way.

| Part | What it holds | Comes from |
|---|---|---|
| Cover | Title, product, organisation, milestone, run type, document id, version, release date, a confidentiality line | `meta.json`, `--run` |
| Contents | Every section, and each function group in the evidence, with its page number. The Word copy holds a contents field that Word fills in on opening | The headings below |
| 1. Document control | Document title, id, version, prepared, reviewed, approved and released by, release date; change history; distribution list by name, organisation and role | `meta.json` `document` |
| 2. Executive summary | The counts table, for all cases and for mandatory cases, each term defined in one line under it, then `Ready for sandbox exit.` or `<n> mandatory cases are still open.` | The workbook, `plan`'s applicability, the gate |
| 3. ABDM details | Entity, product, category, role, entity type, milestone, API version, run type, dates, days, most passes any case took, executed by, recordings | `meta.json`, the workbook |
| 4. Results summary | The counts by function group; every conditional pass with its condition; any mandatory case NHA agreed is not run, with the agreement; then every case not tested, blocked or not applicable, once, with what it needs or why it does not apply | The workbook, `agreed_not_run` |
| 5. Scope and limitations | Applications and URLs; workbook and tabs; the limitation that results hold for the build tested on those dates, and any `limitations` | `meta.json`, the workbook |
| 6. Flow details | For linking and consent flows: the ABHA address used and the HI types created or tested | `meta.json` `flows` |
| 7. Test environment and tools | Browser, Playwright, PHR app, emulator, the model that ran the agent, with versions | `meta.json` `environment` |
| 8. Test team | Name, role and qualifications of each tester, reviewer and approver | `meta.json` `team` |
| 9. Approach and methodology | One line each: who ran the cases, the three pass limit, how OTPs and consents were given, the PHR app proof, the run type, REQUEST-IDs | Fixed text, `--run` |
| 10. Test data | The ABHA numbers and addresses used, masked | `meta.json` `test_data` |
| 11. Evidence | Tested cases only, passed, conditional pass or failed, under their function group in sheet order. Per case: its id and title; the result line (status, passes, marking, any condition or error code); the expected result; what was observed; its REQUEST-IDs; a table of its steps if it has them; the response for an `ft` run; then its screenshots | The workbook, `findings`, `--manifest`, the evidence folder |
| 12. Failures and iterations log | Failed, blocked and conditional pass cases only, with the reason, the condition or what is needed, and any error code | The workbook |
| 13. Conclusion and sign-off | The same ready line as the summary, then a sign-off table for preparer, reviewer and approver with date and signature | The gate, `meta.json` `document` |
| 14. Annexures | Recording links, the completed workbook, the REQUEST-ID manifest, the full size screenshots in the evidence folder and the file listing them | `meta.json`, the arguments |

| Count | What it means |
|---|---|
| Cases in NHA's sheet | Every case in the workbook |
| Applicable to this integrator | The cases less those not applicable, as `plan` classifies them for your entity type |
| Tested | Passed, conditional pass and failed |
| Passed, conditional pass, failed | `PASS`, `CONDITIONAL PASS` and `FAIL` in the run type's status column |
| Blocked | A blank status with Remarks starting `Needs tester:`: waiting for a tester, a device or test data |
| Not tested | Applicable and blank but not blocked; `NA` on a mandatory case NHA has not agreed to, which is still open; or a status the script does not know, shown as `Unrecognised status: <value>` |
| Not applicable | In a group the sheet marks for the other entity type only, whether or not it was run (a run one is listed as `Run, not applicable` with its result); or `NA` on an optional case or with NHA's agreement |

The counts must add up: applicable is tested, blocked and not tested; tested is
passed, conditional pass and failed. The script stops with `the summary counts
do not add up` if they do not. The mandatory column counts each case that is
mandatory for your entity type, and each either pair once: by the case that met
it, else by one that was tried. So the mandatory failed, blocked and not tested
add up to the number in `<n> mandatory cases are still open.` When one case of
an either pair passes, the other's result carries `Either rule: <id> or <id>
satisfies it.` and is not a mandatory failure.

Screenshots print to be read, at their own resolution. Two rows fit a page with a
case heading: each row is at most about 98 mm tall. A landscape (desktop)
screenshot spans the text width up to that height, one to a row, never under
140 mm wide. Portrait (phone) ones sit up to three to a row at that height,
never under 45 mm wide. A capture
more than three times as tall as it is wide prints 60 mm wide, cut into parts
that each fit a page. Landscape and portrait ones never share a row. Each is
embedded with every pixel it has, unless that is more than prints at 300 dots
per inch at its size, when it is scaled to that. A PNG stays lossless. A file
Pillow cannot open, an empty one included, is named in the case as `Screenshot
could not be read: <file>`, and the report is still written. The full size
files stay in the evidence folder, and `build` writes `<report>-screenshots.json`
beside the report, listing each figure's case, step and file, for the annexure
bundle.

The only prose you write is the one line finding per case, in `meta.json`.
The observed value is that finding, else the Remarks value. A failure reason is
the Remarks value, else the response. The result line names any `ABDM-` or
`MIS-` code, HTTP 4xx or 5xx status or exception in them. Request
ids come from the run's manifest JSON, the file the test skill writes beside
the run log, given with `--manifest`. A request id that is a UUID is printed as
it is, so a reviewer can look it up in the gateway's record; anything else in
that field is masked like the rest of the report.

What the report never holds: a login, password, client secret, token or OTP,
an unmasked Aadhaar number, ABHA number, ABHA address or mobile, and anyone's
email or phone number. The team and distribution tables take a name, a role and an
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

A group's Applicable To comes first. When the row that heads a group names one entity type only, such as M1's demographic authentication group, `Government`, every case in it is not for the other entity type, whatever its own marking says: for a private entity, CRT_ABHA_301 to 309 are not mandatory.

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
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. PNG, JPEG, GIF, BMP, WebP and TIFF are read; HEIC and PDF files are read only where Pillow can open them, so export them to PNG. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `openpyxl`, `Pillow`, `python-docx` and `reportlab`: `pip install openpyxl pillow python-docx reportlab`. On Python 3.9, ReportLab 5 does not install; use `pip install "reportlab<5"`. All four are open source (MIT, the HPND licence, MIT and BSD). ReportLab draws the PDF itself, so no office suite is needed.
- Optionally, the design system's fonts as `.ttf` files: Newsreader for headings, Public Sans for text and JetBrains Mono for labels and case ids, all under the SIL Open Font License. The script looks in the folder given with `--fonts`, then `abdm-ft/fonts/`, then `~/Library/Fonts`, `/Library/Fonts` and `/usr/share/fonts`, and prints which it used. A font it does not find is replaced by the PDF's own Times-Roman, Helvetica or Courier, which are the design system's fallbacks, so the report is complete either way.
- The script below, saved as `abdm-ft/abdm_report.py`.
- A `meta.json` for the report, written by you, with placeholder values replaced. It carries no credential: the script refuses any field named like `password`, `secret`, `token` or `credentials`, and any value that holds a token or a credential's label with its value, such as `client secret: ...`. `agreed_not_run` is only for mandatory cases NHA agreed are not run; leave it `{}` otherwise. `flows` is for M2 and M3 linking and consent flows; leave it `[]` for M1. `team` and `distribution` carry no email or phone number.
- For request ids in the report, the run's manifest JSON, which the test skill writes beside the run log at the end of the run. It is optional: without it each tested case reads `No manifest given`. The script refuses a manifest that holds a credential, as it does `meta.json`.

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

  python3 abdm_report.py plan  WORKBOOK --run ft|ui --entity government|private
  python3 abdm_report.py check WORKBOOK --run ft|ui --entity government|private [--meta meta.json]
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.pdf
      [--manifest RUN.json] [--format pdf|docx|both] [--fonts DIR]

plan prints every case in sheet order with its group, its applicability for the
entity type and its status so far, then the totals: the run log is made from it.
check lists every mandatory case not PASS or CONDITIONAL PASS for the run type
and exits 1, or exits 0 when there is none. build refuses unless check passes, then writes the
report. A mandatory case NA passes only when meta.json's agreed_not_run names it.
--manifest is the run's manifest of case ids to REQUEST-IDs, printed per case.
build writes REPORT.pdf, the report to submit, and REPORT.docx beside it, the
editable copy; --format picks one of them. For a ui run it also writes
REPORT-screenshots.json, naming each figure's full size file for the annexure. The PDF uses Newsreader, Public Sans
and JetBrains Mono where it finds them (--fonts DIR, abdm-ft/fonts, then the
system's font folders), else Times-Roman, Helvetica and Courier.
Needs openpyxl, Pillow, python-docx and reportlab
(pip install openpyxl pillow python-docx reportlab).
"""
import argparse, json, re, sys
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
# The statuses that pass a case, and how a multi step case's steps read in Remarks.
PASSING = ("PASS", "CONDITIONAL PASS")
STEPS = re.compile(r"\bSteps: (.+)$")
STEP = re.compile(r"^(\d+) (PASS|FAIL|needs tester|not run)(?: \((.*)\))?$")
IMAGES = (".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".tif", ".tiff", ".heic", ".heif", ".pdf")
RUN_NAME = {"ui": "UI functional test", "ft": "API functional test"}
SECTIONS = ["Document control", "Executive summary", "ABDM details", "Results summary",
            "Scope and limitations", "Flow details", "Test environment and tools", "Test team",
            "Approach and methodology", "Test data", "Evidence", "Failures and iterations log",
            "Conclusion and sign-off", "Annexures"]
# The fixed fields of each tested case's evidence table, in order, under its id and title.
CASE_FIELDS = ["Result", "Expected result", "Observed", "Request IDs"]
# Where each case stands. Tested is passed, conditional pass or failed; applicable is
# tested, blocked or not tested; every case is applicable or not applicable.
TESTED = ("PASS", "CONDITIONAL PASS", "FAIL")
COUNTS = [("Cases in NHA's sheet", "Every case in the workbook."),
          ("Applicable to this integrator", "The cases less those not applicable."),
          ("Tested", "Run to a result: passed, conditional pass or failed."),
          ("Passed", "The Expected Result was seen."),
          ("Conditional pass", "The Expected Result was seen, with a gap beside it, listed with its condition."),
          ("Failed", "The Expected Result was not seen in three passes."),
          ("Blocked", "Started, then waiting for a tester, a device or test data."),
          ("Not tested", "Applicable and not run yet, NA on a mandatory case NHA has not agreed to, or an unknown status."),
          ("Not applicable", "Not for this entity type as the sheet's groups mark it, run or not; or NA agreed or optional.")]
# Screenshots print to be read and pack two rows to a page: a row is at most ROW_MM tall, the
# A4 frame (257 mm) less a case heading and fields (40 mm) and two captions and gaps (10 mm each),
# halved. A landscape one spans the text width up to that height, never under 140 mm wide; portrait
# ones sit three to a row at that height, never under 45 mm wide; a very tall one (over three times
# as tall as wide) prints 60 mm wide, cut into parts that each fit a page. Each is embedded with
# every pixel it has, up to what prints at 300 dots per inch.
ROW_MM = (257 - 40 - 2 * 10) / 2.0
SHOT_MM = {"wide_min_width": 140, "tall_min_width": 45, "very tall": 60, "part": 190}
DPI = 300
# A REQUEST-ID is a UUID. Only a UUID is printed as it is; anything else is masked.
UUID = re.compile(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
# An error code or exception named in a response or remark.
ERROR = re.compile(r"\b(?:ABDM|MIS|HIS|HIU|HIP|CM|PHR|UHI)-\d{3,5}\b|\bHTTP [45]\d{2}\b|\b[A-Z]\w*(?:Exception|Error)\b")


def norm(text):
    return re.sub(r"\s+", " ", str(text if text is not None else "")).strip()


# Masking. This block is the same in abdm_workbook.py and abdm_report.py, so the
# sheet and the report hide the same things in the same way.
# A JWT: three base64url segments, the first a JSON header, so starting eyJ.
JWT = re.compile(r"\beyJ[\w-]+\.[\w-]+\.[\w-]*")
SECRET_WORDS = r"pass(?:word|wd)|secret|token|otp|credentials?|api[ _-]?key|private[ _-]?key"


def labelled(words):
    """A value after a label naming a secret: "client secret: x", "OTP 482913", "otp":"482913",
    "X-token: Bearer x". Only a value is taken, never the { or [ that opens an object or a list."""
    return re.compile(
        r"(\b[\w-]*(?:" + words + r")[\w-]*['\"]?\s*[:=]\s*['\"]?)(?![\[{])((?:Bearer\s+)?[^\s'\",;}]+)"
        r"|(\b(?:" + words + r")\b\s+(?:is\s+)?)((?=[^\s,;]*\d)[^\s,;]{4,})", re.I)


LABELLED = labelled(SECRET_WORDS)
BEARER = re.compile(r"\bBearer\s+(?!\[token\]|\[redacted\])[^\s'\",;}]+")
# A person's profile fields, by key, in JSON or in "key: value" and "key=value" text, in any case.
# A quoted value is taken whole; an unquoted one runs to the end of its clause: a comma, a
# semicolon, a full stop, a line end or a steps list.
PROFILE_KEYS = (r"firstName|middleName|lastName|fullName|name|dob|dayOfBirth|monthOfBirth|yearOfBirth|"
                r"address|pinCode|pincode|photo|profilePhoto|kycPhoto|email")
PROFILE = re.compile(
    r"(['\"]?\b(?i:" + PROFILE_KEYS + r")\b['\"]?\s*[:=]\s*)(?![\[{])"
    r"(\"(?:[^\"\\]|\\.)*\"|'[^']*'|[^\s,;}\]]+(?: (?!Steps:)[^\s,;.}\]]+)*)")
# A date of birth after its label, and any date written dd/mm/yyyy.
DATE = r"\d{1,2}[/-]\d{1,2}[/-]\d{4}|\d{4}-\d{2}-\d{2}"
BIRTH = re.compile(r"(\b(?i:dob|date of birth|birth ?date)\b['\"]?\s*[:=]?\s*['\"]?)(" + DATE + r")(?!\d)")
SLASHED = re.compile(r"(?<![\d/])\d{1,2}/\d{1,2}/\d{4}(?![\d/])")
ABHA_ADDRESS = re.compile(r"(?<![\w.-])([A-Za-z0-9._]+)@(sbx|abdm)\b(?!\.\w)", re.I)
# A digit run is not a number to mask when it is a segment of a UUID.
LEAD, TRAIL = r"(?<!\d)(?<![0-9a-fA-F]-)", r"(?!\d)(?!-[0-9a-fA-F])"
ABHA_NUMBER = re.compile(LEAD + r"\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?(\d{4})" + TRAIL)
AADHAAR = re.compile(LEAD + r"\d{4}[ -]?\d{4}[ -]?(\d{4})" + TRAIL)
MOBILE = re.compile(r"(?<![\d+])(?<![0-9a-fA-F]-)(?:\+91[ -]?|91[ -]?|0)?[6-9](?:[ -]?\d){5}"
                    r"[ -]?(\d)[ -]?(\d)[ -]?(\d)[ -]?(\d)" + TRAIL)


def profile(m):
    quote = m.group(2)[0] if m.group(2)[:1] in ("'", '"') else ""
    return m.group(1) + quote + "[masked]" + quote


def address(m):
    """An ABHA address keeps the last four characters before the @, the rest as x. Four or fewer: all x."""
    name = m.group(1)
    if len(name) <= 4:
        return "x" * len(name) + "@" + m.group(2)
    return "x" * (len(name) - 4) + name[-4:] + "@" + m.group(2)


def mask(text):
    """A JWT to [token], a secret's value and a Bearer credential to [redacted], a profile field's
    value and a date of birth to [masked], a dd/mm/yyyy date to [date], an ABHA address to
    xxxxxx1234@sbx, ABHA numbers to XX-XXXX-XXXX-1234, any other 12 digit run to XXXX XXXX 1234,
    a mobile, with or without 0 or +91, to XXXXXX1234."""
    text = JWT.sub("[token]", str(text))
    text = LABELLED.sub(lambda m: (m.group(1) or m.group(3)) + "[redacted]", text)
    text = BEARER.sub("Bearer [redacted]", text)
    text = BIRTH.sub(lambda m: m.group(1) + "[masked]", text)
    text = PROFILE.sub(profile, text)
    text = SLASHED.sub("[date]", text)
    text = ABHA_ADDRESS.sub(address, text)
    text = ABHA_NUMBER.sub(r"XX-XXXX-XXXX-\1", text)
    text = AADHAAR.sub(r"XXXX XXXX \1", text)
    return MOBILE.sub(r"XXXXXX\1\2\3\4", text)
# End of the masking block.


# What meta.json may never hold as a value. An OTP is masked, not refused: it
# has expired by the time a report is written, and findings name the OTP step.
LABELLED_CREDENTIAL = labelled(r"pass(?:word|wd)|secret|token|credentials?|api[ _-]?key|private[ _-]?key")
LABEL = re.compile(r"\b(?:" + SECRET_WORDS + r")\b", re.I)


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


def group_applies(ws, top, cols):
    """Each case row's group Applicable To, carried down from the row that heads the group."""
    acol, icol = cols.get("Applicable To"), cols.get("Test Case ID")
    if not acol or not icol:
        return {}
    out, current = {}, ""
    for r in range(top + 1, ws.max_row + 1):
        applies = norm(anchor(ws, r, acol).value)
        if applies:
            current = applies
        if norm(ws.cell(r, icol).value):
            out[r] = current
    return out


def group_names(ws, top, cols):
    """Each case row's group: the Function carried down from the row that heads the group,
    else the last section heading. A section heading is a row with no case id whose values sit in
    the first two columns only: a title, alone or after its number, as on the PHR sheet's
    "4.1 | Login with mobile number flow" and "| Edit Profile"."""
    fcol, icol = cols.get("Function"), cols.get("Test Case ID")
    if not icol:
        return {}
    first = min(cols.values())
    out, current = {}, ""
    for r in range(top + 1, ws.max_row + 1):
        name = norm(anchor(ws, r, fcol).value) if fcol else ""
        filled = [c for c in ws[r] if norm(c.value)]
        titles = [norm(c.value) for c in filled if not re.fullmatch(r"[\d.]+", norm(c.value))]
        if name:
            current = name
        elif (filled and not norm(ws.cell(r, icol).value) and all(c.column in (first, first + 1) for c in filled)
              and len(titles) == 1 and len(titles[0]) <= 120):
            current = titles[0]
        if norm(ws.cell(r, icol).value):
            out[r] = current or norm(ws.title)
    return out


def restricted_to(applies):
    """The one entity type a group is for, when it names only one: government or private."""
    low = applies.lower()
    gov, priv = "gov" in low, "priv" in low
    if "all" in low or "both" in low or gov == priv:
        return None
    return "government" if gov else "private"


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    path = Path(path)
    # The copy the writer made before its first write: what NHA's own cells held.
    backup = path.with_name(path.stem + ".before-abdm-run" + path.suffix)
    original = load(backup) if backup.exists() else None
    out = []
    applies_by, groups_by = {}, {}
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        if ws.title not in applies_by:
            applies_by[ws.title] = group_applies(ws, top, cols)
            groups_by[ws.title] = group_names(ws, top, cols)
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
        rec["applies"] = applies_by[ws.title].get(row, "")
        rec["group"] = groups_by[ws.title].get(row, "") or norm(ws.title)
        for key, names in COLUMNS[run].items():
            rec[key] = value(ws, row, top, cols, names, original)
        rec["raw_status"], rec["status"] = rec["status"], rec["status"].upper()
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
    # A group the sheet marks for one entity type only, such as M1's demographic authentication
    # for Government, is not for the other one, whatever its cases' own markings say.
    for rec in out:
        only = restricted_to(rec["applies"])
        if only and only != entity:
            rec.update(kind="optional", pair=None, label="Not for a " + entity + " entity", na=True,
                       note="the group applies to " + rec["applies"] + " only: not for a " + entity + " entity")
    groups = {k: v for k, v in groups.items() if any(by_id[i]["kind"] == "pair" for i in v if i in by_id)}
    return out, list(groups.values())


def gate(recs, groups, agreed):
    """Mandatory cases not PASS or CONDITIONAL PASS. NA passes only on a case NHA agreed not to run."""
    blocking = []
    by_id = {r["id"]: r for r in recs}

    def through(r):
        if r["status"] == "CONDITIONAL PASS":
            # A conditional pass passes only with its condition written down.
            return bool(STEPS.sub("", r["remarks"]).strip())
        return r["status"] in PASSING or (r["status"] == "NA" and r["id"] in agreed)

    def shown_status(r):
        if r["status"] == "CONDITIONAL PASS" and not through(r):
            return "CONDITIONAL PASS with no condition in Remarks"
        return r["status"] or "blank"

    for r in recs:
        if r["kind"] == "mandatory" and not through(r):
            blocking.append(r["id"] + ": " + shown_status(r))
    for ids in groups:
        present = [by_id[i] for i in ids if i in by_id]
        if present and not any(through(r) for r in present):
            blocking.append(" or ".join(r["id"] for r in present) + ": " +
                            ", ".join(shown_status(r) for r in present))
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
    for r in recs:
        if r["status"] == "CONDITIONAL PASS":
            print("conditional pass " + r["id"] + ": " + mask(r["remarks"] or "no condition recorded"))
    return recs, groups, blocking


def applicability(r):
    """What a case is for this entity type, in the words plan prints."""
    if r.get("na"):
        return "not applicable (group " + r["group"] + ", Applicable To: " + r["applies"] + ")"
    if r["kind"] == "pair":
        what = "mandatory, either " + " or ".join(r["pair"])
    elif r["kind"] == "mandatory":
        what = "conditional" if "conditional" in r["label"].lower() else "mandatory"
    else:
        what = "optional"
    low = r["applies"].lower()
    if r["applies"] and not restricted_to(r["applies"]) and not ("all" in low or "both" in low or
                                                                  ("gov" in low and "priv" in low)):
        # An Applicable To that names neither entity type, such as "PHR App", is read as all.
        what += "; applies: " + r["applies"] + " (read as all)"
    return what


def settle(recs, groups):
    """Mark what the counts need: a mandatory NA without NHA's agreement is still open, and an
    either pair met by one case leaves the other's result beside it, not a mandatory failure.
    Returns the mandatory cases to count: each mandatory case, and one case for each either pair."""
    by_id = {r["id"]: r for r in recs}

    def through(r):
        return r["status"] in PASSING or bool(r.get("agreed"))

    mandatory = [r for r in recs if r["kind"] == "mandatory"]
    for ids in groups:
        members = [by_id[i] for i in ids if i in by_id and by_id[i]["kind"] == "pair"]
        if not members:
            continue
        met = [r for r in members if through(r)]
        for r in members:
            r["either"] = " or ".join(x["id"] for x in members)
            r["pair_met"] = bool(met) and r not in met
        tried = [r for r in members if r["status"] in TESTED or r["remarks"].lower().startswith("needs tester")]
        mandatory.append((met or tried or members)[0])
    for r in recs:
        r["open_na"] = (r["status"] == "NA" and r["kind"] in ("mandatory", "pair") and not r.get("agreed")
                        and not r.get("pair_met"))
    return sorted(mandatory, key=recs.index)


def standing(r):
    """Where a case stands: passed, conditional pass, failed, blocked, not tested or not applicable.
    What plan classifies not applicable stays so, run or not; a mandatory NA nobody agreed is not tested."""
    status = r["status"]
    if r.get("na"):
        return "not applicable"
    if status in TESTED:
        return {"PASS": "passed", "CONDITIONAL PASS": "conditional pass", "FAIL": "failed"}[status]
    if status == "NA":
        return "not tested" if r.get("open_na") else "not applicable"
    if not status and r["remarks"].lower().startswith("needs tester"):
        return "blocked"
    return "not tested"


def tally(recs):
    """The summary counts, checked to add up: applicable is tested, blocked and not tested;
    tested is passed, conditional pass and failed; the sheet is applicable and not applicable."""
    c = {"cases": len(recs)}
    for name in ("passed", "conditional pass", "failed", "blocked", "not tested", "not applicable"):
        c[name] = sum(1 for r in recs if standing(r) == name)
    c["tested"] = sum(1 for r in recs if r["status"] in TESTED and not r.get("na"))
    c["applicable"] = sum(1 for r in recs if not r.get("na") and not (r["status"] == "NA" and not r.get("open_na")))
    if not (c["applicable"] == c["tested"] + c["blocked"] + c["not tested"]
            and c["tested"] == c["passed"] + c["conditional pass"] + c["failed"]
            and c["cases"] == c["applicable"] + c["not applicable"]):
        sys.exit("the summary counts do not add up: " + json.dumps(c))
    return c


def run_plan(path, run, entity):
    """Every case in sheet order: id, group, applicability, status so far. Then the totals."""
    recs, _ = read_cases(path, run, entity)
    if not recs:
        sys.exit("no Test Case ID column with ids in " + Path(path).name + ": nothing to plan")
    counts, statuses = {}, {}
    for r in recs:
        what = applicability(r)
        status = r["status"] or "open"
        print(" | ".join([r["id"], r["group"], what, status]))
        key = what.split(" (")[0].split(",")[0].split(";")[0]
        counts[key] = counts.get(key, 0) + 1
        statuses[status] = statuses.get(status, 0) + 1
    print("total " + str(len(recs)) + " cases: " + ", ".join(str(v) + " " + k for k, v in counts.items()) +
          "; status: " + ", ".join(str(v) + " " + k for k, v in statuses.items()))


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
        # A REQUEST-ID is a UUID; anything else in the field is not printed.
        out[norm(case).replace(" ", "")] = [norm(i) if UUID.fullmatch(norm(i)) else "[invalid id]"
                                            for i in ids if norm(i)]
    return out


def days(start, end):
    try:
        return (date.fromisoformat(end) - date.fromisoformat(start)).days + 1
    except (TypeError, ValueError):
        return ""




def codes(*texts):
    """The error codes and exceptions named in a response or remark."""
    found = []
    for text in texts:
        for c in ERROR.findall(text or ""):
            if c not in found:
                found.append(c)
    return ", ".join(found)


def shown(row, header=False):
    """A table row as text. A value beside a label naming a secret, such as "OTP used", is never shown."""
    secret = len(row) == 2 and not header and LABEL.search(str(row[0] or ""))
    return ["[redacted]" if secret and c == 1 and text else str(text if text is not None else "")
            for c, text in enumerate(row)]


def step_rows(remarks):
    """A multi step case's steps, read back from the "Steps: ..." the writer put at the end of Remarks."""
    found = STEPS.search(remarks or "")
    rows = []
    for part in (found.group(1).split("; ") if found else []):
        m = STEP.match(part.strip())
        if m:
            rows.append([m.group(1), m.group(2), m.group(3) or ""])
    return rows


def shot_rows(shots):
    """Screenshots into rows, in name order within each shape: a landscape one alone across the
    text width, portrait ones three to a row, a very tall one alone. Shapes never share a row."""
    kinds = []
    for shot in shots:
        if shot["kind"] not in kinds:
            kinds.append(shot["kind"])
    rows = []
    for kind in kinds:
        these = [s for s in shots if s["kind"] == kind]
        per = 3 if kind == "tall" else 1
        rows += [these[i:i + per] for i in range(0, len(these), per)]
    return rows


def unreadable(path):
    """Why a screenshot cannot be placed, or None when Pillow opens it."""
    from PIL import Image
    try:
        with Image.open(path) as im:
            im.load()
            if not im.size[0] or not im.size[1]:
                return "no pixels"
        return None
    except Exception as e:
        return type(e).__name__


def content(path, run, meta, evidence, recs, groups, manifest=None, draft=None, out=None):
    """What the report says, as a list of blocks. The DOCX and the PDF draw the same blocks."""
    from PIL import Image

    dm = meta.get("document", {})
    dates = meta.get("test_dates", {})
    milestone = meta.get("milestone", "")
    entity = meta["entity_type"]
    label = RUN_NAME[run]
    title = milestone + " " + label + " report"
    if draft:
        # A draft carries the mark on every page, so it is never mistaken for the report to submit.
        title = "Draft " + title
    rids = request_ids(manifest)
    safe = set()  # text printed unmasked: a list of REQUEST-IDs that are all UUIDs
    blocks = []

    def add(*block):
        blocks.append(block)

    def table(rows, header=None):
        add("table", rows, header)

    counted = settle(recs, groups)
    everything = tally(recs)
    mandatory = tally(counted)
    conditional = [r for r in recs if r["status"] == "CONDITIONAL PASS"]
    agreed = [r for r in recs if r.get("agreed")]
    tested = [r for r in recs if standing(r) in ("passed", "conditional pass", "failed")]
    untested = [r for r in recs if r not in tested]
    log = [r for r in recs if standing(r) in ("failed", "blocked", "conditional pass")]
    findings = meta.get("findings", {})
    ready = ("Ready for sandbox exit." if not draft else
             str(len(draft)) + " mandatory case" + (" is" if len(draft) == 1 else "s are") + " still open.")
    functions = []
    for r in recs:
        if r["group"] not in functions:
            functions.append(r["group"])
    by_function = [r for fn in functions for r in recs if r["group"] == fn]

    def condition(r):
        return STEPS.sub("", r["remarks"]).strip() or "Not recorded"

    def needed(r):
        """For a case not tested: what it waits for, or why it does not apply."""
        if r.get("agreed"):
            return "Agreed not run: " + r["agreed"]
        if r.get("na"):
            ran = ("Run, result " + r["status"] + ". ") if r["status"] in TESTED else ""
            return ran + "The group applies to " + r["applies"] + " only."
        if r["status"] and r["status"] not in TESTED + ("NA",):
            return "Unrecognised status: " + r["raw_status"]
        text = STEPS.sub("", r["remarks"]).strip()
        text = re.sub(r"^needs tester:\s*", "", text, flags=re.I)
        if r.get("open_na"):
            return ("Recorded NA without NHA's agreement: run it, or add the agreement to agreed_not_run."
                    + (" Remarks: " + text if text else ""))
        if not text and standing(r) == "blocked":
            text = "; ".join(s[2] for s in step_rows(r["remarks"]) if s[1] == "needs tester" and s[2])
        return text or ("Not run yet." if standing(r) == "not tested" else "Not recorded.")

    def shown_status(r):
        if r.get("na") and r["status"] in TESTED:
            return "Run, not applicable"
        return standing(r).capitalize()

    def either(r):
        return (" Either rule: " + r["either"] + " satisfies it.") if r.get("pair_met") else ""

    def passes(r):
        n = r["iterations"] or 1
        return str(n) + (" pass" if n == 1 else " passes")

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

    # 1. Document control
    add("h1", SECTIONS[0])
    table([["Document title", title], ["Document id", dm.get("id", "FT-" + milestone)],
           ["Version", dm.get("version", "")], ["Prepared by", dm.get("prepared_by", "")],
           ["Reviewed by", dm.get("reviewed_by", "")], ["Approved by", dm.get("approved_by", "")],
           ["Released by", dm.get("released_by", "")], ["Release date", dm.get("release_date", "")]])
    add("h2", "Change history")
    history = dm.get("change_history", [])
    table([[h.get("version", ""), h.get("date", ""), h.get("by", ""), h.get("change", "")] for h in history]
          or [["", "", "", ""]], header=["Version", "Date", "By", "Change"])
    add("h2", "Distribution")
    dist = dm.get("distribution", [])
    table([[d.get("name", ""), d.get("organisation", ""), d.get("role", "")] if isinstance(d, dict)
           else [str(d), "", ""] for d in dist] or [["", "", ""]], header=["Name", "Organisation", "Role"])

    # 2. Executive summary: the counts, each term in one line, then whether the run is done.
    add("h1", SECTIONS[1])
    keys = ["cases", "applicable", "tested", "passed", "conditional pass", "failed", "blocked", "not tested",
            "not applicable"]
    add("counts", [[name, everything[k], mandatory[k]] for (name, _), k in zip(COUNTS, keys)],
        ["Measure", "All cases", "Mandatory"],
        [[name, meaning.replace("not applicable", "not applicable to a " + entity + " entity")
          if name == "Applicable to this integrator" else meaning] for name, meaning in COUNTS], ready)

    # 3. ABDM details
    add("h1", SECTIONS[2])
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

    # 4. Results summary: by function, the conditional passes, the agreed NA, then every case not tested.
    add("h1", SECTIONS[3])
    add("h2", "Results by function")
    rows = []
    for fn in functions:
        c = tally([r for r in recs if r["group"] == fn])
        rows.append([fn, c["cases"], c["passed"], c["conditional pass"], c["failed"], c["blocked"],
                     c["not tested"], c["not applicable"]])
    table(rows, header=["Function", "Cases", "Passed", "Conditional pass", "Failed", "Blocked", "Not tested",
                        "Not applicable"])
    if conditional:
        add("h2", "Conditional passes")
        table([[r["id"], r["title"], condition(r)] for r in conditional], header=["Test case ID", "Title", "Condition"])
    if agreed:
        add("h2", "Mandatory cases NHA agreed not to run")
        table([[r["id"], r["title"], r["agreed"]] for r in agreed], header=["Test case ID", "Title", "Agreed by and when"])
    if untested:
        add("h2", "Cases not tested")
        table([[r["id"], r["title"], r["label"], shown_status(r), needed(r)]
               for r in by_function if r in untested],
              header=["Test case ID", "Title", "Marking", "Status", "Needed, or why not applicable"])

    # 5. Scope and limitations
    add("h1", SECTIONS[4])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)],
           ["Limitations", " ".join(["The results hold for the build and configuration tested from " +
                                     dates.get("start", "") + " to " + dates.get("end", "") + "."] +
                                    [str(x) for x in meta.get("limitations", [])])]])

    # 6. Flow details
    add("h1", SECTIONS[5])
    flows = meta.get("flows", [])
    if flows:
        table([[f.get("name", ""), ", ".join(f.get("abha_addresses", [])), ", ".join(f.get("hi_types", []))]
               for f in flows if isinstance(f, dict)],
              header=["Flow", "ABHA address used", "HI types created or tested"])
    else:
        add("para", "No linking or consent flow in this milestone.")

    # 7. Test environment and tools
    add("h1", SECTIONS[6])
    env = dict(meta.get("environment", {}))
    names = [("browser", "Browser"), ("browser_version", "Browser version"), ("playwright", "Playwright"),
             ("phr_app", "PHR app"), ("phr_app_version", "PHR app version"), ("emulator", "Emulator"),
             ("model", "Model that ran the agent")]
    rows = [[name, env.pop(key, "Not used")] for key, name in names]
    rows += [[key, val] for key, val in env.items()]
    table(rows, header=["Tool", "Version or value"])

    # 8. Test team
    add("h1", SECTIONS[7])
    team = meta.get("team", [])
    table([[m.get("name", ""), m.get("role", ""), m.get("qualifications", "")] for m in team if isinstance(m, dict)]
          or [[meta.get("executed_by", ""), "Tester", ""]], header=["Name", "Role", "Qualifications"])

    # 9. Approach and methodology: one line each.
    add("h1", SECTIONS[8])
    table([["Runner", "An agent ran each case with the module's test skill and wrote the result into the workbook."],
           ["Passes", "At most three per case. Iterations is the number of passes a case took."],
           ["Approvals", "A person gave every OTP, consent and approval as the case needed it. The agent kept no OTP."],
           ["PHR app", "A case through the PHR app is proved by one PHR app screenshot of the consent or the record."],
           ["Run type", run + ": Playwright drove the screens, with a screenshot per step." if run == "ui" else
            run + ": the calls to the sandbox and the callbacks decide each case. The response is the evidence."],
           ["Request IDs", "A fresh one on every call. Look each up in the gateway's own record."]])

    # 10. Test data
    add("h1", SECTIONS[9])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 11. Evidence: tested cases only, by function. Each: a result line, the expected and observed
    # results, its REQUEST-IDs, any steps, the response for an ft run, then its screenshots in rows.
    add("h1", SECTIONS[10])
    figures = []
    if not tested:
        add("para", "No case was tested.")
    for fn in functions:
        these = [r for r in recs if r["group"] == fn and r in tested]
        if not these:
            continue
        add("group", fn)
        for r in these:
            observed = findings.get(r["id"]) or STEPS.sub("", r["remarks"]).strip() or "None recorded."
            result = r["status"] + ", " + passes(r) + ". Marking: " + r["label"] + "." + either(r)
            if r["status"] == "CONDITIONAL PASS" and condition(r) != observed:
                result += " Condition: " + condition(r) + ("" if condition(r).endswith(".") else ".")
            err = codes(r["response"], r["remarks"]) if r["status"] != "PASS" or r["iterations"] > 1 else ""
            if err:
                result += " Error code: " + err + "."
            values = [result, r["expected"] or "Not given in the workbook", observed, rid_text(r)]
            shots, unread = [], []
            if run == "ui":
                folder = Path(evidence) / r["id"]
                files = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
                for step, shot in enumerate(files, 1):
                    if unreadable(shot):
                        # A file Pillow cannot open is named, never dropped and never a crash.
                        unread.append("Screenshot could not be read: " + shot.name + " (" + unreadable(shot) + ")")
                        continue
                    with Image.open(shot) as im:
                        w, h = im.size
                    shots.append({"path": shot, "step": step, "w": w, "h": h,
                                  "kind": "very tall" if h > 3 * w else "tall" if h > 1.2 * w else "wide"})
            rows = shot_rows(shots)
            for shot in [s for row in rows for s in row]:
                # Figures are numbered in the order they print.
                figures.append({"figure": len(figures) + 1, "case": r["id"], "step": shot["step"],
                                "file": str(shot["path"])})
                shot["figure"] = len(figures)
            add("case", r, values, r["response"] if run == "ft" else "", rows, step_rows(r["remarks"]), unread)

    # 12. Failures and iterations log: failed, blocked and conditional pass only.
    add("h1", SECTIONS[11])
    if log:
        table([[r["id"], standing(r).capitalize(), r["iterations"] or "",
                (condition(r) if r["status"] == "CONDITIONAL PASS" else needed(r) if standing(r) == "blocked"
                 else STEPS.sub("", r["remarks"]).strip() or r["response"] or "Not recorded") + either(r),
                codes(r["response"], r["remarks"]) or "None found"] for r in log],
              header=["Test case ID", "Status", "Iterations", "Failure reason", "Error code"])
    else:
        add("para", "No case failed, is blocked or passed with a condition.")

    # 13. Conclusion and sign-off
    add("h1", SECTIONS[12])
    add("ready", ready)
    table([["Prepared by", dm.get("prepared_by", ""), "", ""], ["Reviewed by", dm.get("reviewed_by", ""), "", ""],
           ["Approved by", dm.get("approved_by", ""), "", ""]], header=["Sign-off", "Name", "Date", "Signature"])

    # 14. Annexures
    add("h1", SECTIONS[13])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recordings]
          or [["", ""]], header=["Recording", "Link"])
    listing = Path(out).stem + "-screenshots.json" if out else "Not written"
    table([["Completed workbook", Path(path).name],
           ["REQUEST-ID manifest", Path(manifest).name if manifest else "Not given"],
           ["Full size screenshots", (str(evidence) + ", each figure listed in " + listing if run == "ui"
                                      else "Not used: the responses are the evidence")]],
          header=["Annexure", "File"])

    return {
        "title": title, "label": label, "run": run, "milestone": milestone, "entity": entity, "safe": safe,
        "draft": draft or [], "figures": figures, "counts": everything, "mandatory": mandatory,
        "product": meta.get("product", ""), "organisation": meta.get("organisation", ""), "blocks": blocks,
        "cover": [["Product", meta.get("product", "")], ["Organisation", meta.get("organisation", "")],
                  ["Milestone", milestone], ["Report type", label + " (run type " + run + ")"],
                  ["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
                  ["Release date", dm.get("release_date", "")]],
        "facts": [["Document id", dm.get("id", "FT-" + milestone)], ["Version", dm.get("version", "")],
                  ["Release date", dm.get("release_date", "")], ["Run type", run + ", " + label],
                  ["Entity type", entity], ["Test dates", dates.get("start", "") + " to " + dates.get("end", "")],
                  ["Executed by", meta.get("executed_by", "")]],
        "confidential": ("Confidential. Aadhaar, ABHA and mobile numbers are masked, and the report "
                         "holds no credential, token or OTP."),
    }


def shot_parts(shot, text_mm, gap_mm=4):
    """How a screenshot prints, as (crop box or None, width mm, height mm) for each piece: a
    landscape one across the text width, no taller than a row and never under 140 mm wide; a
    portrait one a row tall, never under 45 mm wide and never over a third of the row; a very tall
    one 60 mm wide, cut into pieces that fit a page."""
    w, h = float(shot["w"]), float(shot["h"])
    if shot["kind"] == "wide":
        width = min(text_mm, max(SHOT_MM["wide_min_width"], ROW_MM * w / h))
        return [(None, width, width * h / w)]
    if shot["kind"] == "tall":
        slot = (text_mm - 2 * gap_mm) / 3.0
        width = min(slot, max(SHOT_MM["tall_min_width"], ROW_MM * w / h))
        return [(None, width, width * h / w)]
    width = SHOT_MM["very tall"]
    pieces = max(1, int(-(-(width * h / w) // SHOT_MM["part"])))
    step = int(-(-h // pieces))
    out = []
    for i in range(pieces):
        top, bottom = i * step, min(int(h), (i + 1) * step)
        out.append(((0, top, int(w), bottom), width, width * (bottom - top) / w))
    return out


def embedded(shot, crop, w_mm, h_mm):
    """The screenshot as it goes in the file: every source pixel, unless that is more than prints
    at 300 dots per inch, when it is scaled to that. PNG stays lossless; JPEG keeps quality 95.
    The full size file stays in the evidence folder for the annexure bundle."""
    from io import BytesIO
    from PIL import Image
    cap = (max(1, int(w_mm / 25.4 * DPI)), max(1, int(h_mm / 25.4 * DPI)))
    with Image.open(shot["path"]) as im:
        jpeg = im.format == "JPEG"
        if crop is None and im.format in ("PNG", "JPEG") and im.size[0] <= cap[0]:
            return BytesIO(Path(shot["path"]).read_bytes())
        im.load()
        if crop is not None:
            im = im.crop(crop)
        if im.mode not in ("RGB", "RGBA", "L"):
            im = im.convert("RGBA" if "A" in im.mode or im.mode == "P" else "RGB")
        if im.size[0] > cap[0]:
            im = im.resize((cap[0], max(1, int(im.size[1] * cap[0] / float(im.size[0])))), Image.LANCZOS)
        buf = BytesIO()
        if jpeg:
            im.convert("RGB").save(buf, "JPEG", quality=95)
        else:
            im.save(buf, "PNG", optimize=True)
    buf.seek(0)
    return buf


def caption(shot, piece, pieces, short=True):
    text = ("Fig " if short else "Figure ") + str(shot["figure"]) + ", step " + str(shot["step"])
    return text + (", part " + str(piece) + " of " + str(pieces) if pieces > 1 else "")


def pieces_of(text, size=600):
    """Long text in pieces of about size characters, broken at a space, so each fits a page."""
    text = str(text if text is not None else "")
    out = []
    while len(text) > size:
        cut = text.rfind(" ", 0, size)
        cut = cut if cut > size // 2 else size
        out.append(text[:cut])
        text = text[cut:].lstrip()
    return out + [text]


def write_docx(m, out):
    """The editable copy, in Word's format: the same blocks, with Word's contents and page fields."""
    from docx import Document
    from docx.enum.text import WD_BREAK
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.shared import Mm, Pt

    doc = Document()
    sec = doc.sections[0]
    width = sec.page_width - sec.left_margin - sec.right_margin

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
            for c, (cell, text) in enumerate(zip(cells, shown(row, header and n == 0))):
                cell.text = text
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

    def page_break():
        doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # Page header and footer on every page: the report title; Confidential and page N of M.
    sec.header.paragraphs[0].text = m["title"]
    foot = sec.footer.paragraphs[0]
    foot.add_run("Confidential, page ")
    field(foot, "PAGE", "1")
    foot.add_run(" of ")
    field(foot, "NUMPAGES", "1")

    # Cover
    doc.add_heading(m["title"], level=0)
    table(m["cover"])
    doc.add_paragraph(m["confidential"])
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

    for block in m["blocks"]:
        kind = block[0]
        if kind == "h1":
            doc.add_heading(block[1], level=1)
        elif kind in ("h2", "group"):
            doc.add_heading(block[1], level=2)
        elif kind == "table":
            table(block[1], header=block[2])
        elif kind == "para":
            doc.add_paragraph(block[1])
        elif kind == "counts":
            table(block[1], header=block[2])
            for term, meaning in block[3]:
                p = doc.add_paragraph()
                p.add_run(term + ": ").bold = True
                p.add_run(meaning)
            doc.add_paragraph().add_run(block[4]).bold = True
        elif kind == "ready":
            doc.add_paragraph().add_run(block[1]).bold = True
        elif kind == "case":
            r, values, response, rows, steps, unread = block[1:]
            doc.add_heading(r["id"] + ": " + r["title"], level=3)
            table([[k, v] for k, v in zip(CASE_FIELDS, values)])
            if steps:
                table(steps, header=["Step", "Result", "Note"])
            if response:
                p = doc.add_paragraph()
                p.add_run("Response with code: ").bold = True
                code = p.add_run(response)
                code.font.name = "Courier New"
                code.font.size = Pt(9)
            for note in unread:
                doc.add_paragraph(note)
            text_mm = width / 36000.0
            for row in rows:
                # The PDF's layout: a landscape screenshot across the page, portrait ones three to a row.
                if row[0]["kind"] == "tall":
                    grid = doc.add_table(rows=1, cols=len(row))
                    for cell, shot in zip(grid.rows[0].cells, row):
                        crop, w, h = shot_parts(shot, text_mm)[0]
                        cell.paragraphs[0].add_run().add_picture(embedded(shot, crop, w, h), width=Mm(w), height=Mm(h))
                        cell.add_paragraph(caption(shot, 1, 1, False), style="Caption")
                    continue
                for shot in row:
                    parts = shot_parts(shot, text_mm)
                    for n, (crop, w, h) in enumerate(parts, 1):
                        doc.add_picture(embedded(shot, crop, w, h), width=Mm(w), height=Mm(h))
                        doc.add_paragraph(caption(shot, n, len(parts), False), style="Caption")

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
                if r.text and r.text not in m["safe"]:
                    masked = mask(r.text)
                    if masked != r.text:
                        r.text = masked
    doc.save(str(out))
    print("wrote " + str(out))


# The ABDM Sandbox design system: colours, and the fonts it names with their PDF fallbacks.
INK = {"navy": "#112044", "deep": "#0B1630", "blue": "#264488", "ink": "#1C2333", "ink2": "#3A4460",
       "ink3": "#4A5368", "ink4": "#6A738A", "orange": "#E8791F", "otext": "#B4530F", "peach": "#FBF1E7",
       "mist": "#F4F6FA", "line": "#DDE2EE", "dark": "#1C2333", "ice": "#C9D4EE", "off": "#FFFDF8"}
FONTS = {"serif": (["newsreader-light.ttf", "newsreader_18pt-light.ttf", "newsreader-regular.ttf", "newsreader.ttf"],
                   "Times-Roman", "Newsreader"),
         "sans": (["publicsans-regular.ttf", "publicsans.ttf"], "Helvetica", "Public Sans"),
         "mono": (["jetbrainsmono-regular.ttf", "jetbrainsmono.ttf"], "Courier", "JetBrains Mono")}
MILESTONES = {"M1": "M1 Identity", "M2": "M2 Health Information Provider", "M3": "M3 Health Information User",
              "M4": "M4 Registry Integration"}
# Column widths, as shares of the text width, for the tables the report holds.
WIDTHS = {
    ("Version", "Date", "By", "Change"): [.12, .18, .25, .45],
    ("Name", "Organisation", "Role"): [.34, .36, .30],
    ("Measure", "All cases", "Mandatory"): [.56, .22, .22],
    ("Function", "Cases", "Passed", "Conditional pass", "Failed", "Blocked", "Not tested", "Not applicable"):
        [.36, .07, .08, .11, .08, .09, .10, .11],
    ("Test case ID", "Title", "Condition"): [.24, .30, .46],
    ("Step", "Result", "Note"): [.10, .22, .68],
    ("Test case ID", "Title", "Marking", "Status", "Needed, or why not applicable"): [.22, .30, .14, .12, .22],
    ("Test case ID", "Title", "Agreed by and when"): [.25, .37, .38],
    ("Test case ID", "Status", "Iterations", "Failure reason", "Error code"): [.22, .12, .11, .37, .18],
    ("Flow", "ABHA address used", "HI types created or tested"): [.30, .35, .35],
    ("Name", "Role", "Qualifications"): [.34, .26, .40],
    ("Sign-off", "Name", "Date", "Signature"): [.18, .34, .18, .30],
}


def find_fonts(extra=None):
    """Register Newsreader, Public Sans and JetBrains Mono where found, else Times-Roman, Helvetica and Courier."""
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    dirs = ([Path(extra)] if extra else []) + [
        Path("abdm-ft/fonts"), Path(__file__).resolve().parent / "fonts", Path.home() / "Library" / "Fonts",
        Path("/Library/Fonts"), Path("/usr/share/fonts")]
    chosen, notes = {}, []
    for role, (names, fallback, family) in FONTS.items():
        for d in dirs:
            if role in chosen or not d.is_dir():
                continue
            files = {}
            for f in d.rglob("*.ttf"):
                files.setdefault(f.name.lower(), f)
            for name in names:
                if name in files and role not in chosen:
                    try:
                        pdfmetrics.registerFont(TTFont("abdm-" + role, str(files[name])))
                        chosen[role] = "abdm-" + role
                        notes.append(family + " from " + str(files[name]))
                    except Exception:
                        pass
        if role not in chosen:
            chosen[role] = fallback
            notes.append(family + " not found, " + fallback + " in its place")
    print("fonts: " + "; ".join(notes))
    return chosen


def write_pdf(m, out, fonts_dir=None):
    """The report to submit, drawn in the ABDM Sandbox design system with ReportLab."""
    from io import BytesIO
    from xml.sax.saxutils import escape
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_RIGHT
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.pdfbase.pdfmetrics import stringWidth
    from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Flowable, Frame, Image as Picture,
                                    NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer, Table,
                                    TableStyle)

    F = find_fonts(fonts_dir)
    C = {k: colors.HexColor(v) for k, v in INK.items()}
    W, H = A4
    M = 20 * mm
    TW = W - 2 * M
    safe = m["safe"]

    def clean(text):
        """Every string drawn goes through the DOCX's mask, a list of UUID REQUEST-IDs excepted."""
        text = str(text if text is not None else "")
        return text if text in safe else mask(text)

    def style(name, font, size, lead, color, **kw):
        return ParagraphStyle(name, fontName=F[font], fontSize=size, leading=lead, textColor=C[color], **kw)

    S = {
        "body": style("body", "sans", 9.5, 14.5, "ink3", spaceAfter=6),
        "lead": style("lead", "sans", 11, 17, "ink2", spaceAfter=8),
        "cell": style("cell", "sans", 8.8, 12.6, "ink3"),
        "strong": style("strong", "sans", 8.8, 12.6, "ink"),
        "id": style("id", "mono", 7.8, 11.5, "ink"),
        "code": style("code", "mono", 7.6, 11, "ink2"),
        "h1": style("h1", "serif", 22, 26, "navy", spaceAfter=10),
        "h2": style("h2", "serif", 15, 19, "navy", spaceBefore=12, spaceAfter=6),
        "case": style("case", "serif", 12, 15, "navy", spaceAfter=4),
        "small": style("small", "sans", 8.2, 11, "ink"),
        "term": style("term", "sans", 8.2, 11.6, "ink3"),
        "note": style("note", "sans", 9.5, 14.5, "ink2"),
        "chev": style("chev", "serif", 13, 14.5, "orange"),
        "page": style("page", "mono", 8, 12, "ink4", alignment=TA_RIGHT),
        "toc": style("toc", "sans", 10.5, 14, "ink"),
        "tocpage": style("tocpage", "mono", 7.2, 10, "ink4", alignment=TA_RIGHT),
        "digit": style("digit", "mono", 24, 28, "off"),
        "cover": style("cover", "serif", 38, 43, "off"),
        "coversub": style("coversub", "sans", 11.5, 16, "ice"),
        "fact": style("fact", "sans", 10, 13.5, "ink"),
    }

    def para(text, s="body"):
        return Paragraph(escape(clean(text)), S[s])

    class Tracked(Flowable):
        """Mono uppercase with wide tracking, which a Paragraph cannot draw: wraps on spaces."""

        def __init__(self, text, size=7.2, color="otext", space=None, upper=True, after=0):
            Flowable.__init__(self)
            text = clean(text)
            self.text = text.upper() if upper else text
            self.size, self.color, self.after = size, color, after
            self.space = size * 0.12 if space is None else space
            self.lead = size * 1.45

        def measure(self, s):
            return stringWidth(s, F["mono"], self.size) + self.space * max(len(s) - 1, 0)

        def wrap(self, aw, ah):
            lines, cur = [], ""
            for word in self.text.split(" "):
                trial = cur + " " + word if cur else word
                if cur and self.measure(trial) > aw:
                    lines.append(cur)
                    cur = word
                else:
                    cur = trial
            lines.append(cur)
            widest = max(self.measure(x) for x in lines)
            if widest > aw:
                # One word wider than its cell, such as ITERATIONS: tighten the tracking, then the size.
                self.space = 0
                widest = max(self.measure(x) for x in lines)
                if widest > aw:
                    self.size *= aw / widest
                    widest = aw
            self.lines = lines
            self.width = min(aw, widest)
            self.height = len(lines) * self.lead + self.after
            return self.width, self.height

        def draw(self):
            c = self.canv
            c.setFont(F["mono"], self.size)
            c.setFillColor(C[self.color])
            for i, line in enumerate(self.lines):
                # The first baseline sits where a 9pt Paragraph's would, so labels line up with cell text.
                c.drawString(0, self.height - self.after - i * self.lead - self.size * 1.2, line, charSpace=self.space)

    class Rule(Flowable):
        """A rule across the text width. At the top of a page it drops the space above it, and a
        hairline between cases drops altogether, so it never doubles the header's rule."""

        def __init__(self, color="dark", width=1, before=0, after=10, top=True):
            Flowable.__init__(self)
            self.color, self.weight, self.before, self.after, self.top = color, width, before, after, top

        def wrap(self, aw, ah):
            self.width = aw
            self.skip = ah >= H - 2 * M - 1 and not self.top
            at_top = ah >= H - 2 * M - 1
            self.height = 0 if self.skip else (0 if at_top else self.before) + self.after + self.weight
            return aw, self.height

        def draw(self):
            if self.skip:
                return
            self.canv.setStrokeColor(C[self.color])
            self.canv.setLineWidth(self.weight)
            y = self.after + self.weight / 2.0
            self.canv.line(0, y, self.width, y)

    class Mark(Flowable):
        """A zero size marker whose page the contents list records."""

        def __init__(self, key):
            Flowable.__init__(self)
            self.toc_key = key

        def wrap(self, aw, ah):
            return 0, 0

        def draw(self):
            pass

    def status(text):
        word = clean(text).split(" ")[0].upper()
        color = "blue" if word in ("PASS", "CONDITIONAL") else "otext" if word == "FAIL" else "ink4"
        return Tracked(text or "Not recorded", size=7.2, color=color, space=0.6)

    def grid(rows, header=None, pad=4.2, value="strong"):
        """Hairline rules only, a mist header row of mono labels that repeats, Paragraphs that wrap."""
        cols = len(header or rows[0])
        shares = WIDTHS.get(tuple(header or ())) or ([.34, .66] if cols == 2 else [1.0 / cols] * cols)
        body = []
        split = []
        for row in rows:
            # A cell too long for one page goes on over rows, so a table never outgrows a page.
            texts = shown(row)
            chunks = [pieces_of(x) for x in texts]
            for n in range(max(len(c) for c in chunks)):
                split.append(([c[n] if n < len(c) else "" for c in chunks], n))
        for texts, n in split:
            cells = []
            for c, text in enumerate(texts):
                name = header[c] if header else ("Label" if c == 0 else texts[0])
                if n and (c == 0 or not text):
                    cells.append("")
                elif not header and c == 0:
                    cells.append(Tracked(text, size=6.8, color="ink4", space=0.7))
                elif name == "Status":
                    cells.append(status(text))
                elif name == "Test case ID":
                    cells.append(para(text, "id"))
                elif not header:
                    cells.append(para(text, value))
                else:
                    cells.append(para(text, "cell"))
            body.append(cells)
        data = ([[Tracked(h, size=6.6, color="ink3", space=0.7) for h in header]] if header else []) + body
        t = Table(data, colWidths=[TW * s for s in shares], repeatRows=1 if header else 0, hAlign="LEFT",
                  rowHeights=None)
        cmds = [("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7), ("TOPPADDING", (0, 0), (-1, -1), pad),
                ("BOTTOMPADDING", (0, 0), (-1, -1), pad),
                ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"]), ("LINEABOVE", (0, 0), (-1, 0), 0.6, C["line"])]
        if header:
            cmds += [("BACKGROUND", (0, 0), (-1, 0), C["mist"]), ("TOPPADDING", (0, 0), (-1, 0), 7),
                     ("BOTTOMPADDING", (0, 0), (-1, 0), 5.5)]
            if header[0] == "Sign-off":
                cmds += [("TOPPADDING", (0, 1), (-1, -1), 14), ("BOTTOMPADDING", (0, 1), (-1, -1), 14)]
        t.setStyle(TableStyle(cmds))
        return t

    def callout(lines, s="note"):
        rows = [[Paragraph("›", S["chev"]), para(line, s)] for line in lines]
        t = Table(rows, colWidths=[28, TW - 28], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), C["peach"]), ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (0, -1), 13), ("LEFTPADDING", (1, 0), (1, -1), 2),
            ("RIGHTPADDING", (0, 0), (0, -1), 0), ("RIGHTPADDING", (1, 0), (1, -1), 16), ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5), ("TOPPADDING", (0, 0), (-1, 0), 12),
            ("BOTTOMPADDING", (0, -1), (-1, -1), 12)]))
        return t


    def facts(values):
        """A tested case's fields, each a labelled line or paragraph, hairlines between them. The
        result and the REQUEST-IDs share the first line; long text goes on over rows."""
        def cell(name, text, first=True):
            label = ('<font name="' + F["mono"] + '" size="6.2" color="' + INK["ink4"] + '">' +
                     escape(name.upper()) + "</font>&nbsp;&nbsp; ") if first else ""
            return Paragraph(label + escape(clean(text)), S["code" if name == "Request IDs" else "small"])

        rows = [[cell(CASE_FIELDS[0], values[0]), cell(CASE_FIELDS[3], values[3])]]
        spans = []
        for name, text in zip(CASE_FIELDS[1:3], values[1:3]):
            for n, piece in enumerate(pieces_of(text, 1200)):
                spans.append(("SPAN", (0, len(rows)), (1, len(rows))))
                rows.append([cell(name, piece, n == 0), ""])
        t = Table(rows, colWidths=[TW * 0.56, TW * 0.44], hAlign="LEFT")
        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                               ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 1.6),
                               ("BOTTOMPADDING", (0, 0), (-1, -1), 1.6), ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"]),
                               ("RIGHTPADDING", (0, 0), (0, 0), 10)] + spans))
        return t

    def terms(rows):
        """Each term of the counts table on one line: the term, then what it means."""
        return [Paragraph("<b>" + escape(clean(term)) + "</b>: " + escape(clean(meaning)), S["term"])
                for term, meaning in rows] + [Spacer(1, 8)]

    def framed(shot, crop, w, h, text):
        pic = Picture(embedded(shot, crop, w, h), width=w * mm, height=h * mm)
        frame = Table([[pic]], colWidths=[w * mm], rowHeights=[h * mm], hAlign="LEFT")
        frame.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.6, C["line"]),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                   ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
        return [frame, Spacer(1, 2), Tracked(text, size=6.2, color="ink4", space=0, upper=False)]

    def shots(row):
        """One row of screenshots as flowables: portrait ones side by side; a landscape one alone;
        a very tall one as one flowable per piece, so each piece fits a page."""
        out = []
        if row[0]["kind"] == "tall":
            cells = []
            for shot in row:
                crop, w, h = shot_parts(shot, TW / mm)[0]
                cells.append(framed(shot, crop, w, h, caption(shot, 1, 1)))
            out.append(Table([cells], colWidths=[TW / 3.0] * len(row), hAlign="LEFT"))
        else:
            for shot in row:
                parts = shot_parts(shot, TW / mm)
                for n, (crop, w, h) in enumerate(parts, 1):
                    out.append(Table([[framed(shot, crop, w, h, caption(shot, n, len(parts)))]], colWidths=[TW],
                                     hAlign="LEFT"))
        for f in out:
            f.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                   ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 6),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
        return out

    def opener(number, name):
        return [CondPageBreak(120), Rule("dark", 1, before=12, after=10), Mark("s" + str(number)),
                Tracked("%02d · %s" % (number, name), size=7.5, color="otext", space=1.0, after=8),
                Paragraph(escape(clean(name)), S["h1"])]

    def story(marks, total):
        out = [NextPageTemplate("inner"), PageBreak()]
        out += [Rule("dark", 1, after=12), Tracked("Contents", size=7.5, color="otext", space=1.0, after=8),
                Paragraph("Contents", S["h1"])]
        functions = [b[1] for b in m["blocks"] if b[0] == "group"]

        def sections(names, first):
            rows = [[Tracked("%02d" % (first + i), size=7.5, color="otext", space=0.6), para(name, "toc"),
                     para(str(marks.get("s" + str(first + i), 0)), "page")] for i, name in enumerate(names)]
            t = Table(rows, colWidths=[40, TW - 80, 40], hAlign="LEFT")
            t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                   ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 4),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                                   ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"])]))
            return t

        split = SECTIONS.index("Evidence") + 1
        out.append(sections(SECTIONS[:split], 1))
        if functions:
            # Under Evidence, each function group with the page it starts on.
            rows = [["", para(name, "small"), para(str(marks.get("g" + name, 0)), "tocpage")] for name in functions]
            groups_t = Table(rows, colWidths=[40, TW - 80, 40], hAlign="LEFT")
            groups_t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                          ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                                          ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5), ("TOPPADDING", (0, 0), (-1, 0), 6),
                                          ("BOTTOMPADDING", (0, -1), (-1, -1), 6),
                                          ("LINEBELOW", (0, -1), (-1, -1), 0.6, C["line"])]))
            out.append(groups_t)
        out.append(sections(SECTIONS[split:], split + 1))
        out.append(PageBreak())

        # A heading never ends a page alone: a section opener, a group heading or a case heading is
        # held, then kept on one page with the first thing after it.
        section, held = 0, []

        def place(lead, rest=()):
            # Ask for the room the held headings and the lead take, with a margin; a lead taller than
            # a page asks for the headings and its first lines.
            body = H - 2 * M
            need = sum(f.wrap(TW, body)[1] + f.getSpaceBefore() + f.getSpaceAfter() for f in held + list(lead))
            if need > body:
                need = sum(f.wrap(TW, body)[1] for f in held) + 80
            out.append(CondPageBreak(need + 14))
            out.extend(held + list(lead) + list(rest))
            del held[:]

        for block in m["blocks"]:
            kind = block[0]
            if kind == "h1":
                section += 1
                parts = opener(section, block[1])
                out.append(parts[0])
                held.extend(parts[1:])
            elif kind == "h2":
                held.append(Paragraph(escape(clean(block[1])), S["h2"]))
            elif kind == "group":
                held.extend([Mark("g" + block[1]), Paragraph(escape(clean(block[1])), S["h2"])])
            elif kind == "table":
                place([grid(block[1], block[2]), Spacer(1, 10)])
            elif kind == "counts":
                # The counts, what each means and the verdict stay on one page.
                place([grid(block[1], block[2], pad=3), Spacer(1, 6)] + terms(block[3]) +
                      [callout([block[4]], "lead"), Spacer(1, 10)])
            elif kind == "ready":
                place([callout([block[1]], "lead"), Spacer(1, 10)])
            elif kind == "para":
                place([para(block[1])])
            elif kind == "case":
                # A case flows on from the one before; its heading and fields stay with its first screenshot.
                r, values, response, rows, steps, unread = block[1:]
                lead = [Rule("line", 0.6, before=2, after=6, top=False), Mark("c" + r["id"]),
                        Paragraph('<font name="' + F["mono"] + '" size="8" color="' + INK["otext"] + '">' +
                                  escape(clean(r["id"])) + "</font>&nbsp;&nbsp; " + escape(clean(r["title"])),
                                  S["case"]), facts(values)]
                lead += [para(note, "small") for note in unread]
                if steps:
                    lead += [Spacer(1, 4), grid(steps, ["Step", "Result", "Note"], pad=2.6)]
                if response:
                    code = Table([[Tracked("Response with code", size=6.6, color="ink4", space=0.7, after=3)]] +
                                 [[para(piece, "code")] for piece in pieces_of(response, 1500)],
                                 colWidths=[TW], hAlign="LEFT")
                    code.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C["mist"]),
                                              ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                                              ("TOPPADDING", (0, 0), (-1, 0), 6), ("BOTTOMPADDING", (0, -1), (-1, -1), 6),
                                              ("TOPPADDING", (0, 1), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -2), 0)]))
                    lead += [Spacer(1, 4), code]
                pictures = [f for row in rows for f in shots(row)]
                place(lead + pictures[:1], pictures[1:] + [Spacer(1, 6)])
        if held:
            place([])
        return out

    eyebrow = clean(m["title"]).upper()

    def tracked(c, x, y, text, size, color, space, right=False):
        text = clean(text)
        c.setFont(F["mono"], size)
        c.setFillColor(C[color])
        if right:
            x -= stringWidth(text, F["mono"], size) + space * (len(text) - 1)
        c.drawString(x, y, text, charSpace=space)

    def inner(c, d):
        c.saveState()
        tracked(c, M, H - 13 * mm, eyebrow, 6.8, "ink4", 0.8)
        c.setStrokeColor(C["line"])
        c.setLineWidth(0.6)
        c.line(M, H - 15.5 * mm, W - M, H - 15.5 * mm)
        c.line(M, 15 * mm, W - M, 15 * mm)
        tracked(c, M, 11 * mm, "CONFIDENTIAL", 6.8, "ink4", 0.8)
        tracked(c, W - M, 11 * mm, "PAGE " + str(d.page) + " OF " + str(d.total or d.page), 6.8, "ink4", 0.8,
                right=True)
        c.restoreState()

    def cover(c, d):
        import math
        c.saveState()
        top = H * 0.47
        c.setFillColor(C["navy"])
        c.rect(0, top, W, H - top, stroke=0, fill=1)
        # The Ashoka wheel, bleeding off the top right: 24 spokes and three rings, ice at 11 percent.
        p = c.beginPath()
        p.rect(0, top, W, H - top)
        c.clipPath(p, stroke=0, fill=0)
        cx, cy, R = W - 22 * mm, H - 18 * mm, 92 * mm
        c.setStrokeColor(C["ice"])
        c.setStrokeAlpha(0.11)
        c.setLineWidth(1.4)
        for radius in (R, R * 0.86, R * 0.16):
            c.circle(cx, cy, radius, stroke=1, fill=0)
        for k in range(24):
            a = 2 * math.pi * k / 24
            c.line(cx + R * 0.16 * math.cos(a), cy + R * 0.16 * math.sin(a),
                   cx + R * 0.86 * math.cos(a), cy + R * 0.86 * math.sin(a))
        c.restoreState()
        c.saveState()
        c.setFillColor(C["orange"])
        c.rect(M, H - 26 * mm, 18 * mm, 2, stroke=0, fill=1)
        tracked(c, M, H - 33 * mm, "ABDM SANDBOX · FUNCTIONAL TEST REPORT", 7.8, "orange", 1.4)
        if m.get("draft"):
            tracked(c, M, H - 39 * mm, "DRAFT · " + str(len(m["draft"])) + " MANDATORY CASES NOT YET PASS", 7.8, "ice", 1.4)
        tail = MILESTONES.get(m["milestone"].upper(), m["milestone"])
        lead = ("Draft " + m["label"]) if m.get("draft") else (m["label"][:1].upper() + m["label"][1:])
        head = (escape(clean(lead + " report, ")) +
                '<font color="' + INK["orange"] + '">' + escape(clean(tail)) + "</font>")
        title = Paragraph(head, S["cover"])
        _, th = title.wrap(TW * 0.86, H)
        sub = Paragraph(escape(clean(m["product"])) + " &#183; " + escape(clean(m["organisation"])), S["coversub"])
        _, sh = sub.wrap(TW * 0.86, H)
        sub.drawOn(c, M, top + 16 * mm)
        title.drawOn(c, M, top + 16 * mm + sh + 8 * mm)
        # Key facts as a ruled-box grid: four across, then three.
        cells = []
        for label, value in m["facts"]:
            cells.append([Tracked(label, size=6.6, color="ink4", space=0.7, after=4), para(value, "fact")])
        rows = [cells[:4], [cells[4], cells[6], cells[5], ""]]
        facts = Table(rows, colWidths=[TW / 4.0] * 4)
        facts.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.8, C["line"]), ("INNERGRID", (0, 0), (-1, -1), 0.8, C["line"]),
                                   ("SPAN", (2, 1), (3, 1)), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                                   ("TOPPADDING", (0, 0), (-1, -1), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 12)]))
        _, fh = facts.wrap(TW, H)
        facts.drawOn(c, M, top - 14 * mm - fh)
        note = callout([m["confidential"]])
        _, nh = note.wrap(TW, H)
        note.drawOn(c, M, 22 * mm)
        c.restoreState()

    class Doc(BaseDocTemplate):
        def afterFlowable(self, f):
            key = getattr(f, "toc_key", None)
            if key and key not in self.marks:
                self.marks[key] = self.page

    marks, total, pdf = {}, 0, b""
    for attempt in range(4):
        buf = BytesIO()
        d = Doc(buf, pagesize=A4, leftMargin=M, rightMargin=M, topMargin=M, bottomMargin=M,
                title=clean(m["title"]), author=clean(m["organisation"]), subject="ABDM functional test report")
        d.marks, d.total = {}, total
        frame = Frame(M, M, TW, H - 2 * M, id="body", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        d.addPageTemplates([PageTemplate("cover", [frame], onPage=cover), PageTemplate("inner", [frame], onPage=inner)])
        d.build(story(marks, total))
        pdf = buf.getvalue()
        if d.marks == marks and d.page == total:
            break
        marks, total = d.marks, d.page
    Path(out).write_bytes(pdf)
    print("wrote " + str(out))


def build(path, run, meta, evidence, out, recs, groups, manifest=None, fmt="both", fonts_dir=None, draft=None):
    """Write the report: the PDF to submit and the DOCX to edit, beside each other."""
    m = content(path, run, meta, evidence, recs, groups, manifest, draft, out)
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if m["figures"]:
        # The full size screenshots go in the annexure bundle; this lists them figure by figure.
        listing = out.with_name(out.stem + "-screenshots.json")
        listing.write_text(json.dumps({"report": out.stem, "figures": m["figures"]}, indent=1))
        print("wrote " + str(listing))
    if fmt in ("docx", "both"):
        write_docx(m, out.with_suffix(".docx"))
    if fmt in ("pdf", "both"):
        write_pdf(m, out.with_suffix(".pdf"), fonts_dir)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("action", choices=["plan", "check", "build"])
    p.add_argument("workbook")
    p.add_argument("--run", choices=["ft", "ui"], required=True)
    p.add_argument("--entity", choices=["government", "private"])
    p.add_argument("--meta")
    p.add_argument("--evidence", default="abdm-ft/evidence")
    p.add_argument("--out")
    p.add_argument("--manifest")
    p.add_argument("--format", choices=["pdf", "docx", "both"], default="both")
    p.add_argument("--fonts")
    p.add_argument("--draft", action="store_true",
                   help="build even when mandatory cases are not PASS, marked Draft on every page")
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
    if a.action == "plan":
        run_plan(a.workbook, a.run, entity)
        return
    recs, groups, blocking = run_check(a.workbook, a.run, entity, agreed_cases(meta))
    if blocking and not (a.action == "build" and a.draft):
        if a.action == "build":
            print("no report: every mandatory case must be PASS first. --draft writes a draft marked as one",
                  file=sys.stderr)
        sys.exit(1)
    if a.action == "build":
        build(a.workbook, a.run, meta, a.evidence, a.out, recs, groups, a.manifest, a.format, a.fonts,
              blocking if blocking else None)


if __name__ == "__main__":
    main()
```

### What happens

**Before the first case, plan the run from the workbook:**

```bash
python3 abdm-ft/abdm_report.py plan <workbook> --run ui --entity private
```

It prints one line per case, in sheet order: the case id, its group (the sheet's Function, else its section heading), what it is for your entity type (`mandatory`, `mandatory, either <id> or <id>`, `conditional`, `optional`, or `not applicable` with the group and its Applicable To; an Applicable To that names neither entity type, such as `PHR App`, adds `applies: PHR App (read as all)`), and its status so far in the run type's column, `open` when blank. Then one `total` line. NHA's PHR workbook carries no case ids until the writer's first write adds them, so for P1 to P4 write an empty results file, `[]`, with `abdm_workbook.py write` first, then run `plan`. Create the run log's rows from this list, one per case. No case may be dropped: a case that cannot run is `needs-human` with what it needs named, after the tester was asked for it, or `not-run` with the rule that makes it not apply. Before the tester leaves, run `python3 abdm-ft/abdm_workbook.py open <workbook> --run ui --entity private` and read the list out, so every case still waiting for them is done or asked about while they are there.

1. When the last case is recorded and written into the workbook, run the gate for the run type and your entity type:

   ```bash
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private --meta abdm-ft/meta.json
   ```

   `--meta` is optional for `check`: it is read for `agreed_not_run`. The script prints one `marking` line for every case whose marking is entity specific, conditional, an either rule, a field list, blank or unrecognised, with how it was treated, and one `agreed not run <id>: <agreement>` line per mandatory `NA` case `agreed_not_run` lets through. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

2. If it exits `1`, the run is not finished, but the tester still gets a PDF of where it stands. Build the draft:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/draft-report-m1.pdf --draft
   ```

   The draft is the same report, marked Draft on the cover and in the header of every page. Its executive summary ends on `<n> mandatory cases are still open.`, and each of them is in the failures log or the table of cases not tested. It is never the report to submit. Then rerun the cases `check` listed, as `open` in `shared.concept.test-workbook-write-back` does, and run `check` again. Every run ends with a PDF: the report when `check` exits `0`, the draft when it does not.

3. Only when `check` exits `0`, write the one line findings into `meta.json` under `findings`, keyed by case id. A case without one gets its Remarks value. Then build:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/report-m1.pdf
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails. `--manifest` is optional. It writes `abdm-ft/report-m1.pdf`, the report to submit, and `abdm-ft/report-m1.docx` beside it, the editable copy, whichever of the two suffixes `--out` names. `--format pdf` writes the PDF alone and `--format docx` the Word copy alone; the default is `both`. `--fonts <folder>` points it at the design system's fonts if they are somewhere else.

4. Submit the PDF as it is: its contents list and page numbers are already filled in. If you edit the Word copy instead, open it in Word or LibreOffice and accept the prompt to update fields, which fills in its contents and page count, then export it to PDF. A screenshot that needs a highlight box gets it before it goes in the evidence folder.

5. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

### How you know it worked

- `plan` prints one line per case in the workbook, 100 for M1, then a `total` line, and the run log has a row for every one of them.
- `check` exits `0` and reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`, followed by one `conditional pass <id>: <condition>` line per conditional pass.
- The executive summary's counts table has nine rows, from `Cases in NHA's sheet` to `Not applicable`, with an `All cases` and a `Mandatory` column. In each column, applicable equals tested plus blocked plus not tested, and tested equals passed plus conditional pass plus failed. Under it, one line defines each term, then `Ready for sandbox exit.` or `<n> mandatory cases are still open.`, the same number `check` lists. The words `No result` appear nowhere.
- The results summary counts each function group in sheet order, lists every conditional pass with its condition, and lists every case not tested, blocked or not applicable once, with what it needs or why it does not apply. A tested case whose Remarks end in `Steps: ...` shows a Step, Result and Note table in its evidence.
- `build` prints `wrote abdm-ft/report-m1-screenshots.json` for a `ui` run, a `fonts:` line naming each font it used or replaced, then `wrote abdm-ft/report-m1.docx` and `wrote abdm-ft/report-m1.pdf`, and exits `0`.
- The PDF opens on a navy cover with the milestone in orange, the key facts in a ruled grid and the confidentiality note. Page 2 is the contents, with every section, each function group in the evidence, and its page. Every later page reads the report title at the top left and `Confidential` and `Page N of M` at the bottom, and every page outside the evidence holds at least four lines of text besides them. No section opener, group heading or case heading ends a page.
- Both files open with the cover and the contents, then the fourteen headings from Document control to Annexures, in order. Every page of the Word copy has the report title at the top and `Confidential, page N of M` at the bottom.
- The evidence holds every tested case and no other, under its function group. Each starts with its id and title, then its result line, expected result, observed result and REQUEST-IDs, then its screenshots, two rows to a page: a landscape one 140 mm wide or more, portrait ones up to three to a row, each captioned with its figure number and step: `Fig <n>, step <k>` in the PDF, `Figure <n>, step <k>` in the Word copy. `<report>-screenshots.json` names each figure's full size file.
- The failures and iterations log lists only failed, blocked and conditional pass cases.
- With `--manifest`, each tested case's Request IDs line lists the REQUEST-IDs the manifest gives it, or reads `None in the manifest`. A value that is not a UUID reads `[invalid id]`.
- No 12 digit number appears anywhere in either file, the PDF's header and footer included: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept. A 10 digit mobile, with or without `0`, `91` or `+91` and spaces or hyphens inside, reads `XXXXXX1234`, and an ABHA address ending `@sbx` or `@abdm` keeps only the last four characters before the `@`, the rest as `x`, or is all `x` when four or fewer. A profile field's value, `firstName`, `lastName`, `name`, `dob`, `address`, `pinCode`, `photo`, `email` and the like, reads `[masked]`, in any case and to the end of its clause, so `Name: asha verma` reads `Name: [masked]`. A date of birth after `dob`, `DOB` or `date of birth` reads `[masked]`, and any date written dd/mm/yyyy reads `[date]`. The writer uses the same masking block, so the sheet and the report agree.
- No token or secret appears in it: a JWT reads `[token]`, and a value after a label naming a password, secret, token, OTP, credential, API key or private key reads `[redacted]`, as does a `Bearer` credential. This covers the workbook's Response and Remarks values and the findings, as well as `meta.json`.

### When it goes wrong

| Observed | Cause | Do |
|---|---|---|
| `ModuleNotFoundError: No module named 'docx'` or `'reportlab'` | python-docx or ReportLab is not installed | `pip install openpyxl pillow python-docx reportlab` |
| `ImportError: reportlab requires 3.10+` | A ReportLab release newer than your Python was installed, on Python 3.9 | `pip install "reportlab<5"`, or use Python 3.10 or later |
| `fonts: Public Sans not found, Helvetica in its place` | That font is not in any folder the script looks in | Nothing, the report is complete with the fallback. For the design system's own face, put its `.ttf` files in `abdm-ft/fonts/` and build again |
| `not passed CRT_ABHA_105: FAIL` | A mandatory case failed | Fix the cause the Remarks name, rerun the case, write it back, run `check` again |
| `not passed <id>: NA` | A mandatory case was recorded not run, and `agreed_not_run` does not list it | Run it, or agree with NHA that it does not apply, keep the reason in its remarks, and add it to `agreed_not_run` with who agreed and when. Pass `--meta` to `check` |
| `agreed_not_run must map each case id` | An entry has no agreement text | Write who at NHA agreed and when for every case listed |
| `not passed <id>: blank` | The case needs a tester step, or never ran | Finish it with the tester, then write it back |
| `not passed <id>: CONDITIONAL PASS with no condition in Remarks` | The Remarks cell for a conditional pass is empty, which the writer refuses, so it was typed into the sheet by hand. The gate blocks it | Write the result again through `abdm_workbook.py write` with the condition in `remarks` |
| A case is missing from the run log | The run log was written by hand, not from `plan` | Run `plan` again and add a row for every case it lists. Never drop a case to finish sooner |
| `plan` prints `not applicable` for a case you expected to run | The sheet's group Applicable To names the other entity type only | Check `--entity`. A group for the other entity type is `not-run` with that rule in Remarks |
| `marking <id> "...": unrecognised marking: treated as mandatory`, or `no marking` | NHA used a marking the script does not know, such as PHR's note on row P1 3.6, or left it blank | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a credential` | `meta.json` has a password, secret, token or credentials field, or a value holding a JWT or a credential's label with its value | Delete the field or the value. A report never carries a credential |
| `the workbook has a (run) column but no .before-abdm-run copy` | The writer's copy of NHA's workbook was moved or deleted | Put it back beside the workbook. Without it the script cannot tell NHA's text from the run's |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as NHA's PHR workbook does not, and no write has added them yet | Write the run's results with `shared.concept.test-workbook-write-back` first: its first write adds the `Test Case ID` column |
| `the manifest carries a credential` | The manifest JSON holds a token, secret or password field or value | Write the manifest as the test skill does, case ids to request ids and nothing else |
| The Word copy's contents page reads `Open in Word and update fields` | Its fields have not been updated since the script wrote them. The PDF is not affected | Open the file in Word or LibreOffice and update fields, then save |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, jpeg, gif, bmp, webp, tif, tiff, heic, heif or pdf. Or the case was not tested: only passed, conditional pass and failed cases have evidence | Move it into the case's folder, named as `cases` prints the id, and build again. For a case not tested, finish it first |
| A case you ran is under Cases not tested as `Blocked` | Its status is blank and its Remarks start `Needs tester:`, as the writer leaves a `needs-human` case | Finish the step with the tester, write the result again, and build again |
| A case is counted `Not applicable` though you ran it | Its status is `NA`, as the writer writes a `not-run` case; or its group is for the other entity type only, listed as `Run, not applicable` | Write the result again with the outcome it had. For the group, check `--entity` |
| A mandatory `NA` is counted `Not tested` | NHA has not agreed it does not apply | Run it, or add the agreement to `agreed_not_run` |
| `Unrecognised status: Passed` in Cases not tested | The status was typed by hand, not written by the writer | Write the result again through `abdm_workbook.py write` |
| `Screenshot could not be read: <file>` | The file is empty, damaged, or in a format Pillow cannot open, such as HEIC on most systems | Export it to PNG in the same folder, delete the unreadable one, and build again |
| A person's name shows in the report | It was written with no label, such as `asha verma saw the screen`. Masking finds a name only after a label such as `Name:`, which it masks to the end of the clause | Write the result again without the name. The agent never writes a name; masking is the backstop, not the rule |
| `the summary counts do not add up` | A status the script does not sort into the counts, which should not happen | Report it with the workbook; never edit the counts by hand |

From `shared.concept.test-report`.

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
