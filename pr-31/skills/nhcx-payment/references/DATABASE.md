# Database

Every table behind the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../database/](../database/INDEX.md), which gives the columns, keys and indexes. D1 to D8 are tables most HMIS already have (extended where NHCX needs a field); D9 to D30 are new for claims.

## Master and clinical data

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D1](../database/D1-organization.md) | organization | The healthcare facility this installation represents. | none | [A12](../apis/A12-txn-fhir.md) | none | [F14](../fhir/F14-payment-acknowledgement.md), [F17](../fhir/F17-organization.md) |
| [D2](../database/D2-practitioner.md) | practitioner | Doctor or staff member of the facility. | none | none | none | [F16](../fhir/F16-practitioner.md) |
| [D3](../database/D3-patient.md) | patient | Registered patient. | none | none | none | [F15](../fhir/F15-patient.md) |

## Claim

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D9](../database/D9-claim.md) | claim | Claim episode (case) around one selected policy, from eligibility to payment. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S12](../screens/S12-payments.md) | [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C10](../callbacks/C10-paymentnotice-request.md) | [F13](../fhir/F13-paymentnotice.md), [F14](../fhir/F14-payment-acknowledgement.md), [F15](../fhir/F15-patient.md), [F17](../fhir/F17-organization.md), [F18](../fhir/F18-coverage.md) |

## Legs and verdicts

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D20](../database/D20-claim-submission.md) | claim_submission | The claim leg of one claim episode: how the stay ended, the last claim send and the payer's verdict on it. Primary key `id`. Parent table: `claim` (D9), one row per claim. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S12](../screens/S12-payments.md) | [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A12](../apis/A12-txn-fhir.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C10](../callbacks/C10-paymentnotice-request.md) | [F13](../fhir/F13-paymentnotice.md) |

## Payer messages and payments

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D21](../database/D21-claim-payment.md) | claim_payment | Payment the payer notified on a claim (a PaymentNotice), with the acknowledgement sent back for it. Primary key `id`. Parent table: `claim` (D9), many rows per claim; children in `claim_payment_detail` (D22). | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S12](../screens/S12-payments.md) | [A8](../apis/A8-paymentnotice-on-request.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C10](../callbacks/C10-paymentnotice-request.md) | [F13](../fhir/F13-paymentnotice.md), [F14](../fhir/F14-payment-acknowledgement.md) |
| [D22](../database/D22-claim-payment-detail.md) | claim_payment_detail | Line of a payment notice's reconciliation breakdown: an amount paid or withheld. Primary key `id`. Parent table: `claim_payment` (D21). | [S12](../screens/S12-payments.md) | none | [C10](../callbacks/C10-paymentnotice-request.md) | [F13](../fhir/F13-paymentnotice.md) |

## Numbering

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D30](../database/D30-counter.md) | counter | Named number series and the last value handed out from it. Primary key `name`. No parent table. | none | none | none | none |
