# Stage 2: planning

Purpose: turn the idea and the capability check into this skill's schedule of gates, and add its block to the ledger every later stage writes to. This is bookkeeping, and it is short.

## Inputs

- `nhcx-build/1-idea.md`
- This skill's section of `nhcx-build/0-capability.md`: the verdict of every capability it owns or stands on
- `core/LADDER.md`, "The ladder"; this skill's `SKILL.md`, "The ladder, for this skill"
- `references/testing-knowledge.md` section 1 (the pyramid) and section 3 (the matrix), so the acceptance tests below are the matrix's rows and not invented ones

## Do

### 1. Size each stage

For every stage 3 to 11, write one row for this skill: what it produces for this build, how big it is (small, medium, large), and what proves it done. "What proves it done" is the stage's gate, restated for this skill.

For stage 7, list the modules this skill's `SKILL.md` names and the foundation modules, each with its verdict from stage 0 turned into an action:

| Verdict | Action in stage 7 |
| --- | --- |
| `present` | reuse: nothing built; validated in stage 8, tested in stage 9 |
| `partial` | extend: the difference, in the existing code |
| `absent`, `unknown` | build |
| `not applicable` | nothing |

Module 7.13 depends on the mode:

| Module | integrate | standalone |
| --- | --- | --- |
| 7.1 to 7.12 | yes | yes |
| 7.13 standalone shell | no | yes |

Module 7.12 (screens) is smaller in `integrate` mode when the HMIS already has patients, admissions and documents; the plan says which existing screens gain a panel and which are new.

### 2. Order and dependencies

The ladder is sequential by stage. Inside stage 7, foundation modules come first, then this skill's modules in the order of `stages/7-write-code/README.md`; the plan may not reorder them, because each module's validation assumes the ones before it exist.

### 3. Risks

Copy into a risk table the rules from `references/flow-knowledge.md` section 5 that touch this skill's legs; its `SKILL.md` names them in its stage 2 row. Each rule is a way the build fails live even when the offline tests pass. When this skill builds or extends a foundation module, add the foundation's rules too: acknowledge or lose the thread; one message is taken once (dedupe on `x-hcx-api_call_id`). Add every `partial` prerequisite from stage 0, and the build's own risks: a missing HPIN on the practitioner table, no inbound route to the HMIS, a plan master too large for the database column, a callback behind auth middleware.

### 4. What the user must do

List every point where the ladder stops for the user: agreeing stage 1, running an owning skill first when a prerequisite is missing, supplying participant credentials (the ABDM client id and secret), registering the participant's certificate and callback address, starting the services for stage 10 rungs 3 and 4 (the app's public callback, or nhcx-adapter when the user chose it), sweeping live pre-auths before a PMJAY run.

## Write

- This skill's section of `nhcx-build/2-planning.md`, from `templates/2-planning.md`.
- This skill's block in `nhcx-build/STATE.md` (created at stage 0 from `templates/STATE.md`), with a row per stage and a row per module part, each module row carrying its action.
- `nhcx-build/NOTES.md`, empty but for its heading, if it does not exist.

## Gate

- [ ] Every stage 3 to 11 has a row with a size and a proof, for this skill.
- [ ] Every module this skill touches, and every foundation module, has its verdict and its action; 7.13 is marked by mode.
- [ ] The risk table holds every rule this skill's `SKILL.md` names for stage 2, and the foundation's rules when this skill builds or extends a foundation module.
- [ ] The user-action list names the credentials and the service starts.
- [ ] STATE.md has this skill's block with a row per stage and per module part.

## Common mistakes

- Estimating in days. Estimate in size; the user turns size into time.
- Planning to skip stage 8 or 9 "for the first pass". They are what makes the report true.
- Planning to rebuild a capability stage 0 found present.
- Reordering modules so screens come first. Screens derive from messages; without readers there is nothing to derive from.
