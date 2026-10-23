# HIE-CM p3 test

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
5. No reply, `skip`, or the tester not present: record the case `needs-human` with `Needs tester: <the value>`, and go to the next case.

**In an `ft` run (terminal):** prompt in the terminal with input hidden, name what is needed and where it came from ("the OTP sent to the mobile ending 1234"), send it once, and hold it only for that call. Never write it to the run log, the results file or the workbook.

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

### When it goes wrong

| Observed | Do |
|---|---|
| You are about to type an Aadhaar number, mobile number, OTP or other identity value yourself | Stop. Click the field and ask the tester to type it, as above |
| The tester asks you to make up a value so the run can go faster | Refuse, and say why in one line: the sandbox needs a real person's values, and a made-up one fails the case |
| You find that a value was typed by the agent, made up or reused, earlier in this run | Stop the run. Every case from that point is void: do not write those results to the workbook, mark them `pending` in the run log with `void: agent entered <value type>`, tell the tester, and run those cases again with the tester entering the value |
| The OTP never arrives | Ask the tester to use the screen's resend option once, then wait. Still nothing: `needs-human` with `Needs tester: OTP not received` |
| The browser is headless or not on the tester's screen | Stop before the first case and ask the tester to restart the Playwright server without `--headless` |
| An identity field already holds a value at the start of a case | The app kept it from an earlier case, or the browser autofilled it. Ask the tester to clear it and type the value for this case; note it in the run record. Never run a case on a value the tester did not enter for it |

From `shared.concept.test-human-entry`.

Walks the ABDM P3 functional test cases against the system you built and the sandbox: subscription requests, auto approval policies and the consent requests an HIU raises for a PHR user. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P3 case in the PHR app set against your PHR app, your HIU service or both, one case at a time
- Records, for each case, the sandbox response or callback and the REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots
- Checks that every credential, person and device the chosen cases need is ready before the first call, and stops when a required one is missing
- Logs every case to a run log file in your repository as it runs, and asks for every OTP, password and approval in the terminal, never skipping one

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Which side you built: the PHR app, the HIU service, or both | Say it at the start. A case is run on the side you own and the other side is a partner |
| Your HIU bridge callback URL registered, if you run the HIU side | Subscription results and notifications arrive there |
| A person logged in to the PHR app with an ABHA address | The P1 login. The PHR side uses that person's login token |
| A sandbox HIP that can link a new record to that address | A partner or your own test facility. Without one, the notification cases are `needs-human` |
| The person present with their phone | Every grant, deny, edit and consent tap is a human step and the skill stops for it |
| A folder for the run log | Your repository. `abdm-ft/` unless you name another |
| NHA's PHR test case workbook, required: the results and the report are built from it | It ships with this skill, in its `workbook/` folder (on the docs site, `/skills/abdm-p3/workbook/`): copy it into `abdm-ft/` before the run, and never use another copy, so the sheet matches the cases below. It has one tab per PHR milestone and no case ids; the script adds a Test Case ID column with the ids this skill uses. Writing into it needs Python 3.9 or later with `openpyxl` and `Pillow` |
| For a `ui` run: your PHR app's APK, installed on an Android emulator or a device over adb | Your build. Android Studio's emulator, or a phone with USB debugging on |
| For a `ui` run: Maestro, to drive the app | https://maestro.mobile.dev, Apache 2.0. `/abdm-test-setup` lists what is missing and prints the install command |
| For a `ui` run: a test ABHA address and its login | A sandbox ABHA address the tester holds, typed at the app's own login when the run reaches it, never stored |

## Say one of these

- "Walk the P3 test cases against my PHR app and my HIU, and log each one."
- "Run only the subscription request cases, PHR_HIU_10101 to PHR_HIU_10105."
- "Re-run PHR_HIU_10201, auto approval did not fire yesterday."
- "Write a terminal script that runs the P3 test cases and waits for me to approve on the phone."

## What happens first

The first question is the run type. `ft` is the API functional test: your PHR app's backend against the sandbox, judged on calls and callbacks. `ui` is the UI test: an agent drives your PHR app on an Android emulator or device with Maestro, as the section "Running a case as a UI test" below sets out. `all` runs `ft` for the chosen cases, then `ui`. Then two questions, asked once: which side you built, and which cases. Then the preconditions for the first case are checked before anything is sent. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

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
| `failed` | Three passes and the exit condition was not observed, or the sandbox returned the refusal the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached a grant, a deny, an edit, a consent tap, a facility partner or a person who was not there | Ever as a substitute for a fail you can see |
| `not-run` | No P specification publishes the operation the case needs | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one of these. It decides what the manifest carries.

- **sandbox.** A call or a callback the gateway sees. Evidence is the HTTP status, the body and the REQUEST-ID, pasted. For an asynchronous call it is the 202 and then the callback carrying the named field. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so. In a `ui` run the agent observes the screen itself instead, as "Running a case as a UI test" sets out.
- **human.** A step only a person can do. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Ask before you subscribe. A subscription raised without the person's agreement is a consent failure. `hiecm.concept.phr-subscriptions`
- A subscription is not consent. A notification says a record exists. Reading it still needs a granted consent.
- Tokens as the specification requires. The gateway access token goes in `Authorization` on every call. PHR side calls about the person send their login token in `X-AUTH-TOKEN`. Every call sends `X-CM-ID`, `sbx` in sandbox. HIU side calls send `X-HIU-ID`.
- A 202 is a receipt, not a result. The answer arrives on the HIU's callback. Log the whole callback body before you parse it. `hiecm.concept.asynchronous-callbacks`
- Fresh `REQUEST-ID` on every call, logged before sending. A reused id is refused, and after a failure the id is the only handle on the call.
- Paste the response. A step with no pasted output is not done.
- Sensitive values travel encrypted, as the specification marks them. Nothing in this set asks for an OTP.
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: PHR_HIU_10102   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /api/hiecm/subscription-requests/v3/{subscriptionRequestId}/approve  REQUEST-ID 6f1c...  HTTP 202
body: {"subscriptionId":"...","message":"..."}
callback: POST /api/v3/hiu/subscription-requests/hiu/notify  notification.status GRANTED
matched: exit condition for PHR_HIU_10102
next: PHR_HIU_10103
```

### The run log

The run is logged to a file as it happens, so the person can follow it, stop and resume it, and hand it to a reviewer. Create it before the first case, at `abdm-ft/p3-<YYYYMMDD-HHMM>.md`.

- The header names this skill, the set, the entity type, the time started, and the readiness check row by row.
- Every case chosen gets a row before the first call, each `pending`.
- A case reads `running` while its loop runs. When it ends, update its row at once: outcome, request ids, the literal that matched or the reason, and the evidence file for a `screen` case. Then append its run record block under the table.
- A stopped run resumes from the log: the first row that is still `pending` or `running` is the next case.
- Never write a secret to it: no token, OTP, password, Aadhaar number, full mobile, client secret or private key. A request id, a txnId and a masked mobile are fine.

```markdown
# P3 functional test run, 2026-10-13 10:12
Readiness: credentials ready; system ready; OTP person ready; biometric device not needed.

