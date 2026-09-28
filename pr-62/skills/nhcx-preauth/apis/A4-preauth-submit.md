# A4. Pre-auth Submit

#### A4E. ENDPOINT
In-process: `gateway.send("v1/preauth/submit", envelope)`, [G7. Send](../gateway/G7-send.md), which encrypts it and posts it to NHCX for the payer: `POST {nhcx}/v1/preauth/submit`. The payer's answer comes back asynchronously on `preauth/on_submit` (taken in by [G8. Receive](../gateway/G8-receive.md), callback C5 through the callback door C1, type `preauth`, or found by polling the [G9. Ledger](../gateway/G9-ledger.md), A10 / A11 / A12 / A13).

#### A4D. DESCRIPTION
Sends the pre-authorisation Claim bundle for one case. The same route carries two things:

- **The pre-authorisation itself** (`Claim.use = preauthorization`), in four send kinds that share one bundle and differ only in the Claim's anchor, the bundle id and the workflow id.
- **A predetermination** (`Claim.use = predetermination`): the same dossier sent as "what would you pay for this", which binds nobody and opens no case. It goes on the preauth route because that is the NHCX route there is for it; `use` says what it is.

**Send kinds.** The kind is worked out from where the pre-authorisation stands:

| Where the pre-auth stands | Kind | Answers a query |
|---|---|---|
| Nothing sent, `cancelled`, `error`, `rejected` | `preauth` | no |
| `queried` | `preauth_query_response` | yes |
| `approved` / `partial` with lines added since the decision | `enhancement` | no |
| `queried`, when the last send was an enhancement round | `enhancement_resubmit` | yes |
| `approved` / `partial`, nothing added | refused: "The pre-authorisation is already decided; add a line to ask for an enhancement." | |
| `submitting` / `cancelling` | refused: "The pre-authorisation is with the payer; wait for its answer before sending again." | |
| (predetermination, any time the policy is eligible) | `predetermination` | no |

FHIR: [F1. Bundle](../fhir/F1-bundle.md) (the bundle id and Claim anchor of each kind), [F8. Claim](../fhir/F8-claim.md)

