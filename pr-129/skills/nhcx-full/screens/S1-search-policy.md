# S1. Search Policy Screen

#### S1R. ROUTE
claims/search

Optional query: `patient` (the patient the claim is for, carried through to S2 so the case opens linked to them), `id_type` and `id_value` (prefill), `mode=walkin` (the desk chose to start without a registered patient; ignored when the facility requires registration). The patient master opens this screen with `patient`: "Search insurance policy" on [S15. Patient Detail](S15-patient-detail.md) or a row of [S13. Patient List](S13-patient-list.md) passes the patient, and the identifiers prefill from the patient's record.

Breadcrumb: Claims (claims/list, S5) > Claim management

Reached from the navigation ("Claim management", under Claims) and from "New claim" on the Claim dashboard [S5. Claim Master](S5-claim-master.md).

#### S1D. DESCRIPTION
The start of a new claim, as the first two steps of the **Claim Management stepper**: Patient, Search policy, Select policy ([S2. Select Policy](S2-select-policy.md)), Claim ([S6. Claim Detail](S6-claim-detail.md)). The stepper is drawn above the cards on S1 and S2, the current step filled and earlier steps ticked, so the desk always sees where it stands. The screen is two cards, the second shown once the first is answered.

**Two facility settings** decide how the screen behaves, kept on [S19. NHCX Settings](S19-nhcx-settings.md) ([D1. organization](../database/D1-organization.md) `registration_required`, `capture_member_id`, both on by default):

| Setting | On | Off |
|---|---|---|
| A claim needs a registered patient | the Patient card offers the register only; a person not on it is registered first ([S14. Patient Registration Form](S14-patient-registration-form.md)) | the Patient card offers "Registered patient" or "Walk-in, not registered"; a walk-in starts on the identifiers alone |
| Ask for the member id at the start | Member ID is offered as an identifier beside the ABHA number and the mobile number | the search starts from the ABHA number or the mobile number only (Member ID still appears when the URL names it) |

