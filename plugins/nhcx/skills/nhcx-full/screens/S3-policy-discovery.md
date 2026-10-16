# S3. Policy Discovery Screen

#### S3R. ROUTE
claims/view/:caseid/eligibility

Shown as the first tab, "Eligibility" (tab key `eligibility`), of the Claim Detail screen S6. It is also the tab S6 opens on when no tab is named.

Form posts to: claims/view/:caseid/check (POST), then redirects back to S6.

| Endpoint | Purpose |
|---|---|
| `POST claims/:caseid/check` | Send the eligibility check |
| `POST claims/:caseid/beneficiary` | Choose which member of the policy is the patient (field `member_id`) |

Breadcrumb (from S6): Claims (claims/list, S5) > <case number>

#### S3D. DESCRIPTION
The coverage eligibility step. It shows who the beneficiary is and which policy the case runs on, sends an eligibility check to the payer, and shows the payer's verdict: whether the policy is in force, the wallet (sum insured, utilised, balance) and whether pre-authorisation is required.

The tab is a stack of up to four cards, in this order:
1. Beneficiary
2. Policy
3. Payer verdict (only once a check has been sent)
4. Coverage eligibility check (hidden while a check is awaiting the payer)

**Beneficiary card.** A photo on the left, then a three-column detail grid. The photo (a URL, a data URI, or bare base64 read as JPEG), 5rem square with rounded corners. With no photo the card shows an initials avatar of the same size. Fields (an empty value shows "-"):

| Label | Value |
|---|---|
| Name | beneficiary name |
| Member ID | member ID |
| ABHA | ABHA number |
| Mobile | mobile number |
| Gender | gender, title-cased |
| Date of birth | date of birth |
| Address | full address |
| Found by | "<identifier label> · <identifier value>" from the S1 search, for example "Member ID · MD5SLS4X5" |

After selection (S2) only member ID, ABHA, mobile and Found by are normally filled. Name, gender, date of birth, address, photo and a corrected ABHA come from the payer's eligibility reply, and only once it is clear which person they belong to.

