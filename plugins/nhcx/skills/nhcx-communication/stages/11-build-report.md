# Stage 11: the report

Purpose: one document a stranger can pick up to know what was built, what was found already there, what was proven, what was not, and what to do next. Written from the artefacts in `nhcx-build/`, not from memory. Its value is its honesty.

`11-report.md` has a summary across the skills at the top and one section per skill below it. This skill writes its section and updates its row of the summary.

## Inputs

- Everything in `nhcx-build/`, `STATE.md` first, `NOTES.md` last
- This skill's sections of `0-capability.md`, `8-validation.md` and `10-test-run.md`

## Do

### 1. Read STATE.md

Every gate row in this skill's block, and the foundation rows it built, with their evidence. A gate without evidence is reported as open, whatever you remember.

### 2. Write this skill's section

From `templates/11-report.md`, in this order:

| Section | Holds |
| --- | --- |
| Capabilities | Every capability in this skill's section of `0-capability.md`: its verdict at stage 0, what was done (reused, extended, built), and its evidence after stage 8 |
| What was built | Each module part this skill built or extended, with its files and its record (`7-modules/7.N.md`) |
| Compliance | The seven points from `core/LADDER.md` for this skill's legs, each with the evidence path (the pin comparisons, the door tests, the screen tests, the rung logs) |
| The test pyramid | Per rung: passed, failed, not run, the log |
| Findings | Every failure from stages 8 and 10 with its resolution or its open state |
| Gaps | This skill's entries in `NOTES.md` folded in: what the skills did not say, what the docs did not say, what the sandbox did that no document states |
| Exceptions | Every accepted exception from stage 8 and the user's agreement |
| Runbook | How to start it, how to run the suite, how to run rungs 3 and 4, what to sweep first, where the archive and the ledger are |
| Next | The `later` legs from stage 1, the open gates, the rungs not climbed, and the skill to run next in the order `core/LADDER.md` gives |

Then update this skill's row in the summary table: stages closed, rung reached, what it reused, extended and built, what is open. Mode, payers and "today a user can" are for the whole build; bring them up to date.

### 3. Check the report against the rules

- Every claim of "passes" has a log or a record path beside it.
- Every rung not run says so.
- Every capability reported as reused has its stage 8 evidence, not only stage 0's.
- No em dashes, short sentences, tables for facts.
- A stranger with this report and the target project could resume at the first open gate.

## Write

This skill's section of `nhcx-build/11-report.md`, and its summary row. Update `STATE.md` with the final gate.

## Gate

- [ ] Every section in the template is present in this skill's section.
- [ ] Every capability in this skill's section of `0-capability.md` appears under Capabilities.
- [ ] Every module part this skill touched appears in "What was built" or, if reused, under Capabilities.
- [ ] Every compliance point names evidence.
- [ ] The pyramid table matches this skill's section of `10-test-run.md`.
- [ ] This skill's entries in `NOTES.md` are folded into "Gaps" in full.
- [ ] The runbook has the start commands, the test command and the sweep.
- [ ] The summary table has this skill's row.

## Common mistakes

- Reporting the rung the user asked for as reached because the offline rung passed.
- Reporting a reused capability as working on the strength of stage 0 alone.
- Dropping a finding that was fixed. Fixed findings are the most useful part of the report for the next build.
- Writing the report before stage 10's logs exist.
