# Stage 7: write the code

Purpose: build the modules in `nhcx-build/modules.json` that this skill touches, in ladder order, one at a time, and only as far as stage 0's verdict says. Each module file has the same shape: Purpose, Skills, Depends on, Inputs, Build, Rules, Validate, Tests, Done when. Stage 8 runs every Validate section; stage 9 writes every Tests section. Do not skip ahead in the ladder: each module's validation assumes the ones before it exist.

## The ladder

| Module | File | Builds | Skills | Held to |
| --- | --- | --- | --- | --- |
| 7.1 | `7.1-config-and-transport.md` | Settings and the NHCX transport (existing, own, or nhcx-adapter on request), the policy lookup, the outbound archive | foundation | `references/transport-knowledge.md` sections 2 to 5 |
| 7.2 | `7.2-storage.md` | The episode and leg tables from `mapping.json` | foundation; each skill its leg tables | `mapping.json` |
| 7.3 | `7.3-callback-and-archive.md` | The callback door: dedupe, archive, match, apply, return | foundation; each skill wires its readers | `references/transport-knowledge.md` sections 2 and 3.9; the cross-cutting rows of the test matrix |
| 7.4 | `7.4-policy-and-coverage.md` | Policy search; coverage eligibility builder and reader | `nhcx-coverage` | `B1/{discovery,validation,benefits}.json` |
| 7.5 | `7.5-insurance-plan.md` | Plan request, the plan parser, master reuse, lines from the plan | `nhcx-insurance` | `B2/insurance-plan-request.json` |
| 7.6 | `7.6-auth-requirements.md` | The ruling on the quoted set: builder, reader, fingerprint | `nhcx-preauth` | `B1/auth-requirements.json` |
| 7.7 | `7.7-claim-bundle.md` | One builder for pre-auth, enhancement, query answer, claim, predetermination; documents, forms, supportingInfo | `nhcx-preauth` (pre-auth legs), `nhcx-claim` (claim legs) | `B3/preauth-{request,enhancement,queryupdate}.json`, `B5/claim-{request,queryupdate}.json` |
| 7.8 | `7.8-claim-response-reader.md` | ClaimResponse into status, `preauth_ref`, amounts, item verdicts; acknowledgement then decision | `nhcx-preauth`, `nhcx-claim` | The payer answers in `C5/` and `C7/` |
| 7.9 | `7.9-tasks.md` | Cancel PC01, reprocess and release 36, status; readers for PC02 and 37 | `nhcx-preauth` (cancel), `nhcx-reprocess` (reprocess, release, status) | `B3/preauth-cancel.json`, `B5/claim-{reprocess,release}.json` |
| 7.10 | `7.10-communication-and-payment.md` | Classification, notification acknowledgement, the TaskBundle reply; payment notice reader and acknowledgement | `nhcx-communication`, `nhcx-payment` | `B4/communication-response.json`, `B7/payment-notice-ack.json` |
| 7.11 | `7.11-state-and-payer-adapters.md` | Stage, sub-stage, next actions; the payer adapter switch | foundation; each skill its stage branches and labels | `flow-knowledge.md` sections 2 to 4 |
| 7.12 | `7.12-screens.md` | The screens from `screens.json` and the JSON state address | foundation (the shell); each skill its tabs | The two honesty rules |
| 7.13 | `7.13-standalone-shell.md` | Standalone only: patients, admissions, documents, settings, seed, run script | foundation, standalone only | `nhcx-build/3-discovery.md` standalone section |

Pins and payer answers are files of the NHCX package, which `scripts/fetch-package.sh` fetches into `nhcx-package/` beside `nhcx-build/`. A short path in the table above (`B1/validation.json`) is under `nhcx-package/fhir/`.

Two guides sit beside the module files. `../../fhir/FHIR.md` holds every builder and reader as pseudo code with the code systems named once; modules 7.4 to 7.10 point into it. `../../ui/UI-GUIDE.md` holds the screens; 7.12 and 7.13 build from it. Each module file ends with its own Pseudo code section for the orchestration around those.

Every module implements the steps of `../../flow/flow.json` that name it in `module`; the module record (`nhcx-build/7-modules/7.N.md`) lists the step ids it covers. 7.11 renders the `next_actions` table of the flow verbatim; 7.12 renders the tabs in the flow's order.

## Build, extend or reuse

Stage 0 gave every capability a verdict and stage 2 turned it into an action per module. Stage 7 follows it:

| Action | In stage 7 |
| --- | --- |
| reuse | Build nothing. Write the module record with "Reused", the existing files, and stage 0's evidence. Stage 8 still runs the Validate section. |
| extend | Change the existing code, in its own files and style, for the difference stage 0 named. Never a second implementation beside the first. |
| build | Build the module, or this skill's part of it, as the module file says. |

A foundation module found absent is built whole by the skill that found it (`../../core/FOUNDATION.md`). A module two skills share (7.7, 7.8, 7.9, 7.10) is one implementation: the second skill extends what the first built, and stage 8 re-runs the first skill's Validate rows for it.

## Working method, every module

1. Read the module's action in this skill's block of `STATE.md`. For `reuse`, go to step 4.
2. Read the module file and the references it names, in the sections it names. Understand the decision; write it in the target's language and conventions.
3. Build or extend. Small commits or checkpoints per module if the target uses version control.
4. Write `nhcx-build/7-modules/7.N.md` from `templates/module-record.md`, or add this skill's part to it: what was built, extended or reused, where, what was copied, what was left out and why, what the skill did not say (also into `NOTES.md`).
5. Walk the module's "Done when" list for this skill's part. Record evidence in `STATE.md`. Move to the next module.

## Rules that hold across modules

- Every bundle is built by a pure function of a data dictionary, with no database access inside the builder. That is what lets stage 9 feed it the pin's data and compare byte for byte.
- Every send goes through 7.1's transport. Every receive goes through 7.3's door. No module talks to the exchange on its own, and there is one of each, whichever skill built it.
- Every leg write is followed by 7.11's stamp of stage and sub-stage.
- Instants are IST, `+05:30`. Money is `INR`; whole numbers are integers.
- Never hard-code a document code, a package code or a questionnaire url.
- A refusal at the door (a ProtocolResponse) restores the thread the payer last answered on. Every leg row has `thread_correlation_id` for this.
