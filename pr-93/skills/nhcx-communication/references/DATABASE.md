# Database

Every table behind the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../database/](../database/INDEX.md), which gives the columns, keys and indexes. D1 to D8 are tables most HMIS already have (extended where NHCX needs a field); D9 to D30 are new for claims.

## Master and clinical data

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D1](../database/D1-organization.md) | organization | The healthcare facility this installation represents. | none | [A12](../apis/A12-txn-fhir.md) | none | [F17](../fhir/F17-organization.md) |
| [D2](../database/D2-practitioner.md) | practitioner | Doctor or staff member of the facility. | none | none | none | [F8](../fhir/F8-claim.md), [F16](../fhir/F16-practitioner.md) |
| [D3](../database/D3-patient.md) | patient | Registered patient. | none | none | none | [F15](../fhir/F15-patient.md) |

## Claim

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D9](../database/D9-claim.md) | claim | Claim episode (case) around one selected policy, from eligibility to payment. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S10](../screens/S10-communication.md) | [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C9](../callbacks/C9-communication-request.md) | [F8](../fhir/F8-claim.md), [F10](../fhir/F10-task-claim-actions.md), [F11](../fhir/F11-communicationrequest.md), [F12](../fhir/F12-communication.md), [F15](../fhir/F15-patient.md), [F17](../fhir/F17-organization.md), [F18](../fhir/F18-coverage.md) |

## Package master and ruling

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D15](../database/D15-claim-auth-requirement.md) | claim_auth_requirement | Document or form the payer's ruling says the procedure set must be accompanied by. | [S10](../screens/S10-communication.md) | [A17](../apis/A17-claim-state.md) | none | none |

## Payer messages and payments

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D23](../database/D23-claim-query.md) | claim_query | Message the payer started on a claim over the communication route: a query for the desk to answer, a notification to acknowledge, or a note to read. Primary key `id`. Parent table: `claim` (D9), many rows per claim. | [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md), [S10](../screens/S10-communication.md) | [A7](../apis/A7-communication-on-request.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C9](../callbacks/C9-communication-request.md) | [F11](../fhir/F11-communicationrequest.md), [F12](../fhir/F12-communication.md) |

## Draft details, documents and enquiries

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D28](../database/D28-claim-document.md) | claim_document | Supporting file (PDF or image) attached to a claim for one leg, stored inline with the payer requirement it answers. Primary key `id`. Parent table: `claim` (D9). | [S10](../screens/S10-communication.md) | [A7](../apis/A7-communication-on-request.md), [A17](../apis/A17-claim-state.md) | none | [F8](../fhir/F8-claim.md), [F10](../fhir/F10-task-claim-actions.md), [F12](../fhir/F12-communication.md) |

## Numbering

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D30](../database/D30-counter.md) | counter | Named number series and the last value handed out from it. Primary key `name`. No parent table. | none | none | none | none |
