---
name: nhcx-payment
description: Add NHCX payment notices to a hospital information system or a standalone claims desk. Receive the payer's PaymentNotice, match it to its claim by the claim number, record it once, and acknowledge it at once (workflow 17 on PMJAY, the notice's own id for a generic payer), held to the pinned bundle. Starts by checking whether the app already records NHCX payments or acknowledges notices, and whether it holds the filed claim a notice names, then builds, extends or reuses only what is missing. Self-contained; needs no other skill installed. Use for payment notices, settlement, UTR, payment acknowledgement, NHCX use cases B7 and D13, flow step F12.
---

# NHCX payment: the notice and its acknowledgement

This skill takes the payer's payment notice when it arrives, files it against its claim once however often it is delivered, acknowledges it straight away, and shows the desk what was paid and against which UTR.

Read `core/LADDER.md` first. It holds the ladder every NHCX skill walks: the definition of compliant, the stages, the workspace, how to run a stage, and the rules. This folder carries everything it needs and runs on its own; the other six NHCX skills are separate folders, and none of them has to be installed. Paths starting `core/`, `stages/`, `references/`, `fhir/`, `flow/`, `ui/`, `templates/` or `scripts/` are relative to this folder. Paths starting `nhcx-package/` are in the NHCX package, which `scripts/fetch-package.sh` fetches into the target project beside `nhcx-build/`; `references/material.md` names the package file of every pin by its label.

## What this skill covers

| | |
| --- | --- |
| Flow step | F12 Payments |
| Tabs | Payments (tab 8); the payments view across cases |
| Wire | In: `v1/paymentnotice/request`, workflow 30 (also 31, 33), on a new thread. Out: `v1/paymentnotice/on_request` with the notice's correlation id, a Task `status completed` with output `paymentack`, workflow 17 (PMJAY) or the notice's own id echoed (generic) |
| Next actions | "Await the payment notice", "Acknowledge the payment notice", "Settled" |
| Use cases | B7, D13; C9 as readers |
| Module | 7.10, the payment half |
| Pins | `payment/notice-ack`: `nhcx-package/fhir/B7/payment-notice-ack.json` |
| Payer fixtures | `nhcx-package/fhir/C9/payment-notice.json`, `C9-notice-wf30.json`, `C9-notice-tds-wf30-pmjay.json`; the live PMJAY acknowledgement in `nhcx-package/fhir/D13` |
| Tables | `claim_payment` (its correlation id unique), `claim_payment_detail` |
| FHIR | `fhir/FHIR.md` section 8; `references/fhir-knowledge.md` section 10 |

## Needs and hands on

Needs: a filed claim. The notice names the claim number, which is looked up against the episode's claim number and every leg's `claim_ref`. Stage 0 checks for it below, whichever way the app got it.

Hands on: payment rows with amount, UTR, status and acknowledgement; the episode at `payment / noticed` or `paid`. A notice short of the approved amount is what a release (the reprocess use case) asks the balance against.

## Capability check

Stage 0 (`stages/0-capability-check.md`) gives every capability below a verdict: search for the markers, run the check, record what was observed.

### Own

| Id | What | Look for | Present when (observed) |
| --- | --- | --- | --- |
| `payment.notice-reader` | `parse_payment_notice`, and the match to a claim | `PaymentNotice`, `PaymentReconciliation`, `paymentStatus`, `CLN` | Fed `nhcx-package/fhir/C9/payment-notice.json`, it yields the claim number, the amount and the UTR; the claim number comes from a `CLN` identifier, then any untyped identifier on the notice, the reconciliation or the Task, and never from the bundle id |
| `payment.record` | One row per notice | a payment table keyed on the notice's correlation id | Delivered through the door, one notice makes one row with its details; the same notice twice makes one row, by the unique constraint (7.10 Validate, row 6); a payer that reuses the notice id updates the row; the episode stamps `payment / noticed` or `paid`, paid counted once per UTR |
| `payment.acknowledge` | The acknowledgement, sent at once and automatically | a send on `v1/paymentnotice/on_request`; `paymentack` | The builder produces `payment/notice-ack` byte for byte; PMJAY gets workflow 17 and a generic payer its notice's own id (7.10 Validate, rows 2 and 7); the notice's correlation id is echoed; nothing is sent inside the callback; a failed acknowledgement stays on the row and the callback still answers 2xx |
| `payment.screens` | The Payments tab and view | a card per notice | Status, amount, the UTR as text, the breakdown, and "Acknowledged at" or "Send the acknowledgement again", all from the stored notice; an initiated notice without a UTR reads "Initiated, UTR awaited" and is not counted as money received |

