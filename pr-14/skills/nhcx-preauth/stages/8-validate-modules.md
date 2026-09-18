# Stage 8: validate the modules

Purpose: run the Validate section of every module this skill touches, in ladder order, and record what was observed. A module this skill reused is validated like one it built: stage 0's check was a sample, this is the whole section. A validation record is evidence: a command, its output, a file, a line. Not a sentence saying it passed.

## Inputs

- `nhcx-build/modules.json`, `nhcx-build/7-modules/7.N.md`, this skill's section of `nhcx-build/0-capability.md`
- This skill's `SKILL.md`: which rows of each module's Validate section are its own (its stage 8 row)
- Every `stages/7-write-code/7.N-*.md` Validate section this skill touches
- `references/fhir-knowledge.md` section 11 (the validator)
- `references/errors-and-debugging.md` section 2 (the refusal each check guards against)

## Do

### 1. Per module, in order

For each module in `modules.json` that names this skill in `skills`, in ladder order:

1. Open its Validate section. Every row this skill owns becomes one row in `nhcx-build/8-validation/7.N.json` (shape in `templates/validation-record.json`): `skill`, `check`, `how` (the command or the inspection), `observed` (the output or the fact), `ok`, `guards` (the PAYR or rule it protects against, when there is one). For a foundation module this skill built or extended, every row; for one it reused, the rows `core/FOUNDATION.md` names for "present". If another skill already wrote the file, append this skill's rows and increment `run`.
2. Run the pin comparisons through the offline test if stage 9 has written it, or through a one-off script now (canonical JSON, `created` excluded, `diff` on failure). Keep the diff as `observed` when it fails.
3. Run the greps the sections ask for (the misspelled input, the hard-coded codes).
4. Feed the fixtures the sections name through the readers and record what came back.
5. Do not fix in this stage. A failing check is recorded as failing, and the fix goes back to stage 7 for that module, then this module is validated again. STATE.md records both passes.

### 2. Reused capabilities

Every capability stage 0 found `present` has its rows run here, not carried forward from stage 0. One that fails is no longer present: set its verdict to `partial` in `capabilities.json`, with the failing row as the evidence, extend it in stage 7, and validate it again. STATE.md records both runs.

### 3. Shared modules

When this skill extended a module another skill built (the Claim builder, the ClaimResponse reader, the Task builder, the door, the stage machine), run that skill's rows for the module again and record them as a new run. A change for the claim leg that breaks the pre-auth pin is found here, not live.

### 4. Cross-module checks

After the last module, these checks span the ladder, for this skill's legs:

| Check | How |
| --- | --- |
| Every pin this skill owns has exactly one comparison in the build | list this skill's pins, list the comparisons, diff |
| Every step of `flow/flow.json` this skill owns has a route and a control on the tab the flow names, and every `next_actions` label it owns renders verbatim from its seeded state | walk a seeded episode through this skill's steps through the state address and the pages; record the label at each step |
| The archive holds one file per message on this skill's legs | seed an episode through this skill's legs with the 7.1 stub and the fixtures, count files against sends and receipts |
| Stage and sub-stage agree with `case_stage` after every write | the seeded episode, checked after each step |
| No module sends except through 7.1's transport; no module receives except through 7.3 | grep the whole build for the NHCX, registry and adapter addresses and the HTTP client outside 7.1 |
| No literal document code, package code, questionnaire url, participant code or workflow id outside 7.11's table and configuration | grep the whole build for `MAND\d+`, `MG\d+`, `/questionnaire/`, `@hcx`, and the workflow ids as bare strings |
| Every leg row this skill writes stores `txn_id`, `correlation_id`, `api_call_id`, `thread_correlation_id` after a send | the seeded episode |
| The HL7 FHIR validator, where installed, reports no errors on each bundle this skill builds | run it as `references/fhir-knowledge.md` section 11 says; warnings are advice, errors are not |

### 5. The validator

The HL7 FHIR validator needs Java and the ndhm.in package; it may not be installed. If it is not, record `not run` with the reason. Do not claim validation you did not run.

## Write

- `nhcx-build/8-validation/7.N.json` per module, with this skill's rows.
- This skill's section of `nhcx-build/8-validation.md`, from `templates/8-validation.md`: one table row per module part (checks, passed, failed, re-validated), the reused capabilities, the cross-module table, and the accepted exceptions with the user's agreement noted.

## Gate

- [ ] Every module that names this skill in `modules.json` has a record file holding every Validate row this skill owns.
- [ ] Every row has `how` and `observed`; none says only "ok".
- [ ] Every pin this skill owns has a passing comparison, or a named exception the user agreed to.
- [ ] Every capability stage 0 found present was validated here; any that failed is back to `partial` with its fix recorded.
- [ ] Every shared module this skill extended shows the other skill's rows run again.
- [ ] The cross-module table is complete, with `not run` and a reason where a tool was missing.
- [ ] Modules that failed and were fixed show both runs in STATE.md.

## Common mistakes

- Validating by reading the code. The checks are observations of behaviour.
- Carrying stage 0's check forward as the validation of a reused capability.
- Extending a shared module and validating only this skill's rows.
- Fixing inside this stage and forgetting to re-run the module's whole section.
- Treating validator warnings as failures, or validator absence as a pass.
