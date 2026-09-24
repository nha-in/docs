# Payers

NHCX standardises the envelope, not what a payer puts in it. Package codes, the workflow id each exchange travels under, how a payer asks a question, whether it rules on authorisation requirements: these differ by payer. The application keeps them in one place, a **payer adapter**, chosen per payer participant code, and the exchange code asks the adapter instead of hard-coding a scheme. This page is that one place.

## Markers

The specs mark every statement that is not the NHCX protocol itself:

| Marker | Means | What to do |
|---|---|---|
| [REF](PAYERS.md#markers) | A choice the reference implementation made (a layout, a label, an id format, a default). The protocol does not require it. | Follow it unless the target has a reason not to; record a different choice in `nhcx-plan/plan.json`. |
| [PAYER](PAYERS.md#markers) | Behaviour that depends on the payer adapter (for example a PMJAY rule or a workflow id). | Read the value from the adapter below, never hard-code it; check it against the knowledge source. |
| [SANDBOX](PAYERS.md#markers) | Something observed on the NHCX sandbox or a sandbox payer, not written in any specification. | Expect it in the sandbox; do not rely on it in production without confirming it. |

Unmarked statements are the protocol or this application's own design, and are followed as written. On the protocol the knowledge source ([KNOWLEDGE.md](KNOWLEDGE.md)) wins.

## Choosing the adapter

- A configuration row maps a payer's participant code to an adapter key: in the reference implementation, rows of kind `payer_adapter` in the code lists ([D8. terminology](../database/D8-terminology.md)), with the participant code as `code`, the operator's name for the payer as `display` and the adapter key as `extra`.
- The adapter is chosen by the policy's **payer id**. Messages are addressed to its **processing id** (the participant that handles the policy on NHCX), which can be a different code; see [CORE.md](CORE.md).
- Codes are matched on their numeric part, so `1518`, `1518@hcx` and `1518@HCX` are the same payer.
- A payer with no row gets the **generic** adapter: a plain NRCeS bundle with none of any scheme's extras. The claim screen names the adapter in use, so an unconfigured payer is visible.
- A workflow id missing from an adapter's table falls back to the PMJAY table's value for that kind; a kind no table defines is refused ("No workflow id is defined for '<kind>'.").

## The adapters

| Property | `pmjay` (PMJAY / Ayushman Bharat) | `xyz` (Sandbox Payer) | `generic` |
|---|---|---|---|
| Payer code system | `https://payer.pmjay.nha.gov.in` | `https://xyz.example/fhir` | `https://nhcx.abdm.gov.in` |
| Programme code on every claim line | `AB-PMJAY` ("Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)") | none | none |
| Rules on authorisation requirements (A2 `auth-requirements`, C3) | yes | yes | no: eligibility only |
| Document stages wanted at pre-authorisation | `pre` | `pre` | `pre` |
| Publishes a package master (A3, C4) | yes | yes | yes |
| Multiple-procedure factors (`Claim.item.factor`) | 1, 0.5, 0.25 (costliest in full, second at half, the rest at a quarter) | 1, 0.5, 0.25 | none |
| How it asks for more (query mode) | `resubmit`: the query is a ClaimResponse on the case's own thread, answered by submitting the leg again under the query-response workflow id; a CommunicationRequest from it is a notification, acknowledged, never answered | `communication`: a CommunicationRequest on a thread of its own, answered with a Communication (A7) | `communication` |
| Answers a status enquiry (A6 status) | no: it refuses the Task (PAYR-1018, or PAYR-1008 with a reason code); read the case's state from its desk instead | yes | yes |
| Reprocess reason codes | `claimrejected`, `partialpayment`, `rejectiondisputed` | same | same |
| Adjudication desk (sandbox testing, A14, A15) | the NHCX Payer Service | the sandbox payer portal's own API | none |

The `xyz` adapter is the reference implementation's own sandbox payer portal; it speaks the PMJAY dialect for plans and rulings. Replace it with the payers the target actually deals with.

## Workflow ids

The `x-hcx-workflow_id` each send travels under, per adapter, and the `x-hcx-status` NHA's workflow sheet pairs it with. An environment override may replace any workflow id. The status is set by the send: a query answer goes on a request path yet travels as `response.complete`, so the gateway's path default must not decide it (the reference implementation let it, sending `request.initiated` everywhere [REF](PAYERS.md#markers)).

| Send (kind) | `pmjay` | `xyz` | `generic` | API | `x-hcx-status` |
|---|---|---|---|---|---|
| Pre-authorisation (`preauth`) | 12 | 12 | 12 | A4 | `request.initiated` |
| Pre-auth resubmitted after a rejection (`preauth_resubmit`) | 121 | 121 | 121 | A4 (defined; the reference send logic never chooses it) | `request.initiated` |
| Pre-auth query answer (`preauth_query_response`) | 19 | 19 | 19 | A4 | `response.complete` |
| Enhancement (`enhancement`) | 13 | 13 | 13 | A4 | `request.initiated` |
| Enhancement query answer (`enhancement_resubmit`) | 131 | 131 | 131 | A4 | `response.complete` |
| Predetermination | 12 | 12 | 12 | A4 | `request.initiated` |
| Cancel (`cancel`) | PC01 | PC01 | PC01 | A6 | `request.initiated` |
| Claim (`claim`) | 15 | 15 | 15 | A5 | `request.initiated` |
| Claim resubmitted (`claim_resubmit`) | not offered: PMJAY refuses 16 with PAYR-1321 [SANDBOX](PAYERS.md#markers) | 16, not in NHA's published workflow list [REF](PAYERS.md#markers) | 16, not in NHA's published workflow list [REF](PAYERS.md#markers) | A5 | `request.initiated` |
| Claim query answer (`claim_query_response`) | 161: the SHA sandbox refuses the handbook's 151 and 19 with PAYR-1321 and takes 161 [SANDBOX](PAYERS.md#markers) | 151 | 151 | A5 | `response.complete` |
| Payment acknowledgement (`payment_ack`) | 17 | the notice's own workflow id, echoed back | the notice's own workflow id | A8 | `response.complete` |
| Reprocess (`reprocess`) | 36 | 36 | 36 | A6 | `request.initiated` |
| Balance release (`release`) | 36 | 36 | 36 | A6 | `request.initiated` |

Eligibility checks (A2) and plan requests (A3) do not take their workflow id from this table: the reference implementation sends the case number [REF](PAYERS.md#markers). NHA publishes no eligibility workflow code; its sample sends `11` (Patient Admitted). Prefer `11` unless the payer is known to accept the case number. A status enquiry sends the leg's own correlation id, else 13 [REF](PAYERS.md#markers). Confirm both against the knowledge source (`workflow.yaml` in the package).

The payer's replies carry workflow ids of their own (for example PMJAY acknowledges a pre-authorisation under 20 and decides under 21, a claim under 25 and 26, a cancel under PC02) [PAYER](PAYERS.md#markers). The callbacks never route on them; they match on correlation ids.

## Sandbox participant codes

Seen in the reference implementation's sandbox runs [SANDBOX](PAYERS.md#markers). They are examples, not constants: a build reads every participant code from configuration.

| Code | Is |
|---|---|
| `1518@hcx` | the PMJAY (NHA) payer on the NHCX sandbox, adapter `pmjay` |
| `1000004805@hcx` | the reference implementation's IRDAI sandbox payer portal, adapter `xyz` |
