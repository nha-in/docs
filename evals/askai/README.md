# Ask AI evals

The instrument that scores the assistant's answers. Read the design in
`docs/superpowers/specs/2026-09-03-askai-excellence-design.md` first.

- `corpus/` is NHA's own words, harvested verbatim. Never edited.
- `cases/` is the golden set: one JSON file per case, six slices.
- `calibration/owner-grades.json` is the owner's hand grading of 30 cases,
  which the judge must agree with before it grades anything.
- `runs/` is written by the harness. `runs/latest` names the run CI replays.

Run:

    npm run eval:askai:run      # answer every case against Bedrock, record transcripts
    npm run eval:askai:check    # deterministic checks against the latest run, no model
    npm run eval:askai:judge    # grade the latest run with the Bedrock judge
    npm run lint:annexure       # every case cites a source row that exists

A scorecard reports, per slice: factuality (share of A or B on answer
cases), uncertainty (share of correct declines), grounding failures,
forbidden phrases, shape failures, recall at 3 and MRR.