**Who is the patient (the members table).** A family policy answers the check with every member on the card, not one person: PMJAY returns one Patient per member, three or more on a family card [PAYER](../references/PAYERS.md#markers). The reply is read into a list ([F3. CoverageEligibilityResponse](../fhir/F3-coverage-eligibility-response.md), D9 `beneficiaries_json`) and the Beneficiary card shows it whenever it holds more than one person, as a table above the detail grid:

| Column | Content |
|---|---|
| (radio) | selected for the chosen member, when one is chosen |
| Member | name over the member id |
| Relationship | `Self`, `Spouse`, `Child`, ... from the member's own Coverage |
| Gender, Date of birth | as returned |
| ABHA | the member's ABHA, or "-" |
| Checked | a chip "checked" on the member the payer's response is about |

Under the table, a primary button "This is the patient" posts the selected `member_id` to `claims/:caseid/beneficiary`. The application never picks for the desk: when the reply holds several people and none carries the member id the case was opened with, no member is selected, the detail grid shows only the member id and "Found by", a warning chip "Choose the patient" sits in the card header, and S6's next action reads "Choose which member of the policy is the patient". Until the choice is made the admission link (S4), the plan fetch (S7) and every send are refused with "Choose which member of the policy is the patient on the Eligibility tab first." When exactly one person comes back, or one carries the case's member id, that person is chosen on arrival and the table still lists everyone, read-only, so the desk can see who else is on the card and change the choice.

Choosing writes the person's details onto the case and makes their member id the case's `member_id`, so the next check, the pre-authorisation and the claim go out for the person in the bed. A choice made after an admission was linked unlinks it (the admission was matched on the earlier person's ABHA) and flashes "The admission was unlinked: it was matched to the previous beneficiary." A member id not on the list is refused: "That member is not on this policy's reply." Success flash: "<name> is the patient on this claim."

Why this matters: a member id is shared across a family card, and a child's admission under the parent's details would send the parent's name, age and ABHA on the pre-authorisation and attach the claim to the parent's record. Response order says nothing about who is in the bed.

**Policy card.** A three-column detail grid:

| Label | Value |
|---|---|
| Policy code | policy code |
| Product | product name (or "-") over the product id, muted |
| Payer | payer name (or "-") over the payer id, muted |
| Plan | plan name |
| Plan period | "<start date> → <end date>" (dates only) |
| Relationship | relationship, title-cased |

**Coverage eligibility check card.** A form with three fields in a three-column grid and a footer with one right-aligned primary button (send icon):

| Field | Control | Default | Notes |
|---|---|---|---|
| Purpose | read-only text "Validation, is the policy in force?" | `validation` | once the case exists only a validation is offered here; there is no dropdown |
| Policy code | text | the case's policy code | help text "National health plan identifier on the card" |
| Member ID (required) | text, required | the case's member ID | |

The purposes of the exchange ([A2. Coverage Eligibility Check](../apis/A2-coverage-eligibility-check.md)) and where each is sent from:

| Value (sent upstream) | Label | Sent from |
|---|---|---|
| `validation` | Validation, is the policy in force? | this card, at registration and on "Check again" |
| `benefits` | Benefits, what does the policy cover for this package? | the Line items tab [S8. Line Items](S8-line-items.md), on the quoted set, before a pre-authorisation or an enhancement; optional and never a condition of the send |
| `discovery` | Discovery, find active coverage | its own page, [S17. Beneficiary Discovery](S17-beneficiary-discovery.md), where the payer is chosen and the policy named by number or member id |
| `auth-requirements` | the ruling on the procedure set | the Line items tab [S8. Line Items](S8-line-items.md) (S8.2); optional and never a condition of the send |

The card used to offer the three purposes in a dropdown; from 1.7.0 it offers validation alone, because a desk that has a case already knows the policy, and the other two purposes have a place of their own [REF](../references/PAYERS.md#markers).

The button reads "Send to payer" while the case is a draft, and "Check again" after any earlier check.

Validation, in this order, before anything is sent. Each failure returns to S6 with the message as a red flash:
- "Choose whether this check is a validation, a benefits check or a discovery." (the server's guard on the purpose; the screen always sends `validation`)
- "Member ID is required for an eligibility check."
- "Policy code is required for a validation check." or "Policy code is required for a benefits check." (discovery may go without one)
- "Set the facility's HFR ID under Settings before raising claims."
- "Set the facility's NHCX participant code under Settings before raising claims."

API: [A2. Coverage Eligibility Check](../apis/A2-coverage-eligibility-check.md)

After a queued send the case moves to Awaiting payer (`checking`) and any earlier error is cleared. The flash reads "Eligibility request queued to the payer."

If the send fails, the error is flashed red.

**Waiting for the reply (async).** Every load of S6 (and the Refresh button) looks once for the reply while the case is `checking`. A poll failure leaves the case waiting and shows the muted note "Could not poll the gateway: <error>".

Callback: [C2. Coverage Eligibility Verdict](../callbacks/C2-coverage-eligibility-on-check.md)

API: [A10. Transaction Related](../apis/A10-txn-related.md) (poll)

API: [A12. Transaction FHIR](../apis/A12-txn-fhir.md) (poll)

API: [A13. Transaction List](../apis/A13-txn-list.md) (poll, rejection lookup)

API: [A11. Transaction Dispatch](../apis/A11-txn-dispatch.md) (poll, dispatch status)

Data: [D9. claim](../database/D9-claim.md)

**Payer verdict card states.** The card follows the case `status`:

| Status | Status chip | Payer verdict card |
|---|---|---|
| `draft` | Draft (warning) | not shown |
| `checking` | Awaiting payer (info) | waiting text, details and a Send again button; the check form is hidden |
| `eligible` | Eligible (success) | three stat tiles and the verdict details |
| `not-eligible` | Not eligible (danger) | the same, balance tile in danger colour |
| `error` | Error (danger) | the error message in danger colour, or "The exchange failed." |

Waiting text: "Eligibility <purpose> sent to the payer; awaiting the on_check reply. Use Refresh to check for it." (the purpose word, for example "validation", else "check"). Below it the poll note if any, then Sent at, Transaction and Correlation.

Verdict tiles (money shows as "₹" with thousands separators and no decimals, or "-" when not reported):

| Tile | Icon | Tone |
|---|---|---|
| Sum insured | shield-check | default |
| Utilised | trending-down | warning |
| Wallet balance | wallet | success when eligible, danger when not |

Verdict details: Disposition, Outcome, In force ("Yes" or "No"), Pre-authorisation ("Required", "Not required", or "-" when the payer did not say), Checked at, Correlation.

**Coverage benefits card** (shown under the verdict whenever the reply listed items; [F3. CoverageEligibilityResponse](../fhir/F3-coverage-eligibility-response.md) "Itemised benefits", D9 `benefit_items_json`). One row per `insurance[].item`:

| Column | Content |
|---|---|
| Item | the package display (else its name, else its code), with the code and category as a muted sub-line; the wallet row is marked "Policy wallet"; the description when the payer gave one |
| Cover | chip "Covered" or "Excluded" (`excluded`), then "Term: Annual" or "Lifetime" and "Network: ..." when given |
| Authorisation | "Required", "Not required" or "-" (`authorizationRequired`) |
| Benefits | one line per `benefit`: "<type>: allowed <amount> · used <amount>", money as `₹` with separators, a count as the number, a text as given |
| Supporting documents | the `authorizationSupporting` displays, comma separated |

The same table sits on the Line items tab's benefits card ([S8. Line Items](S8-line-items.md)), where the benefits check is sent from.

#### S3L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the fields, options, columns, statuses, messages and actions.


```
|------------------------------------------------------------------|
| [S6 header, next actions and tab bar; Eligibility tab active]    |
|------------------------------------------------------------------|
| [Card] Beneficiary                                               |
|  +------+  NAME            MEMBER ID        ABHA                 |
|  | photo|  Asha Devi       MD5SLS4X5        91703412374240       |
|  | / AD |  MOBILE          GENDER           DATE OF BIRTH        |
|  +------+  -               Female           1984-02-11           |
|            ADDRESS         FOUND BY                              |
|            ...             Member ID · MD5SLS4X5                 |
|------------------------------------------------------------------|
| [Card] Policy                                                    |
|  POLICY CODE     PRODUCT               PAYER                     |
|  PMJAY/HP/S/G    PMJAY for Himachal    Nhcx Pmjay                |
|                  PMJAY/HP/S/G          <payer code>              |
|  PLAN            PLAN PERIOD           RELATIONSHIP              |
|  ...             2026-04-01 → 2027-03-31   Self                  |
|------------------------------------------------------------------|
| [Card] Payer verdict                                             |
|  [Sum insured  ] [Utilised     ] [Wallet balance]                |
|  [₹500,000     ] [₹305,951     ] [₹194,049      ]                |
|  DISPOSITION     OUTCOME          IN FORCE                       |
|  PRE-AUTHORISATION  CHECKED AT    CORRELATION                    |
|------------------------------------------------------------------|
| [Card] Coverage eligibility check                                |
|  Purpose              Policy code          Member ID *           |
|   Validation, is the  [PMJAY/HP/S/G]       [MD5SLS4X5]           |
|   policy in force?                                               |
|                       National health plan                       |
|                       identifier on the card                     |
|------------------------------------------------------------------|
|                                        [(send) Check again]      |
|------------------------------------------------------------------|

While awaiting the payer (check form hidden):
| [Card] Payer verdict                         [(refresh) Send again]|
|  Eligibility validation sent to the payer; awaiting the on_check |
|  reply. Use Refresh to check for it.                             |
|  Could not poll the gateway: ...   (muted, only on failure)      |
|  SENT AT          TRANSACTION          CORRELATION               |
```

- Detail grids use small uppercase muted labels over the value, three columns from small screens up.
- The stat tiles sit in a grid: one column on phones, two on small screens, three on large.
- The Send again button sits in the Payer verdict card header, secondary style, refresh icon.
- The check form's button sits in the card footer, right-aligned, primary style.

#### S3A. ACTIONS
1. Send to payer / Check again: validate, send the check (A2), set the case to Awaiting payer, and reload S6 on this tab with "Eligibility request queued to the payer." Validation failures reload with the message in red.
2. Send again (only while awaiting the payer): ask "The payer has not replied to the last check yet. Send the same eligibility check again?" and on OK resend with the same purpose (default `validation`), policy code and member ID. The check form is withheld while an exchange is open so two checks on one case cannot be answered out of order; this button is the only way out of a stalled exchange.
3. Refresh (in the S6 header while awaiting): reload S6, which polls once for the on_check reply.
4. This is the patient: post the selected member id, write that person onto the case (and unlink a linked admission matched on another person), reload S6 on this tab with "<name> is the patient on this claim."
5. After an eligible verdict with the patient known, the S6 next-action button "Fetch the package master" goes to the Insurance Plan tab S7. With the patient still to choose it reads "Choose which member of the policy is the patient" and stays on this tab.
