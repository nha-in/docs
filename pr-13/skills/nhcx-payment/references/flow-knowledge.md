# Flow knowledge: the claim episode, its workflow ids, the two payer kinds, the use cases

Sources: the NHCX package, fetched by `scripts/fetch-package.sh` into `nhcx-package/` beside `nhcx-build/`. That means the overview chapters under `nhcx-package/docs/01-Overview`, the workflow sheet `nhcx-package/workflow.yaml`, the use-case catalogue `nhcx-package/usecases.yaml`, and the payer bundles under `nhcx-package/fhir/C3` to `nhcx-package/fhir/C11`. The published chapters live under `nhcx-package/docs/01-Overview`, `nhcx-package/docs/05-FHIR Reference` and `nhcx-package/docs/03-Building a Provider`. Everything else here was learnt live on the NHCX sandbox.

## 1. The episode

One hospital admission that an insurer pays for is one claim episode. Store it as one record with a claim number. Any number works if it is unique per hospital, short, sortable, and fits the payer's `CLN` identifier. The episode has these legs, each a separate exchange with its own correlation id:

| Order | Leg | You send | Payer answers | Thread |
| --- | --- | --- | --- | --- |
| 1 | Policy lookup | The participant service's `participant/get/policies`, through the transport; the recipient of every later leg is the policy's `processingid` | synchronous JSON | none, plain REST |
| 2 | Coverage eligibility | `v1/coverageeligibility/check`, purpose `discovery`, `validation` or `benefits` | `on_check` | new per check |
| 3 | Insurance plan (package master) | `v1/insuranceplan/request` | `on_request` | new; one plan per facility and policy |
| 4 | Auth requirements | `v1/coverageeligibility/check`, purpose `auth-requirements`, with items | `on_check` (the PMJAY sandbox rarely answers; `nhcx-package/fhir/C3/C3-response-pmjay.json` is an SHA ruling, `C3/C3-response-generic.json` a generic one) | new per procedure set |
| 5 | Pre-authorisation | `v1/preauth/submit` wf 12 | `on_submit` 20 first, then 21, 23 or 24 | new; the acknowledgement comes first on the same thread |
| 5a | Pre-auth query answer | `v1/preauth/submit` wf 19 (PMJAY) or `v1/communication/on_request` (generic) | 21 or 23 | new (PMJAY) or the request's (generic) |
| 5b | Enhancement | `v1/preauth/submit` wf 13, the whole pre-auth again with the added line | 20 then 22, 231 or 241 (the SHA sandbox has also answered with 21) | new |
| 5c | Enhancement query answer | `v1/preauth/submit` wf 131 | 22 or 231 | new |
| 5d | Cancel | `v1/task/submit` wf PC01 | `task/on_submit` PC02 | new |
| 5e | Predetermination | `v1/preauth/submit`, `Claim.use = predetermination`, wf 12 | `on_submit` | new |
| 6 | Claim | `v1/claim/submit` wf 15, `Claim.use = claim`, under the pre-auth's number | 25 then 26, 27 or 291 | new |
| 6a | Claim query answer | `v1/claim/submit` wf 161 (PMJAY) or `v1/communication/on_request` (generic) | 26 or 291 | new (PMJAY) or the request's (generic) |
| 6b | Reprocess or release | `v1/task/submit` wf 36 | `task/on_submit` 37, then a fresh verdict on the claim's thread | new |
| 7 | Payment notice | the payer sends `v1/paymentnotice/request` wf 30 (31, 33) | you answer `v1/paymentnotice/on_request` wf 17 (PMJAY) or the notice's own id (generic) | the notice's |
| any | Status enquiry | `v1/task/submit`, Task code `status` | `task/on_submit` (generic); PMJAY refuses it | new |
| any | Communication | the payer sends `v1/communication/request` | you answer `v1/communication/on_request` | the request's |

The payer's acknowledgement is `x-hcx-status: response.partial` and the decision is `response.complete`, on the same correlation id (`nhcx-package/docs/01-Overview/07-Payer Flexibility.md`, "Answer detail"). Read the acknowledgement as "the payer has it", never as a decision. Map `ClaimResponse.outcome` `queued`, or an adjudication reason `submitted`, to leg status `submitting` (`verdict_status`).