A line counts as added when its code (or a ward tier code riding as a modifier) is not in the Claim of the last bundle sent. After a rejection the next send is a fresh `preauth` (12), not a resubmission: PMJAY refuses 121 there with PAYR-1214 [PAYER](../references/PAYERS.md#markers).

**Status (`x-hcx-status`).** Set by the send, not left to the gateway's path default: `response.complete` for a query answer (`preauth_query_response`, `enhancement_resubmit`), `request.initiated` for everything else, as NHA's workflow sheet pairs them (see [PAYERS.md](../references/PAYERS.md)). The reference implementation left it to the default, `request.initiated`, on every send [REF](../references/PAYERS.md#markers).

**Workflow ids (`x-hcx-workflow_id`).** Read from the payer adapter chosen by the claim's payer participant code (see [PAYERS.md](../references/PAYERS.md)) [PAYER](../references/PAYERS.md#markers). An unmapped payer uses Generic.

| Kind | `pmjay` | `xyz` (Sandbox Payer) | `generic` |
|---|---|---|---|
| `preauth` | 12 | 12 | 12 |
| `preauth_query_response` | 19 | 19 | 19 |
| `enhancement` | 13 | 13 | 13 |
| `enhancement_resubmit` | 131 | 131 | 131 |
| `preauth_resubmit` (defined, never chosen by the send logic) | 121 | 121 | 121 |
| predetermination | always `12`, fixed in code, not read from the adapter [REF](../references/PAYERS.md#markers) | | |

A per-environment override (a JSON object of kind to workflow id) wins over the adapter, key by key. A kind with no id anywhere is refused with "No workflow id is defined for '<kind>'.".

**Headers set by the application.** Only these three; G7 generates ([G5. Protocol Headers](../gateway/G5-protocol-headers.md)) `x-hcx-api_call_id`, `x-hcx-request_id`, `x-hcx-correlation_id`, the timestamp and the status.

| Header | Value |
|---|---|
| `x-hcx-sender_code` | The facility's NHCX participant code (Settings) |
| `x-hcx-recipient_code` | The case's processing id (D9 `processing_id`), else the case's processing id, else the claim's payer id, else the configured default payer code |
| `x-hcx-workflow_id` | From the tables above |

**Before a pre-authorisation send** (not a predetermination), the app fires the payer's `auth-requirements` coverage check (A2) when the adapter supports it (see [PAYERS.md](../references/PAYERS.md)) [PAYER](../references/PAYERS.md#markers), the claim is `eligible`, lines exist, and this procedure set has not been ruled on (or the last ruling is in `error`). It never waits for the answer, and a failure of that check does not stop the send.

**Checks before sending**, in order, each raised as the screen's red message:

Pre-authorisation:
1. "Submit a preauth only after the payer has confirmed the policy is eligible."
2. The send-kind refusals above.
3. On a query-answering kind with no reply text: "Write the reply to the payer's query before answering it."
4. "Set the facility's HFR ID and NHCX participant code under Settings before submitting."
5. "Link the admitted patient before submitting."
6. "Enter the admission date on the preauth draft."
7. "Quote at least one ICD-10 diagnosis."
8. "Add at least one doctor to the care team."
9. "Add at least one line, the procedure being done."

Predetermination: "Ask for a quote only after the payer has confirmed the policy is eligible.", then "A quote is already with the payer; wait for its answer before asking again.", then checks 4 to 9.

#### A4Q. REQUEST

The arguments passed to G7 Send:

| Field | Type | Notes |
|---|---|---|
| `jwe_headers` | object | The three headers above |
| `fhir` | Bundle | The Claim bundle |

FHIR: [F1. Bundle](../fhir/F1-bundle.md), [F8. Claim](../fhir/F8-claim.md), [F15. Patient](../fhir/F15-patient.md), [F17. Organization](../fhir/F17-organization.md), [F18. Coverage](../fhir/F18-coverage.md), [F16. Practitioner and PractitionerRole](../fhir/F16-practitioner.md), [F19. Other bundle resources](../fhir/F19-other-resources.md) (Procedure), [F7. QuestionnaireResponse](../fhir/F7-questionnaireresponse.md) (pre-auth only, not predetermination)

The bundle always carries every quoted line, also on an enhancement.

Envelope (PMJAY, first pre-authorisation):

```json
{
  "jwe_headers": {
    "x-hcx-sender_code": "<facility code>",
    "x-hcx-recipient_code": "<payer code>",
    "x-hcx-workflow_id": "12"
  },
  "fhir": <F1 Bundle carrying F8 Claim (use preauthorization), F15 Patient, F17 provider and payer Organizations, F18 Coverage, F16 Practitioner per care-team doctor, F19 Procedure per procedure line, F7 QuestionnaireResponse per answered form>
}
```

A query answer (workflow 19 under the `pmjay` adapter [PAYER](../references/PAYERS.md#markers)) differs only in the Claim anchor, the bundle id, and the reply text riding on the Claim as the "Claim query detail" entry (F8).

#### A4S. RESPONSE

**Acknowledgement** (the G7 result, NHCX status 202):

```json
{"ok": true,
 "gateway_status": 202,
 "txn_id": "7UPG003U",
 "ledger_id": "7UPG003U",
 "correlation_id": "f8425e75-52e0-4413-a915-39a7bad38ee2",
 "request_id": "0b398fdf-0516-4935-9ebb-a0dc90a06bb6",
 "headers": {"x-hcx-correlation_id": "f8425e75-52e0-4413-a915-39a7bad38ee2", "...": "..."},
 "response": "<NHCX's acceptance>"}
```

For a pre-authorisation the leg becomes `submitting` under the acknowledgement's ids (`txn_id`, `correlation_id`), and the verdict fields are cleared. An enhancement keeps the payer's pre-auth reference and counts one more round; a query answer keeps the reference and the round count. A predetermination adds a quote row in `asking`.

**Failed send.** Per the shared conventions. When the failure names ids, the leg is kept under them as refused at the door: `error` with the message for a `preauth` or a query answer; back to `approved` with the message for an enhancement or an enhancement query answer (the added lines stay unsent). A predetermination is stored as `error`. If the payer later answers on that correlation, the leg reopens and the answer is applied.

Data: [D18. claim_preauth](../database/D18-claim-preauth.md), [D19. claim_predetermination](../database/D19-claim-predetermination.md)

Reply: [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md)

**Polling** (while the leg is `submitting`, on each load of S6): A10 (G9 related) with the leg's `txn_id`; the newest inbound entry not sent by this facility whose bundle (A12) carries a ClaimResponse is applied. With no reply: a failed payer answer when one G hosts both participants ("The payer answered, but NHCX refused its reply..."), or a ProtocolResponse for this correlation found through A13 (type `preauth`) and A12, is applied as a refusal at the door. Otherwise A11 (G9 dispatch) is read, and a dispatch status of `dispatch_failed` turns the leg to `error` with the ledger's `errorMessage`, else `errorCode`, else "Dispatch to NHCX failed.". When G9 no longer holds the transaction (A10 not found), the leg turns to `error`: "The gateway no longer has this transaction, its ledger was reset after the preauth was sent. Submit again." Predetermination polling is the same without the A11 step, and its not-found message reads "The gateway no longer has this transaction. Ask again."

#### A4P. PSEUDOCODE

```
// shared send convention (every outbound bundle), in-process through G7
function SEND(path, envelope, case):
    archive envelope with the case (outbound)
    try:
        result = gateway.send(path, envelope)       // G7 Send, posts to {nhcx}/<path>
    catch send_error:                               // G7 SendError {code, message, retryable, ...}
        if send_error names ids (txn_id, correlation_id):
            return ack = those ids, failed = send_error
        raise send_error                            // nothing went out; nothing written
    ack = {txn_id: result.txn_id, correlation_id: result.correlation_id,
           request_id: result.request_id}
    if not result.ok:                               // NHCX did not accept it; ledger row "rejected"
        return ack, failed = NHCX's refusal (APIs conventions)
    return ack, failed = none

function submit_preauth(case_id, reply):
    case = claim[case_id]                  or refuse "Claim not found."
    if case.status != eligible:
        refuse "Submit a preauth only after the payer has confirmed the policy is eligible."
    existing = claim_preauth for the case
    kind     = preauth_send_kind(case_id)                 // may refuse
    adapter  = payer adapter for case.payer_id (Generic when unmapped)
    flow     = enhancement           if kind == enhancement
               queryupdate           if kind in {enhancement_resubmit, preauth_query_response}
               request               otherwise
    answer = null
    if flow == queryupdate:
        answer = trim(reply)
        if answer empty: refuse "Write the reply to the payer's query before answering it."

    ensure_auth_requirements(case_id)                     // A2; fire and forget

    // gather (each refusal in this order)
    org = default organization
    if org missing or HFR ID or participant code empty:
        refuse "Set the facility's HFR ID and NHCX participant code under Settings before submitting."
    if case.encounter_id empty:  refuse "Link the admitted patient before submitting."
    if case.admission_date empty: refuse "Enter the admission date on the preauth draft."
    diagnoses = claim_diagnosis rows (by seq)
    if none: refuse "Quote at least one ICD-10 diagnosis."
    care_team = claim_care_team rows joined to practitioner (by seq)
    if none: refuse "Add at least one doctor to the care team."
    lines = claim_line rows
    if none: refuse "Add at least one line, the procedure being done."
    patient    = patient[case.patient_id]
    doctors    = practitioner row per care-team member (HPR id, name, degree, specialty)
    proc_type  = per procedure line, ProcedureType condition from claim_plan_benefit, else conservative
    documents  = claim_document rows at stage preauth, minus files given as form answers
                 (code default ODN, category default INV [REF](../references/PAYERS.md#markers), base64 data)
    forms      = forms required at preauth (claim_auth_requirement ruling, else the
                 claim_plan_form master) with answers from claim_form_answer; unanswered forms dropped
    total      = sum of the quoted lines

    // build
    bundle = F1 Bundle for leg preauth, flow, carrying F8 Claim (use preauthorization,
             claim number, admission to expected discharge, diagnoses, care team, items,
             documents, reply text as the query detail when answering, total),
             F15 Patient, F17 Organizations, F18 Coverage, F16 Practitioners,
             F19 Procedures, F7 QuestionnaireResponses;
             program code and multiple-procedure factors from the adapter
    workflow = workflow_id(adapter, kind)   // env override, else adapter; else
                                            // refuse "No workflow id is defined for '<kind>'."

    // call
    ack, failed = SEND("v1/preauth/submit", {
        jwe_headers: {x-hcx-sender_code: org.participant_code,
                      x-hcx-recipient_code: case.processing_id or case.payer_id or default payer code,
                      x-hcx-workflow_id: workflow,
                      x-hcx-status: status_for(adapter, kind)},   // response.complete for a query answer (19, 131), else request.initiated
        fhir: bundle}, case)

    // write
    values = {status: submitting, txn_id: ack.txn_id, correlation_id: ack.correlation_id,
              submitted_at: now, settled_at: null, error_message: null,
              claim_ref: case.claim_no, preauth_ref: null, outcome: null,
              disposition: null, approved_amount: null, eligible_amount: null,
              submitted_amount: null, items_json: null, requested_amount: total,
              submission_kind: kind, reply_text: answer, workflow_id: workflow,
              request_json: bundle, response_json: null}
    if kind in {enhancement, enhancement_resubmit}:
        values.preauth_ref    = existing.preauth_ref
        values.enhancement_no = (existing.enhancement_no or 0) + (1 if kind == enhancement else 0)
    else if kind in {preauth_resubmit, preauth_query_response}:
        values.preauth_ref    = existing.preauth_ref
        values.enhancement_no = existing.enhancement_no
    if failed:                                              // refused at the door
        values.status = approved if kind in {enhancement, enhancement_resubmit} else error
        values.error_message = failed.message
    if existing is none: INSERT claim_preauth (values, claim_id)
    else:                UPDATE claim_preauth[existing.id] SET values; recompute case stage
    if failed: raise failed

function preauth_send_kind(case_id):
    existing = claim_preauth for the case
    if existing is none or existing.status in {cancelled, error}: return preauth
    added = claim_line rows whose code is not in the last sent Claim (items and tier modifiers)
    if existing.status in {approved, partial}:
        if added empty: refuse "The pre-authorisation is already decided; add a line to ask for an enhancement."
        return enhancement
    if existing.status == queried:
        if existing.enhancement_no > 0 and existing.submission_kind in {enhancement, enhancement_resubmit}:
            return enhancement_resubmit
        return preauth_query_response
    if existing.status == rejected: return preauth
    if existing.status in {submitting, cancelling}:
        refuse "The pre-authorisation is with the payer; wait for its answer before sending again."
    return preauth

function ask_predetermination(case_id):
    case = claim[case_id]                  or refuse "Claim not found."
    if case.status != eligible:
        refuse "Ask for a quote only after the payer has confirmed the policy is eligible."
    if any claim_predetermination row of the case has status asking:
        refuse "A quote is already with the payer; wait for its answer before asking again."
    gather as in submit_preauth (same refusals 4 to 9), without forms
    bundle = F1 Bundle for leg predetermination carrying F8 Claim (use predetermination)
             and the same resources, no F7 QuestionnaireResponse
    ack, failed = SEND("v1/preauth/submit", {
        jwe_headers: {x-hcx-sender_code: org.participant_code,
                      x-hcx-recipient_code: case.processing_id or case.payer_id or default payer code,
                      x-hcx-workflow_id: "12"},             // fixed, not from the adapter [REF](../references/PAYERS.md#markers)
        fhir: bundle}, case)
    INSERT claim_predetermination {claim_id, status: asking, txn_id: ack.txn_id,
        correlation_id: ack.correlation_id, requested_at: now,
        requested_amount: sum of the quoted lines, request_json: bundle}
        with status = error, error_message = failed.message when failed
    if failed: raise failed
    return the new row id
```

#### A4U. USED BY
- Screens: [S9. Pre-authorisation](../screens/S9-preauthorisation.md), [S14. Patient Registration Form](../screens/S14-patient-registration-form.md), [S15. Patient Detail](../screens/S15-patient-detail.md), [S16. Practitioner Master](../screens/S16-practitioner-master.md)
- APIs: [A2. Coverage Eligibility Check](A2-coverage-eligibility-check.md), [A10. Transaction Related](A10-txn-related.md), [A11. Transaction Dispatch](A11-txn-dispatch.md), [A13. Transaction List](A13-txn-list.md)
- Callbacks: [C5. Pre-auth Reply](../callbacks/C5-preauth-on-submit.md)
- FHIR: [F8. Claim](../fhir/F8-claim.md), [F9. ClaimResponse](../fhir/F9-claimresponse.md), [F15. Patient](../fhir/F15-patient.md), [F17. Organization](../fhir/F17-organization.md), [F18. Coverage](../fhir/F18-coverage.md)
- Gateway: [G5. Protocol Headers](../gateway/G5-protocol-headers.md)
