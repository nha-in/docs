# Screens

Each file has ROUTE (R), DESCRIPTION (D), LAYOUT (L) and ACTIONS (A) sections. DESCRIPTION and ACTIONS are required behaviour; LAYOUT is the reference implementation's arrangement [REF](../references/PAYERS.md#markers) and follows the target's own conventions. S13 to S16 are screens most HMIS already have: only their NHCX additions are built.

## Claims

| # | Screen | Route | File |
|---|---|---|---|
| [S4](S4-claim-creation-form.md) | Claim Creation Form | `claims/view/:caseid/validate`, `claims/view/:caseid/preauth` | [S4-claim-creation-form.md](S4-claim-creation-form.md) |
| [S5](S5-claim-master.md) | Claim Master | `claims/list` | [S5-claim-master.md](S5-claim-master.md) |
| [S6](S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | [S6-claim-detail.md](S6-claim-detail.md) |
| [S7](S7-insurance-plan.md) | Insurance Plan | `claims/view/:caseid/plan` | [S7-insurance-plan.md](S7-insurance-plan.md) |
| [S8](S8-line-items.md) | Line Items | `claims/view/:caseid/lines` | [S8-line-items.md](S8-line-items.md) |
| [S9](S9-preauthorisation.md) | Pre-authorisation | `claims/view/:caseid/preauth` | [S9-preauthorisation.md](S9-preauthorisation.md) |

## Patient

| # | Screen | Route | File |
|---|---|---|---|
| [S13](S13-patient-list.md) | Patient List | `patients/list` | [S13-patient-list.md](S13-patient-list.md) |
| [S14](S14-patient-registration-form.md) | Patient Registration Form | `patients/new`, `patients/edit/:id` | [S14-patient-registration-form.md](S14-patient-registration-form.md) |
| [S15](S15-patient-detail.md) | Patient Detail | `patients/view/:id` | [S15-patient-detail.md](S15-patient-detail.md) |

## Practitioner

| # | Screen | Route | File |
|---|---|---|---|
| [S16](S16-practitioner-master.md) | Practitioner Master | `practitioners/list` | [S16-practitioner-master.md](S16-practitioner-master.md) |

## Flow

S5 Claim Master, then S1 Search Policy and S2 Select Policy, then S6 Claim Detail. The tabs of S6 run in episode order: S3 Eligibility, S7 Insurance plan, S8 Line items, S8.2 Validate (auth requirements), S4 and S9 Pre-authorisation, S10 Communication, S11 Claim, S12 Payments. S4 links the case to an admission found through S13 and S15, and picks the treating team from S16. Screens this skill does not hold are specified in the skill named beside them.
