---
name: hiecm-p3-test
description: "Use when walking the ABDM P3 functional test cases (PHR subscriptions, auto approval and the consent requests an HIU raises) against an integrator's own PHR app or HIU service and the sandbox: runs each case as a loop, records evidence the sandbox can vouch for, and writes the manifest that stands in for a screenshot report."
---
# HIE-CM p3 test

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

## Say one of these

- "Walk the P3 test cases against my PHR app and my HIU, and log each one."
- "Run only the subscription request cases, P3 1.1.1 to P3 1.1.5."
- "Re-run P3 1.2.1, auto approval did not fire yesterday."
- "Write a terminal script that runs the P3 test cases and waits for me to approve on the phone."

## What happens first

Two questions, asked once: which side you built, and which cases. Then the preconditions for the first case are checked before anything is sent. Then the readiness check below. After it, nothing else is asked until a case needs a human or an authentication step.

**Readiness check.** The run does not start until every row of "What it needs from you" that the chosen cases use is confirmed. Ask for each one in the terminal, one at a time. Record each in the run log's header as `ready`, `missing` or `not needed`, never the value itself.

| Row | Ready when |
|---|---|
| Credentials | They are set in the environment or typed at a hidden prompt, and the first session call the cases use returns its token |
| Your system | It answers on the address you gave, against the sandbox hosts |
| People and devices | Each is named for this run: who receives the OTPs, who approves in the PHR app, which device scans |
| Entity type and claimed capabilities | Answered, because they decide which cases are mandatory |
| The run log | Its folder exists and can be written: `abdm-ft/` in your repository unless you name another |

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
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so.
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
case: P3 1.1.2   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /api/hiecm/subscription-requests/v3/{subscriptionRequestId}/approve  REQUEST-ID 6f1c...  HTTP 202
body: {"subscriptionId":"...","message":"..."}
callback: POST /api/v3/hiu/subscription-requests/hiu/notify  notification.status GRANTED
matched: exit condition for P3 1.1.2
next: P3 1.1.3
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
| P3 1.1.1 | passed | 6f1c..., a02d... | exit condition matched, pasted below |
| P3 1.1.2 | needs-human | b7a1... | OTP prompt shown, left blank |
| P3 1.1.3 | running | | |
| P3 1.1.4 | pending | | |
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
| Name every check by its case name from this skill, such as `P3 1.1.2`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
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
P3 1.1.1  POST /api/hiecm/subscription-requests/v3/init  REQUEST-ID 3b9e...  HTTP 202  matched
P3 1.1.1  callback on-init  subscriptionRequest.id present  matched
P3 1.1.1  GET /api/hiecm/subscription-requests/v3/requests  REQUEST-ID 5e70...  HTTP 200  requests[].status REQUESTED  matched
  Grant the subscription on the phone, then press enter. Leave blank if nobody is here:
P3 1.1.2  callback hiu/notify  notification.status GRANTED  matched
P3 1.1.2  passed
```

Nudge: calls with a missing `X-AUTH-TOKEN`, a wrong `X-CM-ID` or a made up subscription id test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, Building HIU Service for PHR tab. That sheet carries no case ids, so each case here is named by its milestone and row, such as `P3 1.1.1`. Read the functional testing report against those names. The sections are grouped as the sheet groups them. Every operation id below is in a P specification, which carries the host, the headers and a full request.

Two calls this set leans on are not in any P specification. An HIU raises a consent request with `m3_post_consent_v3_request_init`, and fetches data with `m3_post_data_flow_v3_health_information_request`. Raising a request is a precondition below. A case whose result is data fetched is `not-run` with that reason.

### P3 1.1.1 to 1.1.5: the subscription request

Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** A gateway access token less than 30 minutes old. The person logged in to the PHR app and has agreed, on screen, that the HIU may subscribe.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P3 1.1.1 | `sandbox`, `screen` | The HIU raises a subscription request, the app is notified, and it shows in Requests | `p3_post_subscription_requests_v3_init` with `subscription.patient.id`, `subscription.hiu.id`, `subscription.categories` and `subscription.period` returns 202. The `p3_post_v3_hiu_hiecm_subscription_requests_on_init` callback carries `subscriptionRequest.id`. `p3_get_subscription_requests_v3_requests` returns 200 with that `requests[].requestId` and `status` `REQUESTED`. Screen check: the notification and the request under Requests |
| P3 1.1.2 | `sandbox`, `human` | The person grants it, choosing HI types, visit types and period, and it shows under Approved, Granted | The person grants. `p3_post_subscription_requests_v3_request_id_approve` with `includedSources[].hiTypes`, `includedSources[].categories` and `includedSources[].period` returns 202 with `subscriptionId`. The HIU's `p3_post_v3_hiu_subscription_requests_hiu_notify` callback carries `notification.status` `GRANTED`, and the HIU acknowledges with `p3_post_subscription_requests_v3_hiu_on_notify`, which returns 202. `p3_get_subscription_requests_v3_subscription_id` returns 200 with `status` `GRANTED` and `includedSources` as chosen |
| P3 1.1.3 | `sandbox`, `human` | The person denies it, it shows under Requests, Denied, and the HIU gets no notifications | The person denies. `p3_post_subscription_requests_v3_request_id_deny` with `reason` returns 202 with `message`. The hiu/notify callback carries `notification.status` `DENIED`. No `p3_post_v3_hiu_subscription_notify` arrives for this person afterwards |
| P3 1.1.4 | `sandbox`, `screen` | A request nobody acts on expires, and shows as Expired, never as Denied | Leave a fresh request alone past its window; the sheet gives 2 hours. `p3_get_subscription_requests_v3_requests` then returns 200 with that request's `status` `EXPIRED`, and the screen lists it under Expired. The sheet's same row asks that a grant gives access only for the period set; that is the `includedSources[].period` check in P3 1.1.2 |
| P3 1.1.5 | `sandbox`, `human` | After a grant, the person deselects HI types, visit types or period and saves, and only the rest stays subscribed | The person edits and saves. `p3_put_subscription_requests_v3_patients_subscription_id` returns 202 with `subscriptionId`. `p3_get_subscription_requests_v3_subscription_id` then returns 200 with `includedSources[].hiTypes` and `includedSources[].period` as saved |

### P3 1.2.1 to 1.2.3: the auto approval policy

Mandatory.

Loop limit: 3 passes per test case.

**Preconditions.** P3 1.1.2 passed. A HIP that can create a new record for the person. An HIU that raises a consent request when notified.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P3 1.2.1 | `sandbox`, `human` | With a policy set at grant, a consent request for a new record is granted with no tap, still shows in the app, and the HIU is notified | The person sets the policy. `p2_post_consent_v3_auto_approve` with `hiu.id` and `includedSources` returns 202. A HIP links a new record, and the HIU's `p3_post_v3_hiu_subscription_notify` callback carries `event.category` `LINK` or `DATA`. The HIU's consent request then shows `status` `GRANTED` on `p2_get_consent_v3_request_request_id`, with no `p2_post_consent_v3_request_request_id_approve` in your log. Screen check: the request appears in the app's history |
| P3 1.2.2 | `sandbox`, `human` | With no policy, every consent request waits for the person | The HIU's consent request shows `status` `REQUESTED` on `p2_get_consent_v3_request_request_id` until the person taps Approve. After the tap, `p2_post_consent_v3_request_request_id_approve` returns 202 and the status is `GRANTED` |
| P3 1.2.3 | `sandbox`, `human` | A disabled policy stops auto approval at once | The person disables it. `p2_post_consent_v3_auto_approve_auto_approval_id_disable` returns 202 with `message`. The next consent request from that HIU shows `status` `REQUESTED`, not `GRANTED` |

### P3 1.3.1 and 1.3.2: notifications on a new record and a consent request

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P3 1.3.1 | `sandbox`, `human` | The HIU is notified whenever a new record is created at a HIP under an approved subscription | A HIP links a record. The HIU's `p3_post_v3_hiu_subscription_notify` callback carries `event.id`, `event.category`, `event.subscriptionId` equal to the subscription, and `event.content.hip.id`. The HIU acknowledges with `p3_post_subscription_requests_v3_hiu_care_context_on_notify`, `acknowledgement.eventId` equal to `event.id`, which returns 202 |
| P3 1.3.2 | `sandbox`, `screen` | A consent request from an HIU reaches the app, which shows its details with Grant and Deny | An HIU raises a request with `m3_post_consent_v3_request_init`. `p2_get_consent_v3_request_request_id` returns 200 with `status` `REQUESTED`, `hiu.id`, `purpose.code` and `permission.dateRange`. Screen check: the notification, then the details with Grant and Deny. `hiecm.concept.consent-in-a-phr-app` |

### P3 1.4.1 to 1.4.4: what an HIU can fetch under each consent state

Mandatory. Each case's result is data fetched or refused, which needs `m3_post_data_flow_v3_health_information_request`. No P specification publishes it.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P3 1.4.1 | not-run | Approved: the HIU fetches and views the data | `not-run`: needs the M3 health information request. The approval half is P2 10.1 |
| P3 1.4.2 | not-run | Denied: the HIU cannot fetch | `not-run`: as P3 1.4.1. The denial half is P2 9.2 |
| P3 1.4.3 | not-run | Expired or not acted on: the HIU cannot fetch | `not-run`: as P3 1.4.1. The expiry half is P2 9.3 |
| P3 1.4.4 | not-run | Revoked: the HIU cannot fetch | `not-run`: as P3 1.4.1. The revocation half is P2 10.2 |

### P3 1.5.1: one consent artefact per HIP

Mandatory. `sandbox` and `human`.

Loop limit: 3 passes per test case.

#### P3 1.5.1, the artefacts are plural

The person grants one consent request across at least two HIPs. Exit condition: `p2_get_consent_v3_artefact_request_request_id` returns 200 with one entry per HIP, each with `status` `GRANTED` and a distinct `consentDetail.hip.id`, and the number of entries equals the number of HIPs granted. The HIU's own artefact fetch, and the records seen against each HIP, are M3. `hiecm.concept.m3-plural-artefacts-and-codes`

Nudge: an HIU that keeps the first artefact and drops the rest fetches from one HIP and silently loses the others.

## When the last case is recorded

Mark the run log finished, with the time and the count of each outcome. Then write the manifest beside it, with the same name and `.json`. It is the whole report. Case names to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no client secret.

```json
{
  "skill": "abdm-p3",
  "set": "PHR mobile app test cases, NHA, Building HIU Service for PHR tab",
  "side": "phr and hiu",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "P3 1.1.2", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c...", "a02d..."],
     "observed": ["approve 202 subscriptionId", "hiu/notify notification.status=GRANTED"]},
    {"id": "P3 1.1.4", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["c9e4..."], "observed": ["requests 200 status=EXPIRED"],
     "attachment": "expired-tab-2026-10-01.png"},
    {"id": "P3 1.3.1", "outcome": "needs-human", "evidence": "human",
     "reason": "no facility partner to link a new record"},
    {"id": "P3 1.4.1", "outcome": "not-run", "reason": "health information request is M3; no P specification publishes it"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
