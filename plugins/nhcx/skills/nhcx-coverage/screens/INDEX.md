# Screens

Each file has ROUTE (R), DESCRIPTION (D), LAYOUT (L) and ACTIONS (A) sections. DESCRIPTION and ACTIONS are required behaviour; LAYOUT is the reference implementation's arrangement [REF](../references/PAYERS.md#markers) and follows the target's own conventions. S13 to S16 are screens most HMIS already have: only their NHCX additions are built, and the ABHA additions are left out when the HMIS's ABDM module already has them ([SCAFFOLDING 4a](../references/SCAFFOLDING.md)). S19 is the facility's NHCX settings, the one screen an administrator needs to onboard the facility and rotate its key without a developer.

## Claims

| # | Screen | Route | File |
|---|---|---|---|
| [S1](S1-search-policy.md) | Search Policy | `claims/search` | [S1-search-policy.md](S1-search-policy.md) |
| [S2](S2-select-policy.md) | Select Policy | `claims/search/results` | [S2-select-policy.md](S2-select-policy.md) |
| [S3](S3-policy-discovery.md) | Policy Discovery | `claims/view/:caseid/eligibility` | [S3-policy-discovery.md](S3-policy-discovery.md) |
| [S5](S5-claim-master.md) | Claim Master | `claims`, `claims/list` | [S5-claim-master.md](S5-claim-master.md) |
| [S6](S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | [S6-claim-detail.md](S6-claim-detail.md) |
| [S17](S17-beneficiary-discovery.md) | Beneficiary Discovery | `claims/discovery` | [S17-beneficiary-discovery.md](S17-beneficiary-discovery.md) |
| [S18](S18-beneficiary-verification.md) | Beneficiary Verification | `claims/view/:caseid/verification` | [S18-beneficiary-verification.md](S18-beneficiary-verification.md) |

## Patient

| # | Screen | Route | File |
|---|---|---|---|
| [S13](S13-patient-list.md) | Patient List | `patients/list` | [S13-patient-list.md](S13-patient-list.md) |
| [S14](S14-patient-registration-form.md) | Patient Registration Form | `patients/new`, `patients/edit/:id` | [S14-patient-registration-form.md](S14-patient-registration-form.md) |
| [S15](S15-patient-detail.md) | Patient Detail | `patients/view/:id` | [S15-patient-detail.md](S15-patient-detail.md) |

## Facility

| # | Screen | Route | File |
|---|---|---|---|
| [S19](S19-nhcx-settings.md) | NHCX Settings | `settings/nhcx` | [S19-nhcx-settings.md](S19-nhcx-settings.md) |

## Flow

The Claims module has two entries, the Claim dashboard (S5) and Claim management, a stepper of S1 Search Policy (steps Patient and Search policy, shaped by the two S19 settings), S2 Select Policy (with "None of these" to S17) and then S6 Claim Detail. The tabs of S6 run in episode order: S3 Eligibility, S7 Insurance plan, S8 Line items (with the optional benefits check and the S8.2 auth-requirements ruling under the lines; there is no Validate tab), S18 Verification, S4 and S9 Pre-authorisation, S10 Communication, S11 Discharge and Claim (two tabs, one screen spec; a Discharge intimation tab when the integration asks for it), S12 Payments. The questions the integration must settle before building, and where each answer lands, are L1.A in [L1 Discovery](../steps/L1-discovery.md). S4 links the case to an admission found through S13 and S15, and picks the treating team from S16. Screens this skill does not hold are specified in the skill named beside them.
