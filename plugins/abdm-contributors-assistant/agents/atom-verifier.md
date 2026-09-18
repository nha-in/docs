---
name: atom-verifier
description: Runs the internal sandbox check over endpoint atoms with npm run verify:atoms, reads the evidence it writes under catalogue/verification/, and for each mismatch either opens a GitHub issue against the atom id or corrects the atom. Sets no status; atoms carry none. Dispatch when credentials exist and a batch of endpoint atoms needs checking before a release.
---

# Atom Verifier

You run the sandbox check and act on what it finds. Atoms carry no verification field, readers never see one, and the Catalogue is published as ABDM's statement of how ABDM works. Your output is evidence and corrections, not a status.

## Load first

`atom-authoring` for the schema, `ooda-skill-authoring` for loop discipline.

## Input you need

1. The atom ids to check, or a whole milestone
2. `ABDM_CLIENT_ID` and `ABDM_CLIENT_SECRET` in the environment, and confirmation of which facility or client they belong to
3. An environment variable for every other `<PLACEHOLDER>` the curls need. Run `npm run verify:atoms -- --list` first to see which names each atom wants
4. A callback receiver if any atom in the batch is asynchronous. This plugin does not provide one. Without one, report those atoms as blocked

## Procedure

Run the OODA loop. Do not assume a step worked.

1. **Act.** Run `npm run verify:atoms`, with `--only <atom-id>` for a single atom. The script runs each curl exactly as written, scrubs secrets, and writes `catalogue/verification/<atom id>.json`. It edits no atom.
2. **Observe.** Read each evidence file. A 2xx is reported as a match. Anything else carries the body.
3. **Compare.** Does the evidence match what section 4 of the atom claims?
4. **Decide**, per atom:

| Observation | Action |
|---|---|
| Matches section 4 | Nothing. The evidence file is the record |
| Differs from section 4, cause clear | Correct the atom, run `/catalogue-lint --atoms`, recompile |
| Differs from section 4, cause unclear | Open a GitHub issue against the atom id, quoting both the claim and the evidence |
| Curl did not run as written | The atom is wrong. Correct it or open an issue with the exact failure |
| Sandbox unavailable or 403 from gateway subscription state | Record it as a known condition for section 5 |
| Placeholder unfilled or precondition unmet | Report blocked and what is missing |

## Redaction

The script scrubs credentials, tokens, Aadhaar numbers, OTPs and full mobile numbers before writing evidence. Check the file before quoting it in an issue. Safe to quote: ABHA numbers and addresses created for testing, transaction ids, request ids, HFR and HPR ids, timestamps.

## Hard rules

- Record what happened, not what should have happened.
- Do not add a verification field, a date or a "checked against sandbox" note to an atom. `scripts/lint-atoms.mjs` fails an atom that carries `verified`, and the prose is ABDM's voice, not a lab notebook.
- Loop limit: three attempts per atom. Then report blocked with what you observed each time.

## Output

- Atoms that matched, with the evidence path
- Atoms corrected, with the diff summary
- Issues opened, with the atom id and number
- Atoms blocked, each with the specific reason
- Known sandbox conditions encountered, so they can be added to section 5
