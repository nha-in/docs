# HIE-CM p2 test

Walks the ABDM P2 functional test cases against the PHR app you built and the sandbox: linking records, sharing a profile, the consents tabs and the profile. Each case ends in one of four recorded outcomes, never in an opinion.

## What this skill does

- Runs every P2 case in the PHR app set against your app and the sandbox, one case at a time
- Records, for each case, the sandbox response or callback and the REQUEST-ID that prove it, or the screen that has to be attested, or the human step it stopped at
- Writes a manifest of case names to request ids at the end, which is the evidence a reviewer checks against the gateway rather than a folder of screenshots

## What it needs from you

| Need | Where it comes from |
|---|---|
| Sandbox client id and secret | The ABDM sandbox portal, under your registered application |
| Your PHR app running against the sandbox hosts, with its bridge callback URL registered | Your build and your bridge. Linking and sharing answer on your callback, so a callback that never arrives fails those cases |
| A person logged in to your app with an ABHA address | The P1 login. The skill uses that person's user token |
| A sandbox HIP with a record for that person, and a sandbox HIU that raises consent requests | A partner or your own test facility. Without one, the linking and consent cases are `needs-human` |
| The person present with their phone | Every OTP, every consent tap and every QR scan is a human step and the skill stops for it |

## Say one of these

- "Walk the P2 test cases against my PHR app and log each one."
- "Run only the linking cases, P2 1.1 to P2 1.11."
- "Re-run P2 15.5, linking the ABHA number failed yesterday."
- "Write a terminal script that runs the P2 test cases and asks me for each OTP and each consent tap."

## What happens first

One question: which cases. All of them, one group, or a list of case names. Then the preconditions for the first case are checked before anything is sent. Nothing else is asked until a case needs a human.

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
- **screen.** A rule about what your app shows or stores, which no call proves. Evidence is one screenshot or a short recording. A screen case is attested, not observed, and the manifest marks it so.
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
case: P2 1.5   pass: 1 of 3   at: 2026-10-01T10:14:02Z
observed: POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover  REQUEST-ID 6f1c...  HTTP 202
callback: POST /api/v3/hiu/patient/care-context/on-discover  response.requestId 6f1c...
body: {"transactionId":"...","patient":[{"referenceNumber":"...","careContexts":[...],"hiType":"Prescription","count":1}],...}
matched: exit condition for P2 1.5
next: P2 1.6
```

### When the run is a script

Asked for a test script, a test command or automated tests, build one interactive terminal runner that walks the cases below. It does the typing. Every rule above still holds.

| Rule | Why |
|---|---|
| Name every check by its case name from this skill, such as `P2 1.5`. Never invent a numbering such as `TC01` | The functional testing report quotes these names. A check with no case name answers nothing a reviewer asks |
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
P2 15.3  POST /abha/api/v3/phr/app/login/profile/request/otp  REQUEST-ID 3b9e...  HTTP 200  txnId present  matched
  Enter the OTP sent to the mobile ending 2425, or leave blank if nobody is here:
P2 15.3  wrong OTP  REQUEST-ID 7c02...  HTTP 200  authResult failed  matched
P2 15.3  right OTP  REQUEST-ID 9a41...  HTTP 200  authResult success  matched
P2 15.5  POST /abha/api/v3/phr/app/login/profile/link  REQUEST-ID 4d10...  HTTP 200  message ABHA number is securely linked to ABHA address  matched
P2 15.5  passed
```

Nudge: calls with a bad `scope`, a missing `X-AUTH-TOKEN` or a made up transaction id test your client, not a case. Run them first if you want them, label them `preflight`, and keep them out of the case counts.

## Test cases

The marks and the wording of each check are ABDM's, from the PHR mobile app test cases, PHR App Functionality tab. That sheet carries no case ids, so each case here is named by its milestone and row, such as `P2 2.10`. Read the functional testing report against those names. The sections are grouped as the sheet groups them. Every operation id below is in a P specification, which carries the host, the headers and a full request.

