# S5. Claim Master Screen

#### S5R. ROUTE
claims (the Claim dashboard)
claims/list?stage=<stage>&sub_stage=<sub-stage>&status=<status>[&patient=<id>] (Claim management, the claim list)

`patient` narrows the list to one patient's cases; the patient master's "Claims" shortcut (S13. Patient List (in nhcx-coverage), S15. Patient Detail (in nhcx-coverage)) opens the list this way, and the card title then reads "<n> claim(s) for <patient name>".

| Endpoint | Purpose |
|---|---|
| `GET claims/dashboard?period=day\|week\|month\|year&date=YYYY-MM-DD` | The dashboard's counts and money for the period |
| `GET claims?stage=&sub_stage=&status=&search=&patient=` | The list |

Page titles: Claim dashboard, Claim management. The Claims item of the navigation opens as one module with these two screens under it.

#### S5D. DESCRIPTION
**One module, two screens.** *Claim dashboard* says where the facility's cases stand; *Claim management* is the ledger of cases, where a claim is opened (the stepper, S1. Search Policy (in nhcx-coverage)) and an existing one found ([S6. Claim Detail](S6-claim-detail.md)). Discovery (S17. Beneficiary Discovery (in nhcx-coverage)) has no entry of its own: it is reached from "None of these" on S2. Select Policy (in nhcx-coverage) and from the Eligibility tab. Neither screen makes an NHCX call: the stage of each case is updated whenever a leg moves (a payer answer lands, a send goes out, a case is opened on S6), so both are current without anyone opening a case. This is the shape of the live PMJAY provider's home and claim list [REF](../references/PAYERS.md#markers).

**Claim dashboard.** A period selector in the header, Day / Week / Month / Year with the day, month or year picked (default: this month), filtering by the date the case was opened. Then, in rows of tiles, each tile a count that opens the list filtered the same way:

| Row | Tiles |
|---|---|
| Where the cases are | Draft (stage `eligibility`), Pre-authorisation (`preauth` and `enhancement`), Claim (`claim`), Paid (`payment`) |
| Pre-authorisation | Submitted (`requested`, `resubmitted`, `answered`), Queried, Approved (`approved`, `partial`), Rejected |
| Claim | Submitted, Queried, Approved, Rejected, the same way |
| Needs attention | Open cases (not paid), Queried awaiting reply (both legs), Rejected (both legs), Errored (`refused`) |
| Money | In process: the pre-authorisation totals reserved on cases still being worked (D9 `preauth_total` on `preauth`, `enhancement`, `claim`); Awaiting: the amount claimed and with the payer (D20 `submitted_amount` on `submitting` and `queried` claims); Paid: what the payer has cleared (D21, the paid total). Shown as `₹` compact (`₹1.25 Cr`, `₹3.5 L`, `₹12,500`) |

Under the tiles, two charts drawn to scale: cases by stage in the period, and new cases per day. A button "Open the claim list" goes to Claim management. Empty period: every tile reads 0 and the charts say "No cases opened in this period."

**Claim management.** The ledger, newest first (by case id, descending), with "New claim" (the stepper, S1) in the header. Above the table a row of quick tabs, each with its count: All, Draft (stage `eligibility`), Pre-authorisation (`preauth`, `enhancement`), Queried (sub-stage `queried`, any stage), Claim (`claim`), Rejected (sub-stage `rejected`, any stage), Paid (`payment`); then the status filter and a search box (case number, member id, name, policy code, ABHA). The tabs and filters are GET parameters, so a view can be bookmarked.

Table columns:

| Column header | Content |
|---|---|
| Claim | the case number as a link to S6 |
| Beneficiary | beneficiary name, or "Unknown", over the member ID (muted) |
| Policy | product name, else plan name, else "-", over the policy code (muted) |
| Payer | payer name, or "-" |
| Balance | wallet balance: sum insured minus utilised from the last eligibility verdict, as "₹" with thousands separators and no decimals; "-" when the payer has not reported a wallet |
| Stage | the stage chip (below); empty until the case has a stage |
| Status | the eligibility status chip (below) |
| Opened | the date the case was opened, `YYYY-MM-DD` |
| Amount | the pre-authorisation total quoted on the case (D9 `preauth_total`), `₹` with thousands separators; "-" until lines are quoted |

**Status chip and filter.** Status is the result of the coverage eligibility check (S3), not the whole case. Values:

| Value | Chip label | Tone |
|---|---|---|
| `draft` | Draft | warning |
| `checking` | Awaiting payer | info |
| `eligible` | Eligible | success |
| `not-eligible` | Not eligible | danger |
| `error` | Error | danger |

The filter dropdown lists these labels in this order, with a blank first option "All claims". The filter is a GET form, so a filtered list can be bookmarked. An unknown `status` value in the URL is ignored and shows all claims.

**Stage chip.** Where the case stands, as "<Stage>: <Sub-stage>", for example "Pre-authorisation: Approved". The chip's tone comes from the sub-stage.

Stages (the leg the case is on, in the order a case walks them):

| Value | Label |
|---|---|
| `eligibility` | Eligibility |
| `preauth` | Pre-authorisation |
| `enhancement` | Enhancement |
| `claim` | Claim |
| `payment` | Payment |

Sub-stages (what was last done with that leg):

| Value | Label | Tone |
|---|---|---|
| `draft` | Drafted | warning |
| `checking` | Checking | info |
| `eligible` | In force | success |
| `not-eligible` | Not covered | danger |
| `requested` | Requested | info |
| `resubmitted` | Resubmitted | info |
| `answered` | Query answered | info |
| `queried` | Queried | warning |
| `approved` | Approved | success |
| `partial` | Partially approved | warning |
| `rejected` | Rejected | danger |
| `cancelling` | Withdrawing | warning |
| `cancelled` | Withdrawn | danger |
| `refused` | Refused at the door | danger |
| `noticed` | Notice received | info |
| `paid` | Paid | success |

How the pair is worked out (read off the legs, never typed in):
- Any payment notice on the case: `payment`, with `paid` when money has settled, else `noticed`.
- Else a claim that has been sent (not a draft): `claim`, with the claim leg's sub-stage.
- Else a pre-authorisation that has been sent: `preauth`, or `enhancement` when the last send was an enhancement, with that leg's sub-stage.
- Else a saved but unsent pre-authorisation: `preauth` / `draft`.
- Else `eligibility`, with the eligibility status as the sub-stage (`error` shows as `draft`).
- A leg's sub-stage is its own status. A send still in flight reads by what it went out as: `requested` for a first send, `resubmitted` for a resubmission, `answered` for a query response. A leg in error reads `refused`.
- A payer query that is still unanswered turns a leg that is with the payer (`requested`, `answered`, `resubmitted`) into `queried`.

Data: [D9. claim](../database/D9-claim.md)

Data: D18. claim_preauth (in nhcx-preauth)

Data: [D20. claim_submission](../database/D20-claim-submission.md)

Data: [D21. claim_payment](../database/D21-claim-payment.md)

Data: D23. claim_query (in nhcx-preauth)

**Empty state.** With no rows (none at all, or none matching the filter) the table is replaced by the muted line "No claims yet. Start from a policy search."

The former intro card ("An NHCX claim episode starts from the beneficiary's policy...") is gone from the list; the dashboard is the module's front page.

#### S5L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the fields, options, columns, statuses, messages and actions.


```
Claim dashboard:
|------------------------------------------------------------------------------|
| Claim dashboard                     [Day][Week][Month][Year]  [October 2026] |
|------------------------------------------------------------------------------|
| [Draft 4] [Pre-authorisation 19] [Claim 24] [Paid 45]                        |
| Pre-auth: [Submitted 7] [Queried 2] [Approved 9] [Rejected 1]                |
| Claim:    [Submitted 6] [Queried 1] [Approved 15] [Rejected 2]               |
| Attention: [Open 47] [Queried 3] [Rejected 3] [Errored 0]                    |
| Money: [In process ₹18.4 L] [Awaiting ₹9.2 L] [Paid ₹31.0 L]                 |
| [cases by stage ▇▇▇▇]   [new cases per day ▁▂▃▅▂▁]   [Open the claim list]  |
|------------------------------------------------------------------------------|

Claim management:
|------------------------------------------------------------------------------|
| Claim management                                           [(+) New claim]   |
| [All 92] [Draft 4] [Pre-authorisation 19] [Queried 3] [Claim 24] [Rejected 3] [Paid 45] |
|------------------------------------------------------------------------------|
| [Card] 3 claim(s)          [All claims       v] [Filter]  [search ______]    |
|------------------------------------------------------------------------------|
| Claim       | Beneficiary | Policy       | Payer    | Balance | Stage              | Status   | Opened     | Amount   |
|-------------|-------------|--------------|----------|---------|--------------------|----------|------------|----------|
| NM-26-0SE.. | Asha Devi   | PMJAY for HP | Nhcx     | ₹194,049| [Pre-authorisation:| [Eligible]| 2026-09-10| ₹45,000  |
|  (link)     | MD5SLS4X5   | PMJAY/HP/S/G | Pmjay    |         |  Approved]         |          |            |          |
| NM-26-0SE.. | Unknown     | PMJAY for HP | Nhcx     | -       |                    | [Draft]  | 2026-09-10 | -        |
|             | MD9XK2...   | PMJAY/HP/S/G | Pmjay    |         |                    |          |            |          |
|------------------------------------------------------------------------------|
```

- The table card title counts the rows shown: "<n> claim(s)".
- The card header's right side holds the filter form (status dropdown and a primary "Filter" button) and then the primary "New claim" button with a plus icon.
- The table scrolls sideways on narrow screens; the header items wrap.
- Chips are small coloured labels. Two-line cells show a main value over a muted line.

#### S5A. ACTIONS
1. New claim (Claim management header): open the stepper at its first step, the Search Policy screen S1.
1a. A dashboard tile, or "Open the claim list": go to Claim management with the tile's stage or sub-stage as the filter.
1b. Period (Day / Week / Month / Year and the picked date): reload the dashboard with `?period=&date=`.
1c. Quick tab: reload the list with `?stage=` or `?sub_stage=`.
2. Claim number link: open the case on the Claim Detail screen S6, which lands on its first tab, Eligibility (S3).
3. Filter: reload this screen with `?status=<value>`, or all claims when "All claims" is chosen.
