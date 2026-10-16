# S17. Beneficiary Discovery Screen

#### S17R. ROUTE
claims/discovery

Optional query: `patient` (the patient the check is about) and `case` (the case to return the cover to).

Breadcrumb: Claims (claims/list, S5) > Discovery

Reached from "None of these" on the policy results [S2. Select Policy](S2-select-policy.md) (always offered, whatever the registry answered) and from the Eligibility tab S3; it has no navigation entry of its own (the Claims module shows Claim dashboard and Claim management only, [S5. Claim Master](S5-claim-master.md)).

#### S17D. DESCRIPTION
Discovery asks a payer directly who a person is to it: a coverage eligibility check with the purpose `discovery` ([A2. Coverage Eligibility Check](../apis/A2-coverage-eligibility-check.md)). It has a page of its own because the request names the policy by one handle and the desk usually knows more than one thing about the person. Whatever else it knows goes with the request as additional information, so the payer has more than one handle to match on.

The page is a stack of cards, in this order:
1. Patient
2. Discovery request
3. Cover returned (only once the payer has answered)
4. Discoveries sent (only when there are any)

**Patient card.** The patient picker until one is chosen; then the name, UHID, age and gender, mobile and ABHA number, with "Change patient" (hidden when the page was opened for a case).

**Discovery request card.**

| Field | Control | Default | Notes |
|---|---|---|---|
| Payer (required) | one typeahead over every payer on the exchange from the participant master ([D32. participant](../database/D32-participant.md)), government and private in one list; the dropdown has three columns, Name, Kind (a chip "Government" or "Private") and Participant code; the chosen payer is then shown **by name**, with its code and kind beside it, and "Change payer" | the only payer, when there is one; the case's payer when the page was opened for a case (then not changeable) | typing a name or a participant code narrows the list; there is no choice of payer kind first, though a target may offer a kind filter; a code typed in full that is not in the list is taken as typed. The master refreshes itself when older than a day, so a fresh install lists every payer on its first search |

