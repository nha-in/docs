# Ask AI evals

The instrument that scores the assistant's answers. Read the design in
`docs/superpowers/specs/2026-09-03-askai-excellence-design.md` first.

- `corpus/` is NHA's own words, harvested verbatim. Never edited.
- `cases/` is the golden set: one JSON file per case, six slices.
- `calibration/owner-grades.json` is the owner's hand grading of 30 cases,
  which the judge must agree with before it grades anything.
- `runs/` is written by the harness. `runs/latest` names the run CI replays.

Run:

    npm run eval:askai:run      # answer every case against Bedrock, record transcripts, write runs/latest
    npm run eval:askai:check    # deterministic checks against the latest run, no model
    npm run eval:askai:judge    # grade the latest run with the Bedrock judge
    npm run eval:askai:report   # render the latest run's scorecard as a table
    npm run lint:annexure       # every case cites a source row that exists

`run` writes checks, retrieval, and a scorecard for the run it just answered,
and names it in `runs/latest` so the commands above never need `-run` by
hand. `judge` and `report` overwrite that run's `scorecard.json` with the
judged numbers once grading has run.

A scorecard reports, per slice: factuality (share of A or B on answer
cases), uncertainty (share of correct declines), grounding failures,
forbidden phrases, shape failures, recall at 3 and MRR.

## Gates

CI runs `eval:askai:check` on every pull request, against the last recorded
run named in `runs/latest`, with no model and no credentials. Until the
first run is recorded the gate passes without proving anything: it says so
and exits clean rather than turning the whole repository red. Once a run
exists, a case that fails and is not already in `runs/baseline.json` fails
the build; the baseline only ever shrinks, so fixing a case is what tightens
the gate.

Pull requests labelled `eval`, and every night against `main`, get the full
judged run instead: all 150 cases, answered, checked and graded by the
judge. Merge is blocked when overall factuality or uncertainty falls, or the
count of ungrounded literals rises, against the run named in `runs/latest`.
The scorecard, with its delta from that run, is posted as a comment on the
pull request. After a nightly run on `main` passes, `runs/latest` is updated
by a pull request that commits the new run, so the comparison point moves
forward deliberately rather than on every push.
