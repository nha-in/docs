# HIE-CM p4 test

Walks the ABDM P4 functional test cases, the health locker, against the locker and PHR app you built and the sandbox. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P4 case in the PHR app set against your locker and your PHR app, one case at a time
- Records, for each case, the sandbox response or callback and the REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your locker's id, registered as a health locker | The ABDM sandbox portal. It goes in `X-LOCKER-ID` |
| Your locker's bridge callback URL registered | Subscription results and notifications arrive there |
| A person logged in to the PHR app with an ABHA address | The P1 login. Patient calls use that person's login token |
| A sandbox HIP that can link a new record to that address | A partner or your own test facility. Without one, the notification cases are `needs-human` |
| The person present with their phone | Every grant, deny, upload and consent tap is a human step and the skill stops for it |

## Say one of these

- "Walk the P4 test cases against my locker and log each one."
- "Run only the consent list cases, P4 6.1 to P4 7.1.2."
- "Re-run P4 2.1, locker setup failed yesterday."
- "Write a terminal script that runs the P4 test cases and waits for me to approve on the phone."

## What happens first

One question: which cases. All of them, one group, or a list of case names. Then the preconditions for the first case are checked before anything is sent. Nothing else is asked until a case needs a human.

## How this skill runs

Every case is an observe, orient, decide, act loop. Observe the live state: the last response, the last callback, the last REQUEST-ID, what your screen shows. Orient against the case below. Decide the cheapest action that produces a new observation. Act, paste the raw result, return to observe. A case is done only when its exit condition is observed, never because the step should have worked.

Loop limit: 3 passes per test case. Hitting the limit is an escalation: state what was observed with request ids, what was tried, name one section of this skill or one operation page to read, and ask one question.

### The four outcomes

| Outcome | Record it when | Never when |
|---|---|---|
| `passed` | The exit condition is observed and the observation is pasted verbatim | The response or the callback was not pasted. A pass with no output is a fail |
| `failed` | Three passes and the exit condition was not observed, or the sandbox returned the refusal the case expects you to handle and your system did not handle it | A human step was missing. That is `needs-human` |
| `needs-human` | The case reached a grant, an upload, a consent tap, a facility partner or a person who was not there | Ever as a substitute for a fail you can see |
| `not-run` | The case is optional and you do not claim it, or no P specification publishes the operation it needs | To skip a mandatory case that applies to you |

### The three kinds of evidence

Every case names one of these. It decides what the manifest carries.

- **sandbox.** A call or a callback the gateway sees. Evidence is the HTTP status, the body and the REQUEST-ID, pasted. For an asynchronous call it is the 202 and then the callback carrying the named field. A reviewer can check this against the gateway's own record, which is why it outranks the other two.
- **screen.** A rule about what your locker or app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so.
- **human.** A step only a person can do. Evidence is the observation immediately before it and the outcome `needs-human` when nobody was there.

### Rules that hold for every case

- Tokens as the specification requires. The gateway access token goes in `Authorization` on every call. Calls about the patient send the person's login token in `X-AUTH-TOKEN`, never the gateway token. Every call sends `X-CM-ID`, `sbx` in sandbox. Setup sends `X-LOCKER-ID`.
- A notification carries no records. A `LINK` event starts a consent request; a `DATA` event reuses a consent that covers it. Records arrive only through the health information request that follows.
- A 202 is a receipt, not a result. The answer arrives on the locker's callback. Log the whole callback body before you parse it. `hiecm.concept.asynchronous-callbacks`
- Fresh `REQUEST-ID` on every call, logged before sending. A reused id is refused, and after a failure the id is the only handle on the call.
- Paste the response. A step with no pasted output is not done.
- Sensitive values travel encrypted, as the specification marks them. An uploaded document is the person's record; never write it to a run log.
- One question when you escalate. The person is being interrupted.

### The run record

Append one block per loop pass. It is the raw material for the manifest.