Fetching health data is the health information request, `m3_post_data_flow_v3_health_information_request`. No P specification publishes it, so every case whose result is records fetched is `not-run` here with that reason.

### P2 1.1 to 1.11: link and view records from a health facility, user initiated

Mandatory unless marked. The programme group repeats this one, so it is written in full.

Loop limit: 3 passes per test case.

**Preconditions.** The person logged in. A sandbox HIP holding a record whose name, year of birth, gender and mobile match the person's profile. Your callback reachable.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 1.1 | `screen` | "Link my Health Records" in My Records, and "+" in Linked Facility, open the facility search | The search screen after each tap |
| P2 1.2 | `sandbox` | The person types part of a facility name and the facility is found | `p2_get_gateway_v3_providers` with `name` returns 200 with entries carrying `identifier.name`, `identifier.id` and `isHIP` `true`, and the screen lists them with the address. A name with no match returns 204 with `error.code`, and the screen says nothing was found |
| P2 1.3 | `screen` | The person's verified mobile, ABHA address, ABHA number, patient id field, full name, year of birth and gender are shown after choosing the facility | The screen |
| P2 1.4 | `sandbox` | An entered patient id narrows the match | `p2_post_user_initiated_linking_v3_patient_care_context_discover` with an `unverifiedIdentifiers` entry of `type` `MR` returns 202, and the `p2_post_v3_hiu_patient_care_context_on_discover` callback carries `patient` with that record |
| P2 1.5 | `sandbox` | Fetch Records discovers by name, year of birth, gender and mobile, and leaves out what is already linked | The discover call returns 202 with `hip.id` set. The on-discover callback carries `transactionId` and `patient[].careContexts`. No care context in it appears in `p2_get_hip_v3_link_patient_links` `Patient.links[].careContexts` |
| P2 1.6 | `sandbox`, `human` | The discovered records are shown with their type, the person selects some, and only those link | `p2_post_user_initiated_linking_v3_link_care_context_init` with the `transactionId` and the selected care contexts returns 202. The `p2_post_v3_hiu_patient_care_context_on_init` callback carries `link.referenceNumber`. After P2 1.7, the on-confirm `patient.careContexts` holds the selected ones and no other |
| P2 1.7 | `sandbox`, `human`, optional | The OTP the HIP sends completes the link, and "Records are successfully linked" is shown | The person enters the OTP. `p2_post_user_initiated_linking_v3_link_care_context_confirm` with `linkRefNumber` and `token` returns 202, and the `p2_post_v3_hiu_patient_care_context_on_confirm` callback carries `patient.careContexts`. A wrong OTP brings the callback with `error.code`, and the screen shows the error. Record `not-run` if you do not claim it |
| P2 1.8 | not-run | Pull Records sends a data request within 5 minutes and records arrive | `not-run`: needs `m3_post_data_flow_v3_health_information_request`, which no P specification publishes. The screen check that the facility shows in Linked Facility is P2 12.1 |
| P2 1.9 | `screen`, optional | An "i" control in My Records says fetching can take time, and a status shows while it does | The message and the status. Record `not-run` if you do not claim it |
| P2 1.10 | `screen`, optional | A record shows facility name, visit type, prescriber, date and its attachment | The record screen. Record `not-run` if you do not claim it |
| P2 1.11 | `screen`, optional | The attachment opens on the device | The opened record. Record `not-run` if you do not claim it |

### P2 2.1 to 2.11: link and view records from a health programme, user initiated

