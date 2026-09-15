# Stage 4: flow and data mapping

Purpose: decide where every fact the exchange needs comes from and where every fact the exchange returns goes, leg by leg. This is the design stage with the most rows; get it right and stages 6 and 7 are transcription.

Two parts of this stage belong to the episode, not to one skill: the flow table (section 1) and the home of every table (section 2), with the matching order (section 4). The first skill to run this stage writes them whole, so every later skill builds on one design; a later skill checks them and adds only what its gaps need. The field mapping (section 3) is this skill's own bundles only.

## Inputs

- `nhcx-build/1-idea.md` (scope), `nhcx-build/3-discovery.md` (the surface and its gaps), this skill's section of `nhcx-build/0-capability.md` (what exists already)
- This skill's `SKILL.md`: its steps, legs, bundles and tables
- `flow/FLOW.md` and `flow/flow.json`: the steps this build implements. They are copied, not redesigned.
- `references/flow-knowledge.md` sections 1, 2, 4 and 5
- `references/transport-knowledge.md` section 2 (what a send returns, what arrives at the door)
- `references/fhir-knowledge.md` sections 3 to 10 (what each bundle needs); `fhir/FHIR.md` for the exact elements, as the builders' data dictionaries name them
- `stages/7-write-code/7.2-storage.md`: the claim tables and the columns each must hold

## Do

### 1. The flow, for this build

The first skill copies every step of `flow/flow.json` into the flow table, in order, with its id and its skills, and adds two columns for this build: the HMIS event it hangs off (admission, discharge, a desk action) and the mark from stage 1 (`in`, `later`, `out`). The steps, their order, their tabs, their guards and their action labels are the flow's; this build adds where each fact comes from, nothing else. Then note the payer branches as the flow has them (F9b, F11, F12: `19`/`131`/`161` resubmits against a Communication reply; `17` against an echoed id). The stage and sub-stage vocabulary is copied as is; do not rename it.

Write the step ids into `mapping.json` under `flow.steps` and the eight tabs, in order and with their labels, under `flow.tabs`.

A later skill checks its own steps' rows and fills their HMIS event where the first skill left it open.

### 2. The episode tables

