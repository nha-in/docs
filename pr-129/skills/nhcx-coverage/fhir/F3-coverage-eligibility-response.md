# F3. CoverageEligibilityResponse

#### F3R. RESOURCE
`CoverageEligibilityResponse`. Direction: received on `coverageeligibility/on_check`. No NRCeS profile is required or checked. PMJAY sends `meta.profile` `http://hl7.org/fhir/StructureDefinition/CoverageEligibilityResponse` [PAYER](../references/PAYERS.md#markers).

#### F3D. DESCRIPTION
The payer's answer to F2, carried in a bundle that repeats the request's seven entries and then appends the payer's own `CoverageEligibilityResponse`, one or more `Patient` and `Coverage` pairs and Organizations. A reply may also carry only the response, Patient and Coverage.

**Which Patients are the payer's.** The request's own Patient is the one `CoverageEligibilityRequest.patient` points at (and the request's Coverage the one its `insurance[].coverage` points at); every other Patient is the payer's. A family policy answers with one Patient and one Coverage per member on the card, each Patient carrying that member's id (an identifier typed `MB`, or typed the payer's own way; the reader takes `MB` first, then any identifier not typed `ABHA`, `MO` or `ADN`) and each Coverage's `beneficiary` pointing at its Patient and `relationship` saying how the member relates to the subscriber [PAYER](../references/PAYERS.md#markers). The reader therefore returns a **list of beneficiaries**, one per payer Patient, each paired with the Coverage whose `beneficiary` references it (else the Coverage at the same position), and marks the one `CoverageEligibilityResponse.patient` points at as `checked`. Reading "the last Patient" picks one family member at random with respect to who is in the bed, and is wrong.

The same resource is read two ways, depending on which exchange the correlation id belongs to:

**Eligibility verdict** (answer to `validation`, `benefits`, `discovery`; C2). Read into the case row, D9 `claim`:
- `insurance[0].inforce` decides eligible or not. `outcome: error` makes the case `error`, else `inforce` true makes it `eligible`, else `not-eligible`.
- The wallet. Every `insurance[0].item[].benefit[]` that has `allowedMoney` is a candidate. The one typed `benefit` wins, then the one typed `30` ("Health Benefit Plan Coverage"), then the first [PAYER](../references/PAYERS.md#markers). `allowedMoney` is what is left on the wallet and `usedMoney` what has gone. The sum insured is stored as left plus used, so the balance shown (sum insured minus used) equals `allowedMoney`.
- `item[].authorizationRequired`: the last item that states it wins.
- The beneficiaries: every payer Patient, with name, gender, birth date, address, ABHA, photo and member id, and from its Coverage the relationship. The whole list goes to D9 `beneficiaries_json`. The person columns of D9 are filled from **one** of them only when the choice is unambiguous: one person returned, or one whose member id equals the case's `member_id` (or an earlier choice, `beneficiary_member_id`). Otherwise they are left as they were and the desk chooses on [S3. Policy Discovery](../screens/S3-policy-discovery.md) ([C2. Coverage Eligibility Verdict](../callbacks/C2-coverage-eligibility-on-check.md)).
- The policy: plan name and period from the payer's Coverage (any of them; they agree on one card).

**Authorisation-requirements ruling** (answer to `auth-requirements`; C3). Read into D13 `claim_auth`, one D14 `claim_auth_item` per `insurance[0].item`, and one D15 `claim_auth_requirement` per distinct `authorizationSupporting` entry:
- Each item answers one quoted line: `authorizationRequired`, `excluded`, the first benefit's type and `allowedMoney`.
- `authorizationSupporting[]` is a list of CodeableConcepts whose free-text `text` says what each is; the text conventions below are the PMJAY dialect [PAYER](../references/PAYERS.md#markers). A text holding `fullUrl: <url>` is a **form** to answer (a Questionnaire, F6, from the plan, F5). Any other is a **document**, and its `Type: <stage>` says when it is due (a document with no `Type:` is due `pre`). `Procedure Code: <code>` names the package it is for. Matching is case-insensitive.
- A requirement is due at pre-authorisation when it is a form, or when its stage is in the adapter's pre-authorisation stages (see [PAYERS.md](../references/PAYERS.md)) [PAYER](../references/PAYERS.md#markers). All others are due with the claim.
- Requirements are de-duplicated on (kind, code, form url) across items.
- A ruling with no `authorizationSupporting` at all is valid. It asks for nothing beyond the package master's own list.

A ProtocolResponse in place of the bundle (F1) turns the case, or the ruling, to `error` with `<code>: <message>`.

#### F3F. FIELDS
Eligibility verdict, into D9 `claim`:

| Element read | Stored in | Notes |
|---|---|---|
| `outcome` | `claim.outcome` | `error` sets `claim.status` = `error` |
| `disposition` | `claim.disposition` | for example "Policy is currently in-force" |
| `insurance[0].inforce` | `claim.inforce` (1/0) | true sets `claim.status` = `eligible`, else `not-eligible` |
| `insurance[0].item[].authorizationRequired` | `claim.auth_required` (1/0) | last item stating it |
| `insurance[0].item[].benefit[].type.coding[].code` | chooses the wallet | `benefit`, then `30`, then first |
| wallet `allowedMoney.value` + `usedMoney.value` | `claim.allowed_amount` | the sum insured |
| wallet `usedMoney.value` | `claim.used_amount` | |
| every payer Patient (not the request's), each with its Coverage | `claim.beneficiaries_json`: list of `{member_id, name, gender, dob, address, abha_number, photo, relationship, checked}` | the whole list, every reply |
| chosen Patient `identifier[]` typed `MB`, else one not typed `ABHA`, `MO` or `ADN`, else `id` | `claim.beneficiary_member_id` | null when the desk must choose |
| chosen Patient `name[0].text`, else `given` joined, else `family` | `claim.beneficiary_name` | |
| chosen Patient `gender` / `birthDate` | `claim.patient_gender` / `claim.patient_dob` | |
| chosen Patient `address[0]`: `line[]`, `district`, `state`, `postalCode` | `claim.patient_address` | joined with ", " |
| chosen Patient `identifier[]` with type code `ABHA` | `claim.abha_number` | |
| chosen Patient `photo[0].data`, else `.url` | `claim.patient_photo` | |
| chosen person's Coverage `relationship.coding[0].display`, else `.code` | `claim.relationship` | |
| payer Coverage `class[0].name` | `claim.plan_name` | |
| payer Coverage `period.start` / `period.end` | `claim.plan_period_start` / `claim.plan_period_end` | |
| the whole bundle | `claim.response_json` | |

"Chosen" is the one person when one is returned, else the one whose member id equals `claim.member_id` or `claim.beneficiary_member_id`; with no such person the chosen-person rows are not written. Empty values are not written, so a reply without a Patient keeps what the case already had.

Authorisation-requirements ruling, the **last** CoverageEligibilityResponse in the bundle:

| Element read | Stored in | Notes |
|---|---|---|
| `outcome`, `disposition` | D13 `claim_auth.outcome`, `.disposition` | `claim_auth.status` = `ready` |
| `insurance[0].inforce` | D13 `claim_auth.inforce` (1/0) | |
| `insurance[0].item[].productOrService.coding[0]` code / display (else `text`) | D14 `claim_auth_item.code` / `.display` | one row per item, `seq` from 1 |
| `item[].category.coding[0].code` | D14 `claim_auth_item.category_code` | |
| `item[].authorizationRequired` | D14 `claim_auth_item.auth_required` (1/0) | |
| `item[].excluded` | D14 `claim_auth_item.excluded` (1/0) | |
| `item[].benefit[0].type.coding[0].code` | D14 `claim_auth_item.benefit_type` | for example `Procedure` |
| `item[].benefit[0].allowedMoney.value` | D14 `claim_auth_item.allowed_amount` | |
| `item[].authorizationSupporting[].coding[0].code` / `.display` | D15 `claim_auth_requirement.code` / `.display` | |
| `authorizationSupporting[].text`, `fullUrl: <url>` | D15 `.kind` = `form`, `.form_url` = the url | |
| `authorizationSupporting[].text`, no `fullUrl:` | D15 `.kind` = `document` | |
| `authorizationSupporting[].text`, `Type: <stage>` | D15 `.stage` (lower case) | a document with none is `pre`, a form `""` |
| `authorizationSupporting[].text`, `Procedure Code: <code>` | D15 `.for_code` | else the item's own code |
| computed | D15 `.at_preauth` (1/0) | form, or stage in the adapter's pre-authorisation stages |
| the whole bundle | D13 `claim_auth.response_json` | |

#### F3U. USED BY
- Screens: [S3. Policy Discovery](../screens/S3-policy-discovery.md)
- Callbacks: [C2. Coverage Eligibility Verdict](../callbacks/C2-coverage-eligibility-on-check.md)
- FHIR: [F1. Bundle](F1-bundle.md), [F2. CoverageEligibilityRequest](F2-coverage-eligibility-request.md), [F15. Patient](F15-patient.md)
