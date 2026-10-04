# Screens

Every screen of the claim, patient and practitioner flows, in one list. Each row links to its full spec in [../screens/](../screens/INDEX.md). Routes are the application's own; "tab" means a tab of the claim page S6.

## Claims

| # | Screen | Route | What it does | APIs | Callbacks |
|---|---|---|---|---|---|
| [S5](../screens/S5-claim-master.md) | Claim Master | `claims/list` | Lists every claim case with beneficiary, policy, payer, balance, stage and status, filterable by status; the entry point to S1 and S6. | none | none |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | `claims/view/:caseid` | The case shell: header chips, next-action buttons and the tabs in episode order. Polls every waiting leg on load. | [A17](../apis/A17-claim-state.md) | [C1](../callbacks/C1-callback-door.md) |
| [S10](../screens/S10-communication.md) | Communication | `claims/view/:caseid/communication` | Shows the payer's queries, notifications and notes per leg, and replies to a query with text and documents. | [A7](../apis/A7-communication-on-request.md) | [C9](../callbacks/C9-communication-request.md) |