Same as P2 1.1 to 1.11, with these differences. Run each as its counterpart and record the counterpart's evidence.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 2.1 | `screen` | As P2 1.1 | As P2 1.1 |
| P2 2.2 | `sandbox` | The person selects an integrated government programme | `p2_get_gateway_v3_govt_programs` returns 200 with entries carrying `identifier.name` and `identifier.id`, and the screen lists them |
| P2 2.3 | `screen` | As P2 1.3, with the programme's own label in place of patient id | The screen |
| P2 2.4 | `sandbox` | An entered programme id, such as a PM-JAY id, narrows the match | As P2 1.4 |
| P2 2.5 | `sandbox` | As P2 1.5 | As P2 1.5, with the programme's id in `hip.id` |
| P2 2.6 | `sandbox`, `human` | As P2 1.6. The records show as the programme names them, such as each vaccine dose | As P2 1.6 |
| P2 2.7 | `sandbox`, `human`, optional | As P2 1.7, with the OTP sent by the programme | As P2 1.7 |
| P2 2.8 | not-run | As P2 1.8 | `not-run`: as P2 1.8 |
| P2 2.9 | `screen`, optional | As P2 1.9 | As P2 1.9 |
| P2 2.10 | `screen`, optional | As P2 1.10 | As P2 1.10 |
| P2 2.11 | `screen`, optional | As P2 1.11 | As P2 1.11 |

### P2 3: records linked by the facility, HIP initiated

Mandatory. The facility links the record with `m2_post_hip_v3_link_carecontext`, an M2 call your app does not make.

Loop limit: 3 passes per test case.

#### P2 3, linked records appear in the app. `sandbox` and `screen`

A facility links a record to the person's address. Exit condition: `p2_get_hip_v3_link_patient_links` returns 200 with `Patient.links[]` holding that HIP's `hip` and the linked `careContexts`, and Linked Facility shows the facility. Viewing the record needs the fetch in P2 1.8, which is `not-run` here.

### P2 4: an HIU views data under an approved consent

Mandatory. `not-run`: the HIU's fetch is `m3_post_data_flow_v3_health_information_request`, which no P specification publishes. The approval half is P2 10.1.

Loop limit: 3 passes per test case.

### P2 5.1.1 to 5.1.3: share the profile by QR from the app

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 5.1.1 | `sandbox`, `human` | The app shows the person's QR code in Profile, and the facility scans it | `p2_get_v3_phr_app_login_profile_qrcode` returns 202, as the specification states, and the screen shows the QR. The facility's scan is a human step. Screen check: after the scan the person sees the profile, the consent text, and Share and Cancel |
| P2 5.1.2 | `sandbox`, `human` | Share sends the profile to the facility's system and a notification confirms it. Cancel sends nothing | Share: `p2_post_patient_share_v3_share` with `intent` `PROFILE_SHARE` and `metaData.hipId` returns 202, and the `p2_post_v3_hiu_patient_on_share` callback carries `acknowledgement.status` and `acknowledgement.abhaAddress`. Cancel: no share call in the log |
| P2 5.1.3 | `sandbox`, `human` | The person scans the facility's counter QR with Scan in Profile, confirms, and shares | The person scans. As P2 5.1.2, with `metaData.context` from the QR, and the callback carries `acknowledgement.profile.tokenNumber`, which the screen shows |

### P2 5.2.1 to 5.2.11: share the profile when the QR is scanned with the phone camera

Mandatory unless the sheet leaves a case unmarked. The camera, the app chooser and the store are the phone's, so each step is a person's.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 5.2.1 | `screen`, `human` | App installed, person logged out: the scan offers the installed PHR apps and yours launches when chosen | A recording from scan to launch |
| P2 5.2.2 | `screen` | Logged out, the app opens on the login page | The login page after launch |
| P2 5.2.3 | `screen` | After login, the app opens the share profile page | The share profile page |
| P2 5.2.4 | `sandbox`, `human` | Share sends the profile, Cancel does not | As P2 5.1.2 |
| P2 5.2.5 | `screen`, `human` | App installed, person logged in: the scan launches your app | A recording from scan to launch |
| P2 5.2.6 | `screen` | The app opens the share profile page | The share profile page |
| P2 5.2.7 | `sandbox`, `human` | As P2 5.2.4 | As P2 5.1.2 |
| P2 5.2.8 | `screen`, `human` | App not installed: the scan opens a browser on the deep link page | A recording from scan to the page |
| P2 5.2.9 | `screen`, `human` | The deep link page lists the ABDM compliant PHR apps, yours among them, and choosing one opens its store page | The page and the store page |
| P2 5.2.10 | `sandbox`, `human` | After install, the person registers or logs in and lands on share profile | A P1 registration or login 200, such as `p1_post_v3_phr_app_enrollment_enrol` with `message` `ABHA Address Created Successfully`, then the share profile page |
| P2 5.2.11 | `sandbox`, `human` | As P2 5.2.4 | As P2 5.1.2 |

