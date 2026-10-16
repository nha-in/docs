# F15. Patient

#### F15R. RESOURCE
- `resourceType`: `Patient`
- Profile in `meta.profile`: `https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient`
- Direction: **sent** at `https://nhcx.abdm.gov.in/patient` in every claim-side bundle and in the eligibility bundle. **Received**: the payer's own Patient in the eligibility reply, read back onto the claim.

#### F15D. DESCRIPTION
The beneficiary. Three variants are sent, all at fullUrl `https://nhcx.abdm.gov.in/patient` and all referenced from the other entries by that url:

| Variant | Bundle | Built from | Content |
|---|---|---|---|
| Claim-bundle Patient | pre-auth, predetermination, enhancement, query update (F8 via A4), claim (F8 via A5) | the admitted patient, with the claim row as fallback | identifiers, name, phone, gender, birth date; `id` `1` |
| Communication-reply Patient | reply to a query (F12 via A7) | lifted unchanged from the queried leg's sent bundle; when no leg went out, built as the claim-bundle Patient from the **claim row only** | as above |
| Eligibility Patient | CoverageEligibilityRequest bundle (F2 via A2) | the member id alone | one identifier, nothing else; no `id` |

**Identifiers.** The member id goes once, typed `MB` "Member Number" under `http://terminology.hl7.org/CodeSystem/v2-0203`, whatever the payer. On the claim-bundle Patient the ABHA number follows it, typed `ABHA`, when the claim has one. No `system` on any of them. No scheme-specific identifier type is sent: the scheme is named by `Claim.programCode` (F8) and the payer by the recipient code, not by how the member id is typed. The facility MRN, the ABHA address and the patient's own `D3 patient.abha_number` are not sent. (NHA's sample bundles type the member id `PMJAY` as well; that is the sample's convention, not a requirement, and this skill does not copy it.)

**Fallbacks.** The claim-bundle Patient takes each demographic from the admitted patient (`D3 patient`, the one the claim is linked to through `D9 claim.patient_id` when the admission is linked; linking requires a current IPD stay of a patient whose ABHA number matches the claim's, digits only, so a linked claim always has an ABHA to send) and falls back to the claim row. The claim row's values come from the policy search (A1: name, ABHA number, mobile number) and are overwritten by the payer's Patient when an eligibility reply arrives (C2: name, gender, birth date, ABHA, address, photo). A pre-auth or claim cannot be built without a linked admission ("Link the admitted patient before submitting."), so in those bundles the admitted patient normally supplies name, gender and phone, which the patient table requires.

**Eligibility Patient.** Demographics are deliberately not sent: they are the payer's to return. The builder takes the identifiers only, so A2 need not read the linked patient at all (a check runs before any patient is linked); a name, gender, birth date, phone, MRN, district or state handed to it is ignored.

#### F15F. FIELDS
**Claim-bundle Patient (sent)**

| Element path | Value or source | Cardinality / notes |
|---|---|---|
| `id` | `1` | |
| `meta.profile[0]` | `.../StructureDefinition/Patient` | |
| `identifier[0].type` | `MB` "Member Number" under `http://terminology.hl7.org/CodeSystem/v2-0203` | always |
| `identifier[0].value` | `D9 claim.member_id` | required on the claim |
| `identifier[1].type` | `ABHA` "Ayushman Bharat Health Account (ABHA) ID" under `https://nrces.in/ndhm/fhir/r4/CodeSystem/ndhm-identifier-type-code` | only when `D9 claim.abha_number` is set |
| `identifier[1].value` | `D9 claim.abha_number`, trimmed | |
| `name[0].text` | `D3 patient.name`, else `D9 claim.beneficiary_name` | always present, empty text if both are empty |
| `telecom[0]` | `{system: "phone", value: D3 patient.phone, else D9 claim.mobile_number}` | only when a phone is known |
| `gender` | `D3 patient.gender`, else `D9 claim.patient_gender`, lower-cased | only when known |
| `birthDate` | `D3 patient.birth_date`, else `D9 claim.patient_dob` | only when known |

Not sent: `address`, `photo`, `given`/`family` names, MRN, ABHA address, `active`, `deceased`.

**Eligibility Patient (sent)**

| Element path | Value or source |
|---|---|
| `meta.profile[0]` | `.../StructureDefinition/Patient` |
| `identifier[0]` | type `MB` (as above), value the member id entered on the check form (A2) |
| `identifier[]` typed `ABHA` | the ABHA number searched on, only on a discovery that also gives a member id (A2) |
| `identifier[]` typed `ADN` "Adhaar number" under `ndhm-identifier-type-code` | the Aadhaar number given as additional information on a discovery (A2), 12 digits; absent otherwise |
| `telecom[0]` | `{system: "phone", value: <mobile>}`, the mobile given as additional information on a discovery; absent otherwise |

**Payer's Patient (received, eligibility reply)**. The reply repeats the request's Patient and appends the payer's, one per member on a family card; every payer Patient is read into the beneficiaries list and the chosen one onto `D9 claim` ([F3. CoverageEligibilityResponse](F3-coverage-eligibility-response.md), C2. Coverage Eligibility Verdict (in nhcx-coverage)):

| Element path | Stored in |
|---|---|
| `identifier[]` typed `MB`, else any identifier whose type is not `ABHA`, `MO` or `ADN`, else `Patient.id` | `member_id` of the person (payers type the member id their own way; the reader does not depend on any scheme-specific type) |
| `name[0].text`, else `given` joined with spaces, else `family` | `beneficiary_name` |
| `gender` | `patient_gender` |
| `birthDate` | `patient_dob` |
| `address[0].line[]`, `.district`, `.state`, `.postalCode` | `patient_address`, joined with `, ` |
| `identifier[]` whose first type coding code is `ABHA` | `abha_number` |
| `photo[0].data`, else `photo[0].url` | `patient_photo` |

Empty values are not written. Patients in ClaimResponse, Task, communication and payment bundles are not read.

#### F15U. USED BY
- Callbacks: [C8. Enquiry Reply](../callbacks/C8-enquiry-on-submit.md)
- FHIR: [F18. Coverage](F18-coverage.md)