**Step 1, the Patient card.** Who the claim is for. With a patient chosen it shows the name, UHID, age and gender, mobile and ABHA number, with "Change patient". Without one it holds a search box "Search by name or UHID" over the facility's own patients (the register, searched through the facility's encounters by name and by UHID [REF](../references/PAYERS.md#markers)), each hit a row (name, age, gender, mobile) that is chosen with a click, and a button "Register a new patient" that opens the HMIS's registration form ([S14. Patient Registration Form](S14-patient-registration-form.md)) and returns here. When registration is not required a two-way choice sits in the card header, "Registered patient" / "Walk-in, not registered"; choosing Walk-in clears the patient and shows the note "The claim starts on the identifiers alone; the patient is registered and the admission linked later, on the claim." The choice is carried in the URL (`mode=walkin`), so a refresh keeps it.

**Step 2, the Search card** ("Search the beneficiary's policy"), shown once a patient is chosen or Walk-in is picked. The operator searches on one identifier the beneficiary carries; the app looks up every policy linked to it on the NHCX Beneficiary Identification System (BIS).

Identifier types, in this order:

| Value (sent upstream) | Label | Offered | Default |
|---|---|---|---|
| `AbhaNumber` | ABHA number | always | when the patient has an ABHA number |
| `MobileNo` | Mobile number | always | when the patient has no ABHA number but a mobile |
| `MemberId` | Member ID | when the facility captures the member id at the start, or the URL names it | for a walk-in, or a patient with neither [REF](../references/PAYERS.md#markers): it is what is printed on the card |

**Prefill and the changed-value marker.** With a patient chosen, the value field shows the patient's own value for the chosen kind (the ABHA number from the patient's identifiers, the mobile from the patient's phone), and switching the kind shows that kind's value. The moment the desk edits the value so it differs from the record, the field turns amber and a line appears under it: a chip "Changed", the note "The patient's record holds <value>." and a link "Use the patient's value" that puts the record's value back. The marker is a reminder, not a block: a changed value is searched as typed, and the case keeps what was searched ("Found by" on [S3. Policy Discovery](S3-policy-discovery.md)). A typed value survives a change of kind (S1A 2). Without a patient the field is empty and the desk types.

Under the field a one-line help for the chosen kind: "14 digits, with or without spaces or hyphens." (ABHA), "10 digits, without the country code." (mobile), "The member id printed on the beneficiary's card, as printed." (member id).

API: [A1. Policy Search](../apis/A1-policy-search.md)

Rules:
- Validation happens before any call, on the screen and again on the server ([A1. Policy Search](../apis/A1-policy-search.md)), each failure a red message in a card under the form: an unknown identifier type gets "Choose what kind of identifier you are searching with."; an empty value "Enter an identifier value to search for."; an ABHA number that is not 14 digits once spaces and hyphens are removed "An ABHA number has 14 digits."; a mobile number that is not 10 digits once spaces, hyphens and a leading +91 are removed "A mobile number has 10 digits.". The cleaned digits are what goes upstream; a member id goes as typed.
- Any upstream failure shows as a red error message inside a card on the screen, never as a 500.
- The search is a GET with the type and value in the query string, so a result can be bookmarked and a refresh repeats the search.
- The sandbox returns no beneficiary name or photo at this stage [SANDBOX](../references/PAYERS.md#markers).
- A facility that requires registration never shows the walk-in choice; `mode=walkin` in the URL is dropped.

#### S1L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the settings, the two steps, the fields, options, messages and actions.

```
|------------------------------------------------------------------|
| Claims > Claim management                                        |
| (1) Patient ── (2) Search policy ── (3) Select policy ── (4) Claim|
|------------------------------------------------------------------|
| [Card] Patient                 [Registered patient | Walk-in]    |
|  Find the patient on the register, or choose Walk-in ...         |
|  [(search) Search by name or UHID      ]  [(+) Register a new    |
|                                               patient]           |
|  Asha Devi        42y F · 98xxxxxx10          (hit rows)         |
|------------------------------------------------------------------|
| [Card] Search the beneficiary's policy                           |
|  Identifier type      Identifier value                           |
|  [ABHA number    v]   [91703412374240____]   [(search) Search    |
|                        (amber when changed)             policies]|
|  [Changed] The patient's record holds 91703412374241.            |
|            [(undo) Use the patient's value]                      |
|  14 digits, with or without spaces or hyphens.                   |
|------------------------------------------------------------------|
| [Card, only when validation failed]                              |
|  <error message in danger colour>                                |
|------------------------------------------------------------------|
```

- The stepper is a row of numbered circles joined by short rules; the current step's circle is filled, a done step shows a tick.
- The Patient card's header holds the Registered / Walk-in switch (only when registration is not required) and "Change patient" once one is chosen.
- The Search card holds a single filter row with the fields and button side by side (they wrap on narrow screens); the identifier value input is at least 16rem wide; the changed-value line spans the row beneath it.
- Fields in this row have no bottom margin, so labelled fields line up with the button.

#### S1A. ACTIONS
1. Choose a patient (a hit row): reload with `patient=<id>`; the Search card appears, prefilled from the record.
2. Registered patient / Walk-in: switch the mode (`mode=walkin` or none); Walk-in clears the patient.
3. Register a new patient: open the HMIS's patient registration ([S14. Patient Registration Form](S14-patient-registration-form.md)); on return, find the new patient here.
4. Change patient: drop the patient and show the search box again (a typed identifier is kept only when no patient was chosen).
5. Change identifier type: switch the dropdown; a typed value keeps its text, an untouched field shows the patient's value for the new kind.
6. Use the patient's value: put the record's value back and clear the marker.
7. Search: validate, and go to the Select Policy screen S2 (claims/search/results) with the identifier type, the cleaned value, the `patient` when one was chosen, and the returned policies. S2 shows zero results as "No policy matches that identifier."
8. Breadcrumb "Claims": go back to the Claim dashboard S5 without searching.
