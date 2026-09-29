# Database

The tables behind the claim, patient and practitioner screens. Screens (S), APIs (A) and callbacks (C) refer to these by D number. Each file has TABLE (T), DESCRIPTION (D), COLUMNS (C), KEYS AND INDEXES (K) and USED BY (U) sections.

## Master and clinical data

| # | Table | What one row is | File |
|---|---|---|---|
| [D1](D1-organization.md) | organization | The healthcare facility this installation represents. | [D1-organization.md](D1-organization.md) |
| [D2](D2-practitioner.md) | practitioner | Doctor or staff member of the facility. | [D2-practitioner.md](D2-practitioner.md) |
| [D3](D3-patient.md) | patient | Registered patient. | [D3-patient.md](D3-patient.md) |

## Claim

| # | Table | What one row is | File |
|---|---|---|---|
| [D9](D9-claim.md) | claim | Claim episode (case) around one selected policy, from eligibility to payment. | [D9-claim.md](D9-claim.md) |

## Package master and ruling

| # | Table | What one row is | File |
|---|---|---|---|
| [D13](D13-claim-auth.md) | claim_auth | The payer's authorisation-requirements ruling on a claim's procedure set. | [D13-claim-auth.md](D13-claim-auth.md) |
| [D14](D14-claim-auth-item.md) | claim_auth_item | The payer's ruling on one line of the procedure set. | [D14-claim-auth-item.md](D14-claim-auth-item.md) |
| [D15](D15-claim-auth-requirement.md) | claim_auth_requirement | Document or form the payer's ruling says the procedure set must be accompanied by. | [D15-claim-auth-requirement.md](D15-claim-auth-requirement.md) |

## Numbering

| # | Table | What one row is | File |
|---|---|---|---|
| [D30](D30-counter.md) | counter | Named number series and the last value handed out from it. Primary key `name`. No parent table. | [D30-counter.md](D30-counter.md) |