**On the network.** As soon as a payer is chosen the page asks the registry about it ([G4. Registry and Certificates](../gateway/G4-registry.md) `fetch_participant` and `certificate`, through `GET claims/payers/check?code=`), and shows a block "On the network" with one line per fact, each ticked or crossed: "<name> is registered on NHCX" (else "The registry has no record for this code"), "Active" (else "Inactive"; the sandbox writes the status as `1` [SANDBOX](../references/PAYERS.md#markers)), "Registered as a payer or TPA" (role code `10002` or `10003`, else "Not registered as a payer or TPA"), "Encryption certificate on file" (else "No encryption certificate: a message cannot be sealed to this payer"). With any line crossed, Discover is disabled and the block says "This payer cannot be asked as things stand. Tick \"Skip the network check\" to send anyway." A checkbox **"Skip the network check"** in the block's header turns the check off: the registry is not asked, the block reads "The registry is not asked about this payer before sending; the send still needs its certificate.", and Discover is enabled. The check is a convenience for the desk, never a protocol step: the send fetches the certificate again regardless ([G7. Send](../gateway/G7-send.md)).

**The policy.** A block titled "The policy" with the note "Name the policy by its number or by the member id on the card, whichever the person has.": a two-way choice **Policy number / Member ID** (one of the two, required) and the value. The policy number goes out as the Coverage identifier ([F18. Coverage](../fhir/F18-coverage.md)) with no `subscriberId`; a member id goes out as `subscriberId` and the Patient identifier typed `MB` ([F15. Patient](../fhir/F15-patient.md)). The default is Member ID, prefilled with the member id the desk already knows for the patient (the case's, else their latest case's); an identifier carried in the URL from [S2. Select Policy](S2-select-policy.md) lands in its own field (a member id here, an ABHA or mobile number below).

Then a block titled "Additional information", with the note "Sent with the discovery so the payer has more than one handle to match on. All optional.":

| Field | Control | Default | Rule |
|---|---|---|---|
| Aadhaar number | text, numeric | empty; never prefilled | 12 digits once spaces and hyphens are removed, else "An Aadhaar number has 12 digits" |
| Mobile number | text, numeric | the patient's mobile | 10 digits once spaces, hyphens and a leading +91 are removed, else "A mobile number has 10 digits" |
| ABHA number | text, numeric | the patient's ABHA number | 14 digits once spaces and hyphens are removed, else "An ABHA number has 14 digits" |

Validation before anything is sent, each as a red message: "Select a patient first", "Choose the payer to ask", "The payer is not on the network; skip the network check to send anyway", "Enter the policy number or the member id to ask about", then the three digit rules above.

API: [A2. Coverage Eligibility Check](../apis/A2-coverage-eligibility-check.md) (purpose `discovery`, with the additional information)

FHIR: [F2. CoverageEligibilityRequest](../fhir/F2-coverage-eligibility-request.md), [F15. Patient](../fhir/F15-patient.md), [F18. Coverage](../fhir/F18-coverage.md) (the policy number as the Coverage identifier, the member id as `subscriberId` and the identifier typed `MB`, the Aadhaar as an identifier typed `ADN`, the ABHA as one typed `ABHA`, the mobile as the phone)

**Waiting for the reply (async).** After a queued send the button gives way to "Waiting for <payer code> to answer" with the correlation id beneath it and "Stop waiting". The page polls for the reply every few seconds.

Callback: [C2. Coverage Eligibility Verdict](../callbacks/C2-coverage-eligibility-on-check.md)

**Cover returned card.** One tile per policy the payer returned: the product or payer name, the policy number and member id, then sum insured, valid until and status. No policy: "The payer answered with no cover for this person. Check the identifiers and ask again, or ask another payer." A refusal is shown as an error and stops the wait.

**Discoveries sent card.** Every discovery sent for the patient, newest first: the status chip (waiting, answered, failed), the payer code, the time, then the correlation id, the API call id and the transaction id, each copied on a click. Under them the additional information the request carried: Aadhaar (the last four digits only, as `XXXX XXXX 1234`), Mobile, Member ID. Opening a row shows the exchange legs.

Data: [D9. claim](../database/D9-claim.md)

#### S17L. LAYOUT
The arrangement below is the reference implementation's [REF](../references/PAYERS.md#markers): follow the target HMIS's own screen conventions. What is required is in DESCRIPTION and ACTIONS: the fields, options, columns, statuses, messages and actions.

```
|------------------------------------------------------------------|
| Discovery                                             [< Back]   |
|------------------------------------------------------------------|
| [Card] Patient                                                   |
|  Asha Devi   <UHID> · 42y F · 98xxxxxx10 · ABHA 91-xxxx-xxxx-xx  |
|------------------------------------------------------------------|
| [Card] Discovery request                                         |
|  Payer *            [SHA HP  <payer code>  [Government]  Change payer]|
|   (typeahead rows:  NAME         KIND          PARTICIPANT CODE) |
|  On the network                      [ ] Skip the network check  |
|   ✓ SHA HP is registered on NHCX   ✓ Active                      |
|   ✓ Registered as a payer or TPA   ✓ Encryption certificate ...  |
|  The policy                                                      |
|   (Policy number | Member ID)   [MD5SLS4X5__________]            |
|  Additional information                                          |
|  Aadhaar number     Mobile number     ABHA number                |
|  [1234 5678 9012]   [98xxxxxx10  ]    [91703412374240]           |
|                                                 [Discover]       |
|------------------------------------------------------------------|
| [Card] Cover returned                                            |
|  [PMJAY for Himachal · PMJAY/HP/S/G · MD5SLS4X5 · active]        |
|------------------------------------------------------------------|
| [Card] Discoveries sent                                          |
|  Discovery [answered] <payer code> 12:00:05                      |
|  Correlation id ...   API call id ...   Transaction ...          |
|  Additional information  Aadhaar XXXX XXXX 9012  Mobile ...      |
|------------------------------------------------------------------|
```

#### S17A. ACTIONS
1. Discover: validate (including the network verdict unless skipped), open a draft case for the patient and payer when the page was not opened for a case (A2 `discover`: the facility guard is checked first, so a refusal creates no case), send the discovery (A2) on it with the policy handle and the additional information, and wait for the reply on this page.
1a. Change payer: drop the chosen payer and reopen the typeahead (not offered when the page was opened for a case).
1b. Skip the network check: stop asking the registry about the payer and enable Discover whatever the verdict.
2. Stop waiting: stop polling; the check stays in the list and can still be opened.
3. Choose a policy tile: fill the policy in on the case the discovery ran on (the draft case `discover` opened, or the case the page was opened for) and land on its Eligibility tab S3.
4. Back: to the case's Eligibility tab when the page was opened for a case, else to the claim list S5.