| Case | Outcome | Request ids | Observed |
|---|---|---|---|
| PHR_HIU_10101 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| PHR_HIU_10102 | needs-human | b7a1... | OTP prompt shown, left blank |
| PHR_HIU_10103 | running | | |
| PHR_HIU_10104 | pending | | |
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
| Name every check by its case name from this skill, such as `PHR_HIU_10102`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal: "grant the subscription on the phone, then press enter", "ask the facility to link a record, then press enter" | Every P3 success path passes through a person's decision. A runner that never asks never reaches one |
| Never write a token to disk, a log or the manifest, and never hard code one | A login token acts for the person |
| For an asynchronous call, wait on the HIU callback with a timeout, and match its `response.requestId` or its `subscriptionRequestId` to what you sent | The 202 alone proves only that the gateway took the request |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the status and the body literal the exit condition names, such as `202` and then `notification.status` `GRANTED` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| At the end, print one line per case name with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case name, not by script step |

A run reads like this.

```text
PHR_HIU_10101  POST /api/hiecm/subscription-requests/v3/init  REQUEST-ID 3b9e...  HTTP 202  matched
PHR_HIU_10101  callback on-init  subscriptionRequest.id present  matched
PHR_HIU_10101  GET /api/hiecm/subscription-requests/v3/requests  REQUEST-ID 5e70...  HTTP 200  requests[].status REQUESTED  matched
  Grant the subscription on the phone, then press enter. Leave blank if nobody is here:
PHR_HIU_10102  callback hiu/notify  notification.status GRANTED  matched
PHR_HIU_10102  passed
```

Nudge: calls with a missing `X-AUTH-TOKEN`, a wrong `X-CM-ID` or a made up subscription id test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

NHA's PHR sheet numbers its rows but gives them no ids, so each case here has an id built the way the HMIS ids are, from the PHR milestone and the row: row P1 3.2 is `PHR_ADDR_302`, and P2, P3 and P4 rows are `PHR_APP_`, `PHR_HIU_` and `PHR_LOCKER_`. The test case page shows each id with its row. Use the id in the run log, the manifest and the workbook.

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, Building HIU Service for PHR tab. The sections are grouped as the sheet groups them. Every operation id below is in a P specification, which carries the host, the headers and a full request.

Two calls this set leans on are not in any P specification. An HIU raises a consent request with `m3_post_consent_v3_request_init`, and fetches data with `m3_post_data_flow_v3_health_information_request`. Raising a request is a precondition below. A case whose result is data fetched is `not-run` with that reason.

### PHR_HIU_10101 to PHR_HIU_10105: the subscription request

Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. The person logged in to the PHR app and has agreed, on screen, that the HIU may subscribe.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_HIU_10101 | `sandbox`, `screen` | The HIU raises a subscription request, the app is notified, and it shows in Requests | `p3_post_subscription_requests_v3_init` with `subscription.patient.id`, `subscription.hiu.id`, `subscription.categories` and `subscription.period` returns 202. The `p3_post_v3_hiu_hiecm_subscription_requests_on_init` callback carries `subscriptionRequest.id`. `p3_get_subscription_requests_v3_requests` returns 200 with that `requests[].requestId` and `status` `REQUESTED`. Screen check: the notification and the request under Requests |
| PHR_HIU_10102 | `sandbox`, `human` | The person grants it, choosing HI types, visit types and period, and it shows under Approved, Granted | The person grants. `p3_post_subscription_requests_v3_request_id_approve` with `includedSources[].hiTypes`, `includedSources[].categories` and `includedSources[].period` returns 202 with `subscriptionId`. The HIU's `p3_post_v3_hiu_subscription_requests_hiu_notify` callback carries `notification.status` `GRANTED`, and the HIU acknowledges with `p3_post_subscription_requests_v3_hiu_on_notify`, which returns 202. `p3_get_subscription_requests_v3_subscription_id` returns 200 with `status` `GRANTED` and `includedSources` as chosen |
| PHR_HIU_10103 | `sandbox`, `human` | The person denies it, it shows under Requests, Denied, and the HIU gets no notifications | The person denies. `p3_post_subscription_requests_v3_request_id_deny` with `reason` returns 202 with `message`. The hiu/notify callback carries `notification.status` `DENIED`. No `p3_post_v3_hiu_subscription_notify` arrives for this person afterwards |
| PHR_HIU_10104 | `sandbox`, `screen` | A request nobody acts on expires, and shows as Expired, never as Denied | Leave a fresh request alone past its window; the sheet gives 2 hours. `p3_get_subscription_requests_v3_requests` then returns 200 with that request's `status` `EXPIRED`, and the screen lists it under Expired. The sheet's same row asks that a grant gives access only for the period set; that is the `includedSources[].period` check in PHR_HIU_10102 |
| PHR_HIU_10105 | `sandbox`, `human` | After a grant, the person deselects HI types, visit types or period and saves, and only the rest stays subscribed | The person edits and saves. `p3_put_subscription_requests_v3_patients_subscription_id` returns 202 with `subscriptionId`. `p3_get_subscription_requests_v3_subscription_id` then returns 200 with `includedSources[].hiTypes` and `includedSources[].period` as saved |

