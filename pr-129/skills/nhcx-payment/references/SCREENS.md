# Screens

Every screen of the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../screens/](../screens/INDEX.md). Routes are the application's own; "tab" means a tab of the claim page S6.

## Claims

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S5](../screens/S5-claim-master.md) | Claim Master | `claims`, `claims/list` | One module, two screens: the Claim dashboard (counts by stage and leg, attention and money for a period) and Claim management (the claim list with quick tabs, the entry to the stepper S1 and to S6). | none | none |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | The case shell: header chips, next-action buttons and the tabs in episode order. Polls every waiting leg on load. | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) |
| [S12](../screens/S12-payments.md) | Payments | `claims/view/:caseid/payments` | Shows each payment notice with its breakdown and acknowledgement, and re-sends a failed acknowledgement. | [A8](../apis/A8-paymentnotice-on-request.md) | [C10](../callbacks/C10-paymentnotice-request.md) |

## Facility

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S19](../screens/S19-nhcx-settings.md) | NHCX Settings | `settings/nhcx` | The facility's NHCX setup, kept by the desk's administrator: HFR id (shown from the ABDM module when it has one), participant code, how a claim starts (registration required, member id captured), the registered endpoint checked against the public URL, the certificate check, the participant master and its refresh, key rotation, and the startup checks run on demand. | none | none |
