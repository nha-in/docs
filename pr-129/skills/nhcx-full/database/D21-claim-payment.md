# D21. claim_payment

#### D21T. TABLE
One row is one payment the payer notified on a claim (a PaymentNotice), with the acknowledgement sent back for it. Primary key `id`. Parent table: `claim` (D9), many rows per claim; children in `claim_payment_detail` (D22).

#### D21D. DESCRIPTION
This is the one leg the payer starts. It posts a payment notice when money moves and expects an acknowledgement straight back. There is no correlation id of ours to match on, so the claim is found by the claim number inside the bundle.

**Created.** By the payment notice callback (C10):

1. The bundle is flattened from its `PaymentNotice`, `PaymentReconciliation` and `Task`. A bundle with neither of the first two is refused ("That is not a payment notice.").
2. A notice whose correlation id is already on a row is a redelivery and is ignored.
3. The claim number is read from the `CLN`-typed identifier on the PaymentNotice, else the PaymentReconciliation, else the Task, else the first entry's untyped identifier. It is matched against `claim.claim_no`, then against the `claim_ref` of D20 and D18 (a cancellation retires numbers). No match: the notice is `unmatched` and nothing is stored.
4. If a row on the same claim has the same `notice_id` (the payer sends one notice when the transfer is initiated and one when it clears [PAYER](../references/PAYERS.md#markers)), that row is updated with the new notice, its acknowledgement is reset (`ack_status` `pending`, `ack_txn_id`, `ack_correlation_id`, `acknowledged_at`, `ack_error` cleared) and its D22 rows are replaced. Otherwise a new row is inserted.
5. The acknowledgement is sent at once (below). A failed acknowledgement does not fail the callback.

6. The payment is **posted to the HMIS's billing** (below). A failed posting does not fail the callback either.

**Posting to the HMIS's billing.** A payment notice is money the hospital has received; recording it on the claim alone leaves the admission's bill unpaid in the HMIS and the finance desk reconciling by hand. So every `paid` or `cleared` notice that counts towards `paid_total` is posted to the HMIS's own billing or accounts module through one service hook, `billing.post_payer_payment(claim, payment)`, which the L2 mapping binds to the HMIS's receipt and adjustment records (L1.3 `billing` in `discovery.json`; [SCAFFOLDING.md](../references/SCAFFOLDING.md), section 4, Billing). What it posts, against the bill or account of the linked admission (D9 `encounter_id`):
- a **receipt** for `amount` on `payment_date`, mode "insurer" or the HMIS's equivalent, payer = the claim's `payer_name`, reference = `utr`, narration = the claim number and the payer's disposition;
- when the claim is decided and this is the clearing notice, an **adjustment** for the shortfall: the claim's billed amount (D20 `requested_amount`) minus the sum approved (D20 `approved_amount`), as the HMIS's payer-deduction or write-off type, with the payer's deduction reasons ([F9. ClaimResponse](../fhir/F9-claimresponse.md) per-item `deduction_reason`) in the narration. The hospital decides on its own screens whether the shortfall is charged to the patient; the posting records it, it does not bill anyone.
A notice that updates an earlier one (same `notice_id`) reverses the earlier receipt and posts again, so the bill never carries two receipts for one UTR. An HMIS with no billing module (`billing` absent in discovery) binds the hook to a no-op that writes `billing_status = 'none'`, and S12 says so.

**Billing statuses** (`billing_status`): `pending` (not posted yet), `posted` (with `billing_ref`, the HMIS receipt id), `error` (with `billing_error`), `none` (no billing module). `error` to `posted` by "Post to billing" on S12.

**Acknowledgement statuses** (`ack_status`, exact strings): `pending`, `sent`, `error`.

- `pending` to `sent`: the acknowledgement Task went (A8). Writes `ack_txn_id`, `ack_correlation_id`, `acknowledged_at`, clears `ack_error`. It goes to `sender_code` (else the claim's payer), carries this notice's `correlation_id`, and its workflow id is the adapter's `payment_ack` (see [PAYERS.md](../references/PAYERS.md)) [PAYER](../references/PAYERS.md#markers), else this row's `workflow_id`, else `claim_ref`, else the claim number.
- `pending` to `error`: the send failed. Writes `ack_error` and, when [G7. Send](../gateway/G7-send.md) named them, `ack_txn_id` and `ack_correlation_id`.
- `error` to `sent`: re-sent by hand from Payments (S12).

**Reading the money.** `paid_total` counts rows whose `payment_status` is `paid` or `cleared` (any case), skips a row whose `utr` is empty and whose `disposition` contains "initiat" (money on its way) [REF](../references/PAYERS.md#markers), and counts each UTR once (newest row wins; a row without a UTR counts by its id). The claim stage becomes `payment` as soon as one notice exists: `paid` when that total is above 0, else `noticed`.

**Deleted.** Never by the application; by cascade with the claim or when the transactional store is cleared.

#### D21C. COLUMNS
| Column | Type | Null / default | Meaning |
|---|---|---|---|
| id | INTEGER | primary key | Row id |
| claim_id | INTEGER | NOT NULL | The claim (D9) the notice names |
| claim_ref | TEXT | null | The claim number the notice named |
| correlation_id | TEXT | null, unique | The payer's correlation id; dedupes redeliveries |
| sender_code | TEXT | null | `x-hcx-sender_code` of the notice; the acknowledgement goes back to it |
| workflow_id | TEXT | null | `x-hcx-workflow_id` of the notice |
| received_at | TEXT | NOT NULL | When the notice was stored |
| disposition | TEXT | null | `PaymentReconciliation.disposition`, else `Task.description`, else the payment status display, else the reconciliation outcome, else "Payment notice" |
| payment_status | TEXT | null | `PaymentNotice.paymentStatus` code, for example `paid`, `cleared` |
| payment_date | TEXT | null | `PaymentReconciliation.paymentDate`, else the date part of `PaymentNotice.created` |
| amount | REAL | null | `PaymentNotice.amount.value`, else `PaymentReconciliation.paymentAmount.value` |
| currency | TEXT | null | Currency of that amount |
| utr | TEXT | null | Unique Transaction Reference: `PaymentReconciliation.paymentIdentifier.value` |
| notice_json | TEXT | null | The notice bundle as received |
| ack_status | TEXT | NOT NULL, default `pending` | `pending`, `sent`, `error` |
| ack_txn_id | TEXT | null | Ledger id of the acknowledgement |
| ack_correlation_id | TEXT | null | Correlation id the acknowledgement went out under |
| acknowledged_at | TEXT | null | When the acknowledgement went |
| ack_error | TEXT | null | Why the acknowledgement failed |
| notice_id | TEXT | null | `PaymentNotice.id`; a later notice with the same id updates this row. Migration only |
| billing_status | TEXT | NOT NULL, default `pending` | `pending`, `posted`, `error`, `none`: whether the payment reached the HMIS's billing. Added by migration |
| billing_ref | TEXT | null | The HMIS receipt (and adjustment) ids the posting created, as the HMIS shows them. Added by migration |
| billing_error | TEXT | null | Why the posting failed. Added by migration |
| posted_at | TEXT | null | When the posting succeeded. Added by migration |

#### D21K. KEYS AND INDEXES
- Primary key `id` (integer).
- Foreign key `claim_id` references `claim (id)` (D9), `ON DELETE CASCADE`. D22 rows reference this table.
- Index `ix_claim_payment` on `(claim_id, id DESC)`; notices are listed newest first.
- Unique index `ux_claim_payment_corr` on `(correlation_id)`. SQLite allows several nulls.

#### D21U. USED BY
- Screens: [S5. Claim Master](../screens/S5-claim-master.md), [S6. Claim Detail](../screens/S6-claim-detail.md), [S11. Claim Submission](../screens/S11-claim-submission.md), [S12. Payments](../screens/S12-payments.md)
- APIs: [A8. Payment Notice Acknowledgement](../apis/A8-paymentnotice-on-request.md), [A17. Claim State](../apis/A17-claim-state.md)
- Callbacks: [C1. Callback Door](../callbacks/C1-callback-door.md), [C10. Payment Notice](../callbacks/C10-paymentnotice-request.md)
- FHIR: [F13. PaymentNotice](../fhir/F13-paymentnotice.md), [F14. Payment acknowledgement](../fhir/F14-payment-acknowledgement.md)
- Database: [D9. claim](D9-claim.md), [D22. claim_payment_detail](D22-claim-payment-detail.md), [D29. claim_enquiry](D29-claim-enquiry.md)