### P2 6: profile details with KYC verified or self declared

Mandatory. `sandbox` and `screen`.

Loop limit: 3 passes per test case.

#### P2 6, the profile shows its status

`p2_get_v3_phr_app_login_profile` with `X-token` returns 200 with `abhaAddress`, `fullName`, `gender`, `mobile` and `kycStatus`. Screen check: every filled field is shown, with "KYC Verified" and a green tick when `kycStatus` is `VERIFIED`, and "Self-Declared" otherwise.

### P2 7: download the ABHA address card

Mandatory. `sandbox` and `screen`.

Loop limit: 3 passes per test case.

#### P2 7, the card shares and downloads

`p2_get_v3_phr_app_login_profile_phrcard` with `X-token` returns 202, as the specification states. Screen check: the card carries the photo, full name, ABHA address, mobile, and the ABHA number when one is linked, and it can be shared and saved.

### P2 9.1 to 9.3: the Requests section of the Consents tab

Mandatory. Each list covers consent, subscription and locker requests. `p4_get_subscription_requests_v3_patients_requests` with `X-AUTH-TOKEN` returns both consents and subscriptions, filtered by `status`.

Loop limit: 3 passes per test case.

**Preconditions.** A sandbox HIU has raised at least one consent request to the person's address with `m3_post_consent_v3_request_init`, an M3 call your app does not make.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 9.1 | `sandbox`, `screen` | Requests not yet acted on show under Requested | `p2_get_consent_v3_request` returns 200 with `requests[].status` `REQUESTED` for the request, and the screen lists it under Requested |
| P2 9.2 | `sandbox`, `human` | A denied request shows under Denied | The person taps Deny. `p2_post_consent_v3_request_request_id_deny` returns 202, then `p2_get_consent_v3_request_request_id` returns 200 with `status` `DENIED`, and the screen lists it under Denied |
| P2 9.3 | `sandbox`, `screen` | A request left past its expiry shows under Expired, never under Denied | `p2_get_consent_v3_request_request_id` returns 200 with `status` `EXPIRED`, and the screen lists it under Expired. `hiecm.concept.consent-in-a-phr-app` |

### P2 10.1 and 10.2: the Approved section of the Consents tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 10.1 | `sandbox`, `human` | A granted request shows under Granted | The person taps Approve. `p2_post_consent_v3_request_request_id_approve` returns 202 with `consentIds[].id`, then `p2_get_consent_v3_request_request_id` returns 200 with `status` `GRANTED`, and the screen lists it under Granted |
| P2 10.2 | `sandbox`, `human` | A revoked consent shows under Revoked | The person taps Revoke. `p2_post_consent_v3_revoke` returns 202 with `message`, then `p2_get_consent_v3_artefact_artefact_id` returns 200 with `status` `REVOKED`, and the screen lists it under Revoked |

### P2 11.1 to 11.3: the My Records tab

Mandatory. Each needs a fetched record, which P2 1.8 cannot produce here. Attest on a record your app already holds.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 11.1 | `screen` | Tapping a fetched record opens its details | The details screen |
| P2 11.2 | `screen` | The details show HI type, date, time and the doctor or facility, with the attachment | The details screen |
| P2 11.3 | `screen` | The attachment opens on the device | The opened report |

### P2 12.1: the Linked Facility tab

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 12.1 | `sandbox`, `screen` | Every linked provider is listed with Pull Records beside it | `p2_get_hip_v3_link_patient_links` returns 200 with one `Patient.links[]` entry per linked facility or programme, and `p4_get_subscription_requests_v3_patients_lockers` returns 200 with each locker. The screen lists every one, each with Pull Records |

### P2 13 and P2 14: edit a subscription, disable auto approval

