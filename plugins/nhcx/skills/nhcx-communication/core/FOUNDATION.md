# The foundation: what every skill stands on

Six modules carry every leg, and no one skill owns them. Every skill's stage 0 checks them. The first skill that finds one absent or partial builds or extends it in its own stage 7, and records itself as `Built by` in the Foundation block of `nhcx-build/STATE.md`. Later skills find it present and reuse it. An HMIS that already has one (an NHCX integration, a webhook door, a claims table) has it `existing`.

| Id | Module | What | Every skill adds |
| --- | --- | --- | --- |
| `foundation.transport` | 7.1 | Settings; the one transport behind `send` (the app's existing NHCX integration, the build's own, or nhcx-adapter when the user asked for it); the policy lookup; the outbound archive | Nothing; it sends through it |
| `foundation.storage` | 7.2 | The episode table with its claim number, payer and recipient codes, stage and sub-stage; the leg tables | The leg tables its `SKILL.md` lists, in its own migration |
| `foundation.callback` | 7.3 | The transport's receiving end and the door: dedupe, archive before apply, match by correlation id then claim number, the door refusal, the poll fallback where there is a ledger | Its readers, wired into the door's dispatch |
| `foundation.state` | 7.11 | The payer adapter table; `case_stage`, `stamp_case`, `next_actions` | The stage branches and next-action rows for its legs, labels verbatim from `flow/flow.json` |
| `foundation.screens` | 7.12 | The case screen shell: the eight tabs in the flow's order, the status line and actions, the JSON state address, the page-load polls, the cases list | Its own tabs and screens |
| `foundation.shell` | 7.13 | Standalone only: patients, admissions, practitioners, diagnoses, documents, settings, the run script | Nothing; `not applicable` in integrate mode |

## Recognising each one

For each capability: what to search for, what must be observed for it to be present, and what makes it partial. Search code, dependencies, migrations, configuration and tests. Run every check offline, with the network stubbed.

### `foundation.transport` (7.1)

- Look for an NHCX integration of the app's own: `x-hcx-`, `JWEPayload`, `RSA-OAEP-256`, `A256GCM`, a JOSE library among the dependencies, `bearer_auth`, a sessions URL on the ABDM gateway, `participanthcxservice`, `fetch/certs`, `participant/get/policies`, routes ending in `on_submit`, `on_check` or `on_request`, a vendor's NHCX or HCX client, a gateway service the app calls. Look also for nhcx-adapter already in use: `/fhir/out/`, `/out/v1/`, `jwe_headers`, an adapter URL setting, `/ledger/thread/`, `/internal/txn/related`.
- Present when: what was found meets the contract in `references/transport-knowledge.md` section 2, observed through 7.1's Validate rows 1 to 6 (and row 7 for an app that seals its own messages), with the network stubbed and a test key pair for the seal; and `send` is one function a test can replace.
- Partial when: it sends but misses a contract item (no `x-hcx-ben-abha-id`, the `payerid` as the recipient, no ids back to the caller, no archive) or cannot be stubbed. Extend it in place (`references/transport-knowledge.md` section 4). Never add a second transport beside it.
- Absent when: the app has no NHCX integration. The transport is then `own`, built from `references/transport-knowledge.md` section 3, unless the user has asked for nhcx-adapter.
- nhcx-adapter is never the answer to a partial or absent transport unless the user asked for it. Do not suggest it.

### `foundation.storage` (7.2)

- Look for: tables or models with `claim_no`, `correlation_id`, `txn_id`, `sub_stage`; migrations that mention claim, preauth or nhcx.
- Present when: observed on a migrated scratch database, or read from the schema file and confirmed by a migration run: the episode table has a unique claim number, member id, policy code, payer code, recipient code, patient and encounter keys, `stage` and `sub_stage`; every leg table this skill needs exists with `txn_id`, `correlation_id`, `api_call_id` and `thread_correlation_id`; the migration runs twice without error; deleting an episode removes its children (7.2 Validate, rows 2, 3, 5 and 6). For `nhcx-communication` and `nhcx-payment`, also row 4: the correlation id on their tables is unique by constraint.
- Partial when: the episode exists but a leg table this skill needs does not, a leg table lacks `thread_correlation_id` or `api_call_id`, or the episode keeps no `recipient_code`. The skill adds its tables and columns in a new migration.

