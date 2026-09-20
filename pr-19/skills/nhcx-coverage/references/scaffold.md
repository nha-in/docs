# NHCX build scaffold

Scaffolds an NHCX use case one stage at a time, from reading the codebase that already exists to a build report a stranger could resume from.

`scaffold.md` is shared by the seven skills, because the ladder is the same for all of them. What differs is the slice: this skill's `SKILL.md` names the capabilities, host facts, modules and tabs that are its own, and every stage below runs over that slice. Read `core/LADDER.md` for the ladder itself. This file is the map of it.

## How this skill runs

Every stage below is an OODA loop, not a recipe: observe the actual state (`nhcx-build/STATE.md`, the last artefact written, the last refusal seen), orient against the stage file and this skill's `SKILL.md` row for it, decide the cheapest next action, act, and return to observe. A stage is done only when its gate closes on evidence a reader can check without trusting you, never because the work "should have worked."

Loop limit: 8 passes per stage. Hitting the limit is an escalation: state what was observed, what was tried, and which reference section to read, then ask one question.

Never close a gate by asserting it. Close it by pointing at the evidence: a file path, a line, a command and its output, written into `nhcx-build/STATE.md`.

## Before the first stage, when the codebase already exists

Most NHCX integrations are not new systems. They are a hospital information system that already has patients, admissions, doctors, documents and bills, an HTTP client and a way of keeping secrets. A leg built before that system has been read lands in the wrong place: a second transport beside the first, a claim number on the wrong table, a callback route the reverse proxy never forwards.

So the first two stages are not a use case. They are a survey of the system as it is, and the ladder already carries them whole:

- **Stage 0, the capability check**, searches for what NHCX needs and gives every own, foundation and prerequisite capability a verdict. Present means a check was observed passing. Code that looks right is partial until its check has run.
- **Stage 3, discovery**, inventories the host: the patient table and its identifier, the encounter table, how a discharge is recorded, how configuration is read, how the app exposes an endpoint an outside process can POST to, and how tests are run. Every answer names the file, table or endpoint that proves it. An answer without proof is a gap.

Do not survey the codebase a second time here, and do not write a plan of your own beside `nhcx-build/`. Build only what stage 0 found absent or partial: a capability found present is reused through its existing code, because two transports or two callback doors break the rule that one module sends and one receives.

## Stages

Twelve stages, 0 to 11, each with one file under `stages/`. Do not start a stage until the gate before it is closed, and do not redo a closed stage unless the user asks.

| Stage | File | Exit condition |
| --- | --- | --- |
| 0. Capability check | `stages/0-capability-check.md` | Every own, foundation and prerequisite capability has a verdict with observed evidence |
| 1. Idea | `stages/1-idea.md` | The mode, the payers, the scope of every step with its skill, and the constraints are written and the user has agreed |
| 2. Planning | `stages/2-planning.md` | Every later stage has a size and a proof; every module has its action from stage 0 |
| 3. Discovery | `stages/3-discovery.md` | Every host fact this skill needs is answered with proof, or marked as a gap |
| 4. Flow and data mapping | `stages/4-flow-and-data-mapping.md` | Every table has a home, every leg the four ids, every bundle of this skill a source map |
| 5. Screen plan | `stages/5-screen-plan.md` | Every value on this skill's screens names its message; the honesty rules hold |
| 6. Code plan | `stages/6-code-plan.md` | Every module this skill touches has files, dependencies, a pin and an action |
| 7. Write code | `stages/7-write-code/README.md` and `7.N-*.md` | Each module's "Done when" list is met, in order |
| 8. Validate modules | `stages/8-validate-modules.md` | Every row passes, or carries a named, accepted exception |
| 9. Write tests | `stages/9-write-tests.md` | Every row this skill owns has a test, or a written reason it cannot |
| 10. Run tests | `stages/10-run-tests.md` | The offline rung passes; the higher rungs are run only when the user starts the services |
| 11. Build report | `stages/11-build-report.md` | The report is written from the artefacts, names every gap, and a stranger could resume from it |

Stage 7 is a module ladder of its own, 7.1 to 7.13. Each module file carries its own Build, Pseudo code, Validate and Tests sections, so a module is never validated against a checklist written somewhere else.

Three gates always stop and ask the user: stage 0 when a prerequisite is missing, stage 1 when it is first written, and stage 10 at rungs 3 and 4.

## Rules that hold across every stage

- Reading and offline commands only until stage 10 says otherwise. Never start a service or send live traffic unless the user asks.
- Never edit the files in `nhcx-package/`. They are the truth you are held to.
- Never build another skill's capability inside this one. When a prerequisite is missing, stop and say which skill owns it.
- Every outbound leg stores `txn_id`, `correlation_id` and `api_call_id` from the transport's answer. Every inbound message is matched by `x-hcx-correlation_id` first and by the claim number inside the bundle second.
- Never hard-code a document code, a package code or a questionnaire url. Take them from the payer's plan or auth-requirements answer.
- Never invent a shape the pins do not show. Take the decisions from the module files and `fhir/FHIR.md`, and write them in the target's language and conventions.
- Write `nhcx-build/NOTES.md` as you go. A fact the skill does not give you is a gap to record, never a guess to bury in code.
- Do not claim a rung of the test pyramid was climbed when it was not. The report's value is its honesty.

## Where the detail is

- The ladder itself, the workspace and what compliant means: `core/LADDER.md`
- The six capabilities every skill rests on: `core/FOUNDATION.md`
- The steps, tabs and actions by id: `flow/FLOW.md` and `flow/flow.json`
- The bundles and the pins they are held to: `fhir/FHIR.md` and `references/material.md`
- What a refusal means and what to do about it: `references/errors-and-debugging.md`
- The test pyramid and its rungs: `references/testing-knowledge.md`
