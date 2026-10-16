# Screens

Every screen of the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../screens/](../screens/INDEX.md). Routes are the application's own; "tab" means a tab of the claim page S6.

## Claims

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S5](../screens/S5-claim-master.md) | Claim Master | `claims`, `claims/list` | One module, two screens: the Claim dashboard (counts by stage and leg, attention and money for a period) and Claim management (the claim list with quick tabs, the entry to the stepper S1 and to S6). | none | none |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | The case shell: header chips, next-action buttons and the tabs in episode order. Polls every waiting leg on load. | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) |
| [S11](../screens/S11-claim-submission.md) | Claim Submission | `claims/view/:caseid/claim` | Records the discharge, collects claim-stage documents and forms, sends the claim, shows the verdict, and asks status, reprocess or release. | [A5](../apis/A5-claim-submit.md), [A6](../apis/A6-task-submit.md), [A10](../apis/A10-txn-related.md), [A11](../apis/A11-txn-dispatch.md), [A18](../apis/A18-biometric-authentication.md) | [C6](../callbacks/C6-claim-on-submit.md), [C8](../callbacks/C8-enquiry-on-submit.md) |
| [S18](../screens/S18-beneficiary-verification.md) | Beneficiary Verification | `claims/view/:caseid/verification` | The Verification tab: the beneficiary authenticated against their ABHA by fingerprint, iris or face, optional for any payer and required by PMJAY, at the stage the stay is at (Preauth while admitted, Discharge once discharged). | [A5](../apis/A5-claim-submit.md), [A18](../apis/A18-biometric-authentication.md) | none |

## Facility

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S19](../screens/S19-nhcx-settings.md) | NHCX Settings | `settings/nhcx` | The facility's NHCX setup, kept by the desk's administrator: HFR id (shown from the ABDM module when it has one), participant code, how a claim starts (registration required, member id captured), the registered endpoint checked against the public URL, the certificate check, the participant master and its refresh, key rotation, and the startup checks run on demand. | [A16](../apis/A16-gateway-token.md) | none |
