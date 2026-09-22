# The NHCX build ladder

This skill is one of seven NHCX skills, one per use case: `nhcx-coverage`, `nhcx-insurance`, `nhcx-preauth`, `nhcx-claim`, `nhcx-communication`, `nhcx-payment` and `nhcx-reprocess`. Each is a folder of its own and runs on its own: it carries this ladder, the stages, the module files, the references, the flow, the templates and the fetch script. The seven copies of these are the same; only `SKILL.md` differs. This file holds what they share. `SKILL.md` says which flow steps, legs, capabilities, modules, pins and test rows are this skill's own, and what it needs from the use cases before it.

## Paths

Paths that start with `core/`, `stages/`, `references/`, `fhir/`, `flow/`, `ui/`, `templates/` or `scripts/` are relative to this skill's folder, the one that holds `SKILL.md`. Paths that start with `nhcx-package/` are in the NHCX package, fetched into the target project beside `nhcx-build/` (below). Paths that start with `nhcx-build/` are the workspace in the target project.

## Getting the material

Pins, payer fixtures and docs come from the NHCX package, published at https://github.com/nha-in/nhcx-package. `scripts/fetch-package.sh` downloads the latest release, unpacks it to `nhcx-package/` beside `nhcx-build/` and verifies its MANIFEST (pass a link or a local path to use a different build). `references/material.md` says what the package holds, gives the file of every pin by its label (`preauth/request` is `nhcx-package/fhir/B3/preauth-request.json`), and lists what it does not hold. Read it once, at stage 0.

## What the skills produce

Software that raises cashless claims on the National Health Claims Exchange (NHCX) with a private insurer and with PMJAY, in one of two shapes:

| Mode | You start with | You end with |
| --- | --- | --- |
| `integrate` | A working hospital information system (HMIS, EMR, HIS, billing system) in any language | The same system, with a claims module that speaks NHCX through its transport, kept in sidecar tables and removable |
| `standalone` | Nothing | A self-contained claims desk: its own patients, admissions, documents and screens, speaking NHCX through a transport of its own |

Every message goes through one transport, chosen at stage 1 from three (`references/transport-knowledge.md` section 1):

| Transport | When | What the build does |
| --- | --- | --- |
| `existing` | Stage 0 found the app already speaks NHCX: its own client, a vendor gateway, an SDK | Wraps it behind 7.1's `send` and 7.3's door, and closes its gaps; never replaces it |
| `own` | The app has no NHCX integration, and the user has not asked for nhcx-adapter | Builds the protocol into the app from NHA's published chapters: the ABDM session token, the key and certificate, the participant record, the recipient's certificate, the JWE, the callback and its receipt |
| `adapter` | Only when the user asks for nhcx-adapter | Downloads it from https://github.com/nha-in/nhcx-adapter/releases and talks plain FHIR to it (`references/api-knowledge.md`) |

Never propose nhcx-adapter; use it only when the user asks for it. Whichever the transport, the rest of the build sees the same two things: `send`, and a door that receives `{meta, jwe_headers, fhir}`.

## The seven skills

One skill per use case. Together they walk the whole flow in `flow/FLOW.md`; each one alone builds its slice. This folder builds only its own row. The others are named so that a verdict can say which skill owns a missing piece.

| Skill | Flow steps | Legs | Use cases | Pins |
| --- | --- | --- | --- | --- |
| `nhcx-coverage` | F1, F2, F3 | policy search; `v1/coverageeligibility/check` purpose `discovery`, `validation`, `benefits` | A2, B1, D3 | `coverage/{discovery,validation,benefits}` |
| `nhcx-insurance` | F4, F7 | `v1/insuranceplan/request`; lines quoted from the plan | B2, D1 | `insurance` |
| `nhcx-preauth` | F5, F6, F8, F9, F9a, F9b for a `resubmit` payer, F9c, F9d, F9e | auth requirements; `v1/preauth/submit` 12, 19, 13, 131 and predetermination; cancel PC01 | B3, B8 cancel, B9, D2, D4 to D8 | `coverage/authrequirements`, `preauth/{request,enhancement,queryupdate,cancel}` |
| `nhcx-claim` | F10, F11 | `v1/claim/submit` 15; 161 (PMJAY) or 151 (generic); 16 (generic) | B5, D9, D10 | `claim/{request,queryupdate}` |
| `nhcx-communication` | F9b and the claim query for a `communication` payer, F12b | `v1/communication/request` in; `v1/communication/on_request` out | B4 | `communication/response`, and the `communication/request` reader |
| `nhcx-payment` | F12 | `v1/paymentnotice/request` in; `v1/paymentnotice/on_request` out on 17 or the notice's own id | B7, D13 | `payment/notice-ack` |
| `nhcx-reprocess` | F13 | `v1/task/submit`: reprocess and release on 36, status; 37 and the status Task read | A5, B8 reprocess, D11, D12 | `claim/{reprocess,release}` |

