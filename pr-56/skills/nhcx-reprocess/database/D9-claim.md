# D9. claim

#### D9T. TABLE
One row is one claim episode (case) around one selected policy, from eligibility to payment; primary key `id`; parent tables [D3. patient](D3-patient.md) and D4. encounter (in nhcx-preauth), both optional until the admission is linked.

#### D9D. DESCRIPTION
The case row. It holds the policy the operator selected, the coverage eligibility exchange and the payer's verdict flattened from it, the link to the admitted patient, the pre-authorisation draft header, and the case's stage. The legs of the case live in child tables: package master D10 (in nhcx-preauth), auth-requirements ruling D13 (in nhcx-coverage), lines [D16](D16-claim-line.md), pre-auth [D18](D18-claim-preauth.md), claim [D20](D20-claim-submission.md), payments [D21](D21-claim-payment.md), queries [D23](D23-claim-query.md) and the others that point here.

Create:
- Written when the operator picks a policy from the search result (S2). The policy must carry a member ID ("That policy has no member ID; a claim cannot be raised without one."). The row starts with `status = 'draft'` and `created_at` = now. It copies the search inputs (`search_id_type`, `search_id_value`), the policy fields, `patient_photo` and the raw policy as `policy_json`. `payer_name` falls back to the payer adapter's name for `payer_id`, then to the configured default payer name.
- `claim_no` is allocated from the `claim` counter ([D30](D30-counter.md)) as `NM-<yy>-<mmdd><serial>`, month-and-day in 3 base32 characters and the serial in 6 (alphabet `0-9A-V`), so every number has the same length and sorts by date, then issue order [REF](../references/PAYERS.md#markers). Example: `NM-26-0SE000001`.

Eligibility check (A2):
- Sending sets `status = 'checking'`, `purpose`, `policy_code` (the one entered, else the stored one), `member_id`, `txn_id`, `correlation_id`, `checked_at` = now, `error_message` = null. A send that fails sets `status = 'error'` and `error_message`. The outbound `x-hcx-workflow_id` is `claim_no` [REF](../references/PAYERS.md#markers).
- The verdict (C2 callback, or polling by `txn_id`) writes `inforce`, `outcome`, `disposition`, `auth_required`, `allowed_amount`, `used_amount` and, when the payer returns them, `beneficiary_name`, `patient_gender`, `patient_dob`, `patient_address`, `abha_number`, `patient_photo`, `plan_name`, `plan_period_start`, `plan_period_end`, `relationship`, plus the whole bundle as `response_json`. Values the payer leaves empty are not written. Then `status`: `error` when `outcome = 'error'`, else `eligible` when in force, else `not-eligible`.
- `status = 'error'` with `error_message` also results from a ProtocolResponse on the callback, a protocol error found in the ledger, a [G9. Ledger](../gateway/G9-ledger.md) dispatch status of `dispatch_failed`, `dead` or `failed`, or a G9 ledger that no longer knows the `txn_id` (not found).
- A redelivered verdict for a row that is no longer `checking` is ignored, unless the row's last send is on record as failed (`status = 'error'`). Then the row is revived to `checking`, `error_message` cleared, and the verdict applied.

Status values and transitions (`status`):
- `draft` -> `checking` (check sent) or `error` (send failed).
- `checking` -> `eligible`, `not-eligible` or `error`.
- `error` -> `checking` (payer answered a send reported failed, or the check is sent again).
- `eligible`, `not-eligible`, `error` -> `checking` when the check is sent again ("Check again").

Link the admission (S4):
- Allowed only when `status = 'eligible'` ("Link an admission only after the payer has confirmed the policy is eligible."). The admission must be a current IPD stay of a patient whose ABHA number matches `abha_number`, digits only. Writes `patient_id`, `encounter_id` and, if empty, `admission_date` from the stay's `period_start`.
- Unlink sets `patient_id` and `encounter_id` to null and keeps the draft fields.

Pre-authorisation draft (S4):
- Save requires a linked `encounter_id` ("Link the admitted patient before drafting a pre-authorisation."), an `admission_date`, an `expected_discharge_date` that is empty or not before it, and `case_type` `package` or `nonpackage`. It writes `admission_date`, `expected_discharge_date`, `case_type`, `package_code`, `package_name`, `preauth_total` and `preauth_saved_at` = now, and replaces D25 (in nhcx-preauth), D26 (in nhcx-preauth) and D27 (in nhcx-preauth) in the same transaction.
- `package` with a `ready` package master: `package_code` / `package_name` are the first Procedure line, and `preauth_total` is the lines' total. `package` without one: the package picked from the `claim_package` terminology, and `preauth_total` is its rate. `nonpackage`: package fields null, and `preauth_total` is the sum of the charge items.

Stage (`stage`, `sub_stage`):
- Derived from the legs and stored whenever a leg is written, the verdict lands, the draft is saved or the state endpoint (A17) runs. The stored pair lets the claim list (S5) show and filter it without reading the legs.
- `stage`: `payment` when any payment notice exists; else `claim` when the claim leg exists and is not `draft`; else `enhancement` (last pre-auth send was `enhancement` or `enhancement_resubmit`) or `preauth` when a pre-auth leg exists; else `preauth` with `sub_stage = 'draft'` when `preauth_saved_at` is set; else `eligibility`.
- `sub_stage`: `draft`, `checking`, `eligible`, `not-eligible`, `requested`, `resubmitted`, `answered`, `queried`, `approved`, `partial`, `rejected`, `cancelling`, `cancelled`, `refused`, `noticed`, `paid`. At `eligibility` it is `status`, with `error` read as `draft`. At `payment` it is `paid` when anything has been paid, else `noticed`. On a leg it is the leg's status: a leg still `submitting` reads by its send kind (`requested`, `resubmitted` or `answered`), a leg in `error` reads `refused`, and an open payer query ([D23](D23-claim-query.md) `kind = 'query'`, status `open` or `error`) on a leg in `requested`, `answered` or `resubmitted` reads `queried`.

Other writes:
- An accepted pre-auth cancellation gives the claim a fresh `claim_no` [REF](../references/PAYERS.md#markers). The withdrawn number stays on the pre-auth leg ([D18](D18-claim-preauth.md) `claim_ref`).
- Never deleted by any screen. The "clear transactional data" reset deletes all rows; `ON DELETE CASCADE` on the child tables removes their rows with it.

#### D9C. COLUMNS
| column | type | null/default | meaning (and allowed values) |
|---|---|---|---|
| id | INTEGER | primary key | row id; the `:caseid` of the claim screens |
| claim_no | TEXT | NOT NULL, UNIQUE | case number `NM-<yy>-<mmdd><serial>`; `caseId` and `x-hcx-workflow_id` of the eligibility check [REF](../references/PAYERS.md#markers) |
| created_at | TEXT | NOT NULL | ISO timestamp the case was opened |
| status | TEXT | NOT NULL, default `'draft'` | eligibility status: `draft`, `checking`, `eligible`, `not-eligible`, `error` |
| search_id_type | TEXT | null | how the beneficiary was searched: `MemberId`, `MobileNo`, `AbhaNumber` |
| search_id_value | TEXT | null | the value searched |
| member_id | TEXT | NOT NULL | beneficiary / member ID from the selected policy; `pmjayId` [PAYER](../references/PAYERS.md#markers) and `subscriberId` |
| policy_code | TEXT | null | policy / plan identifier, for example `PMJAY/HP/S/G` [PAYER](../references/PAYERS.md#markers); `policyNumber` |
| beneficiary_name | TEXT | null | name from the search, then from the payer's Patient |
| abha_number | TEXT | null | ABHA number from the search, then from the payer's Patient; used to find the admission |
| mobile_number | TEXT | null | mobile number from the search |
| processing_id | TEXT | null | the policy's processing participant code from the policy search (A1); the `x-hcx-recipient_code` of every exchange on the case, falling back to `payer_id` when the registry gave none. Not in the reference implementation's schema, which sent to `payer_id` [REF](../references/PAYERS.md#markers); add it |
| payer_id | TEXT | null | payer participant code, with or without the `@hcx` suffix (for example `<payer code>`); `x-hcx-recipient_code`, and picks the payer adapter (see [PAYERS.md](../references/PAYERS.md)) |
| payer_name | TEXT | null | payer name |
| product_id | TEXT | null | insurance product id |
| product_name | TEXT | null | insurance product name |
| policy_json | TEXT | null | JSON: the raw policy row as the search returned it |
| purpose | TEXT | null | last eligibility purpose: `validation`, `benefits`, `discovery` |
| txn_id | TEXT | null | [G9. Ledger](../gateway/G9-ledger.md) id of the outbound check |
| correlation_id | TEXT | null | `x-hcx-correlation_id` tying the check to its on_check |
| checked_at | TEXT | null | ISO timestamp the check was sent |
| error_message | TEXT | null | why the check failed; null otherwise |
| inforce | INTEGER | null | `1` policy in force, `0` not |
| outcome | TEXT | null | CoverageEligibilityResponse.outcome: `complete`, `error`, `partial` |
| disposition | TEXT | null | CoverageEligibilityResponse.disposition |
| auth_required | INTEGER | null | `1` / `0` from the last item's `authorizationRequired` |
| allowed_amount | REAL | null | sum insured: the wallet's `allowedMoney` (what is left) plus `usedMoney` [PAYER](../references/PAYERS.md#markers) |
| used_amount | REAL | null | the wallet's `usedMoney` |
| plan_name | TEXT | null | Coverage.class[0].name |
| plan_period_start | TEXT | null | Coverage.period.start |
| plan_period_end | TEXT | null | Coverage.period.end |
| relationship | TEXT | null | subscriber relationship (`self`, `child` and so on), display else code |
| patient_gender | TEXT | null | gender from the payer's Patient |
| patient_dob | TEXT | null | birth date from the payer's Patient |
| patient_address | TEXT | null | address lines, district, state and postal code joined with ", " |
| patient_photo | TEXT | null | base64 data or URL of the photo, from the search or the payer |
| response_json | TEXT | null | JSON: the full on_check bundle, for audit |
| patient_id | INTEGER | null | linked patient ([D3](D3-patient.md)) |
| encounter_id | INTEGER | null | linked IPD admission (D4 (in nhcx-preauth)) |
| admission_date | TEXT | null | `YYYY-MM-DD`; the check's `servicedDate` and the pre-auth period start |
| expected_discharge_date | TEXT | null | provisional discharge, `YYYY-MM-DD`; the pre-auth period end |
| case_type | TEXT | null | `package` or `nonpackage` |
| package_code | TEXT | null | package code when `case_type = 'package'` |
| package_name | TEXT | null | its name |
| preauth_total | REAL | null | package rate, lines' total, or sum of items |
| preauth_saved_at | TEXT | null | ISO timestamp the draft was last saved; set means the case has reached `preauth` / `draft` |
| stage | TEXT | null | `eligibility`, `preauth`, `enhancement`, `claim`, `payment`; migration only |
| sub_stage | TEXT | null | one of the sub-stages listed above; migration only |

#### D9K. KEYS AND INDEXES
- Primary key `id` (integer).
- `patient_id` references [D3. patient](D3-patient.md) `id`.
- `encounter_id` references D4. encounter (in nhcx-preauth) `id`.
- Referenced (`claim_id`, `ON DELETE CASCADE`) by D10 (in nhcx-preauth), D13 (in nhcx-coverage), [D16](D16-claim-line.md), [D17](D17-claim-form-answer.md), [D18](D18-claim-preauth.md), D19 (in nhcx-preauth), [D20](D20-claim-submission.md), [D21](D21-claim-payment.md), [D23](D23-claim-query.md), D24 (in nhcx-preauth), D25 (in nhcx-preauth), D26 (in nhcx-preauth), D27 (in nhcx-preauth), [D28](D28-claim-document.md), [D29](D29-claim-enquiry.md). D10 (in nhcx-preauth), D13 (in nhcx-coverage), [D18](D18-claim-preauth.md) and [D20](D20-claim-submission.md) allow one row per claim.
- Unique: `claim_no`.
- Index: `ix_claim_status (status, id DESC)`.

#### D9U. USED BY
- Screens: [S5. Claim Master](../screens/S5-claim-master.md), [S6. Claim Detail](../screens/S6-claim-detail.md), [S11. Claim Submission](../screens/S11-claim-submission.md)
- APIs: [A6. Task Submit (cancel, status, reprocess, release)](../apis/A6-task-submit.md), [A10. Transaction Related](../apis/A10-txn-related.md), [A11. Transaction Dispatch](../apis/A11-txn-dispatch.md), [A13. Transaction List](../apis/A13-txn-list.md), [A17. Claim State](../apis/A17-claim-state.md)
- Callbacks: [C1. Callback Door](../callbacks/C1-callback-door.md), [C8. Enquiry Reply](../callbacks/C8-enquiry-on-submit.md)
- FHIR: [F10. Task (claim actions)](../fhir/F10-task-claim-actions.md), [F15. Patient](../fhir/F15-patient.md), [F17. Organization](../fhir/F17-organization.md), [F18. Coverage](../fhir/F18-coverage.md)
- Database: [D1. organization](D1-organization.md), [D3. patient](D3-patient.md), [D16. claim_line](D16-claim-line.md), [D17. claim_form_answer](D17-claim-form-answer.md), [D18. claim_preauth](D18-claim-preauth.md), [D20. claim_submission](D20-claim-submission.md), [D21. claim_payment](D21-claim-payment.md), [D23. claim_query](D23-claim-query.md), [D28. claim_document](D28-claim-document.md), [D29. claim_enquiry](D29-claim-enquiry.md), [D30. counter](D30-counter.md)
