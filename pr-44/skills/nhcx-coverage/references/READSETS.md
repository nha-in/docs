# Read Sets

What to read before implementing one spec, so a task never needs the whole skill. Each row is one screen, API, callback or gateway part, and the FHIR, database and gateway specs it links to, followed through their own links (tables and hub specs such as the bundle envelope F1 and the claim table D9 are listed but not followed further). Only specs this skill holds are listed.

Always read, whatever the task: [CORE.md](CORE.md) (addresses and the exchange table), [F1. Bundle](../fhir/F1-bundle.md) (every bundle), [D9. claim](../database/D9-claim.md) (every case), [C1. Callback Door](../callbacks/C1-callback-door.md) (every reply), and the knowledge source ([KNOWLEDGE.md](KNOWLEDGE.md)).

## Screens

| To implement | What it is | Read with it |
|---|---|---|
| [S1](../screens/S1-search-policy.md) | Search Policy | nothing else |
| [S2](../screens/S2-select-policy.md) | Select Policy | [D9](../database/D9-claim.md), [D30](../database/D30-counter.md) |
| [S3](../screens/S3-policy-discovery.md) | Policy Discovery | [D9](../database/D9-claim.md) |
| [S5](../screens/S5-claim-master.md) | Claim Master | nothing else |
| [S6](../screens/S6-claim-detail.md) | Claim Detail | nothing else |

## APIs

| To implement | What it is | Read with it |
|---|---|---|
| [A1](../apis/A1-policy-search.md) | Policy Search | [D9](../database/D9-claim.md), [G3](../gateway/G3-session-token.md), [G10](../gateway/G10-beneficiary-registry.md) |
| [A2](../apis/A2-coverage-eligibility-check.md) | Coverage Eligibility Check | [F1](../fhir/F1-bundle.md), [F2](../fhir/F2-coverage-eligibility-request.md), [F15](../fhir/F15-patient.md), [F16](../fhir/F16-practitioner.md), [F17](../fhir/F17-organization.md), [F18](../fhir/F18-coverage.md), [F19](../fhir/F19-other-resources.md), [D9](../database/D9-claim.md), [D13](../database/D13-claim-auth.md), [D14](../database/D14-claim-auth-item.md), [D15](../database/D15-claim-auth-requirement.md), [G5](../gateway/G5-protocol-headers.md), [G7](../gateway/G7-send.md), [G8](../gateway/G8-receive.md), [G9](../gateway/G9-ledger.md) |
| [A10](../apis/A10-txn-related.md) | Transaction Related | nothing else |
| [A11](../apis/A11-txn-dispatch.md) | Transaction Dispatch | nothing else |
| [A12](../apis/A12-txn-fhir.md) | Transaction FHIR | nothing else |
| [A13](../apis/A13-txn-list.md) | Transaction List | nothing else |
| [A17](../apis/A17-claim-state.md) | Claim State | nothing else |

## Callbacks

| To implement | What it is | Read with it |
|---|---|---|
| [C1](../callbacks/C1-callback-door.md) | Callback Door | nothing else |
| [C2](../callbacks/C2-coverage-eligibility-on-check.md) | Coverage Eligibility Verdict | [G8](../gateway/G8-receive.md) |

## Gateway

| To implement | What it is | Read with it |
|---|---|---|
| [G1](../gateway/G1-embedding.md) | Embedding | nothing else |
| [G2](../gateway/G2-configuration.md) | Configuration and Participants | nothing else |
| [G3](../gateway/G3-session-token.md) | Session Token | nothing else |
| [G4](../gateway/G4-registry.md) | Registry and Certificates | nothing else |
| [G5](../gateway/G5-protocol-headers.md) | Protocol Headers | nothing else |
| [G6](../gateway/G6-encryption.md) | Encryption | nothing else |
| [G7](../gateway/G7-send.md) | Send | nothing else |
| [G8](../gateway/G8-receive.md) | Receive | nothing else |
| [G9](../gateway/G9-ledger.md) | Ledger | nothing else |
| [G10](../gateway/G10-beneficiary-registry.md) | Beneficiary Registry | nothing else |
| [G11](../gateway/G11-startup-checks.md) | Startup Checks and Health | nothing else |