`flow/flow.json` names the skills of every step in `skills`. Fifteen pins, each owned by exactly one skill, plus the communication request read as the sixteenth comparison.

### The order they depend on

The use cases depend on one another in the order the episode happens. A full build runs the seven skills top to bottom. Any one can run alone on an app that already has what it needs; stage 0 establishes whether it does, with the checks in this skill's `SKILL.md` under "Prerequisites". The other skills do not have to be installed for that check.

| Skill | Needs | Because |
| --- | --- | --- |
| `nhcx-coverage` | nothing | It opens the episode |
| `nhcx-insurance` | coverage: an episode with an `eligible` verdict | The plan is fetched for an eligible episode's policy |
| `nhcx-preauth` | coverage (eligible, and its builder for auth requirements); insurance (plan ready, lines quoted) | Items, prices, documents and forms come from the plan; F9 holds `eligible` |
| `nhcx-claim` | preauth: an approved or partial pre-auth with its `preAuthRef`, the dossier, the Claim builder | The claim goes under the pre-auth's number, built by the same builder |
| `nhcx-communication` | preauth or claim: a leg the payer can ask about, with its bundle as sent | A query names a Claim; the reply lifts entries from the bundle sent |
| `nhcx-payment` | claim: a filed claim | A notice is matched by the claim number |
| `nhcx-reprocess` | claim: a decided claim; payment for a release; preauth for status on a pre-auth | A reprocess reopens a decided claim; a release follows a short payment |

## The foundation

Six modules carry every leg and belong to no one skill: 7.1 (the transport), 7.2 (storage), 7.3 (the callback door), 7.11 (state and payer adapters), 7.12 (the case screen shell) and 7.13 (the standalone shell). Every skill's stage 0 checks them. The first skill that finds one absent builds it; a skill that runs later on the same app finds it present and reuses it. `core/FOUNDATION.md` says how to recognise each and what makes it present.

## What compliant means

Every skill is held to the same points, for its own legs:

1. Every hospital-side leg the skill owns (`references/flow-knowledge.md` section 1) is sent with its workflow id, and every payer answer on it is read.
2. Every bundle the skill sends matches its pin in `nhcx-package/fhir` byte for byte, `created` excepted.
3. The callback door answers 2xx fast, dedupes on `x-hcx-api_call_id`, archives before it applies, and matches by correlation id first.
4. No screen shows a decision the exchange has not sent, and nothing the exchange already said is retyped.
5. The offline tests pass, and the report says honestly which rungs of the test pyramid were climbed.
6. The software walks the flow in `flow/FLOW.md`, step for step: the same steps in the same order, the same tabs with the same names, the same guards, the same action labels. The flow is copied, never redesigned.
7. Nothing the app already did is built a second time. Every capability stage 0 found present is reused, and validated and tested like new code.

## The flow

An NHCX provider desk walks one path from policy search to settlement, and a build from these skills walks it. `flow/FLOW.md` is that path: thirteen steps with their branches, the case screen's eight tabs in order, the status line, the action labels the desk sees, the guards before every send, and what runs on every page load. `flow/flow.json` is the same, machine-readable, with step ids `F1` to `F13`. Read FLOW.md whole at stage 1; stage 4 copies the steps, stage 5 puts the screens on them, stage 7 implements them by id, stage 8 checks every step has a route. An agent that reorders, merges or renames these steps has left the skill.

## The ladder

Twelve stages, 0 to 11. Each has one file under `stages/`, reads the artefacts of the stages before it, writes into `nhcx-build/` in the target project, and ends at a gate. A gate is a list of conditions a reader can check without trusting you. Do not start a stage until the gate before it is closed, and never close a gate by asserting it; close it by pointing at the evidence.

This skill runs every stage over its own slice. Stage 1 is shared with any other NHCX skill that runs on the same app: the first writes it and later ones confirm it. Parts of stages 3 to 6 are the episode's, not the skill's: the first skill to reach them writes those parts whole, and later skills build on them.

