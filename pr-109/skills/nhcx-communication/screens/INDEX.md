# Screens

Each file has ROUTE (R), DESCRIPTION (D), LAYOUT (L) and ACTIONS (A) sections. DESCRIPTION and ACTIONS are required behaviour; LAYOUT is the reference implementation's arrangement [REF](../references/PAYERS.md#markers) and follows the target's own conventions. S13 to S16 are screens most HMIS already have: only their NHCX additions are built.

## Claims

| # | Screen | Route | File |
|---|---|---|---|
| [S5](S5-claim-master.md) | Claim Master | `claims/list` | [S5-claim-master.md](S5-claim-master.md) |
| [S6](S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | [S6-claim-detail.md](S6-claim-detail.md) |
| [S10](S10-communication.md) | Communication | `claims/view/:caseid/communication` | [S10-communication.md](S10-communication.md) |

## Flow

S5 Claim Master, then S1 Search Policy and S2 Select Policy, then S6 Claim Detail. The tabs of S6 run in episode order: S3 Eligibility, S7 Insurance plan, S8 Line items, S8.2 Validate (auth requirements), S4 and S9 Pre-authorisation, S10 Communication, S11 Claim, S12 Payments. S4 links the case to an admission found through S13 and S15, and picks the treating team from S16. Screens this skill does not hold are specified in the skill named beside them.
