# Stage 9: write the tests

Purpose: a test suite that a stranger can run to know the build still works. The offline rung, with the pins as truth and the payer fixtures as the other side of the wire. Every row of the test matrix this skill owns has a test or a written reason.

There is one suite for the whole build. The first skill to reach this stage writes the harness (section 1); each skill adds its tests to it. A capability stage 0 found present gets the same tests as one this skill built.

## Inputs

- `nhcx-build/6-code-plan.md` section 5 (where tests live, how the pin comparison is wired)
- This skill's `SKILL.md`: its pins, its fixture families, its matrix rows (its stage 9 row)
- Every `stages/7-write-code/7.N-*.md` Tests section this skill touches
- `references/testing-knowledge.md` sections 1 to 4, whole; section 4 is the skeleton to start from
- `nhcx-build/3-discovery.md` (the target's test runner)

## Do

### 1. The harness

Written once, by the first skill; later skills reuse it. One test module (or one per module, in the target's convention) with:

- A canonical-JSON comparison: sort keys, no whitespace, drop `created` (and `meta.lastUpdated`, `timestamp`, `authoredOn` where the module says), assert equal, print a unified diff on failure.
- The 7.1 stub: a fake client that records `(path, headers, payload)` and returns `{"txn_id": "T-n", "correlation_id": "<uuid>", "headers": {"x-hcx-api_call_id": "<uuid>", ...}}`. Injected the way the target injects (monkeypatch, a constructor argument, an environment switch).
- A fixture loader for the pins and payer answers, from `nhcx-package/fhir` (each pin's file is in `references/material.md`). Copy the files beside the tests (copy, do not symlink) and record each file's sha256 from `nhcx-package/MANIFEST` so a later package release that changes a pin is noticed.
- An envelope wrapper: given a payer bundle and a correlation id, build the callback body 7.3 expects.
- A fresh database per test.

### 2. Pin comparisons

One test per pin this skill owns, each feeding the builder the reference's own data (the data dictionary in `references/testing-knowledge.md` section 4). Across the seven skills there are sixteen, counting the communication request reader. These are the tests stage 8 ran by hand; now they are permanent.

### 3. Reader tests

One test per payer fixture family this skill reads: coverage answers (`nhcx-coverage`); the plan (`nhcx-insurance`); the ruling, 20 then 21, 22, 23, 24, PC02 (`nhcx-preauth`); 25 then 26, 27, 291 (`nhcx-claim`); the two communication captures (`nhcx-communication`); the payment notices (`nhcx-payment`); 37 and the status answer (`nhcx-reprocess`).

### 4. The matrix

Copy the rows of the test-case matrix in `references/testing-knowledge.md` section 3 that this skill's `SKILL.md` names into this skill's section of `nhcx-build/9-tests.md`, and add a column `test` naming the test function, or `reason` saying why there is none (out of scope by stage 1; needs a live payer). Each in-scope row becomes a test that: seeds the precondition, performs the action against the stub, asserts the stub's record (path, workflow id, correlation id new or echoed, the bundle's key elements) and the state afterwards (leg status, sub-stage, the row created). The cross-cutting rows (redelivery, unmatched, refusal at the door, ledger reset, stage after every write) are mandatory on this skill's legs; the door's own tests are written once, by the skill that built the door.

### 5. Screens

One render test per screen this skill plans in `screens.json` on a seeded state, asserting the verbatim strings 7.12's Validate section names and the absence of decision words on a waiting case.

### 6. The existing suite

In `integrate` mode the HMIS's own tests must still pass. Do not edit them to accommodate the build. A test the app already had for a reused capability stays; add the pin comparison beside it if it lacks one.

## Write

- The test code, in the target's test path.
- This skill's section of `nhcx-build/9-tests.md` from `templates/9-tests.md`: its matrix rows with the `test` column, its pins with test names; the command that runs the suite (once, at the top).

## Gate

- [ ] One pin comparison exists for every pin this skill owns.
- [ ] Every fixture family this skill reads has a reader test.
- [ ] Every in-scope matrix row this skill owns names a test; every other row names a reason.
- [ ] The five cross-cutting rows have tests on this skill's legs.
- [ ] Every screen this skill plans has a render test.
- [ ] The run command is written and the suite is runnable offline (no transport, no network).

## Common mistakes

- Comparing bundles with the payer's `created` included, then excluding more and more until it passes. Only the fields the module names are excluded.
- Testing builders through the database. Builders are pure; feed them dictionaries.
- Asserting on the stub's call count alone. Assert the path, the workflow id and the bundle's elements.
- Skipping tests for a reused capability because the app "already has tests". The pin comparison is the test that counts.