### PHR_HIU_10201 to PHR_HIU_10203: the auto approval policy

Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** PHR_HIU_10102 passed. A HIP that can create a new record for the person. An HIU that raises a consent request when notified.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_HIU_10201 | `sandbox`, `human` | With a policy set at grant, a consent request for a new record is granted with no tap, still shows in the app, and the HIU is notified | The person sets the policy. `p2_post_consent_v3_auto_approve` with `hiu.id` and `includedSources` returns 202. A HIP links a new record, and the HIU's `p3_post_v3_hiu_subscription_notify` callback carries `event.category` `LINK` or `DATA`. The HIU's consent request then shows `status` `GRANTED` on `p2_get_consent_v3_request_request_id`, with no `p2_post_consent_v3_request_request_id_approve` in your log. Screen check: the request appears in the app's history |
| PHR_HIU_10202 | `sandbox`, `human` | With no policy, every consent request waits for the person | The HIU's consent request shows `status` `REQUESTED` on `p2_get_consent_v3_request_request_id` until the person taps Approve. After the tap, `p2_post_consent_v3_request_request_id_approve` returns 202 and the status is `GRANTED` |
| PHR_HIU_10203 | `sandbox`, `human` | A disabled policy stops auto approval at once | The person disables it. `p2_post_consent_v3_auto_approve_auto_approval_id_disable` returns 202 with `message`. The next consent request from that HIU shows `status` `REQUESTED`, not `GRANTED` |

### PHR_HIU_10301 and 1.3.2: notifications on a new record and a consent request

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_HIU_10301 | `sandbox`, `human` | The HIU is notified whenever a new record is created at a HIP under an approved subscription | A HIP links a record. The HIU's `p3_post_v3_hiu_subscription_notify` callback carries `event.id`, `event.category`, `event.subscriptionId` equal to the subscription, and `event.content.hip.id`. The HIU acknowledges with `p3_post_subscription_requests_v3_hiu_care_context_on_notify`, `acknowledgement.eventId` equal to `event.id`, which returns 202 |
| PHR_HIU_10302 | `sandbox`, `screen` | A consent request from an HIU reaches the app, which shows its details with Grant and Deny | An HIU raises a request with `m3_post_consent_v3_request_init`. `p2_get_consent_v3_request_request_id` returns 200 with `status` `REQUESTED`, `hiu.id`, `purpose.code` and `permission.dateRange`. Screen check: the notification, then the details with Grant and Deny. `hiecm.concept.consent-in-a-phr-app` |

### PHR_HIU_10401 to PHR_HIU_10404: what an HIU can fetch under each consent state

Mandatory. Each case's result is data fetched or refused, which needs `m3_post_data_flow_v3_health_information_request`. No P specification publishes it.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| PHR_HIU_10401 | not-run | Approved: the HIU fetches and views the data | `not-run`: needs the M3 health information request. The approval half is PHR_APP_1001 |
| PHR_HIU_10402 | not-run | Denied: the HIU cannot fetch | `not-run`: as PHR_HIU_10401. The denial half is PHR_APP_902 |
| PHR_HIU_10403 | not-run | Expired or not acted on: the HIU cannot fetch | `not-run`: as PHR_HIU_10401. The expiry half is PHR_APP_903 |
| PHR_HIU_10404 | not-run | Revoked: the HIU cannot fetch | `not-run`: as PHR_HIU_10401. The revocation half is PHR_APP_1002 |

### PHR_HIU_10501: one consent artefact per HIP

Mandatory. `sandbox` and `human`.

Loop limit: 3 passes per test case.

#### PHR_HIU_10501, the artefacts are plural

The person grants one consent request across at least two HIPs. Exit condition: `p2_get_consent_v3_artefact_request_request_id` returns 200 with one entry per HIP, each with `status` `GRANTED` and a distinct `consentDetail.hip.id`, and the number of entries equals the number of HIPs granted. The HIU's own artefact fetch, and the records seen against each HIP, are M3. `hiecm.concept.m3-plural-artefacts-and-codes`

Nudge: an HIU that keeps the first artefact and drops the rest fetches from one HIP and silently loses the others.

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
| `failed` | `FAIL` | the reason: the HTTP status and ABDM error code, the missing callback, or the exception from your server log |
| `needs-human` | blank | `Needs tester:` and the step that was left |
| `not-run` | `NA` | why it does not apply |

### Before you start

- The workbook for the module, copied from the test skill's own `workbook/` folder into your repository beside the run log, such as `abdm-ft/M1_ABHA_CREATION_VERIFICATION_SCAN_AND_SHARE.xlsx`. The skill ships the sheet its cases come from, so use that copy rather than another. M4 has two, HFR and HPR: each is its own workbook with its own results file. The PHR workbook has no case ids: the script builds them from each tab and row, `PHR_ADDR_302` for row 3.2 of the ABHA address creation tab, exactly as the test case page shows them, and its first write adds a `Test Case ID` column holding them.
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

The report is a PDF, the file you submit, with a Word copy beside it that you
can edit. Both hold the same text. The PDF is drawn in the ABDM Sandbox design
system: a navy cover with the key facts in a ruled grid, a contents list with
page numbers, each section opened by a rule and a numbered label, hairline
tables, the counts as tiles, and each screenshot framed and captioned. Every
page after the cover carries the report title in its header and
`Confidential` with `Page N of M` in its footer. Its parts come in this order,
each from a fixed source, so two reports for the same milestone read the same
way.