### `foundation.callback` (7.3)

- Look for: routes under `/v1/` ending in `on_submit`, `on_check`, `on_request`, `/v1/error`, or a route with `callback` in it; `JWEPayload`, `ProtocolResponse`, `x-hcx-correlation_id`, `x-hcx-api_call_id`, a receipt with `protocol_status`.
- Present when: 7.3 Validate rows 1 to 5, 7 and 8 are observed by calling the receiving end with deliveries of the transport's kind (every inbound path reaches it; an unreadable body is archived and changes nothing; one api call id delivered twice changes state once and is `ignored`; an unknown correlation id is answered and archived under `unmatched`; a delivery is archived even when the apply raises; no outbound call during a delivery; the inbound authentication of the kind). Row 6, the door refusal, is checked by each skill on its own thread.
- Partial when: it receives but routes by path instead of by correlation id, lacks the dedupe, archives after applying, answers the exchange with anything but the 202 receipt (`own`, `existing`), hosts no `/v1/error`, or, with `adapter`, has no poll fallback. Extend it; there is one door.
- A skill whose reader is not wired into the door is partial for its own capability, not for the door.

### `foundation.state` (7.11)

- Look for: `query_mode`, `resubmit`, `1518`, a workflow id table (`"12"`, `"PC01"`, `"161"`), `sub_stage`, `next_actions`, a stamp after each write.
- Present when: 7.11 Validate rows 1 to 3 are observed (`adapter_for` with `1518@hcx` and `1518` gives PMJAY and an unknown code gives generic; the PMJAY workflow table equals `references/flow-knowledge.md` section 2; an override changes one kind only), and rows 4 to 7 hold on the seeded states the legs built so far can reach.
- Partial when: the payer table exists and the stage machine does not, or the stage machine lacks this skill's stage branches or labels. Each skill adds its own.

### `foundation.screens` (7.12)

- Look for: routes like `/claims`, `/claims/<id>`, `/claims/<id>/state`; the tab keys `eligibility`, `plan`, `lines`, `validate`, `preauth`, `communication`, `claim`, `payments`.
- Present when: 7.12 Validate rows 1, 3, 8 and 9 are observed on the shell (the eight tabs in the flow's order with the flow's labels; routes answer 200 for a seeded case and 404 for an unknown one; no input or select named for a rate, a payer name, a `preAuthRef`, a UTR or a status; the state address returns `stage`, `sub_stage`, `next_actions` and `legs`). Rows 4 to 7 belong to the skills whose tabs they test.
- Partial when: the case screen exists without some tabs, without the status line, or without the state address.
- An HMIS with its own screens: the shell may live inside them, for example a panel on the admission screen that opens the case. Present is judged on the eight tabs and the state address, not on the look.

### `foundation.shell` (7.13, standalone only)

- Present when: every row of 7.13's Validate section is observed.
- In integrate mode: `not applicable`. The HMIS is the shell; stage 3 finds its patients, admissions, practitioners and documents.

## Who builds what

| Verdict at stage 0 | What the running skill does |
| --- | --- |
| `absent` | Builds it in stage 7, before its own modules. 7.1 and 7.3 whole, for the transport chosen at stage 1. 7.2: the episode table and this skill's leg tables. 7.11: the payer adapter table whole, and this skill's stage branches and labels. 7.12: the shell with all eight tabs present in order, its own tabs filled, the others showing their empty state. 7.13 whole, in standalone mode. |
| `partial` | Extends it in the existing code, for the difference stage 0 named, and runs the module's whole Validate section after. |
| `present` | Reuses it. Stage 8 still runs the rows this skill depends on. |

Record: the Foundation row in `STATE.md` with `Built by` (the skill, or `existing`), and the module record `nhcx-build/7-modules/7.N.md` with a part for each skill that touched it.
