---
description: Run the six ABDM Developer Portal eval tasks against the sandbox and record the score.
argument-hint: '[<n>] [--record] [--since <version>]'
---

Run the ABDM Developer Portal eval tasks and score them. Load the `portal-proof` skill. Selection: `$ARGUMENTS`. With no arguments, run all six.

Measures whether an agent can do the work using only the plugin and the MCP.

## Usage

```
/eval-run                    # all six
/eval-run <n>                # one task
/eval-run --record           # write the score to the eval log
/eval-run --since <version>  # re-run only what a Catalogue change could have affected
```

The harness is `scripts/eval-agent.mjs`, reachable as `npm run eval:agent`. It runs each task on a chosen model through `claude -p` with only the integrators plugin and the Docs MCP, reads the task's exit condition from `evals/agent/tasks.json`, and writes the score to `evals/agent/runs/`. Run it rather than doing the tasks in this session: an agent scoring its own run is the fabrication `portal-proof` exists to catch.

```sh
ABDM_CLIENT_ID=... ABDM_CLIENT_SECRET=... npm run eval:agent -- --model haiku --record
```

The floor model is Haiku. Score on Haiku first. A pass on a stronger model proves the model, not the skill.

## The tasks

1. Scaffold an ABHA verification flow from an empty repo
2. Build and validate an OPConsultation bundle
3. Link a care context and push encrypted data
4. Raise an HIU consent request and fetch records
5. Diagnose a failing HIP data push from its error
6. Walk the M1 to M3 test cases to completion

## Scoring

Pass or fail against the exit condition from the relevant atom. No partial credit, because partial credit hides the ambiguity the exit conditions exist to remove.

A pass with no pasted evidence is a fail. The harness enforces this because it has been observed: on 2026-09-16 a Haiku helper reported an NRCeS example bundle as structurally sound without running the validator. A task whose credentials are unset is blocked, not failed.

Also recorded per task: which atoms the agent cited, and how many loops it took. An agent that succeeded citing nothing is a warning, not a pass to celebrate: it used ambient knowledge and will be wrong wherever the Catalogue contradicts its training.

## Prerequisites

Sandbox credentials, a callback receiver, and a clean repository for the scaffolding tasks. Check the sandbox is up before concluding anything from a failure.

## When a task fails

Diagnose in this order: is section 4 observable, is section 5 real, is the error atom linked, is the template wrong, is the sandbox down. Most failures are the first two.

Every failure produces a Catalogue issue with the atom id.