## 2. Every workflow id

The hospital's table. PMJAY and a generic payer differ in three rows: `claim_query_response`, `claim_resubmit` and `payment_ack`.

| Kind | PMJAY | Generic | Path | Note |
| --- | --- | --- | --- | --- |
| `preauth` | `12` | `12` | `v1/preauth/submit` | A new pre-auth. Also a fresh request after a rejection: PMJAY refuses 121 there with PAYR-1214. |
| `preauth_resubmit` | `121` | `121` | `v1/preauth/submit` | Kept in the table. `preauth_send_kind` never picks it after a rejection. |
| `preauth_query_response` | `19` | `19` | `v1/preauth/submit` | The answer to a 24. A generic payer asks by communication instead, so this is a PMJAY leg. |
| `enhancement` | `13` | `13` | `v1/preauth/submit` | The whole pre-auth again under the parent's number, plus the added line. |
| `enhancement_resubmit` | `131` | `131` | `v1/preauth/submit` | The answer to a 241. |
| `cancel` | `PC01` | `PC01` | `v1/task/submit` | Task code `cancel`. The handbook's section 8.6 says 122 (`nhcx-package/docs/01-Overview/06-Workflow Codes.md`, "Reconciled Discrepancies and Authority Rules", takes PC01). If a payer insists on 122, override it per payer in configuration. |
| `claim` | `15` | `15` | `v1/claim/submit` | The final bill. |
| `claim_query_response` | `161` | `151` | `v1/claim/submit` | PMJAY refuses 151, 19 and 16 with PAYR-1321; 161 is taken. |
| `claim_resubmit` | none | `16` | `v1/claim/submit` | PMJAY has no claim resubmit. A decided claim goes back only as a reprocess. |
| `payment_ack` | `17` | none (echo the notice's own id) | `v1/paymentnotice/on_request` | `None` in the table means "echo". |
| `reprocess` | `36` | `36` | `v1/task/submit` | Task code `reprocess`; acknowledged on 37. |
| `release` | `36` | `36` | `v1/task/submit` | Task code `release`, reason `partialpayment`, an `amount` input. |
| status enquiry | the leg's correlation id, fallback `13` | same | `v1/task/submit` | The fallback id is `13`. The NHCX sandbox refuses `v1/status` with NHCX-1012. |
| coverage, plan, auth requirements | your case number | your case number | see section 1 | The sheet lists no code. Send the episode's case number. |

The payer's ids you must branch on (`nhcx-package/workflow.yaml`, `nhcx-package/docs/01-Overview/06-Workflow Codes.md`), with what the sandbox actually sent:

| Id | Meaning | Status word |
| --- | --- | --- |
| `20` | Pre-auth or enhancement received | `response.partial` |
| `21` | Pre-auth approved | `response.complete` |
| `22` | Enhancement approved. A generic payer sends 22. The SHA sandbox has answered an enhancement with 21, and `nhcx-package/fhir/C5/C5-enhancement-approved-wf22-pmjay.json` is an SHA answer on 22. Accept both. | `response.complete` |
| `23` | Pre-auth rejected | `response.complete` |
| `231` | Enhancement denied | `response.complete` |
| `24` | Pre-auth queried | the sheet says `request.initiated`; the SHA sent `response.complete` |
| `241` | Enhancement queried | as 24 |
| `25` | Claim received | `response.partial` |
| `26` | Claim approved | `response.complete` |
| `27` | Claim queried | as 24 |
| `28`, `29` | Claim in process, forwarded | `response.partial` |
| `291` | Claim rejected | `response.complete` |
| `251`, `252`, `253`, `254` | Reprocess received, approved, rejected, queried | listed; both live payers answer a 36 with 37 instead |
| `37` | Arbitration acknowledged (the reprocess taken) | `response.complete` (the SHA sent `response.partial`) |
| `PC02` | Cancellation done | `response.complete` |
| `30`, `31`, `33` | Payment initiated, processed, settled with UTR | `request.initiated`, new thread |
| `5` | The SHA's coverage eligibility and plan answers | `response.complete` (`nhcx-package/fhir/index.yaml` gives 5 for `C3/C3-response-pmjay.json` and `C4/C4-response-pmjay.json`) |
| `N02` | Notification to a provider (a PMJAY CommunicationRequest) | `request.initiated` |

Other codes exist (10, 11, 14, 141, 18, 45 to 47, 181, 491, 34, 35, 38, 39, G11 to G13, RP1 to RP3, DC01, DC02, N01, N03, N04, the R-series). A hospital build sends none of them. See `nhcx-package/docs/01-Overview/06-Workflow Codes.md` for the full sheet and the seven codes the handbook and the sheet publish differently.

## 3. Two kinds of payer

Read `nhcx-package/docs/01-Overview/07-Payer Flexibility.md` in full. A generic payer is any payer on the exchange, IRDAI-regulated insurers and TPAs included (`nhcx-package/fhir/README.md`). The rule, as coded:

| | PMJAY (`query_mode: resubmit`) | Generic (`query_mode: communication`) |
| --- | --- | --- |
| The query arrives as | a `ClaimResponse` on the case's own thread, `outcome: partial`, item status `Queried`, wf 24, 241 or 27 | a `CommunicationRequest` TaskBundle on `v1/communication/request`, on a new thread, wf 24, 241 or 27 |
| The answer | the whole bundle again on `v1/preauth/submit` or `v1/claim/submit`, wf 19, 131 or 161, a new correlation id, the reply text on the `NMI`/`CQD` supportingInfo entry | a Communication TaskBundle on `v1/communication/on_request`, the request's correlation id and workflow id echoed |
| A `CommunicationRequest` from this payer | always a notification: acknowledge and leave the case alone | classified (below) |

Where the payer's case number arrives. The package files are under `nhcx-package/fhir/`; the rule is in `07-Payer Flexibility.md`, "When the case number arrives".

| Answer | PMJAY | Generic |
| --- | --- | --- |
| 20 on a fresh pre-auth | The package says none, and `C5/C5-received-wf20-pmjay.json` carries none. A live SHA 20 has also carried the path form, `PMJAY/HP/S/2024/R2/<case number>`. Handle both. | present (`C5/C5-received-wf20.json`) |
| 20 on an enhancement | none; keep the parent's | present |
| 21, 23, 24 | the bare number (`C5/C5-approved-wf21-pmjay.json`, `C5/C5-rejected-wf23-pmjay.json`, `C5/C5-queried-wf24.json`) | present (`C5/C5-approved-wf21.json`, `C5/C5-rejected-wf23.json`) |
| 25 | the path form (`C7/C7-received-wf25-pmjay.json`) | present (`C7/C7-received-wf25.json`) |
| 26, 27, 291, PC02, 37 | none | none |

So the brief's rule holds with care. A generic payer's `response.partial` acknowledgement carries the payer's case number. PMJAY's 25 carries it; its 20 may not. Read `ClaimResponse.preAuthRef` on every answer. Keep a value and never overwrite it with an empty one (`apply_preauth`). The bare number is what the payer service desk wants; the path form ends in it.

`query_mode` lives on the payer adapter. Choose the adapter by the payer's participant code through configuration: `1518@hcx` is PMJAY, and an unmapped code is generic.

### The classification rule

`classify_communication(adapter, reason, intent)` applies these, in order:

1. If the payer's `query_mode` is `resubmit`: notification.
2. Else if `Task.intent` is `proposal`: notification. If `order`: query.
3. Else look at `Task.reasonCode`: absent, `additionalinfo`, `questionnaire` or `query` is a query; anything else (`tatquery`, `grievance`, `walletupdate`, `policychange`, `claimarbitration`) is a notification. Fold `claimArbitartion` into `claimarbitration`.
4. A bare `Communication` with no `CommunicationRequest` is a note: recorded, shown, never acted on.

Acknowledge a notification at once. Send the payer's own bundle back with `Task.status` flipped to `completed`, the reason echoed and the provider Organization first. File a query open for the desk, and answer it later with the TaskBundle reply (see `fhir-knowledge.md`). The reply names the request in `Communication.basedOn`, never `inResponseTo`.

The live shapes. A generic payer's query (`nhcx-package/fhir/C6/C6-preauth-query-wf24.json`) carries a Task `poll`, `requested`, `intent order`, reason `additionalinfo`, and a CommunicationRequest with one `contentString` per ask and `basedOn` the Claim. PMJAY's notification (`nhcx-package/fhir/C6/C6-notification-wfN02.json`) carries a Task `poll`, `completed`, `intent proposal`, reason `information` under the HL7 communication-category system.

## 4. Stage, sub-stage, next actions

Stamp two words onto the episode after every leg write (`stamp_case`), and compute a next-action list from them. Copy the vocabulary; it is what a desk needs to see.

Stages: `eligibility`, `preauth`, `enhancement`, `claim`, `payment`.

Sub-stages: `draft`, `checking`, `eligible`, `not-eligible`, `requested`, `resubmitted`, `answered`, `queried`, `approved`, `partial`, `rejected`, `cancelling`, `cancelled`, `refused`, `noticed`, `paid`.

How a send kind maps to a sub-stage: `preauth`, `claim`, `enhancement` set `requested`; `*_resubmit` sets `resubmitted`; `*_query_response` and `enhancement_resubmit` set `answered`. `requested`, `answered` and `resubmitted` mean "with the payer".

Derivation (`case_stage`): a payment notice wins, then the filed claim, then the pre-auth (stage `enhancement` if the last submission kind was an enhancement), then a saved draft, then the eligibility status. An open communication query on a leg that is with the payer flips the sub-stage to `queried`, because a generic payer's query never touches the leg row.

Next actions (`next_actions`) are `{label, tab, tone}`; the first is what the case waits for. Rules worth copying:

- An unanswered query always leads with "Answer the payer (n)".
- The leg's own reply box is offered only for a `resubmit` payer. A `communication` payer's desk is sent to the communication tab.
- A claim refused at the door offers "send again" while `claim_send_kind` still yields a kind, else "Ask for a reprocess".
- After a rejection the pre-auth offers a fresh 12, not 121.

## 5. Rules the exchange enforces that no document states

Each was found live on the sandbox.

- Acknowledge or lose the thread. NHCX redelivers an unanswered submission, then drops it and retires the correlation id; a verdict sent later is refused with NHCX-1010. Both live payers answer twice on one correlation: `outcome: queued` first, the decision after. Your reader must not close a thread on the first reply.
- One message is taken once. The SHA redelivers the same `api_call_id` two or three times, about a minute apart, and a transport can fan one delivery out to several receivers (nhcx-adapter's `callback.also`). Dedupe on `x-hcx-api_call_id`.
- One live pre-auth per beneficiary per hospital (PAYR-1238). Clear it with PC01 or a rejection (`nhcx-package/docs/03-Building a Provider/11-PMJAY Sandbox Run.md`, "PAYR-1238 An active preauthorisation exists"). Sweep live pre-auths before a test run.
- One request at a time per case (PAYR-1322, "Active instance found"). Wait about 30 seconds after a decision before the next leg. When a refusal says "Active instance", wait and resend, up to three times.
- One plan per facility and policy. Key it on policy code, provider id and payer. Copy the held master onto a new episode instead of asking again (`reuse_plan`). A PMJAY master runs to tens of megabytes; one fetched live was 56 MB.
- Never drop a document. A file nobody asked for by name goes under `ODN`, "other document". A file attached against a requirement carries that requirement's code (`attach_required_document`). Take the code list from the plan, not from a constant.
- Ask the auth-requirements check, never await it (`ensure_auth_requirements`). Fingerprint the quoted set (`procedure_set`) so an unchanged set is not asked twice. Send the quantity as a whole number.
- Tiers are modifiers, not lines. A ward or ICU tier rides on `Claim.item.modifier` under its procedure, and that item's `net` carries both.
- The claim goes under the pre-auth's number (ERR-PYR-CLM-007), and PMJAY bills the package alone at the whole amount (`11-PMJAY Sandbox Run.md`, "ERR-PYR-CLM-007" and "What the package master decides").
- Answers to a PMJAY query go on a new correlation id (`07-Payer Flexibility.md`, "On the claim thread"). A same-thread answer is swallowed: no acknowledgement, no refusal, and the desk dies on the old id.
- Cancel retires the number. Give the episode a fresh claim number after an accepted PC01, and keep the withdrawn one on the leg.
- A send refused at the door keeps the case on the thread the payer last answered. An enhancement refused at the door leaves the pre-auth approved.

## 6. The use-case catalogue

Codes and titles are quoted from `nhcx-package/usecases.yaml`, rendered as `nhcx-package/docs/01-Overview/05-NHCX Use Cases.md`. "Proves" is what a test run must show for each one. "Package file" is the provider bundle the package holds for it, under `nhcx-package/fhir/`.

### A: shared

| Code | Title | What it proves |
| --- | --- | --- |
| A1 | Get participant list | You can find the payer's code in the registry (the participant service's `fetch/participants/list`). |
| A2 | Get policy | You can find a beneficiary's policy and the processor code that becomes `x-hcx-recipient_code` (the participant service's `participant/get/policies`). |
| A3 | Get public key | The transport fetches the recipient's certificate (`fetch/certs`) and caches it. |
| A4 | Get auth token | The transport holds an ABDM session token (the gateway's sessions call) and refreshes it. |
| A5 | Get status | A status Task on `v1/task/submit` gets a Task back (generic), or a PAYR-1018 then PAYR-1008 refusal (PMJAY). The package holds no bundle for A5 (`nhcx-package/fhir/README.md`). |
| A6 | Receive errors | Your callback accepts a `ProtocolResponse` on any path and answers 2xx. |

### B: hospital on the generic network

| Code | Title | Workflow | Proves | Package file |
| --- | --- | --- | --- | --- |
| B1 | Check coverage eligibility | none | The check goes out; `inforce` and the wallet come back. | `B1/B1-check.json` |
| B2 | Request insurance plan | none | The package master lands and is stored once per policy. | `B2/B2-request.json` |
| B3 | Submit pre-authorisation | 12, 13 | Sent, acknowledged on 20, decided on 21 or 23; an enhancement on 13 decided on 22. | `B3/B3-request.json`, `B3/B3-enhancement.json` |
| B4 | Respond to a communication | 24, 27 echoed | A CommunicationRequest is classified and the TaskBundle reply goes on the request's thread. | `B4/B4-preauth-query-answer.json`, `B4/B4-claim-query-answer.json` |
| B5 | Submit claim | 15 | The claim under the pre-auth's number, acknowledged 25, decided 26 or 291. | `B5/B5-request.json` |
| B6 | Search claims | none | Not built by these skills. | `B6/claim-search.json` (example) |
| B7 | Acknowledge payment notice | 30 echoed | The notice is filed by claim number, deduped by correlation id, acknowledged on `on_request`. | `B7/B7-acknowledgement.json` |
| B8 | Reprocess or cancel | 36, PC01 | A decided claim is reopened (37 then a new verdict); a live pre-auth is withdrawn (PC02). | `B8/B8-reprocess.json`, `B8/B8-cancel.json` |
| B9 | Submit predetermination | 12 | A quote comes back as a ClaimResponse; nothing else changes. | `B9/predetermination-request.json` (example); the answer is `C11/predetermination-response.json` |

### C: payer answering (for reference; you build the reader, not the sender)

C3 coverage answer, C4 plan answer, C5 pre-auth answers (20, 21, 22, 23, 24, 231, 241), C6 communication (24, 241, 27, N02), C7 claim answers (25, 26, 27, 28, 29, 291), C9 payment notice (30, 31, 33), C10 Task answers (PC02, 37, 251 to 254), C11 predetermination. Reader inputs: `nhcx-package/fhir/C3` to `nhcx-package/fhir/C11`. The files ending `-pmjay` are the SHA's own; the rest are the generic payer's. `nhcx-package/fhir/index.yaml` gives each file's scheme, workflow id and origin. The PMJAY captures have the beneficiary's identifiers replaced.

### D: hospital on PMJAY

| Code | Title | Workflow | Proves | Package file |
| --- | --- | --- | --- | --- |
| D1 | Fetch the insurance plan | none | The scheme's master, both `coverage[]` and `specificCost[]`, nested document requirements, questionnaires. | `D1/D1-request.json` |
| D2 | Authenticate the beneficiary | not NHCX | Biometric token or the consent questionnaire fallback. | none |
| D3 | Check coverage eligibility | none | The wallet answer on wf 5. | `D3/D3-check.json` |
| D4 | Submit pre-authorisation | 12 | Element ids, HPIN, consent QuestionnaireResponse, documents from the master; acknowledged 20, decided 21 or 23 with `preAuthRef`. | `D4/D4-request.json` |
| D5 | Resubmit pre-authorisation | 121 | Not reachable on the sandbox after a rejection (PAYR-1214); send a fresh 12. | none |
| D6 | Raise an enhancement | 13, 131 | A second package (medical, not conservative: PAYR-1245) under the parent's number; a 241 answered on 131. | `D6/D6-enhancement.json`, `D6/D6-enhancement-query-answer.json` |
| D7 | Answer a pre-authorisation query | 19 | The 24 answered as a fresh submit with `CQD` reply text, new correlation id, then 21. | `D7/D7-query-answer.json` |
| D8 | Cancel pre-authorisation | PC01 | Task `cancel` with `claimNumber` and `intimationNumber`; PC02 back. | `D8/D8-cancel.json` |
| D9 | Submit claim | 15 | Under the pre-auth's number, the package alone, discharge scalars, Discharge Consent answered, PDF documents; 25 then 26. | `D9/D9-request.json` |
| D10 | Answer a claim query | 161 | The 27 answered on 161 with a written reply; the sandbox approves at zero. | `D10/D10-query-answer.json` |
| D11 | Reprocess a rejected claim | 36 | Task `reprocess`, reason `claimrejected`, second input spelled `intimationNumber` on every Task (a reprocess under any other spelling is refused PAYR-1008). The SHA answers 37, "Arbitration claim submission process completed successfully", and reopens the case; a generic payer answers 37 too. | `D11/D11-reprocess.json` |
| D12 | Claim a shortfall | 36 | Task `reprocess` with `partialpayment` after a settled payment. Out of reach on the sandbox: its finance side issues the notice on its own schedule, and the combination is refused before notice 33 is acknowledged (`11-PMJAY Sandbox Run.md`, "What the sandbox will not take"). | none |
| D13 | Acknowledge the payment notice | 17 | Notice 30 filed and acknowledged on `on_request` with 17. | `D13/D13-acknowledgement.json` |

Discharge variants the D9 claim must cover, each proven on the sandbox: normal after surgery; LAMA and DAMA before, during and after surgery; death before, during and after surgery. Before or during surgery, LAMA and DAMA collapse the claim to one `LM100` line; a death carries `ONS`/`DTM`. `nhcx-package/docs/03-Building a Provider/08-PMJAY Provider.md` states the LAMA and DAMA rule.

## 7. What each payer sends back, in order

A pre-authorisation on the SHA sandbox: 20 (`queued`, `response.partial`, `ClaimResponse.type` present only here, as in `nhcx-package/fhir/C5/C5-received-wf20-pmjay.json`), then 24 (query) or 21 or 23. A claim: 25, then 27 or 26 or 291. A cancel: PC02 as a Task `completed`, code `approve`, `output[0]` an `include` reference to a ClaimResponse whose adjudication reason is `cancelled` (`C10/C10-cancelled-wfPC02-pmjay.json`). A reprocess: 37 as a Task `accepted` with a `queued` ClaimResponse (`C10/C10-arbitration-wf37-pmjay.json`), then 26 or 291 on the claim's thread. A payment: 30 on a new thread with a Task `deliver`, a `PaymentNotice` and a `PaymentReconciliation` (`C9/payment-notice.json`).

A generic payer sends the same ids with the generic differences: 22 for an enhancement, `preAuthRef` on every acknowledgement and every pre-auth decision, queries as CommunicationRequests, `response.complete` on 37. Its files are the ones without `-pmjay` under `nhcx-package/fhir/C5`, `C6`, `C7`, `C9` and `C10`.