| Stage | File | Scope | Writes | Gate closes when |
| --- | --- | --- | --- | --- |
| 0 | `stages/0-capability-check.md` | this skill | `nhcx-build/0-capability.md` section, `nhcx-build/capabilities.json` entries | Every own, foundation and prerequisite capability has a verdict with observed evidence |
| 1 | `stages/1-idea.md` | shared | `nhcx-build/1-idea.md` | The mode, the payers, the scope of every step with its skill, and the constraints are written and the user has agreed |
| 2 | `stages/2-planning.md` | this skill | `nhcx-build/2-planning.md` section, this skill's block in `nhcx-build/STATE.md` | Every later stage has a size and a proof; every module has its action from stage 0 |
| 3 | `stages/3-discovery.md` | shared rows; this skill's host facts | `nhcx-build/3-discovery.md` | Every host fact this skill needs is answered with proof, or marked as a gap |
| 4 | `stages/4-flow-and-data-mapping.md` | the flow and table homes episode-wide; this skill's bundles | `nhcx-build/4-flow-data-mapping.md`, `nhcx-build/mapping.json` | Every table has a home, every leg the four ids, every bundle of this skill a source map |
| 5 | `stages/5-screen-plan.md` | the case screen shell episode-wide; this skill's tabs | `nhcx-build/5-screen-plan.md`, `nhcx-build/screens.json` | Every value on this skill's screens names its message; the honesty rules hold |
| 6 | `stages/6-code-plan.md` | this skill's modules; the client and configuration episode-wide | `nhcx-build/6-code-plan.md`, `nhcx-build/modules.json` | Every module this skill touches has files, dependencies, a pin and an action |
| 7 | `stages/7-write-code/README.md` and `7.N-*.md` | what stage 0 found absent or partial | Code, plus `nhcx-build/7-modules/7.N.md` | Each module's "Done when" list is met, in order |
| 8 | `stages/8-validate-modules.md` | every module part this skill owns, reused ones included | `nhcx-build/8-validation.md`, `nhcx-build/8-validation/7.N.json` | Every row passes, or carries a named, accepted exception |
| 9 | `stages/9-write-tests.md` | this skill's pins, readers and matrix rows | Test code, plus `nhcx-build/9-tests.md` | Every row this skill owns has a test, or a written reason it cannot |
| 10 | `stages/10-run-tests.md` | this skill's tests | `nhcx-build/10-test-run.md` and the raw outputs | The offline rung passes; the higher rungs are run only when the user starts the services |
| 11 | `stages/11-build-report.md` | this skill | `nhcx-build/11-report.md` section | The report is written from the artefacts, names every gap, and a stranger could resume from it |

Stage 7 is a module ladder of its own, 7.1 to 7.13. Each module file carries its own Build, Pseudo code, Validate and Tests sections, and names the skills that build it; stage 8 runs the Validate sections and stage 9 writes the Tests sections, so a module is never validated against a checklist written somewhere else.

## The workspace

Everything this skill writes lives in one folder in the target project, so the work can be resumed, reviewed and deleted as a unit. When several NHCX skills work on one app they share that folder, whichever skill folder each runs from: each adds its own section or entries and leaves the others alone.

```
nhcx-build/
  STATE.md                  the gate ledger: the shared rows, the foundation, one block per skill
  capabilities.json         every capability checked, its verdict and its evidence; read and written by every skill
  0-capability.md           one section per skill; scratch checks under 0-capability/
  1-idea.md                 shared
  2-planning.md             one section per skill
  3-discovery.md            shared; each row says which skill answered it
  4-flow-data-mapping.md    the flow and table homes, then one section per skill; plus mapping.json
  5-screen-plan.md          the case screen shell, then one section per skill; plus screens.json
  6-code-plan.md            the client and configuration, then one section per skill; plus modules.json
  7-modules/7.1.md .. 7.13.md   one record per module; a shared module has a part per skill
  8-validation.md           one section per skill; plus 8-validation/7.N.json, each row tagged with its skill
  9-tests.md                one section per skill
  10-test-run.md            one section per skill; plus 10-test-run/<skill>-*.log
  11-report.md              a summary across skills, then one section per skill
  NOTES.md                  every place a skill was silent, ambiguous or wrong
```

`templates/` holds the skeleton of each artefact. Copy the skeleton, fill it, keep its headings: later stages find things by heading.

## How to run a stage

1. Read `nhcx-build/STATE.md`. If stage 1 in the Shared block is open, and this skill's stage 0 is closed, run stage 1. Otherwise find the first open gate in this skill's block. That is the stage to run; do not skip ahead and do not redo a closed stage unless the user asks.
2. Read the stage file. Read the artefacts it lists under Inputs, and this skill's `SKILL.md` row for the stage. Read the references it names, in the sections it names.
3. Do the work. Write the artefact from its template, in this skill's section.
4. Walk the gate. For each condition, write the evidence into STATE.md: a file path, a line, a command and its output. A condition with no evidence stays open. Every artefact that names a step, a tab or an action uses the ids and words from `flow/flow.json`.
5. If a gate needs the user (stage 0 when a prerequisite is missing; stage 1 always when it is first written; stage 10 rungs 3 and 4 always), stop and ask. Otherwise continue to the next stage.

Resuming later is step 1 again. Nothing lives in your memory; everything lives in `nhcx-build/`.

You may be asked to run one stage alone with the earlier artefacts already written. Treat those as closed; do not rewrite them.

## Rules that hold throughout