```text
case: P4 2.1   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /api/hiecm/subscription-requests/v3/setup-locker  REQUEST-ID 6f1c...  HTTP 200
body: {"consentAutoApprovalId":"..."}
matched: exit condition for P4 2.1, step 1
next: GET /api/hiecm/subscription-requests/v3/patients/lockers
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case name from this skill, such as `P4 2.1`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
| At each `human` step, stop and prompt in the terminal: "approve the locker request on the phone, then press enter", "upload a report in the app, then press enter" | Every P4 success path passes through a person's decision. A runner that never asks never reaches one |
| Never write a token or an uploaded document to disk, a log or the manifest, and never hard code a token | A login token acts for the person, and the document is their record |
| For an asynchronous call, wait on the locker's callback with a timeout, and match its `response.requestId` or its `subscriptionId` to what you sent | The 202 alone proves only that the gateway took the request |
| Run each `sandbox` case's success path and the refusal its exit condition names, as separate checks | The case passes only when both are observed |
| Compare the status and the body literal the exit condition names, such as `200` with `consentAutoApprovalId` present, or `isActive` `true` | A status alone never passes a check |
| A `4xx` passes only where the case's exit condition names that refusal | A `400` on a success path step is `failed` |
| A blank answer at a prompt records the case `needs-human` and moves to the next case | Nobody present is neither a pass nor a fail |
| A `screen` case prints its check, then asks `passed? y/n` and the evidence file name | No call proves a screen, so the case is attested |
| At the end, print one line per case name with its outcome and request ids, then write the manifest in the last section | The person reads outcomes by case name, not by script step |

A run reads like this.

```text
P4 2.1  POST /api/hiecm/subscription-requests/v3/setup-locker  REQUEST-ID 3b9e...  HTTP 200  consentAutoApprovalId present  matched
P4 2.1  GET /api/hiecm/subscription-requests/v3/patients/lockers  REQUEST-ID 5e70...  HTTP 200  lockerId matches  isActive true  matched
P4 2.1  passed
  Ask the facility to link a new record to the address, then press enter. Leave blank if nobody is here:
P4 3.1  callback subscription/notify  event.category LINK  matched
P4 3.1  POST /api/hiecm/subscription-requests/v3/hiu/care-context/on-notify  REQUEST-ID 8d21...  HTTP 202  matched
P4 3.1  passed
```

Nudge: calls with the gateway token in `X-AUTH-TOKEN`, a wrong `X-LOCKER-ID` or a made up locker id test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, Locker tab. That sheet carries no case ids, so each case here is named by its milestone and row, such as `P4 5.3.1`. Read the functional testing report against those names. The sections are grouped as the sheet groups them. Every operation id below is in a P specification, which carries the host, the headers and a full request.

Three calls this set leans on are not in any P specification. A locker raises a consent request with `m3_post_consent_v3_request_init` and fetches records with `m3_post_data_flow_v3_health_information_request`. It links a care context as a HIP with `m2_post_hip_v3_link_carecontext`, after a token from `m2_post_v3_token_generate_token`. A case whose result needs one of these is `not-run` with that reason.

### P4 1.1: discover and add a health locker

Optional. `sandbox`.

Loop limit: 3 passes per test case.

#### P4 1.1, the locker is found and a request reaches the app

`p4_get_gateway_v3_health_lockers` with `name` returns 200 with an entry whose `identifier.id` is your locker. After linking, `p4_get_subscription_requests_v3_patients_requests` returns 200 with a `subscriptions.requests[]` entry of `requestType` `HEALTH_LOCKER` for this person. A name with no match returns 204 with `error.code`. Record `not-run` if you do not claim it.

### P4 2.1: set up a health locker for the person

Mandatory. `sandbox`.

Loop limit: 3 passes per test case.

#### P4 2.1, the locker is linked to the address

Exit condition, both pasted.

1. `p4_post_subscription_requests_v3_setup_locker` with `X-LOCKER-ID` and `X-AUTH-TOKEN` returns 200 with `consentAutoApprovalId` present.
2. `p4_get_subscription_requests_v3_patients_lockers` returns 200 with an entry whose `lockerId` is your locker and `isActive` `true`.

The sheet also names a long term linking token. That token is the M2 one in P4 5.3.3, not part of this exit condition.

### P4 3.1 to 3.8: records from a HIP into the locker

Mandatory. The sheet has no row 3.5.

Loop limit: 3 passes per test case.

**Preconditions.** P4 2.1 passed. A HIP that links a new record to the person's address.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 3.1 | `sandbox`, `human` | The locker is notified when a HIP creates a record | A HIP links a record. The locker's `p3_post_v3_hiu_subscription_notify` callback carries `event.id`, `event.category` `LINK`, and `event.content.hip.id`. The locker acknowledges with `p3_post_subscription_requests_v3_hiu_care_context_on_notify`, `acknowledgement.eventId` equal to `event.id`, which returns 202 |
| P4 3.2 | `sandbox`, `human` | The locker's consent request reaches the app, and an SMS reaches the person | The locker raises the request with `m3_post_consent_v3_request_init`. `p2_get_consent_v3_request_request_id` returns 200 with `status` `REQUESTED` and `hiu.id` equal to your locker. The SMS is a human check. The records that follow are P4 3.6 |
| P4 3.3 | `sandbox` | Under the policy set at linking, the locker's consent request is granted with no tap | `p4_get_subscription_requests_v3_patients_lockers_lockerid` returns 200 with an `autoApprovals[]` entry with `isActive` `true`. The locker's next request shows `status` `GRANTED` on `p2_get_consent_v3_request_request_id`, with no approve call in the log |
| P4 3.4 | `sandbox`, `human` | The person grants the locker's request in the app's Requests list | The person taps Approve. `p2_post_consent_v3_request_request_id_approve` returns 202 with `consentIds[].id`, then `p2_get_consent_v3_request_request_id` returns 200 with `status` `GRANTED` |
| P4 3.6 | not-run | With consent, the locker fetches the records from each HIP | `not-run`: needs `m3_post_data_flow_v3_health_information_request`, which no P specification publishes |
| P4 3.7 | not-run | The locker links the fetched record's care context to the consent manager | `not-run`: needs `m2_post_hip_v3_link_carecontext`. Once linked, the app side check is P4 4.5 |
| P4 3.8 | `screen` | Fetched records can be viewed in the locker | The record in the locker. Attest on a record your locker already holds |

### P4 4 to 4.7: upload a document into the locker from the app

Mandatory. ABDM publishes no upload operation. The upload goes to your locker's own service, so those steps are attested.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 4 | `screen`, `human` | The person uploads a scanned report with the Upload icon | The person uploads. The upload screen and the confirmation |
| P4 4.1 | `screen` | The upload form's fields, mandatory ones marked | The form. The sheet lists no fields for this row; record the ones your form marks mandatory |
| P4 4.2 | `screen` | The locker checks whether the upload is a health document and processes only those | A health document accepted and a non health document refused, with your locker's record of each |
| P4 4.3 | `screen` | The locker stores the record against a care context | Your locker's stored record, showing its care context reference |
| P4 4.4 | not-run | The upload is linked to the address by HIP initiated linking | `not-run`: needs `m2_post_hip_v3_link_carecontext` |
| P4 4.5 | `sandbox`, `screen` | Once linked, the locker shows under Providers in the app | `p2_get_hip_v3_link_patient_links` returns 200 with a `Patient.links[]` entry whose `hip` is your locker. The screen lists it under Providers |
| P4 4.6 | not-run | Get Data fetches the record into the app's Records tab | `not-run`: needs `m3_post_data_flow_v3_health_information_request` |
| P4 4.7 | `screen` | Tapping the record shows its details, and the attachment opens | The details and the opened attachment |

### P4 5.1.1 to 5.1.4: the subscription, learning of a new record

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 5.1.1 | `sandbox` | The locker raises a subscription during setup | `p3_post_subscription_requests_v3_init` returns 202, and the `p3_post_v3_hiu_hiecm_subscription_requests_on_init` callback carries `subscriptionRequest.id` |
| P4 5.1.2 | `sandbox`, `human` | The request is visible in the app's Requests tab and approved | `p4_get_subscription_requests_v3_patients_requests` returns 200 with a `subscriptions.requests[]` entry of `requestType` `HEALTH_LOCKER`. Once approved, it shows `status` `GRANTED`, and the locker's `p3_post_v3_hiu_subscription_requests_hiu_notify` callback carries `notification.status` `GRANTED`. A locker's subscription can be approved automatically; record whether the person tapped |
| P4 5.1.3 | `sandbox`, `human` | The locker is notified of a new care context or new data | As P4 3.1, with `event.category` `LINK` or `DATA` |
| P4 5.1.4 | not-run | On the notification the locker fetches the new record | `not-run`: needs `m3_post_data_flow_v3_health_information_request`, and for a `LINK` event first `m3_post_consent_v3_request_init` |

### P4 5.2.1 to 5.2.3: the auto approval policy

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 5.2.1 | `sandbox`, `human` | The person chooses an auto approval policy at locker setup | The `consentAutoApprovalId` from P4 2.1, and `p4_get_subscription_requests_v3_patients_lockers_lockerid` returns 200 with an `autoApprovals[]` entry with that `autoApprovalId` and `isActive` `true` |
| P4 5.2.2 | `sandbox` | A consent request inside the policy is granted with no tap | As P4 3.3 |
| P4 5.2.3 | `sandbox`, `human` | The person disables the policy, and requests need a tap again | `p2_post_consent_v3_auto_approve_auto_approval_id_disable` returns 202 with `message`. The locker settings then show that `autoApprovals[]` entry with `isActive` `false`, and the next request shows `status` `REQUESTED` |

### P4 5.3.1 to 5.3.4: the authorisation request, telling the consent manager the locker holds records

Mandatory. The authorisation request and the linking token are M2 calls the locker makes as a HIP. No P specification publishes them.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 5.3.1 | not-run | The locker raises a direct authorisation request | `not-run`: no P specification publishes it |
| P4 5.3.2 | not-run | The person approves it in the app | `not-run`: as P4 5.3.1 |
| P4 5.3.3 | not-run | The locker receives a linking token | `not-run`: needs `m2_post_v3_token_generate_token` and its `m2_post_v3_hip_token_on_generate_token` callback |
| P4 5.3.4 | not-run | One locker token links several care contexts | `not-run`: needs `m2_post_hip_v3_link_carecontext` |

### P4 6.1 to 6.1.3: the Requests tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 6.1 | `sandbox`, `screen` | The Requests tab shows the request categories | `p4_get_subscription_requests_v3_patients_requests` returns 200 with `consents.requests` and `subscriptions.requests`. The screen shows Requested, Denied and Expired |
| P4 6.1.1 | `sandbox`, `screen` | Requests not acted on show under Requested | The same call with `status` `REQUESTED` returns the request, and the screen lists it there |
| P4 6.1.2 | `sandbox`, `human` | A denied request shows under Denied | The person denies. `p2_post_consent_v3_request_request_id_deny` returns 202, then the list call with `status` `DENIED` returns it |
| P4 6.1.3 | `sandbox`, `screen` | An expired request shows under Expired | The list call with `status` `EXPIRED` returns a request left past its window, and the screen lists it under Expired, never under Denied |

### P4 7.1.1 and 7.1.2: the Approved tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 7.1.1 | `sandbox`, `screen` | Granted consents show under Granted | `p2_get_consent_v3_artefact` returns 200 with a `consentArtefacts[]` entry with `status` `GRANTED`, and the screen lists it under Granted |
| P4 7.1.2 | `sandbox`, `screen` | Consents past their end show under Expired | The same call returns an entry with `status` `EXPIRED`, and the screen lists it under Expired |

### P4 8 and P4 9: edit a subscription, disable auto approval

Mandatory. These repeat P3 1.1.5 and P4 5.2.3. One run can serve both; quote both names.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 8 | `sandbox`, `human` | The person edits the locker's subscription | `p3_put_subscription_requests_v3_patients_subscription_id` returns 202 with `subscriptionId`, then `p3_get_subscription_requests_v3_subscription_id` returns 200 with `includedSources` as saved |
| P4 9 | `sandbox`, `human` | With auto approval disabled, every consent needs a tap | As P4 5.2.3 |

### P4 10.1 to 10.5: what an HIU can fetch from the locker under each consent state

Mandatory. Each case's result is data fetched or refused, which needs `m3_post_data_flow_v3_health_information_request`. No P specification publishes it.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P4 10.1 | not-run | Approved: the HIU views the data | `not-run`: needs the M3 health information request. The approval half is P4 3.4 |
| P4 10.2 | not-run | Denied: the HIU cannot view the data | `not-run`: as P4 10.1. The denial half is P4 6.1.2 |
| P4 10.3 | not-run | Expired or not acted on: the HIU cannot view the data | `not-run`: as P4 10.1. The expiry half is P4 6.1.3 |
| P4 10.4 | not-run | Revoked: the HIU cannot view the data | `not-run`: as P4 10.1. Revoking is P2 10.2 |
| P4 10.5 | not-run | Auto approved: the HIU fetches data created later | `not-run`: as P4 10.1. The auto approval half is P4 5.2.2 |

### P4 11: the HIU receives records only under an approved consent

Mandatory. `not-run`: needs `m3_post_data_flow_v3_health_information_request`, which no P specification publishes. The approval half is P4 3.4.

Loop limit: 3 passes per test case.

## When the last case is recorded

Write the manifest. It is the whole report. Case names to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no documents, no client secret.

```json
{
  "skill": "abdm-p4",
  "set": "PHR mobile app test cases, NHA, Locker tab",
  "locker_id": "<your locker id>",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "P4 2.1", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["3b9e...", "5e70..."],
     "observed": ["setup-locker 200 consentAutoApprovalId", "patients/lockers 200 isActive=true"]},
    {"id": "P4 4.2", "outcome": "passed", "evidence": "screen",
     "attachment": "locker-processing-2026-10-01.png"},
    {"id": "P4 3.1", "outcome": "needs-human", "evidence": "human",
     "reason": "no facility partner to link a new record"},
    {"id": "P4 3.6", "outcome": "not-run", "reason": "health information request is M3; no P specification publishes it"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
