# The flow: the one path a claim episode walks

This is the reference flow for an NHCX provider desk: these steps, in this order, with these guards and these words. A build from this skill walks the same path. It does not redesign it, reorder it, merge steps, or invent screens the path does not have. Stage 4 copies it, stage 5 puts screens on it, stage 7 implements it step by step, stage 8 checks every step exists, and test drivers check the same through `flow.json`.

## The shape

One episode is one case (`claim` row). It has one list screen, one "new case" screen and one case screen. The case screen has tabs in the order the episode happens, and above the tabs one status line and the actions the case is waiting for. Everything else (inbox, payments across cases) is a view over the same rows.

Tabs on the case screen, in this order and with these names:

| # | Tab key | Tab label | Opens when |
| --- | --- | --- | --- |
| 1 | `eligibility` | Eligibility | always |
| 2 | `plan` | Insurance plan | always (empty until the plan is fetched) |
| 3 | `lines` | Line items | always (quoting refused until the plan is `ready`) |
| 4 | `validate` | Validate | always (the ruling on the quoted set) |
| 5 | `preauth` | Pre-authorisation | once the coverage verdict is `eligible` |
| 6 | `communication` | Communication | always (the payer's questions on both legs) |
| 7 | `claim` | Claim | always; its submit opens once a pre-auth is approved or partial |
| 8 | `payments` | Payments | always |

The episode may also render on one page, with the same sections in the same order. Either shape is fine; the order and the gating are not negotiable.

## Which skill builds which step

Seven skills build this flow, one slice each (`core/LADDER.md`). `flow.json` names them per step in `skills`, the first named being the one that owns the step.

| Steps | Skill |
| --- | --- |
| F1, F2, F3 | `nhcx-coverage` |
| F4, F7 | `nhcx-insurance` |
| F5, F6, F8, F9, F9a, F9c, F9d, F9e; F9b for a `resubmit` payer (19, 131) | `nhcx-preauth` |
| F10, F11; the claim query answer for a `resubmit` payer (161) | `nhcx-claim` |
| F9b and the claim query for a `communication` payer; F12b | `nhcx-communication` |
| F12 | `nhcx-payment` |
| F13 | `nhcx-reprocess` |

The case screen, its tabs, the status line and actions, and the page-load polls are the foundation's (`core/FOUNDATION.md`): the first skill lays them out whole, and each skill fills its own tabs.

## The status line and the actions

Above the tabs: `stage / sub-stage` from `case_stage` (module 7.11) and the list from `next_actions`, first item highlighted. The labels are these, verbatim:

| Stage | Sub-stage | Action offered (label, tab) |
| --- | --- | --- |
| any | an open query exists | "Answer the payer (n)", `communication` (leads every list) |
| `eligibility` | `draft`, `error`, `not-eligible` | "Check the cover", `eligibility` |
| `eligibility` | `eligible`, no plan `ready` | "Fetch the package master", `plan` |
| `eligibility` | plan ready, no lines | "Quote the treatment", `lines` |
| `eligibility` | lines quoted | "Send the pre-authorisation", `preauth` |
| `preauth` or `enhancement` | `queried` | "Answer the query", `preauth` (resubmit payer) or "Answer the payer's query", `communication` (communication payer) |
| `preauth` | `draft`, `refused` | "Send the pre-authorisation", `preauth` |
| `preauth` | `rejected` | "Send a fresh pre-authorisation", `preauth` |
| `preauth` | `approved`, `partial`, lines added since | "Send the enhancement (n added)", `preauth` |
| `preauth` | `approved`, `partial`, not discharged | "Record the discharge", `claim` |
| `preauth` | `approved`, `partial`, discharged | "File the claim", `claim` |
| `preauth` | `requested`, `answered`, `resubmitted` | "With the payer; ask where it stands", `preauth` |
| `claim` | `queried` | "Answer the claim query", `claim` or "Answer the payer's query", `communication` |
| `claim` | `rejected`, `partial` | "Ask for a reprocess", `claim` |
| `claim` | `requested`, `answered`, `resubmitted` | "With the payer; ask where it stands", `claim` |
| `claim` | `refused` | "Send the claim again", `claim` (while a send kind remains) else "Ask for a reprocess" |
| `claim` | `approved` | "Await the payment notice", `payments` |
| `payment` | a notice unacknowledged | "Acknowledge the payment notice", `payments` |
| `payment` | all acknowledged | "Settled", `payments` |

## The steps

Each step: where it happens, what must hold, what the user does, what the system does (module in brackets), what goes on the wire, what is stored, where the case stands afterwards, and what the screen shows next. Ids are `F1` to `F13` with letters for branches; `flow.json` carries the same ids.

### F1. Policy search

- Screen: Cases list, "New case", `GET /claims/new`.
- Holds: nothing.
- User: picks an identifier type (`MemberId`, `AbhaNumber`, `MobileNo`) and a value, presses "Search policies".
- System [7.4]: `search_policies` through the transport: the participant service's `participant/get/policies`; normalises each row (`member_id`, `policy_code` from `productid`, `payer_code` from `payerid`, `recipient_code` from `processingid`, `product_name`). NHCX-1016 (nothing linked) is an empty list, not an error.
- Screen: a table, one row per policy: beneficiary, product and policy, payer, ABHA, mobile, a "Select" button. No name and no photo yet; the payer returns those at F3.

### F2. Open the case

- Screen: the same, "Select" on a row; `POST /claims`.
- System [7.4, 7.2]: `create_claim` snapshots the policy (`member_id`, `policy_code`, `payer_code`, `recipient_code`, `policy_json`), mints the claim number, stamps `eligibility / draft`.
- Redirect: the case screen, Eligibility tab, "Claim <number> opened."
- Next action: "Check the cover".

### F3. Check the cover (coverage eligibility)

- Screen: Eligibility tab, card "Coverage eligibility check": purpose select (`validation` default, `benefits`, `discovery`), policy code and member id shown from the snapshot, "Send to payer".
- Holds: member id; policy code for `validation` and `benefits`.
- System [7.4]: `run_check(purpose)`, workflow id = the claim number, status `checking`; the page shows "Awaiting payer" and refreshes; the answer arrives by callback [7.3] or poll.
- Wire: `v1/coverageeligibility/check`; `on_check` back.
- Stored: `txn_id`, `correlation_id`, `api_call_id`; on the answer `inforce`, `outcome`, `disposition`, allowed and used amounts, the payer's `Patient` (name, gender, DOB, address, ABHA, photo), `Coverage` class and period.
- After: `eligibility / eligible` or `not-eligible` (or `error` with the payer's words). A `ProtocolResponse` or a 404 on `txn/related` settles as `error`, never spins.
- Screen: card "Payer verdict": Sum insured, Utilised, Wallet balance (allowed less used), Disposition verbatim, In force, Pre-authorisation required, Checked at, Correlation. Beneficiary card fills with the payer's demographics. "Check again" allowed from any settled state.
- Next action: "Fetch the package master".

### F4. Fetch the package master (insurance plan)

- Screen: Insurance plan tab, "Fetch the plan" (or "Refresh").
- Holds: `eligible`.
- System [7.5]: `reuse_plan` first (same policy, provider, payer, status `ready`: zero sends); else `request_plan`, status `fetching`, workflow id = the claim number.
- Wire: `v1/insuranceplan/request`; `on_request` back with the InsurancePlan and Questionnaires.
- Stored: `claim_plan` (`ready`, `empty` or `error`), `claim_plan_benefit` per package, `claim_plan_form` per url. Both published shapes merged on package code.
- Screen: a search over the master (name or code, specialty filter, procedure or implant), one row per package with rate, kind, "View"; a package view with rate, implants approved, tiers, conditions, documents wanted, the forms those point at as questions; an "All forms" page. Policy-wide requirements shown above the table.
- Next action: "Quote the treatment".

### F5. Link the admission (integrate) or capture it (standalone)

- Screen: Pre-authorisation tab, card "Link the admission" (opens once `eligible`).
- Holds: `eligible`.
- Integrate: list every current inpatient stay of the patient whose ABHA matches the payer's (digits only); "Link" stores `patient_id` and `encounter_id`, defaults the admission date from the encounter. Linking before `eligible` and to a stay that is not a current IPD admission is refused. "Unlink" keeps the draft.
- Standalone [7.13]: register the patient (from the payer's demographics) and admit them here; the same two keys are stored.
- Screen after: card "Linked admission" with ward, bed, admitted at, consultant.

### F6. The dossier (pre-auth capture)

- Screen: Pre-authorisation tab, once linked: the form, saved in one transaction by `save_preauth` [7.7 inputs].
- Captured: admission date (required) and provisional discharge date (not before admission); ICD-10 diagnoses (at least one; read off the admission when it recorded them, else a picker); the treating doctor (the admission's consultant, else a picker; must have an HPIN); package case or non-package case toggle; documents (pdf, jpg, jpeg, png, each recorded against the payer requirement code it answers, else `ODN`).
- Estimated amount: always recomputed server-side from the lines (F7), never from the form.
- Guards: saving a package case with no line quoted is refused.

### F7. Quote the treatment (lines from the plan)

- Screen: Line items tab, "Choose line items", `GET /claims/<id>/lines`. Three parts: what is quoted (editable quantities, running total, "remove"); what the payer says goes with it (implants approved for the quoted procedures, the tiers each offers; anything already quoted drops out); the whole master to search.
- Holds: plan `ready`. Quoting anything before that is refused.
- System [7.5]: `add_line(kind, code, parent_code)`; price read from the plan at add time; `amount = rate x quantity` server-side; a tier is added through the procedure that offers it and carries `parent_code`. Refused: a code the plan lacks, a tier the procedure does not offer, a duplicate, a zero quantity.
- Forms: the chosen lines pull in the questionnaires the plan attaches (STG per package, policy forms always); they render on the Pre-authorisation tab and are answered there (`save_answers`, one row per question, file answers upload a document).
- Next action: "Send the pre-authorisation".

### F8. Validate the set (auth requirements)

- Screen: Validate tab, "Ask the payer" (also run silently before F9).
- Holds: at least one line.
- System [7.6]: `ensure_auth_requirements`: fingerprint the quoted set; send only when the fingerprint is new; never wait for the answer.
- Wire: `v1/coverageeligibility/check` with purpose `auth-requirements` and the items; `on_check` back (the PMJAY sandbox rarely answers).
- Stored: `claim_auth` (`checking` then `ready`), items authorised or excluded, requirements (document or form, code, url, stage `pre` or `post`, `at_preauth`).
- Screen: the ruling per line, the documents and forms it wants for each leg; the pre-auth and claim tabs read it to build their document and form cards. Without a ruling they fall back to the plan's list.

### F9. Send the pre-authorisation

- Screen: Pre-authorisation tab, card "Submit": what will be sent (lines, forms answered, documents attached, the total), "Send to payer".
- Holds (all before any HTTP call): `eligible`; an admission linked; an admission date; at least one diagnosis; at least one care team member with an HPIN; at least one line; every required form answered; every document the ruling or plan asks for at pre-auth attached.
- System [7.7]: `submit_preauth`: `preauth_send_kind` picks `preauth` (12); builds the Claim bundle (`preauth`, `request`); status `submitting`, `submission_kind`, `workflow_id`; stores the three ids; `thread_correlation_id` untouched until the payer answers.
- Wire: `v1/preauth/submit`, workflow 12.
- After: `preauth / requested`.
- Screen: "Awaiting payer", the timeline row for the send, Refresh. Next action: "With the payer; ask where it stands".

#### F9a. The payer answers

- Callback [7.3] or poll: first the acknowledgement (workflow 20, `outcome queued`, reason `submitted`): recorded, `preauth_ref` kept, the leg stays `submitting`. Then the decision on the same correlation id: `verdict_status` [7.8].
- After: `approved` (21), `partial` (approved for less), `queried` (24), `rejected` (23). Never read `outcome` alone.
- Screen: Decision, Payer reference (`preAuthRef`), Approved amount (`total[benefit]`), Eligible amount, the item verdicts table (eligible, status, reason verbatim, eligible %, quantity), process notes verbatim. A door refusal shows as a flag with the payer's code and text, the thread restored.
- Next action per the table above.

#### F9b. Answer a query

- Resubmit payer (PMJAY): the query is inside the ClaimResponse (`query_note`). Screen: Pre-authorisation tab, the payer's words, a reply box, "Submit again". System: `submit_preauth(reply)` with kind `preauth_query_response` (19; 131 after an enhancement query), flow `queryupdate`, `NMI/CQD` = the reply, a new correlation id. After: `answered`, then the decision.
- Communication payer (generic): the query is a CommunicationRequest on a new thread, filed in `claim_query` (F12 inbox). Screen: Communication tab, the questions verbatim, a reply box, documents to attach (existing or new, each under the payer's code else `ODN`), "Send the reply". System [7.10]: `answer_query`: the TaskBundle reply on `v1/communication/on_request` with the request's correlation id and workflow id. The leg stays `queried` until the decision arrives on its own thread. An empty reply is refused before any HTTP call.

#### F9c. Enhancement

- Screen: Line items tab, add a line after a decision; the Pre-authorisation card shows "enhancement pending (n added)"; "Submit enhancement".
- Holds: `approved` or `partial`; no request in flight.
- System: `submit_preauth` with kind `enhancement` (13; `enhancement_resubmit` 131 on a query): the whole bundle again, every line old and new, same claim number, factors 1 and 0.5. After: `enhancement / requested`, then 22 (or 21 from the SHA), 231, 241.

#### F9d. Cancel

- Screen: Pre-authorisation tab, "Withdraw": a reason picker (the seven documented reasons) and a note, required for Other. Hidden once a claim has been raised; refused on a `rejected` pre-auth and twice.
- System [7.9]: `cancel_preauth`: Task `cancel`, workflow PC01, on its own thread (`cancel_correlation_id`), `cancelling`.
- After PC02: `cancelled`; the episode gets a fresh claim number, the withdrawn one stays on the leg.

#### F9e. Predetermination (a quote)

- Screen: Pre-authorisation tab, "Ask for a quote".
- System [7.7]: the very bundle F9 would send with `use predetermination`, on `v1/preauth/submit`, workflow 12, its own row (`asking` then `answered`). Nothing on the pre-auth changes.

### F10. Record the discharge

- Screen: Claim tab, card "Discharge": mode (Normal, LAMA, DAMA, Death), stage (Before, During, After surgery), discharge date and time, surgery date and time, death date and time (death only).
- Holds: a pre-auth `approved` or `partial`.
- Stored: on `claim_submission` (`draft`) or the encounter.
- Screen after: the claim card opens; for LAMA or DAMA before or during surgery it says the approved packages are voided and the claim will carry `LM100` only.
- Next action: "File the claim".

### F11. File the claim

- Screen: Claim tab, cards "Documents for the claim" (what the ruling deferred to this stage, plus the discharge summary, always), "Forms for the claim" (the consent again, and what the ruling deferred), "Everything attached for the claim" (any further pdf or image), "Submit the claim".
- Holds: discharge recorded; the discharge summary attached; every claim-stage form answered; amount not above the approved amount.
- System [7.7]: `submit_claim`: `claim_send_kind` (`claim` 15; `claim_query_response` 161 PMJAY or 151 generic; `claim_resubmit` 16 generic only); the Claim bundle (`claim`, `request`) under the pre-auth's claim number with `preAuthRef`, procedures `completed`, discharge scalars, `HDS`, `DIS`; `LM100` collapse when it applies.
- Wire: `v1/claim/submit`.
- After: `claim / requested`; then 25 (ack), 26 `approved`, 27 `queried`, 291 `rejected`, read as F9a.
- Screen: as the pre-auth card: decision, amounts, item verdicts with `deductible`, notes verbatim.

#### F11, continued: claim query and reprocess

- Query: as F9b, on the claim (161 or the Communication reply).
- Rejected or partial: "Ask for a reprocess" (F13). There is no claim resubmit on PMJAY.

### F12. Payments

- The payer starts it: `v1/paymentnotice/request` arrives on a new thread, matched by the claim number inside (a `CLN` identifier, then any untyped identifier on the notice, the reconciliation, the Task; never the bundle id), looked up against `claim_no` and every leg's `claim_ref`.
- System [7.10]: `record_payment`: one `claim_payment` row per notice, deduped on the notice's correlation id; details from the PaymentReconciliation; a payer that reuses the notice id updates the row. Then, at once and automatically, `acknowledge_payment`: Task `status` `completed`, output `paymentack`, to the notice's own sender, its correlation id echoed, workflow 17 (PMJAY) or the notice's own (generic). A failed acknowledgement is kept on the row; the notice is still recorded and the callback still answered 2xx.
- After: `payment / noticed` or `paid`. Paid is counted once per UTR, newest notice winning; an initiated notice without a UTR shows "Initiated, UTR awaited" and is not money received.
- Screen: Payments tab, one card per notice: status, amount, UTR as text, the breakdown, "Acknowledged at" or "Send the acknowledgement again". Across cases: the payments view.
- Next action: "Acknowledge the payment notice" while one is pending, else "Settled".

### F12b. The inbox

- Every CommunicationRequest is classified [7.10]: query, notification or note. Notifications are acknowledged at once (the payer's bundle back, Task `completed`) and the case left alone. Queries are filed `open` and lead every action list until answered (F9b). Notes are shown, never acted on.
- Screen: Communication tab on the case; the inbox view across cases, by kind and reason.

### F13. The small exchanges

- Status: "Ask where it stands" on the pre-auth and claim cards, while awaiting and after a decision; Task `status`, workflow = the leg's correlation id (fallback 13); not offered to a payer whose adapter refuses it (PMJAY, PAYR-1018). The answer fills the enquiry row; the leg is unchanged.
- Reprocess: on a decided claim not paid in full, "Send reprocess request" with a coded reason (`claimrejected`, `partialpayment`, `rejectiondisputed`), words, and documents; Task `reprocess`, workflow 36. The payer's `completed` Task (37) reopens the claim: the submission goes back to `requested` and the new verdict lands on the claim's own thread.
- Release: once part of an approved claim is paid, "Ask for the balance" with the amount owed; Task `release`, reason `partialpayment`, `valueMoney`, workflow 36.
- Each ask is its own `claim_enquiry` row on its own thread, shown on the card it belongs to, newest first.

## What runs on every page load of the case

In this order, before rendering, each bounded to one poll and a short timeout, never a send: coverage (`checking`), plan (`fetching`), ruling (`checking`), claim (`submitting`), predeterminations (`asking`), pre-auth (`submitting` or `cancelling`), enquiries (`asking`). Then the beneficiary card, the policy card, the verdict card, the status line and actions, the tabs. A "Refresh" button reloads the same tab.

## What is not in the flow

- No status control anywhere. Stage and sub-stage are derived.
- No manual acknowledgement of a payment notice as the only path; it goes automatically and the screen shows that it went.
- No "chase" button without the status exchange behind it.
- No separate discharge submission on PMJAY; the discharge rides on the claim.
- No claim resubmit on PMJAY; a decided claim is reprocessed.