### Foundation

All six capabilities in `core/FOUNDATION.md`. `foundation.callback` is partial until the door matches an inbound request by the claim number inside it; `foundation.storage` until `claim_payment` exists with its unique correlation id; `foundation.state` until a notice wins in `case_stage`.

### Prerequisites

The claim use case (`nhcx-claim`) owns these. The checks are here, so that skill need not be installed.

| Capability | Why | Look for | Present when (observed) |
| --- | --- | --- | --- |
| `claim.send` | A notice is matched by the claim number of a filed claim | a claim leg with `claim_ref` and `correlation_id` | A claim sent with a stubbed client on `v1/claim/submit` (workflow 15) stores `claim_ref`, and the claim number in `nhcx-package/fhir/C9/payment-notice.json` can be looked up against the episode's number or a leg's `claim_ref` |
| `claim.response-reader` | A payer pays an approved claim; "Await the payment notice" follows the approval | a ClaimResponse reader on the claim thread | `nhcx-package/fhir/C7/C7-received-wf25.json` then `C7-approved-wf26.json` on the claim's correlation id leave the claim `approved` |

### Host facts

Invoices and receipts: where a settlement amount and a UTR could be written back, if stage 4 says so.

## The ladder, for this skill

| Stage | What is specific here |
| --- | --- |
| 0 | The tables above. |
| 1 | Confirm the shared page, or write it if this skill runs first on the app. Own rows: B7, D13. |
| 2 | Risks: acknowledge or lose the thread (NHCX redelivers, then retires the id); a redelivered notice counted twice; 17 against an echoed id; a notice matched by the bundle id instead of the claim number. |
| 3 | The host facts above. |
| 4 | The homes of `claim_payment` and `claim_payment_detail`; the notice's destinations; the acknowledgement's source map; whether a UTR is written back to the HMIS receipt. If this skill maps first, every table's home too. |
| 5 | The Payments tab and view. F12 is started by the payer: the only action is "Send the acknowledgement again". |
| 6 | The payment half of 7.10; the foundation modules stage 0 found absent or partial. |
| 7 | The payment half of 7.10, as far as its verdicts say. |
| 8 | 7.10 Validate rows 2, 6, 7 and 8. |
| 9 | The pin comparison; reader tests on every C9 fixture; matrix rows B7 and D13; the cross-cutting rows for an inbound notice (redelivery, unmatched). |
| 10 | Rung 1. Rung 3: a generic payer's desk releases payment. Rung 4: the SHA's finance side sends 30 on its own schedule, which may not fall within a run; say so rather than wait. |
| 11 | This skill's section. |

## Rules for these legs

- The payer starts this leg. The acknowledgement goes at once and automatically, and the screen shows that it went; the button is only the retry.
- Match by the claim number inside the notice, never by the bundle id.
- Dedupe on the notice's correlation id with a unique constraint, not a check in code.
- PMJAY is acknowledged on workflow 17; a generic payer's notice id is echoed (`None` in the payer table means echo).
- Paid is counted once per UTR, the newest notice winning.

## Done when

- Every gate in this skill's block of `nhcx-build/STATE.md` is closed with evidence.
- The acknowledgement pin passes; a redelivered notice makes no second row.
- The compliance points in `core/LADDER.md` hold for F12.
