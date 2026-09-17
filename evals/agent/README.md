# Agent evals

The six tasks from `portal-proof`, run on a chosen model with only the
integrators plugin and the Docs MCP, and scored pass or fail against the exit
condition in `tasks.json`.

```sh
ABDM_CLIENT_ID=... ABDM_CLIENT_SECRET=... npm run eval:agent -- --record
node scripts/eval-agent.mjs --model haiku --task 2
```

The floor model is Haiku. A skill is not done when Opus passes; it is done
when Haiku passes. Run on Haiku first and on a stronger model only to find out
whether a failure is the skill or the model.

Rules the script enforces:

- A task whose `needs` variables are unset is `BLOCKED`, never `FAIL`.
- A `PASS` with empty `evidence` is scored `FAIL`. The agent pastes the tool or
  sandbox output that shows the exit condition, or it did not pass.
- A `PASS` that cites no atom is flagged. It used ambient knowledge and will
  be wrong wherever the Catalogue contradicts its training.

Runs land in `runs/<date>-<catalogue version>-<model>.json`. The first entry is
the 2026-09-16 hand run that produced this harness: task 2 passed on Haiku,
the other five were blocked on credentials.

Tasks 3 to 6 need a public callback URL. Nothing in this repo provides one.
