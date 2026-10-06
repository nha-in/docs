# Screens

Every screen of the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../screens/](../screens/INDEX.md). Routes are the application's own; "tab" means a tab of the claim page S6.

## Claims

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S1](../screens/S1-search-policy.md) | Search Policy | `claims/search` | Starts a new claim: the operator enters one identifier (member id, mobile or ABHA number) and searches the beneficiary registry. | [A1](../apis/A1-policy-search.md) | none |
| [S2](../screens/S2-select-policy.md) | Select Policy | `claims/search/results` | Lists the policies found, and opens a new claim case around the one picked, landing on S6. | [A1](../apis/A1-policy-search.md) | none |
| [S3](../screens/S3-policy-discovery.md) | Policy Discovery | `claims/view/:caseid/eligibility` | Shows the beneficiary and policy, sends the eligibility check, and shows the verdict and wallet. | [A2](../apis/A2-coverage-eligibility-check.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A12](../apis/A12-txn-fhir.md), [A13](../apis/A13-txn-list.md) | [C2](../callbacks/C2-coverage-eligibility-on-check.md) |
| [S5](../screens/S5-claim-master.md) | Claim Master | `claims/list` | Lists every claim case with beneficiary, policy, payer, balance, stage and status, filterable by status; the entry point to S1 and S6. | none | none |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | The case shell: header chips, next-action buttons and the tabs in episode order. Polls every waiting leg on load. | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) |
| [S17](../screens/S17-beneficiary-discovery.md) | Beneficiary Discovery | `claims/discovery` | A page of its own for a discovery check: the operator picks the payer, names the person by one identifier and adds the Aadhaar, mobile and member id as additional information. | [A2](../apis/A2-coverage-eligibility-check.md) | [C2](../callbacks/C2-coverage-eligibility-on-check.md) |
| [S18](../screens/S18-beneficiary-verification.md) | Beneficiary Verification | `claims/view/:caseid/verification` | The Verification tab: the beneficiary authenticated against their ABHA by fingerprint, iris or face, optional for any payer and required by PMJAY, at the stage the stay is at (Preauth while admitted, Discharge once discharged). | [A2](../apis/A2-coverage-eligibility-check.md), [A18](../apis/A18-biometric-authentication.md) | none |

## Patient

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S13](../screens/S13-patient-list.md) | Patient List | `patients/list` | Finds a registered patient by name, MRN, mobile or ABHA, and opens the chart or registers a new patient. | [A19](../apis/A19-abha-m1.md) | none |
| [S14](../screens/S14-patient-registration-form.md) | Patient Registration Form | `patients/new`, `patients/edit/:id` | Registers or edits a patient, including the ABHA number and address that link a claim to an admission. | [A18](../apis/A18-biometric-authentication.md), [A19](../apis/A19-abha-m1.md) | none |
| [S15](../screens/S15-patient-detail.md) | Patient Detail | `patients/view/:id` | The chart: overview, encounters, problems and allergies, vitals, laboratory and billing. | none | none |
