# Stage 10: run the tests

Purpose: climb the pyramid as far as the user asked in stage 1, for this skill's rows, and record every rung honestly. Rung 1 you run yourself. Rungs 2 to 4 need services or live payers, and only the user starts those.

## Inputs

- `nhcx-build/1-idea.md` (the target rung), `nhcx-build/9-tests.md` (the run command, this skill's rows)
- This skill's `SKILL.md`: its stage 10 row (which matrix rows each rung walks)
- `references/testing-knowledge.md` sections 1, 5 and 6
- `references/errors-and-debugging.md` sections 4 to 8 (reading the ledger, sandbox pace)

## The rungs

| Rung | What | Who starts it | Record |
| --- | --- | --- | --- |
| 1 Offline | The suite from stage 9, against the pins and fixtures, no network | you | the full output |
| 2 Validator | The HL7 FHIR validator on every bundle this skill builds, run as `references/fhir-knowledge.md` section 11 says | you, if Java and the validator are installed | one table: bundle, errors, warnings |
| 3 Generic payer | The transport on the sandbox (the app's own, or nhcx-adapter when the user chose it) and a generic sandbox payer whose desk you can drive; this skill's legs, every query as a CommunicationRequest, payment from its desk | the user | the ledger thread per leg, the state address after each |
| 4 PMJAY sandbox | SHA Himachal Pradesh, `1518@hcx`; sweep live pre-auths first; one request at a time per case, 30 seconds between; decisions on the payer service desk | the user | the ledger, the archive folder, every refusal verbatim |

## Do

### Rung 1

Run the command from `nhcx-build/9-tests.md`: the whole suite, not only this skill's tests, because a skill that extended a shared module can break another skill's test. Save the whole output to `nhcx-build/10-test-run/<skill>-rung1.log`. In `integrate` mode also run the HMIS's own suite and save it. A failure goes back to stage 7 (the module) or stage 9 (the test); record the fix and the re-run. Do not edit a test to make it pass unless the test was wrong, and say so.

### Rung 2

If the validator runs, validate every bundle this skill's tests built (write them to a folder from the tests). Warnings are advice; the sandbox accepted every pin as it stands. Errors are findings. If it does not run, write `not run` and why.

### Rungs 3 and 4

Prepare, do not run:

1. The commands the user runs: the HMIS with its public callback (`own` or `existing`), nhcx-adapter with its filled config only when the user chose it, and the payer (rung 3). For `own`, the sandbox's dummy payer proves the loop first (`references/transport-knowledge.md` section 3.11). Write them into this skill's section of `nhcx-build/10-test-run.md` under "Runbook".
2. The driver: a script or a spec that walks this skill's matrix rows through the JSON state address, waiting on the case's own state and never on a fixed sleep, logging every verdict the payer gives. The earlier legs a row needs (an eligible case, an approved pre-auth) are reached by the earlier skills' drivers or through the app's own screens.
3. The sweep for rung 4: cancel or let expire every live pre-auth for the beneficiaries the tests use (PAYR-1238 otherwise).
4. Then stop and ask the user to start the services. When they have, run the driver, save its log, and package the run's bundles by correlation id from the per-case archive (or the adapter's ledger, when it is the transport).

While a live run is going: one request at a time per case; wait about 30 seconds after a decision; on "Active instance found" wait and resend up to three times; on a refusal read the ledger thread before touching the code.

## Write

This skill's section of `nhcx-build/10-test-run.md` from `templates/10-test-run.md`: per rung, `passed`, `failed`, `not run` with the reason, the log path, and the findings (each a line: what, where, the PAYR or rule, the fix or the open question). The raw logs under `nhcx-build/10-test-run/`, named for the skill.

## Gate

- [ ] This skill's rung 1 log exists and shows every test in the suite passing, or the failures are listed as findings with a stage to return to.
- [ ] In `integrate` mode the HMIS's own suite log exists and passes.
- [ ] Rung 2 has a table or `not run` with a reason.
- [ ] Rungs 3 and 4 have a runbook and a driver for this skill's rows, and either a log or `not run: user has not started the services`.
- [ ] No rung is marked passed without a log.

## Common mistakes

- Starting a service yourself: the app's public callback, or nhcx-adapter. Only the user does.
- Running only this skill's tests at rung 1. A shared module may have broken another skill's.
- Sleeping a fixed time in a driver. Wait on the state address.
- Reading a refusal as a code bug before reading the ledger thread. Half of them are scheme rules (flow-knowledge section 5).