| Part | What it holds | Comes from |
|---|---|---|
| Cover | Title, product, organisation, milestone, run type, document id, version, release date, a confidentiality line | `meta.json`, `--run` |
| Contents | Every section and every case id with its page number. The Word copy holds a contents field that Word fills in on opening | The headings below |
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
- For a `ui` report, the screenshots under `abdm-ft/evidence/<case id>/`, one folder per case id as `cases` prints it. They are placed in name order, so name them `01-consent.png`, `02-otp.png`. Blur any Aadhaar number, OTP or full mobile on a screenshot before it goes in the folder: the script masks text, not images.
- Python 3.9 or later with `openpyxl`, `Pillow`, `python-docx` and `reportlab`: `pip install openpyxl pillow python-docx reportlab`. On Python 3.9, ReportLab 5 does not install; use `pip install "reportlab<5"`. All four are open source (MIT, the HPND licence, MIT and BSD). ReportLab draws the PDF itself, so no office suite is needed.
- Optionally, the design system's fonts as `.ttf` files: Newsreader for headings, Public Sans for text and JetBrains Mono for labels and case ids, all under the SIL Open Font License. The script looks in the folder given with `--fonts`, then `abdm-ft/fonts/`, then `~/Library/Fonts`, `/Library/Fonts` and `/usr/share/fonts`, and prints which it used. A font it does not find is replaced by the PDF's own Times-Roman, Helvetica or Courier, which are the design system's fallbacks, so the report is complete either way.
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
  python3 abdm_report.py build WORKBOOK --run ft|ui --meta meta.json --evidence DIR --out REPORT.pdf
      [--manifest RUN.json] [--format pdf|docx|both] [--fonts DIR]

check lists every mandatory case not PASS for the run type and exits 1, or
exits 0 when there is none. build refuses unless check passes, then writes the
report. A mandatory case NA passes only when meta.json's agreed_not_run names it.
--manifest is the run's manifest of case ids to REQUEST-IDs, printed per case.
build writes REPORT.pdf, the report to submit, and REPORT.docx beside it, the
editable copy; --format picks one of them. The PDF uses Newsreader, Public Sans
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


def read_cases(path, run, entity):
    """Every case in sheet order, with its marking, the run's values and treatment."""
    wb = load(path)
    path = Path(path)
    # The copy the writer made before its first write: what NHA's own cells held.
    backup = path.with_name(path.stem + ".before-abdm-run" + path.suffix)
    original = load(backup) if backup.exists() else None
    out = []
    applies_by = {}
    for case, (ws, row) in index(wb).items():
        top, cols = header_row(ws)
        if ws.title not in applies_by:
            applies_by[ws.title] = group_applies(ws, top, cols)
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
    # A group the sheet marks for one entity type only, such as M1's demographic authentication
    # for Government, is not for the other one, whatever its cases' own markings say.
    for rec in out:
        only = restricted_to(rec["applies"])
        if only and only != entity:
            rec.update(kind="optional", pair=None, label="Not for a " + entity + " entity",
                       note="the group applies to " + rec["applies"] + " only: not for a " + entity + " entity")
    groups = {k: v for k, v in groups.items() if any(by_id[i]["kind"] == "pair" for i in v if i in by_id)}
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