Mandatory. These repeat P3 1.1.5 and P3 1.2.3. One run can serve both; quote both names.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 13 | `sandbox`, `human` | A granted subscription's HI types, visit types and period can be edited and saved | The person edits and taps Save Changes. `p3_put_subscription_requests_v3_patients_subscription_id` returns 202 with `subscriptionId`, then `p3_get_subscription_requests_v3_subscription_id` returns 200 with `includedSources[].hiTypes` and `includedSources[].period` as saved |
| P2 14 | `sandbox`, `human` | A granted auto approval policy can be disabled | The person taps Disable. `p2_post_consent_v3_auto_approve_auto_approval_id_disable` returns 202 with `message`, then the next request from that HIU shows `status` `REQUESTED` until the person acts |

### P2 15.1 to 15.6: link an ABHA number to the ABHA address

Mandatory.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 15.1 | `screen` | A self declared profile shows "Link ABHA Number" beside "Self Declared" on home | The home screen |
| P2 15.2 | `screen` | The 14 digit number is entered, and a malformed one is refused in the form | The entry screen and the refusal |
| P2 15.3 | `sandbox`, `human` | The number is verified by Aadhaar OTP and by mobile OTP | `p2_post_v3_phr_app_login_profile_request_otp` with `loginHint` `abha-number` and `scope` `["abha-login","mobile-verify"]` with `otpSystem` `abdm`, or `["abha-login","aadhaar-verify"]` with `otpSystem` `aadhaar`, returns 200 with `txnId`. `p2_post_v3_phr_app_login_profile_verify` then returns 200 with `authResult` `success`. A wrong mobile OTP returns 200 with `authResult` `failed` and `message` `Please enter a valid OTP. Entered OTP is either expired or incorrect.` Run both OTP systems |
| P2 15.4 | `screen`, `sandbox` | Resend is offered after 60 seconds for both OTPs | A second request OTP 200 at least 60 seconds after the first, and P2 15.3 then passes |
| P2 15.5 | `sandbox`, `screen` | The link succeeds, the message says so, and the profile takes the ABHA number's details | `p2_post_v3_phr_app_login_profile_link` with `action` `LINK` and the `transactionId` returns 200 with `message` `ABHA number is securely linked to ABHA address` and `authResult` `success`. Then `p2_get_v3_phr_app_login_profile` returns 200 with `abhaNumber` present. Screen check: the congratulations message, the number on profile and home, and "Self-Declared" gone |
| P2 15.6 | `screen` | "Go back to home screen" returns home | The home screen |

### P2 17.1 and 17.3: edit a KYC verified profile

Mandatory. The sheet has no 17.2.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 17.1 | `sandbox`, `human` | The mobile is updated after an OTP on the new number | `p2_post_v3_phr_app_login_profile_request_otp` with `scope` `["abha-address-profile","mobile-verify"]` and `loginHint` `mobile-number` returns 200 with `txnId`. `p2_post_v3_phr_app_login_profile_verify` returns 200 with `message` `Mobile Number linked successfully` and `authResult` `success`. A wrong OTP returns 200 with `authResult` `failed` and `message` `Entered OTP is incorrect. Kindly re-enter valid OTP.` |
| P2 17.3 | `sandbox` | Address line, district, state and pin code are updated | `p2_post_v3_phr_app_login_profile_updateprofile` returns 200 with `address`, `districtName`, `stateName` and `pinCode` equal to the values sent |

### P2 18.1 to 18.7: edit a self declared profile

Mandatory. The sheet has no 18.6.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 18.1 | `sandbox`, `screen` | The photo is updated from the camera or the gallery | `p2_post_v3_phr_app_login_profile_updateprofile` with `profilePhoto` returns 200. The response carries no photo field, so the screen check is the new photo on the profile |
| P2 18.2 | `sandbox` | First, middle and last name are updated | The same call returns 200 with `firstName`, `middleName` and `lastName` as sent |
| P2 18.3 | `sandbox` | Gender is updated | 200 with `gender` as sent |
| P2 18.4 | `sandbox` | Day, month and year of birth are updated | 200 with `dayOfBirth`, `monthOfBirth` and `yearOfBirth` as sent |
| P2 18.5 | `sandbox`, `human` | As P2 17.1 | As P2 17.1 |
| P2 18.7 | `sandbox` | As P2 17.3 | As P2 17.3 |

