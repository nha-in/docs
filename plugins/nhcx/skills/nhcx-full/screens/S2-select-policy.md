# S2. Select Policy Screen

#### S2R. ROUTE
claims/search/results?id_type=<type>&id_value=<value>[&patient=<id>]

Breadcrumb: Claims (claims/list, S5) > Claim management > Select policy

Select posts to: claims (POST), then redirects to claims/view/:caseid (S6).

#### S2D. DESCRIPTION
Step 3 of the Claim Management stepper (the stepper row shows "Select policy" as the current step). It lists every policy the Beneficiary Identification System (BIS) returned for the identifier searched on S1, and lets the operator pick one. Picking a policy opens a new claim (a case) around it and lands on the Claim Detail screen S6.

The search card from S1 stays at the top of this screen, pre-filled with the identifier type and value (and, with a patient carried, the changed-value marker when the value differs from the record), so the operator can correct the identifier and search again without going back. The results card sits below it.

**None of these.** The results card's header always carries a secondary button to the discovery page [S17. Beneficiary Discovery](S17-beneficiary-discovery.md), whatever the registry answered: "Discover with a payer" when no policy came back, "None of these? Discover with a payer" when some did. The registry lists only the policies linked to the identifier; a beneficiary whose cover is not linked yet, or whose card carries another identifier, is still found by asking the payer directly. The button carries the identifier and the patient to S17, which lists every payer on the exchange from the participant master ([D32. participant](../database/D32-participant.md)), government and private in one list.

API: [A1. Policy Search](../apis/A1-policy-search.md)

Results table columns:

| Column header | Main line | Muted sub-line |
|---|---|---|
| Member ID | `member_id`, or "-" | |
| Product / policy | `product_name`, or "-" | `policy_code`, else `product_id` |
| Payer | the payer's registered name from the participant registry (`payer_name`, G4, cached), else the code | `payer_id` |
| ABHA | `abha_number`, or "-" | |
| Mobile | `mobile_number`, or "-" | |
| (blank header) | Select button | |

The table shows no beneficiary name and never a placeholder such as "Unknown": the registry returns no name at this stage [SANDBOX](../references/PAYERS.md#markers), and a name it did return is not yet verified. The name, gender, date of birth, address and ABHA arrive with the payer's eligibility reply and are shown on S3 once the desk has confirmed the beneficiary. The row's `name`, when any, is still kept on the opened case (D9) for S3 to compare against.

The card title counts the rows: "1 policy found", or "N policies found" for any other count (including "0 policies found"). The "None of these" button sits at the title's right.

Select sends the whole normalised policy back to the server as a JSON string, with the search identifier:

```
POST claims
id_type=MemberId
id_value=<the searched value>
patient=<patient id, when the search was started from the patient master>
policy={"member_id": "MD5SLS4X5", "name": null, "policy_code": "PMJAY/HP/S/G",
        "payer_id": "<payer code>", "payer_name": "<registry name, or null>",
        "product_id": "PMJAY/HP/S/G", "product_name": "PMJAY for Himachal",
        "abha_number": "91703412374240", "mobile_number": "", "photo": null,
        "raw": { ...the BIS row... }}
```

Opening the claim makes no NHCX call. It saves a new draft claim (status Draft) around the chosen policy and the search identifier (shown on S3 as "Found by"), with D9 `patient_id` set when a `patient` was carried from the patient master ([S13. Patient List](S13-patient-list.md), [S15. Patient Detail](S15-patient-detail.md)). That carried patient is where the search started, not a confirmed link: the admission is linked on S4 by the desk, after the payer's reply has said who the beneficiary is, and the carried patient is cleared there when it is not that person. The case number takes the form `NM-<yy>-<mmdd><serial>`, month-day and serial in base32, so numbers sort by date and then issue order [REF](../references/PAYERS.md#markers). The payer name is the registry's (G4), looked up by the payer id and cached; it never falls back to a configured label, the adapter's name or a default name, and a payer whose lookup failed is shown by its code.

Data: [D9. claim](../database/D9-claim.md)

Data: [D30. counter](../database/D30-counter.md)

Rules:
- A policy without a member ID cannot open a claim. The server refuses with "That policy has no member ID; a claim cannot be raised without one." and returns to the search screen with that message as a red flash.
- An unreadable `policy` field is treated as an empty policy, which fails the same member ID rule.
- Selecting the same policy twice opens two separate claims. There is no duplicate check at this step.
- On success the flash reads "Claim <number> opened."

#### S2L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the fields, options, columns, statuses, messages and actions.


```
|------------------------------------------------------------------|
| Claims > Claim management > Select policy                        |
| (✓) Patient ── (✓) Search policy ── (3) Select policy ── (4) Claim|
|------------------------------------------------------------------|
| [Card] Search the beneficiary's policy                           |
|  Identifier type      Identifier value                           |
|  [Member ID      v]   [MD5SLS4X5_________]   [(search) Search    |
|                                                         policies]|
|------------------------------------------------------------------|
|                                                                  |
| [Card] 1 policy found          [(search) None of these? Discover |
|                                                    with a payer] |
|------------------------------------------------------------------|
| Member ID   | Product / policy   | Payer       | ABHA    | Mobile |  |
|-------------|--------------------|-------------|---------|--------|--|
| MD5SLS4X5   | PMJAY for Himachal | Nhcx Pmjay  | 9170... | -      |[(+) Select]
|             | PMJAY/HP/S/G       | <payer code>|         |        |  |
|------------------------------------------------------------------|

Empty result:
| [Card] 0 policies found              [(search) Discover with a payer]
|  No policy matches that identifier.   (muted text, no table)     |

Search failed:
| [Card, no title]                                                 |
|  <error message in danger colour>                                |
```

- The search card is the S1 card, pre-filled.
- The results card sits below it with a gap. It holds a single scrollable table (it scrolls sideways on narrow screens).
- Two-line cells show the main value over a smaller muted line.
- Each row ends with an extra-small primary "Select" button with a circle-plus icon. The column has no header.
- When there are no rows the table is replaced by the muted line "No policy matches that identifier."
- The "None of these" button is the outline style with a search icon, in the results card header, on every result.
- When the lookup failed the results card is replaced by an untitled card holding the error in the danger colour.

#### S2A. ACTIONS
1. Select: post the chosen policy with the search identifier, open a draft claim, and go to the Claim Detail screen S6 (it opens on the Eligibility tab, S3) with the flash "Claim <number> opened." If the policy has no member ID, stay on S1 with the red flash "That policy has no member ID; a claim cannot be raised without one."
2. Search policies: run the S1 search again with the edited type or value (validated as on S1) and refresh this list.
3. None of these / Discover with a payer: go to the discovery page S17 with the identifier type and value, and the patient when one was carried.
4. Breadcrumb "Claims": go to the Claim dashboard S5.
