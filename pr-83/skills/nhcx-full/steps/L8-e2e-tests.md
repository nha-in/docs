# L8. End-to-end Tests

#### L8G. GOAL
Run the integrated system against the NHCX sandbox with real sandbox participants and prove each exchange completes: the message goes out, the payer's answer comes back through G8, and the screens show the result.

#### L8I. INPUTS
- `nhcx-plan/dry-run.json` all passing.
- Sandbox credentials: the facility's participant code, client id and secret, the private key of the registered certificate, and a public URL NHCX can reach (registered as `endpoint_url`).
- A sandbox payer that answers (for example the scheme's sandbox payer, or a hosted test payer), and test beneficiaries with known member ids or ABHA numbers.

### L8.1 Check the setup
Run G11 checks: session token, participant record, certificate match, endpoint probe. Stop and report if any fails; nothing else is meaningful until they pass.

### L8.2 Run the exchanges one by one
In order, each as its own test with a fresh claim where needed. Each exchange has an id (`X1` to `X10`), used in `e2e.json`:

| Id | Exchange | Screens |
|---|---|---|
| X1 | A1 policy search | S1, S2 |
| X2 | A2 eligibility, and C2 verdict | S3 |
| X3 | A3 insurance plan, and C4 | S7 |
| X4 | A2 auth-requirements, and C3 (only when the payer adapter rules on authorisation requirements, see PAYERS.md; otherwise `skipped`) | S8.2 |
| X5 | A4 pre-authorisation, and C5 | S9 |
| X6 | A6 status, and C8 (only when the payer adapter answers status enquiries; PMJAY does not, so for it record `skipped` with that reason) | S9 |
| X7 | C9 payer query, and A7 reply (or, for a payer in `resubmit` query mode, a queried C5 answered through A4) | S10 |
| X8 | A6 cancel, and C7 (on its own claim) | S9 |
| X9 | A5 claim, and C6; A6 reprocess or release, and C8 | S11 |
| X10 | C10 payment notice, and A8 acknowledgement | S12 |

Also run at least two negative cases where the sandbox payer allows them: a rejected pre-authorisation (the leg ends `rejected`, not `queried`) and a refused cancel (the leg returns to the status it had before the cancel).

For each, wait for the answer by callback, and fall back to polling (A10 to A13) after a bounded time. Record correlation ids and ledger ids so a failure can be traced in G9.

### L8.3 Drive the payer side when needed
Where the sandbox payer needs a decision, take it through A14 and A15 (or the payer's own desk), then wait for the resulting callback.

### L8.4 Check what the operator sees
After each exchange, open the matching screen and check the status chips, amounts and messages the S spec describes.

### L8.5 Record and triage
A failure is classed as ours (fix, then re-run L6 and L7 for the changed files), the sandbox's (retry within the limit, then report), or setup (back to L8.1). At most 3 attempts per exchange.

#### L8O. OUTPUT
Test files in the target's test layout, and `nhcx-plan/e2e.json`:

```json
{
  "environment": {"env": "sandbox", "participant": "", "payer": "", "public_url": ""},
  "setup_checks": [{"check": "session token", "result": "pass | fail", "detail": ""}],
  "exchanges": [
    {
      "id": "X5",
      "apis": ["A4"], "callbacks": ["C5"], "screens": ["S9"],
      "claim": "", "correlation_id": "", "ledger_ids": [],
      "answered_by": "callback | poll | none",
      "result": "pass | fail | blocked | skipped",
      "cause": "ours | sandbox | setup", "detail": "", "attempts": 1
    }
  ],
  "summary": {"pass": 0, "fail": 0, "blocked": 0},
  "corrections": []
}
```

#### L8L. LOG
Record in `nhcx-plan/progress.json` and regenerate `nhcx-plan/progress.md`, as [LOG.md](LOG.md) describes. One entry per sub-step, and one per exchange attempt (the exchange id as `item`) with its correlation and ledger ids and result. A fix made because of a failure is logged as its own entry naming the files changed, then the re-run of L6 and L7 for them.

#### L8X. EXIT
- Every exchange in L8.2 passes, is `skipped` for a reason the payer adapter gives (for example no status enquiry), or is `blocked` with a sandbox or setup cause the user has seen.
- The ledger ids recorded for each exchange exist in G9.
- Every sub-step of L8 has its `started` and closing entries in progress.json, and every file changed is named in one.
