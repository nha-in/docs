# Database

Every table behind the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../database/](../database/INDEX.md), which gives the columns, keys and indexes. D1 to D8 are tables most HMIS already have (extended where NHCX needs a field); D9 to D30 are new for claims.

## Master and clinical data

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D1](../database/D1-organization.md) | organization | The healthcare facility this installation represents. | none | [A12](../apis/A12-txn-fhir.md), [A14](../apis/A14-adjudicator-user-role.md), [A15](../apis/A15-adjudicator-process-case.md), [A16](../apis/A16-gateway-token.md) | none | [F17](../fhir/F17-organization.md), [F19](../fhir/F19-other-resources.md) |
| [D2](../database/D2-practitioner.md) | practitioner | Doctor or staff member of the facility. | none | none | none | [F8](../fhir/F8-claim.md), [F16](../fhir/F16-practitioner.md) |
| [D3](../database/D3-patient.md) | patient | Registered patient. | none | none | none | [F15](../fhir/F15-patient.md) |

## Claim

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D9](../database/D9-claim.md) | claim | Claim episode (case) around one selected policy, from eligibility to payment. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S11](../screens/S11-claim-submission.md) | [A5](../apis/A5-claim-submit.md), [A6](../apis/A6-task-submit.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A14](../apis/A14-adjudicator-user-role.md), [A15](../apis/A15-adjudicator-process-case.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C6](../callbacks/C6-claim-on-submit.md), [C8](../callbacks/C8-enquiry-on-submit.md) | [F8](../fhir/F8-claim.md), [F10](../fhir/F10-task-claim-actions.md), [F15](../fhir/F15-patient.md), [F17](../fhir/F17-organization.md), [F18](../fhir/F18-coverage.md), [F19](../fhir/F19-other-resources.md) |

## Package master and ruling

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D11](../database/D11-claim-plan-benefit.md) | claim_plan_benefit | Package (or covered benefit) in a claim's package master. | [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | none | [F8](../fhir/F8-claim.md) |
| [D12](../database/D12-claim-plan-form.md) | claim_plan_form | Payer questionnaire (dynamic form) shipped with a claim's package master. | [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | none | [F7](../fhir/F7-questionnaireresponse.md) |
| [D15](../database/D15-claim-auth-requirement.md) | claim_auth_requirement | Document or form the payer's ruling says the procedure set must be accompanied by. | [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | none | none |

## Pre-authorisation draft

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D16](../database/D16-claim-line.md) | claim_line | Line the pre-authorisation quotes from the payer's package master: a procedure, an implant or a ward / ICU stratification tier. Primary key `id`. Parent table: `claim` (D9). | [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | none | [F8](../fhir/F8-claim.md), [F19](../fhir/F19-other-resources.md) |
| [D17](../database/D17-claim-form-answer.md) | claim_form_answer | The answer to one question of one payer form (questionnaire) on one claim. Primary key `id`. Parent table: `claim` (D9); the form itself is a `claim_plan_form` row (D12) matched by `form_url`, not by a foreign key. | [S11](../screens/S11-claim-submission.md) | none | none | [F7](../fhir/F7-questionnaireresponse.md) |

## Legs and verdicts

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D18](../database/D18-claim-preauth.md) | claim_preauth | The pre-authorisation leg of one claim: the last send (first request, query answer, enhancement), the payer's verdict on it and any cancellation. Primary key `id`. Parent table: `claim` (D9), one row per claim. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md) | [A6](../apis/A6-task-submit.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A12](../apis/A12-txn-fhir.md), [A13](../apis/A13-txn-list.md), [A14](../apis/A14-adjudicator-user-role.md), [A15](../apis/A15-adjudicator-process-case.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) | [F8](../fhir/F8-claim.md), [F9](../fhir/F9-claimresponse.md), [F10](../fhir/F10-task-claim-actions.md) |
| [D20](../database/D20-claim-submission.md) | claim_submission | The claim leg of one claim episode: how the stay ended, the last claim send and the payer's verdict on it. Primary key `id`. Parent table: `claim` (D9), one row per claim. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S11](../screens/S11-claim-submission.md) | [A5](../apis/A5-claim-submit.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A12](../apis/A12-txn-fhir.md), [A13](../apis/A13-txn-list.md), [A14](../apis/A14-adjudicator-user-role.md), [A15](../apis/A15-adjudicator-process-case.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C6](../callbacks/C6-claim-on-submit.md), [C8](../callbacks/C8-enquiry-on-submit.md) | [F8](../fhir/F8-claim.md), [F9](../fhir/F9-claimresponse.md), [F10](../fhir/F10-task-claim-actions.md), [F19](../fhir/F19-other-resources.md) |

## Payer messages and payments

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D21](../database/D21-claim-payment.md) | claim_payment | Payment the payer notified on a claim (a PaymentNotice), with the acknowledgement sent back for it. Primary key `id`. Parent table: `claim` (D9), many rows per claim; children in `claim_payment_detail` (D22). | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) | none |
| [D23](../database/D23-claim-query.md) | claim_query | Message the payer started on a claim over the communication route: a query for the desk to answer, a notification to acknowledge, or a note to read. Primary key `id`. Parent table: `claim` (D9), many rows per claim. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) | none |
| [D24](../database/D24-claim-adjudication.md) | claim_adjudication | Decision step taken from the application's adjudicator desk on a case this application raised: one role, one action, one call to the payer's desk. Primary key `id`. Parent table: `claim` (D9), many rows per claim. | none | [A15](../apis/A15-adjudicator-process-case.md) | [C1](../callbacks/C1-callback-door.md) | none |

## Draft details, documents and enquiries

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D28](../database/D28-claim-document.md) | claim_document | Supporting file (PDF or image) attached to a claim for one leg, stored inline with the payer requirement it answers. Primary key `id`. Parent table: `claim` (D9). | [S11](../screens/S11-claim-submission.md) | [A17](../apis/A17-claim-state.md) | none | [F7](../fhir/F7-questionnaireresponse.md), [F8](../fhir/F8-claim.md), [F10](../fhir/F10-task-claim-actions.md) |
| [D29](../database/D29-claim-enquiry.md) | claim_enquiry | Small Task exchange a claim starts beside its main legs: a status enquiry, a reprocess request or a balance release request. Primary key `id`. Parent table: `claim` (D9), many rows per claim. | [S6](../screens/S6-claim-detail.md), [S11](../screens/S11-claim-submission.md) | [A6](../apis/A6-task-submit.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C8](../callbacks/C8-enquiry-on-submit.md) | [F10](../fhir/F10-task-claim-actions.md) |

## Numbering

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D30](../database/D30-counter.md) | counter | Named number series and the last value handed out from it. Primary key `name`. No parent table. | none | none | none | none |