The first skill gives every table below a home, not only its own. The home is one decision for the episode (sidecar tables, or columns on the HMIS's tables), and a skill that chose differently later would split the design. It writes the columns each table must hold, and the legs' columns under `legs`. Later skills read the homes and add only the columns their gaps need.

For each table below, decide one of three homes and write it down:

| Home | When |
| --- | --- |
| A new sidecar table keyed on the HMIS's own ids | Default. Keeps the HMIS schema untouched and the integration removable. |
| Columns added to an existing HMIS table | Only for a scalar the HMIS already half-holds (a member id on the visit, an HPIN on the doctor) |
| An existing table used as is (`existing`) | Only when it already holds every column named below. This is the home of a capability stage 0 found present: record its real name and its columns, and a gap for each column it lacks |

| Table | Why it exists | Must hold |
| --- | --- | --- |
| `claim` | The episode: beneficiary, policy, payer, eligibility verdict, link to the admission, pre-auth draft, stage and sub-stage | claim number, member id, policy code, payer participant code, patient and encounter keys, `txn_id`, `correlation_id`, `stage`, `sub_stage` |
| `claim_plan`, `claim_plan_benefit`, `claim_plan_form` | The payer's package master, flattened; one per facility and policy, copied onto later episodes | packages with rate, kind, conditions, extras (tiers, implants), document requirements; questionnaires by url |
| `claim_auth`, `claim_auth_item`, `claim_auth_requirement` | The auth-requirements ruling on the quoted set | per line: authorised, excluded; per requirement: kind (document or form), code, url, stage |
| `claim_line` | What is quoted: procedures, implants, ward tiers with a parent procedure | code, kind, quantity, unit price, amount, parent code |
| `claim_form_answer` | Answers to the plan's questionnaires | url, linkId, answer, stage |
| `claim_preauth` | The pre-auth leg, one row rewritten each round (12, 19, 13, 131) | status, `txn_id`, `correlation_id`, `thread_correlation_id`, `api_call_id`, `preauth_ref`, `submission_kind`, `workflow_id`, request and response json, cancel fields |
| `claim_submission` | The claim leg plus the discharge | discharge mode, stage, dates; the same exchange columns as the pre-auth |
| `claim_query` | Every CommunicationRequest or Communication from the payer, classified | `correlation_id` (unique), request id, kind, reason code, status, reply fields |
| `claim_payment`, `claim_payment_detail` | Payment notices, matched by claim number, deduped by correlation id | amount, UTR, payment status, ack fields |
| `claim_enquiry` | Status, reprocess and release Tasks, one row per ask | kind, `correlation_id`, answer |
| `claim_predetermination` | A quote, one row per ask | as a pre-auth, without state effects |
| `claim_document` | Attachments with the payer's code, category and stage | bytes or a pointer, content type, code, stage |
| `claim_diagnosis`, `claim_care_team`, `claim_item` | ICD-10 codes, doctors, non-package items | as named |

The rule that never bends: every leg row holds `txn_id`, `correlation_id` and `api_call_id` from the transport's answer, and `thread_correlation_id` separately, because a send refused at the door must not lose the thread the payer last answered on.

### 3. Field mapping, per bundle

For each bundle this skill sends (its `SKILL.md` lists them; `fhir-knowledge.md` sections 3, 4, 5, 7, 9, 10), one table: `FHIR element | Source (table.column or constant or payer answer) | Transform | Gap`. Do not fill values; name sources. The elements that are always mapped from a payer answer and never from the HMIS: package codes and rates (the plan), document codes and questionnaire urls (the plan or the ruling), `preAuthRef` (the ClaimResponse), the payer's own case number.

For each bundle this skill reads (sections 6, 8, 9, 10 and the coverage answer in section 3), one table: `FHIR element | Destination | Rule`. The status rule for a ClaimResponse is `verdict_status`, copied verbatim; never read `outcome` alone.

Where stage 0 found a builder or reader present, map what it does today, and name each element where it differs from the pin as a gap.

### 4. Inbound matching

Written once, by the first skill. Write the matching order as a numbered list: `x-hcx-correlation_id` against every leg table; then the claim number inside the bundle; then unmatched, archived, 2xx returned. Write the dedupe key: `x-hcx-api_call_id`. Write the archive path: `<cases dir>/<claim number>/NNN-<usecase>-<direction>.json` plus `transactions.txt`. A later skill adds its leg tables to the correlation order.

## Write

- `nhcx-build/4-flow-data-mapping.md` from `templates/4-flow-data-mapping.md`. The first skill writes the flow table, the table homes and the matching order at the top; each skill writes a section headed with its name holding its field mappings.
- `nhcx-build/mapping.json` in the shape of `templates/mapping.json`. The first skill writes `flow`, `episode`, `tables`, `legs` and `inbound` whole; every skill adds its bundles under `bundles`, each entry with `"skill"`. Stage 6 reads it.

## Gate

- [ ] The flow table has every step of `flow/flow.json`, in its order, with its id, its skills and an in/later/out mark; `mapping.json` `flow.steps` lists every id and `flow.tabs` the eight tabs verbatim.
- [ ] Every table above has a home in `mapping.json` under `tables`.
- [ ] Every leg table's columns in `mapping.json` include `txn_id`, `correlation_id`, `api_call_id` and `thread_correlation_id`.
- [ ] `mapping.json` `episode.columns` includes `stage` and `sub_stage`.
- [ ] Every bundle this skill sends has a source table; every element with no source is listed as a gap, not omitted.
- [ ] Where this skill's bundles carry a Practitioner, the HPIN element's source is named (or its gap is).
- [ ] Every capability stage 0 found present is mapped to what exists, with its differences from the pin as gaps.
- [ ] The matching order, the dedupe key and the archive path are written.

## Common mistakes

- Redesigning the flow: merging tabs, adding a "status" step, moving the discharge out of the claim tab. The flow is the reference flow; copy it.
- Giving homes only to this skill's tables when it is the first to run the stage. The next skill would choose differently.
- Mapping package rates to the HMIS charge master. Prices come from the plan; the master is for reconciliation.
- One `correlation_id` column on the episode instead of one per leg. Each leg is its own thread.
- Forgetting `thread_correlation_id`. It is the difference between a recoverable door refusal and a dead case.
- Mapping `Patient` demographics on the coverage request. Only the member id goes out; the payer returns the rest.
