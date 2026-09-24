# Database

Every table behind the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../database/](../database/INDEX.md), which gives the columns, keys and indexes. D1 to D8 are tables most HMIS already have (extended where NHCX needs a field); D9 to D30 are new for claims.

## Master and clinical data

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D1](../database/D1-organization.md) | organization | The healthcare facility this installation represents. | none | [A12](../apis/A12-txn-fhir.md) | none | [F2](../fhir/F2-coverage-eligibility-request.md), [F17](../fhir/F17-organization.md), [F19](../fhir/F19-other-resources.md) |
| [D2](../database/D2-practitioner.md) | practitioner | Doctor or staff member of the facility. | none | none | none | [F16](../fhir/F16-practitioner.md) |
| [D3](../database/D3-patient.md) | patient | Registered patient. | none | none | none | [F15](../fhir/F15-patient.md) |

## Claim

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D9](../database/D9-claim.md) | claim | Claim episode (case) around one selected policy, from eligibility to payment. | [S2](../screens/S2-select-policy.md), [S3](../screens/S3-policy-discovery.md), [S5](../screens/S5-claim-master.md), [S6](../screens/S6-claim-detail.md) | [A1](../apis/A1-policy-search.md), [A2](../apis/A2-coverage-eligibility-check.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md), [C2](../callbacks/C2-coverage-eligibility-on-check.md) | [F2](../fhir/F2-coverage-eligibility-request.md), [F3](../fhir/F3-coverage-eligibility-response.md), [F15](../fhir/F15-patient.md), [F17](../fhir/F17-organization.md), [F18](../fhir/F18-coverage.md), [F19](../fhir/F19-other-resources.md) |

## Package master and ruling

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D13](../database/D13-claim-auth.md) | claim_auth | The payer's authorisation-requirements ruling on a claim's procedure set. | [S6](../screens/S6-claim-detail.md) | [A2](../apis/A2-coverage-eligibility-check.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A13](../apis/A13-txn-list.md), [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) | [F3](../fhir/F3-coverage-eligibility-response.md) |
| [D14](../database/D14-claim-auth-item.md) | claim_auth_item | The payer's ruling on one line of the procedure set. | none | [A2](../apis/A2-coverage-eligibility-check.md) | none | [F3](../fhir/F3-coverage-eligibility-response.md) |
| [D15](../database/D15-claim-auth-requirement.md) | claim_auth_requirement | Document or form the payer's ruling says the procedure set must be accompanied by. | none | [A2](../apis/A2-coverage-eligibility-check.md), [A17](../apis/A17-claim-state.md) | none | [F3](../fhir/F3-coverage-eligibility-response.md) |

## Numbering

| # | Table | What one row is | Screens | APIs | Callbacks | FHIR |
|---|---|---|---|---|---|---|
| [D30](../database/D30-counter.md) | counter | Named number series and the last value handed out from it. Primary key `name`. No parent table. | [S2](../screens/S2-select-policy.md) | none | none | none |