def content(path, run, meta, evidence, recs, groups, manifest=None, draft=None):
    """What the report says, as a list of blocks. The DOCX and the PDF draw the same blocks."""
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
    if draft:
        held = (" This is a draft, not the report to submit: " + str(len(draft)) + " of the " + str(mandatory) +
                " mandatory cases that apply to a " + entity + " entity are not yet PASS, listed below.")

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

    # 2. Executive summary
    add("h1", SECTIONS[1])
    add("lead",
        "This report records the " + label + " run of " + meta.get("product", "") + " by " +
        meta.get("organisation", "") + " against ABDM " + milestone + ", API version " +
        meta.get("api_version", "V3") + ", from " + dates.get("start", "") + " to " + dates.get("end", "") +
        ". The workbook " + Path(path).name + " holds " + str(n) + " cases. " + str(passed) + " are PASS, " +
        str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) + " have no result." + held + " " +
        str(len(retried)) + " cases took more than one pass.")
    if draft:
        add("callout", ["Draft. The report to submit is built only when every mandatory case below is PASS."])
        add("h2", "Mandatory cases not yet passed")
        table([line.split(": ", 1) if ": " in line else [line, ""] for line in draft],
              header=["Test case ID", "Status"])

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

    # 4. Results summary: counts, then by function, then one row per case.
    add("h1", SECTIONS[3])
    add("stats", [["Cases in the workbook", n], ["PASS", passed], ["FAIL", failed], ["NA", na], ["No result", blank],
                  ["Mandatory for a " + entity + " entity", mandatory], ["Took more than one pass", len(retried)]])
    add("h2", "Results by function")
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
    add("h2", "Results by case")
    table([[r["id"], r["title"], r["label"], (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed")
            else ""), r["iterations"] or ""] for r in recs],
          header=["Test case ID", "Title", "Marking", "Status", "Iterations"])
    if agreed:
        add("h2", "Mandatory cases NHA agreed not to run")
        add("note", ["NHA agreed that each case below does not apply. The gate lets a mandatory NA through only "
                     "when it is listed here with who agreed and when."])
        table([[r["id"], r["title"], r["agreed"]] for r in agreed], header=["Test case ID", "Title", "Agreed by and when"])

    # 5. Scope and limitations
    add("h1", SECTIONS[4])
    apps = meta.get("applications", [])
    table([[a.get("name", ""), a.get("url", "")] if isinstance(a, dict) else [str(a), ""] for a in apps]
          or [["", ""]], header=["Application", "URL"])
    add("gap")
    sheets = sorted(set(r["sheet"] for r in recs), key=[r["sheet"] for r in recs].index)
    table([["Role", meta.get("role", "")], ["Entity type", entity], ["Run type", run],
           ["Workbook", Path(path).name], ["Tabs", ", ".join(sheets)], ["Cases", n]])
    skipped = [r for r in recs if r["kind"] == "optional" and r["status"] != "PASS"]
    add("h2", "Optional cases not passed")
    if skipped:
        table([[r["id"], r["title"], r["status"] or "Not recorded"] for r in skipped],
              header=["Test case ID", "Title", "Status"])
    else:
        add("para", "Every optional case is PASS.")
    add("h2", "Limitations")
    add("callout", ["The results hold for the build and configuration tested from " + dates.get("start", "") +
                    " to " + dates.get("end", "") + ". A later change to the code or the configuration can change them."]
        + [str(x) for x in meta.get("limitations", [])])

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

    # 9. Approach and methodology
    add("h1", SECTIONS[8])
    add("bullets", [
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
    ])
    table([["PASS", "The case's expected result was observed."],
           ["FAIL", "The expected result was not observed in three passes. The failure reason says what was."],
           ["NA", "The case was not run: optional and not offered, or mandatory with NHA's agreement."],
           ["Not recorded", "The case has no result in the workbook."]], header=["Status", "Meaning"])

    # 10. Test data
    add("h1", SECTIONS[9])
    data = meta.get("test_data", [])
    if isinstance(data, dict):
        data = [{"item": k, "value": v} for k, v in data.items()]
    table([[d.get("item", ""), d.get("value", "")] for d in data] or [["", ""]], header=["Item", "Value"])

    # 11. Evidence: per case a fixed table, the response with its code, then captioned screenshots.
    add("h1", SECTIONS[10])
    figure = 0
    for r in recs:
        observed = findings.get(r["id"]) or r["remarks"] or "None recorded."
        err = codes(r["response"], r["remarks"]) if r["status"] != "PASS" or r["iterations"] > 1 else ""
        values = [r["id"], r["title"], r["label"], r["expected"] or "Not given in the workbook", observed,
                  (r["status"] or "Not recorded") + (" (agreed not run)" if r.get("agreed") else ""),
                  r["iterations"] or "", reason(r) + (("" if reason(r).endswith(".") else ".") + " Error code: " + err
                                                      + "." if err else ""), rid_text(r)]
        shots = []
        if run == "ui":
            folder = Path(evidence) / r["id"]
            files = sorted(f for f in folder.iterdir() if f.suffix.lower() in IMAGES) if folder.is_dir() else []
            for step, shot in enumerate(files, 1):
                figure += 1
                shots.append((shot, figure, step))
        add("case", r, values, r["response"], shots)

    # 12. Failures and iterations log
    add("h1", SECTIONS[11])
    if log:
        table([[r["id"], r["status"] or "Not recorded", r["iterations"] or "", reason(r),
                codes(r["response"], r["remarks"]) or "None found"] for r in log],
              header=["Test case ID", "Status", "Iterations", "Failure reason", "Error code"])
    else:
        add("para", "No case failed and no case took more than one pass.")

    # 13. Conclusion and sign-off
    add("h1", SECTIONS[12])
    add("lead",
        "In the " + run + " run of " + meta.get("product", "") + " for " + milestone + "," +
        held.replace(" All", " all", 1) + " Of " + str(n) + " cases, " +
        str(passed) + " are PASS, " + str(failed) + " FAIL, " + str(na) + " NA and " + str(blank) +
        " have no result.")
    table([["Prepared by", dm.get("prepared_by", ""), "", ""], ["Reviewed by", dm.get("reviewed_by", ""), "", ""],
           ["Approved by", dm.get("approved_by", ""), "", ""]], header=["Sign-off", "Name", "Date", "Signature"])

    # 14. Annexures
    add("h1", SECTIONS[13])
    table([[x.get("title", ""), x.get("link", "")] if isinstance(x, dict) else [str(x), ""] for x in recordings]
          or [["", ""]], header=["Recording", "Link"])
    add("gap")
    table([["Completed workbook", Path(path).name],
           ["REQUEST-ID manifest", Path(manifest).name if manifest else "Not given"],
           ["Evidence folder", (str(evidence) if run == "ui" else "Not used: the responses are the evidence")]],
          header=["Annexure", "File"])

    return {
        "title": title, "label": label, "run": run, "milestone": milestone, "entity": entity, "safe": safe,
        "draft": draft or [],
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


def write_docx(m, out):
    """The editable copy, in Word's format: the same blocks, with Word's contents and page fields."""
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
        elif kind == "h2":
            doc.add_heading(block[1], level=2)
        elif kind == "table":
            table(block[1], header=block[2])
        elif kind == "stats":
            table(block[1], header=["Measure", "Count"])
        elif kind in ("para", "lead"):
            doc.add_paragraph(block[1])
        elif kind in ("bullets", "callout"):
            for line in block[1]:
                doc.add_paragraph(line, style="List Bullet")
        elif kind == "gap":
            doc.add_paragraph("")
        elif kind == "case":
            r, values, response, shots = block[1:]
            doc.add_heading(r["id"] + ": " + r["title"], level=2)
            table([[k, v] for k, v in zip(CASE_FIELDS, values)], header=["Field", "Value"])
            if response:
                p = doc.add_paragraph()
                p.add_run("Response with code: ").bold = True
                code = p.add_run(response)
                code.font.name = "Courier New"
                code.font.size = Pt(9)
            for shot, figure, step in shots:
                with Image.open(shot) as im:
                    w, h = im.size
                # Page width, unless that makes a tall phone screenshot overrun the page.
                if h * width > 0.75 * height * w:
                    doc.add_picture(str(shot), height=int(0.75 * height))
                else:
                    doc.add_picture(str(shot), width=width)
                doc.add_paragraph("Figure " + str(figure) + ": " + r["id"] + ", step " + str(step) +
                                  " (" + shot.name + ")", style="Caption")
        # "note" blocks are the PDF's callouts; the DOCX carries the same facts in its tables.

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
    ("Function", "Cases", "PASS", "FAIL", "NA", "Mandatory not PASS"): [.38, .11, .11, .11, .11, .18],
    ("Test case ID", "Title", "Marking", "Status", "Iterations"): [.24, .36, .17, .10, .13],
    ("Test case ID", "Title", "Agreed by and when"): [.25, .37, .38],
    ("Test case ID", "Title", "Status"): [.25, .60, .15],
    ("Test case ID", "Status", "Iterations", "Failure reason", "Error code"): [.22, .09, .13, .38, .18],
    ("Flow", "ABHA address used", "HI types created or tested"): [.30, .35, .35],
    ("Name", "Role", "Qualifications"): [.34, .26, .40],
    ("Status", "Meaning"): [.20, .80],
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
                                    KeepTogether, NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer, Table,
                                    TableStyle)
    from PIL import Image

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
        "h1": style("h1", "serif", 27, 32, "navy", spaceAfter=14),
        "h2": style("h2", "serif", 17, 21, "navy", spaceBefore=16, spaceAfter=8),
        "case": style("case", "serif", 15, 19, "navy", spaceAfter=8),
        "note": style("note", "sans", 9.5, 14.5, "ink2"),
        "chev": style("chev", "serif", 13, 14.5, "orange"),
        "page": style("page", "mono", 8, 12, "ink4", alignment=TA_RIGHT),
        "toc": style("toc", "sans", 10.5, 14, "ink"),
        "tocid": style("tocid", "mono", 7.2, 10, "ink3"),
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
        color = "blue" if word == "PASS" else "otext" if word == "FAIL" else "ink4"
        return Tracked(text or "Not recorded", size=7.2, color=color, space=0.6)

    def grid(rows, header=None, pad=6.5):
        """Hairline rules only, a mist header row of mono labels that repeats, Paragraphs that wrap."""
        cols = len(header or rows[0])
        shares = WIDTHS.get(tuple(header or ())) or ([.34, .66] if cols == 2 else [1.0 / cols] * cols)
        body = []
        for row in rows:
            texts = shown(row)
            cells = []
            for c, text in enumerate(texts):
                name = header[c] if header else ("Label" if c == 0 else texts[0])
                if not header and c == 0:
                    cells.append(Tracked(text, size=6.8, color="ink4", space=0.7))
                elif name == "Status":
                    cells.append(status(text))
                elif name == "Test case ID":
                    cells.append(para(text, "id"))
                elif not header:
                    cells.append(para(text, "strong"))
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

    def bullets(lines):
        rows = [[Paragraph("›", S["chev"]), para(line, "note")] for line in lines]
        t = Table(rows, colWidths=[16, TW - 16], hAlign="LEFT")
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7), ("LINEBELOW", (0, 0), (-1, -2), 0.6, C["line"])]))
        return [t, Spacer(1, 12)]

    def tiles(rows):
        """The counts as navy-deep tiles: off-white mono digits over an ice mono label."""
        short = {"Cases in the workbook": "Cases", "Took more than one pass": "More than one pass"}
        gap = 6

        def tile(label, count, width):
            t = Table([[Paragraph(escape(clean(count)), S["digit"])],
                       [Tracked(short.get(label, label), size=6.4, color="ice", space=0.7)]],
                      colWidths=[width], rowHeights=[34, 26])
            t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C["deep"]), ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                   ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                                   ("TOPPADDING", (0, 0), (-1, 0), 10), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                                   ("TOPPADDING", (0, 1), (-1, 1), 4)]))
            return t

        out = []
        for chunk in (rows[:4], rows[4:]):
            width = (TW - gap * (len(chunk) - 1)) / len(chunk)
            cells, widths = [], []
            for i, (label, count) in enumerate(chunk):
                if i:
                    cells.append("")
                    widths.append(gap)
                cells.append(tile(label, count, width))
                widths.append(width)
            row = Table([cells], colWidths=widths, hAlign="LEFT")
            row.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                                     ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
            out += [row, Spacer(1, gap)]
        return out

    class Shot(Flowable):
        """A screenshot at the text width and at most 60 percent of the page height, in a hairline frame,
        with its caption. It shrinks to as little as 60 percent of that to finish a page rather than leave a gap."""

        def __init__(self, shot, figure, step, case):
            Flowable.__init__(self)
            with Image.open(shot) as im:
                w, h = im.size
            self.shot, self.ratio = shot, h / float(w)
            self.full = min(TW, 0.6 * H / self.ratio)
            self.caption = Tracked("FIGURE " + str(figure) + " \u00b7 " + case + ", STEP " + str(step) + " \u00b7 " +
                                   shot.name, size=6.8, color="ink4", space=0.5, upper=False)

        def wrap(self, aw, ah):
            _, ch = self.caption.wrap(aw, ah)
            self.ch = ch
            extra = 16 + 7 + ch + 6
            w = min(self.full, aw)
            if w * self.ratio + extra > ah and (ah - extra) / self.ratio >= 0.6 * w:
                w = (ah - extra) / self.ratio
            self.w = w
            self.width, self.height = aw, w * self.ratio + extra
            return self.width, self.height

        def draw(self):
            c = self.canv
            h = self.w * self.ratio
            y = self.ch + 6 + 7
            c.drawImage(str(self.shot), 0, y, width=self.w, height=h)
            c.setStrokeColor(C["line"])
            c.setLineWidth(0.6)
            c.rect(0, y, self.w, h, stroke=1, fill=0)
            self.caption.drawOn(c, 0, 6)

    def tall(shot):
        with Image.open(shot) as im:
            return im.size[1] > 1.2 * im.size[0]

    def opener(number, name):
        return [CondPageBreak(170), Rule("dark", 1, before=14, after=12), Mark("s" + str(number)),
                Tracked("%02d · %s" % (number, name), size=7.5, color="otext", space=1.0, after=8),
                Paragraph(escape(clean(name)), S["h1"])]

    def story(marks, total):
        out = [NextPageTemplate("inner"), PageBreak()]
        out += [Rule("dark", 1, after=12), Tracked("Contents", size=7.5, color="otext", space=1.0, after=8),
                Paragraph("Contents", S["h1"])]
        case_ids = [b[1]["id"] for b in m["blocks"] if b[0] == "case"]

        def sections(names, first):
            rows = [[Tracked("%02d" % (first + i), size=7.5, color="otext", space=0.6), para(name, "toc"),
                     para(str(marks.get("s" + str(first + i), 0)), "page")] for i, name in enumerate(names)]
            t = Table(rows, colWidths=[40, TW - 80, 40], hAlign="LEFT")
            t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                   ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 7),
                                   ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
                                   ("LINEBELOW", (0, 0), (-1, -1), 0.6, C["line"])]))
            return t

        def ident(text, width):
            """A case id on as few lines as fit, broken after an underscore, never inside a number."""
            text, size, lines, cur = clean(text), S["tocid"].fontSize, [], ""
            for part in re.findall(r"[^_]+_?|_", text):
                if cur and stringWidth(cur + part, F["mono"], size) > width:
                    lines.append(cur)
                    cur = part
                else:
                    cur += part
            lines.append(cur)
            return Paragraph("<br/>".join(escape(x) for x in lines), S["tocid"])

        split = SECTIONS.index("Evidence") + 1
        out.append(sections(SECTIONS[:split], 1))
        if case_ids:
            col = (TW - 40) / 3.0
            per = -(-len(case_ids) // 3)
            rows = []
            for j in range(per):
                row = []
                for k in range(3):
                    n = k * per + j
                    if n < len(case_ids):
                        row += [ident(case_ids[n], col - 34), para(str(marks.get("c" + case_ids[n], 0)), "tocpage")]
                    else:
                        row += ["", ""]
                rows.append([""] + row)
            cases_t = Table(rows, colWidths=[40] + [col - 30, 30] * 3, hAlign="LEFT")
            cases_t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                         ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (2, 0), (2, -1), 14),
                                         ("RIGHTPADDING", (4, 0), (4, -1), 14),
                                         ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                                         ("TOPPADDING", (0, 0), (-1, 0), 9), ("BOTTOMPADDING", (0, -1), (-1, -1), 9),
                                         ("LINEBELOW", (0, -1), (-1, -1), 0.6, C["line"])]))
            out.append(cases_t)
        out.append(sections(SECTIONS[split:], split + 1))
        out.append(PageBreak())

        section = 0
        for block in m["blocks"]:
            kind = block[0]
            if kind == "h1":
                section += 1
                if block[1] in ("Results summary", "Evidence", "Failures and iterations log") and section > 1:
                    out.append(PageBreak())
                out += opener(section, block[1])
            elif kind == "h2":
                out += [CondPageBreak(110), Paragraph(escape(clean(block[1])), S["h2"])]
            elif kind == "table":
                out += [grid(block[1], block[2]), Spacer(1, 10)]
            elif kind == "stats":
                out += tiles(block[1])
            elif kind in ("para", "lead"):
                out.append(para(block[1], kind if kind == "lead" else "body"))
            elif kind == "bullets":
                out += bullets(block[1])
            elif kind in ("callout", "note"):
                out += [callout(block[1]), Spacer(1, 10)]
            elif kind == "gap":
                out.append(Spacer(1, 10))
            elif kind == "case":
                r, values, response, shots = block[1:]
                head = [CondPageBreak(200), Rule("line", 0.6, before=6, after=14, top=False), Mark("c" + r["id"]),
                        Tracked(r["id"], size=7.5, color="otext", space=0.9, after=5),
                        Paragraph(escape(clean(r["title"])), S["case"]),
                        grid([[k, v] for k, v in zip(CASE_FIELDS, values)], pad=4.6)]
                if response:
                    code = Table([[Tracked("Response with code", size=6.6, color="ink4", space=0.7, after=3)],
                                  [para(response, "code")]], colWidths=[TW], hAlign="LEFT")
                    code.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), C["mist"]),
                                              ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                                              ("TOPPADDING", (0, 0), (-1, 0), 8), ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
                                              ("TOPPADDING", (0, 1), (-1, 1), 0), ("BOTTOMPADDING", (0, 0), (-1, 0), 0)]))
                    head += [Spacer(1, 8), code]
                out.append(KeepTogether(head))
                k = 0
                while k < len(shots):
                    # Two phone screenshots in a row sit side by side.
                    pair = shots[k:k + 2]
                    if len(pair) == 2 and all(tall(x[0]) for x in pair):
                        a, b = [Shot(x[0], x[1], x[2], r["id"]) for x in pair]
                        t = Table([[a, "", b]], colWidths=[(TW - 16) / 2.0, 16, (TW - 16) / 2.0], hAlign="LEFT")
                        t.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
                                               ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0),
                                               ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
                        out.append(t)
                        k += 2
                    else:
                        out.append(Shot(*(shots[k] + (r["id"],))))
                        k += 1
                out.append(Spacer(1, 12))
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
    m = content(path, run, meta, evidence, recs, groups, manifest, draft)
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if fmt in ("docx", "both"):
        write_docx(m, out.with_suffix(".docx"))
    if fmt in ("pdf", "both"):
        write_pdf(m, out.with_suffix(".pdf"), fonts_dir)


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