### P2 19.1 to 19.8: the deep link flow

Mandatory. The facility's notice and the SMS are not your app's calls.

Loop limit: 3 passes per test case.

| Case | Evidence | Check | Exit condition |
|---|---|---|---|
| P2 19.1 | `human` | The person is registered at a facility that holds a record but no ABHA address for them | A facility partner confirms it. Without one, `needs-human` |
| P2 19.2 | not-run | The facility notifies ABDM of the new record with the mobile and its HIP code | `not-run`: the notice is `m2_post_hip_v3_link_patient_links_sms_notify2`, an M2 call no P specification publishes |
| P2 19.3 | `human` | ABDM sends the SMS with the deep link | The SMS on the person's phone, read out or photographed |
| P2 19.4 | `screen`, `human` | The link opens the list of ABDM compliant PHR apps, yours among them | The list |
| P2 19.5 | `screen`, `human` | App not installed: choosing it opens the store to install it | A recording from the list to the installed app |
| P2 19.6 | `sandbox`, `human` | After install, a new person registers an address and password | As P2 5.2.10. The sheet also names registration by email, which the P1 specification does not publish |
| P2 19.7 | `sandbox`, `screen` | App installed: it launches into user initiated linking for that facility | The app opens on discovery, and `p2_post_user_initiated_linking_v3_patient_care_context_discover` returns 202 with `hip.id` equal to the HIP code in the link, followed by the on-discover callback as P2 1.5 |
| P2 19.8 | `sandbox`, `human` | Scanning the facility QR gets a token number, and the records link as in P2 1.1 to 1.11 | The person scans. As P2 5.1.3, with `acknowledgement.profile.tokenNumber` shown. Then P2 1.5 and P2 1.6 on that facility |

### P2 20.1: scan and share with no PHR app installed

Mandatory. `sandbox` and `human`.

Loop limit: 3 passes per test case.

#### P2 20.1, the token is shown after sharing

The person scans the facility QR with the phone camera, installs the app and logs in. Exit condition: `p2_post_patient_share_v3_share` returns 202 and the `p2_post_v3_hiu_patient_on_share` callback carries `acknowledgement.profile.tokenNumber`. Screen check: the consent statement before Share, the notification that the profile went to the hospital, and the token number after OK. `p2_get_patient_share_v3_profile_gettokendetails` then returns 200 with an entry holding that `tokenNumber` and the facility's `hipId`.

## When the last case is recorded

Write the manifest. It is the whole report. Case names to request ids, nothing else, so a reviewer checks it against the gateway's own record rather than reading screenshots. Secrets never appear in it: no tokens, no OTPs, no mobile or ABHA numbers, no client secret.

```json
{
  "skill": "abdm-p2",
  "set": "PHR mobile app test cases, NHA, PHR App Functionality tab",
  "run_started": "2026-10-01T10:12:40Z",
  "run_finished": "2026-10-01T11:48:03Z",
  "client_id": "<your sandbox client id>",
  "cases": [
    {"id": "P2 1.5", "outcome": "passed", "evidence": "sandbox",
     "request_ids": ["6f1c..."],
     "observed": ["discover 202", "on-discover patient[].careContexts 2 entries, none already linked"]},
    {"id": "P2 1.10", "outcome": "passed", "evidence": "screen",
     "attachment": "record-details-2026-10-01.png"},
    {"id": "P2 10.1", "outcome": "needs-human", "evidence": "human",
     "request_ids": ["b7a1..."], "reason": "approval is the person's tap; nobody present"},
    {"id": "P2 1.8", "outcome": "not-run", "reason": "health information request is M3; no P specification publishes it"}
  ]
}
```

Then say, in three lines: how many cases passed, failed, need a human and were not run; which mandatory cases are not `passed`; and the one case to fix first.
