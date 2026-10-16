# Screens

Every screen of the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../screens/](../screens/INDEX.md). Routes are the application's own; "tab" means a tab of the claim page S6.

## Claims

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S1](../screens/S1-search-policy.md) | Search Policy | `claims/search` | Steps 1 and 2 of the Claim Management stepper: who the claim is for (a registered patient, or a walk-in when the facility allows one), then one identifier (ABHA number, mobile number, member id) validated and searched on the beneficiary registry. | [A1](../apis/A1-policy-search.md) | none |
| [S2](../screens/S2-select-policy.md) | Select Policy | `claims/search/results` | Step 3 of the Claim Management stepper: lists the policies found, always offers "None of these" to discover with a payer, and opens a new claim case around the policy picked, landing on S6. | [A1](../apis/A1-policy-search.md) | none |
| [S3](../screens/S3-policy-discovery.md) | Policy Discovery | `claims/view/:caseid/eligibility` | Shows the beneficiary and policy, sends the eligibility check, and shows the verdict and wallet. | [A2](../apis/A2-coverage-eligibility-check.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A12](../apis/A12-txn-fhir.md), [A13](../apis/A13-txn-list.md) | [C2](../callbacks/C2-coverage-eligibility-on-check.md) |
| [S5](../screens/S5-claim-master.md) | Claim Master | `claims/list` | The Claim dashboard: lists every claim case with beneficiary, policy, payer, balance, stage and status, filterable by status; the entry point to Claim management (S1) and to S6. | none | none |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | The case shell: header chips, next-action buttons and the tabs in episode order. Polls every waiting leg on load. | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) |
| [S17](../screens/S17-beneficiary-discovery.md) | Beneficiary Discovery | `claims/discovery` | A page of its own for a discovery check: the operator picks the payer from the participant master (government and private, shown by name), sees whether it is live on the network, names the policy by its number or its member id, and adds the Aadhaar, mobile and ABHA numbers as additional information. | [A2](../apis/A2-coverage-eligibility-check.md) | [C2](../callbacks/C2-coverage-eligibility-on-check.md) |
| [S18](../screens/S18-beneficiary-verification.md) | Beneficiary Verification | `claims/view/:caseid/verification` | The Verification tab: the beneficiary authenticated against their ABHA by fingerprint, iris or face, optional for any payer and required by PMJAY, at the stage the stay is at (Preauth while admitted, Discharge once discharged). | [A2](../apis/A2-coverage-eligibility-check.md), [A18](../apis/A18-biometric-authentication.md), [A19](../apis/A19-abha-m1.md) | none |

## Patient

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S13](../screens/S13-patient-list.md) | Patient List | `patients/list` | Finds a registered patient by name, MRN, mobile or ABHA, and opens the chart or registers a new patient. | [A19](../apis/A19-abha-m1.md) | none |
| [S14](../screens/S14-patient-registration-form.md) | Patient Registration Form | `patients/new`, `patients/edit/:id` | Registers or edits a patient, including the ABHA number and address that link a claim to an admission. | [A18](../apis/A18-biometric-authentication.md), [A19](../apis/A19-abha-m1.md) | none |
| [S15](../screens/S15-patient-detail.md) | Patient Detail | `patients/view/:id` | The chart: overview, encounters, problems and allergies, vitals, laboratory and billing. | none | none |

## Facility

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S19](../screens/S19-nhcx-settings.md) | NHCX Settings | `settings/nhcx` | The facility's NHCX setup, kept by the desk's administrator: HFR id (shown from the ABDM module when it has one), participant code, how a claim starts (registration required, member id captured), the registered endpoint checked against the public URL, the certificate check, the participant master and its refresh, key rotation, and the startup checks run on demand. | none | none |