1. When the last case is recorded and written into the workbook, run the gate for the run type and your entity type:

   ```bash
   python3 abdm-ft/abdm_report.py check <workbook> --run ui --entity private --meta abdm-ft/meta.json
   ```

   `--meta` is optional for `check`: it is read for `agreed_not_run`. The script prints one `marking` line for every case whose marking is entity specific, conditional, an either rule, a field list, blank or unrecognised, with how it was treated, and one `agreed not run <id>: <agreement>` line per mandatory `NA` case `agreed_not_run` lets through. Then one `not passed <id>: <status>` line per mandatory case in the way, an either pair as `<id> or <id>: <status>, <status>`, and a count.

2. If it exits `1`, the run is not finished, but the tester still gets a PDF of where it stands. Build the draft:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/draft-report-m1.pdf --draft
   ```

   The draft is the same report, marked Draft on the cover and in the header of every page, with the mandatory cases not yet passed listed first in the executive summary. It is never the report to submit. Then rerun the cases `check` listed, as `open` in `shared.concept.test-workbook-write-back` does, and run `check` again. Every run ends with a PDF: the report when `check` exits `0`, the draft when it does not.

3. Only when `check` exits `0`, write the one line findings into `meta.json` under `findings`, keyed by case id. A case without one gets its Remarks value. Then build:

   ```bash
   python3 abdm-ft/abdm_report.py build <workbook> --run ui --meta abdm-ft/meta.json --evidence abdm-ft/evidence --manifest abdm-ft/m1-<YYYYMMDD-HHMM>.json --out abdm-ft/report-m1.pdf
   ```

   `entity_type` in `meta.json` is the entity type, unless `--entity` is given. `build` runs the gate again and refuses with the same list if it fails. `--manifest` is optional. It writes `abdm-ft/report-m1.pdf`, the report to submit, and `abdm-ft/report-m1.docx` beside it, the editable copy, whichever of the two suffixes `--out` names. `--format pdf` writes the PDF alone and `--format docx` the Word copy alone; the default is `both`. `--fonts <folder>` points it at the design system's fonts if they are somewhere else.

4. Submit the PDF as it is: its contents list and page numbers are already filled in. If you edit the Word copy instead, open it in Word or LibreOffice and accept the prompt to update fields, which fills in its contents and page count, then export it to PDF. A screenshot that needs a highlight box gets it before it goes in the evidence folder.

5. For an `ft` report, use `--run ft` in both commands. The evidence for each case is its `FT Response with Code` value, and `--evidence` is not read.

### How you know it worked

- `check` exits `0` and its last line reads `0 of <n> mandatory case(s) for a <entity> entity not PASS in the <run> run`.
- `build` prints a `fonts:` line naming each font it used or replaced, then `wrote abdm-ft/report-m1.docx` and `wrote abdm-ft/report-m1.pdf`, and exits `0`.
- The PDF opens on a navy cover with the milestone in orange, the key facts in a ruled grid and the confidentiality note. Page 2 is the contents, with every section and every case id and its page. Every later page reads the report title at the top left and `Confidential` and `Page N of M` at the bottom.
- Both files open with the cover and the contents, then the fourteen headings from Document control to Annexures, in order. Every page of the Word copy has the report title at the top and `Confidential, page N of M` at the bottom.
- The results summary has one row per case in the workbook, after the counts. Each case's evidence section starts with its nine row table, then its response, then its screenshots in name order, each captioned with its figure number, case id and step: `FIGURE <n> · <case id>, STEP <k> · <file>` in the PDF, `Figure <n>: <case id>, step <k> (<file>)` in the Word copy.
- With `--manifest`, each case's Request IDs row lists the REQUEST-IDs the manifest gives it, or reads `None in the manifest`.
- No 12 digit number appears anywhere in either file, the PDF's header and footer included: an Aadhaar number reads `XXXX XXXX 1234` and an ABHA number `XX-XXXX-XXXX-1234`, with the last four digits kept. A 10 digit mobile reads `XXXXXX1234`.
- No token or secret appears in it: a JWT reads `[token]`, and a value after a label naming a password, secret, token, OTP, credential, API key or private key reads `[redacted]`. This covers the workbook's Response and Remarks values and the findings, as well as `meta.json`.

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
| `marking <id> "...": unrecognised marking: treated as mandatory`, or `no marking` | NHA used a marking the script does not know, such as PHR's note on row P1 3.6, or left it blank | Ask NHA what it means for your entity type. Never edit NHA's marking to pass the gate |
| `meta.json carries a credential` | `meta.json` has a password, secret, token or credentials field, or a value holding a JWT or a credential's label with its value | Delete the field or the value. A report never carries a credential |
| `the workbook has a (run) column but no .before-abdm-run copy` | The writer's copy of NHA's workbook was moved or deleted | Put it back beside the workbook. Without it the script cannot tell NHA's text from the run's |
| `case id on more than one tab` | Two tabs carry the same id | Ask NHA which one counts |
| `no Test Case ID column with ids` | The workbook has no case ids, as NHA's PHR workbook does not, and no write has added them yet | Write the run's results with `shared.concept.test-workbook-write-back` first: its first write adds the `Test Case ID` column |
| `the manifest carries a credential` | The manifest JSON holds a token, secret or password field or value | Write the manifest as the test skill does, case ids to request ids and nothing else |
| The Word copy's contents page reads `Open in Word and update fields` | Its fields have not been updated since the script wrote them. The PDF is not affected | Open the file in Word or LibreOffice and update fields, then save |
| A screenshot is missing from the report | Its file is not under `<evidence>/<case id>/`, or its extension is not png, jpg, gif or bmp | Move it into the case's folder, named as `cases` prints the id, and build again |

From `shared.concept.test-report`.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It maps case names to request ids, nothing else. Those REQUEST-IDs are the evidence a reviewer can check against the gateway's own record. Secrets never appear in it: no tokens, no client secret. The run log and the manifest are written on every run. The manifest is not the report. Every run ends with a PDF, written as the section "Writing the test report" sets out: run its `check`; when it exits 0, build the report; when it does not, build the draft with `--draft`. Never end a run without one, and say where it is in the three lines below.

```json
{
  "skill": "abdm-p3",
  "set": "PHR mobile app test cases, NHA, Building HIU Service for PHR tab",
  "side": "phr and hiu",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "PHR_HIU_10102", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c...", "a02d..."],
     "observed": ["approve 202 subscriptionId", "hiu/notify notification.status=GRANTED"]},
    {"id": "PHR_HIU_10104", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["c9e4..."], "observed": ["requests 200 status=EXPIRED"],
     "attachment": "expired-tab-2026-10-01.png"},
    {"id": "PHR_HIU_10301", "outcome": "needs-human", "evidence": "human",
     "reason": "no facility partner to link a new record"},
    {"id": "PHR_HIU_10401", "outcome": "not-run", "reason": "health information request is M3; no P specification publishes it"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