- Reading and offline commands only until stage 10 says otherwise. Never start a service or send live traffic unless the user asks.
- Never edit the files in `nhcx-package/`. They are the truth you are held to.
- Build only what stage 0 found absent or partial. A capability found present is reused through its existing code, never built a second time: two transports or two callback doors break the rule that one module sends and one receives.
- Present means a check was observed passing. Code that looks right is partial until its check has run.
- Never build another skill's capability inside this one. When a prerequisite is missing, stop and say which skill owns it.
- When this skill extends a module another skill built, it re-runs that skill's Validate rows for the module. The rows are in the module file, which every skill folder carries.
- This skill writes its own section of a shared artefact and leaves the other skills' sections alone.
- Never hard-code a document code, a package code or a questionnaire url. Take them from the payer's plan or auth-requirements answer.
- Every outbound leg stores three things from the transport's answer: `txn_id`, `correlation_id` and `api_call_id`. Every message is addressed to the policy's processor (`recipient_code`) and carries the beneficiary's ABHA. Every inbound message is matched by `x-hcx-correlation_id` first and by the claim number inside the bundle second.
- Take the decisions from the module files (Build, Rules, Pseudo code) and `fhir/FHIR.md`, and write them in the target's language and conventions. Never invent a shape the pins do not show.
- Write `nhcx-build/NOTES.md` as you go. A fact the skill does not give you is a gap to record, never a guess to bury in code.
- No em dashes anywhere you write. Short sentences. Tables for anything with more than three columns of fact.
- Do not claim a rung of the test pyramid was climbed when it was not. The report's value is its honesty.

## Reference map

| File | Holds | Read at |
| --- | --- | --- |
| `core/FOUNDATION.md` | The six foundation capabilities: how to recognise each, what makes it present, who builds it | Stage 0, stage 7 when building one |
| `references/flow-knowledge.md` | The episode and its legs, every workflow id, the two payer kinds, the classification rule, stage vocabulary, the use-case catalogue, rules no document states | Stages 1, 2, 4, 7.4 to 7.11 |
| `references/transport-knowledge.md` | The three transports and when each applies; the contract `send` and the door rely on; building the protocol yourself from NHA's chapters (token, key and certificate, participant record, policy lookup, recipient certificate, JWE, callback and receipt, status and `/v1/error`); wrapping an existing integration; getting nhcx-adapter when asked | Stages 0, 1, 4, 6, 7.1, 7.3 |
| `references/api-knowledge.md` | The nhcx-adapter contract, read only when the user chose the adapter: config, routes, envelope and answer, delivery, ledger, kit endpoints, curl | 7.1 and 7.3, adapter only |
| `references/fhir-knowledge.md` | Every bundle sent and received, element ids, HPIN, consent questionnaires, supportingInfo, LM100, ONS and DTM, the TaskBundle reply, where the pins live, the validator | Stages 4, 6, 7.4 to 7.10, 8 |
| `references/errors-and-debugging.md` | PAYR and ERR codes with meaning and fix, gateway errors, reading a ledger thread, correlation mistakes, redelivery, sandbox pace | Stages 8, 10, 11 |
| `references/testing-knowledge.md` | The test pyramid, the test-case matrix per use case, a skeleton offline test | Stages 2, 9, 10 |
| `fhir/FHIR.md` | The FHIR guide: every bundle sent and read, entries in pinned order, the code systems, pseudo code for each builder and reader, the refusal each rule guards against | Stages 0, 4, 6, 7.4 to 7.10, 8 |
| `ui/UI-GUIDE.md` | The screens: the two honesty rules, where every value comes from, a layout per screen, the state words, pseudo code for the status line, the timeline and the actions | Stages 5, 7.12, 7.13 |
| `flow/FLOW.md`, `flow/flow.json` | The one path an episode walks: steps F1 to F13 and their skills, the tab order, the action labels, the guards, the page-load polls | Stage 1 whole; stages 4, 5, 7, 8 by step id |
| `references/material.md` | Where the pins, fixtures and docs live: the NHCX package, the pin map, what the package lacks | Stage 0, and whenever a cited file is needed |

## Keeping the seven copies in step

Everything in this folder except `SKILL.md` is the same in all seven skill folders. A change to one of these files is made in all seven. `diff -r --exclude=SKILL.md` between any two skill folders prints nothing when they agree.

## Deliverables

- This skill's sections of `nhcx-build/`, every gate in its STATE.md block closed with evidence or open with a reason.
- Its verdicts in `capabilities.json`, each with the check that decided it.
- Schema additions for its legs (integrate) or its tables in the whole schema (standalone), under the target's conventions.
- Builders and readers for every leg it owns, each compared with its pin in the offline test.
- Its tabs and screens, deriving every state from received messages.
- Tests covering its rows of the matrix, a run record, and a report section a stranger could act on.
