---
description: Run the recorded source hash check, npm run lint:sources, and report drift. It does not fetch NHA sources and it does not open a pull request.
argument-hint: '[--hash <url>]'
---

Check whether the sources the Catalogue records still match what the repository holds. Load the `update-pipeline` skill, and read its first section before you report anything. Target: `$ARGUMENTS`.

## What actually runs

`npm run lint:sources`, which is `scripts/check-source-freshness.mjs`. It hashes everything under `catalogue/openapi/.raw/`, collects every source reference the Catalogue records (a spec's `x-abdm-sources` list, an atom's frontmatter `sources` list), and reports three buckets:

- `MISMATCH`, a recorded sha256 differs from the current `.raw` hash. CI fails on this.
- `MISSING`, a recorded file is nowhere under `.raw/`. A warning, not a failure.
- `UNHASHED`, a reference recorded with a status instead of a hash. Counted as coverage debt.

The same command runs in CI as the `lint-sources` job.

## What this command does not do

- It does not fetch anything from NHA. It compares recorded hashes against files already in the repository, so it detects a raw file changing under the Catalogue, not NHA changing a page.
- It does not flip any atom to `stale`. Nothing does; no atom is stale today.
- It does not open a pull request. There is no bot. If the check reports a `MISMATCH`, a person reads the diff and edits the affected atoms by hand.
- It is not scheduled. Nothing sweeps sources on a timer.

## Usage

```
/source-check                        # run npm run lint:sources and read the output
/source-check --hash <url>           # fetch one URL yourself and print its sha256, for adding a source by hand
```

`--hash` is you fetching and hashing, not a pipeline. Say so when you report the number.

## Reporting

Report the three buckets separately and name every affected atom id. `UNHASHED` is the one people skim past: a source recorded without a hash cannot drift-check, so it is unwatched however watched it looks.

Anything that looks like a change to an endpoint contract goes at the top, because that needs a person now rather than in a review queue.
