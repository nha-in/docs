---
description: Run the sandbox check over endpoint atoms with npm run verify:atoms and report the evidence it writes. Edits no atom and sets no status.
argument-hint: '[<atom-id>] [--list] [--include-destructive]'
---

Run the internal sandbox check and report what it found. Load the `portal-proof` skill and follow the procedure below. Target: `$ARGUMENTS`. If empty, run every endpoint atom.

Atoms carry no verification field and readers never see one. The Catalogue is published as ABDM's statement of how ABDM works. This command produces evidence for contributors, nothing more.

## Usage

```
/atom-verify                                        # every endpoint atom
/atom-verify hiecm.endpoint.m1-get-public-certificate
/atom-verify --list                                 # which atoms would run, and which placeholders each needs
/atom-verify --include-destructive                  # also run bridge and deactivation calls, which change sandbox state
```

## Prerequisites

- `ABDM_CLIENT_ID` and `ABDM_CLIENT_SECRET` in the environment, and knowledge of which facility they belong to
- An environment variable for every other `<PLACEHOLDER>` in the curl (`ABHA_NUMBER`, `MOBILE`, `YOUR_HIP_ID`, ...). `ACCESS_TOKEN`, `FRESH_UUID` and the timestamps are filled by the script. An atom with an unfilled placeholder is skipped and the missing names are printed
- A callback receiver for asynchronous atoms, which you provide yourself. Nothing in this repository provides one

## What it does

1. Runs `npm run verify:atoms`, passing `--only <atom-id>` when one was given
2. For each endpoint atom, runs the curl in section 3 exactly as written, with placeholders filled
3. Scrubs credentials, tokens, Aadhaar numbers, OTPs and full mobile numbers, replacing each with a named placeholder so the shape stays readable
4. Writes the request and response to `catalogue/verification/<atom id>.json`
5. Reports: a 2xx is "matches"; anything else is recorded with its body

## What to do with a mismatch

The script edits nothing. For each atom whose response does not match section 4, read the evidence file and decide:

- The atom is wrong: fix the atom, run `/catalogue-lint --atoms`, recompile
- The cause is unclear: open a GitHub issue against the atom id, quoting the evidence
- The sandbox is unavailable or returns 403 from subscription state: record it as a known condition for section 5

## Output

- Atoms that matched, atoms that did not, and atoms skipped with the placeholder names they need
- The evidence path for each
- Issues opened, and atoms corrected
