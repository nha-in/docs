# Sandbox exit evidence

[Payer checklist](/docs/pr-115/docs/nhcx/v1/roles/payer/payer-checklist) names the fifteen use cases and the test cases under them. This page is how you prove each one: the recording a checkpoint is ticked against, what done looks like, the mistake that most often fails it, and the evidence pack the demonstration is scored on.

## In short

- A checkpoint is done only against a sandbox or staging recording: the request, the 202 within 30 seconds, the callback, and the hospital screen.
- The evidence pack is correlation ids with timestamps, hospital screenshots, master data, the money trail, and the negative tests.
- Every acknowledgement in a recording is within 30 seconds. Decisions travel later.

## The recording

Four things, for every checkpoint:

1. The request as sent.
2. The 202 acknowledgement, timestamped within 30 seconds of the request.
3. The callback, `on_*`, that carried the answer.
4. The hospital screen after the callback.

A checkpoint with a decision but no acknowledgement timestamp, or an acknowledgement but no hospital screen, is not done.

## Done when, and the watch-out

| Checkpoint                   | Done when                                                                                                                                                                                                          | Watch out for                                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 01 Link ABHA with policy     | Linking runs from issuance and endorsement, so a member is linked the day cover starts. A duplicate member and payer pair is refused with `NHCX-1043`, an ABHA of the wrong length with `NHCX-1041` or `NHCX-1042` | Linking under a token that belongs to neither the `payerid` nor the `processingid` on the link, refused with `NHCX-1048`       |
| 03 De-link ABHA from policy  | The association is removed by `memberid` plus `payerid`, under the token that created the link, and your own audit records who de-linked and why                                                                   | De-linking by ABHA alone. Expecting NHCX to hold the business reason, which it does not store                                  |
| 04 Get participant list      | Operations can list `ACTIVE` providers with HFR or participant codes, to accept or to monitor                                                                                                                      | Building a closed two-party integration. NHCX is a network, not a bilateral link                                               |
| 06 Get auth token            | Your backend holds the token and refreshes it                                                                                                                                                                      | A browser application obtaining a token                                                                                        |
| 08 Coverage eligibility      | The 202 is within 30 seconds and the wallet shows on the hospital screen                                                                                                                                           | Wallet figures on a benefit type other than `30`, which never reach the screen                                                 |
| 10 Raise a communication     | The hospital's acknowledgement on 18 arrives against the query you raised on 24 or 27                                                                                                                              | A new workflow id when the hospital answers a resubmit. A wallet upgrade or a TAT notice treated as a Task reprocess           |
| 12 Respond to search         | An unknown member returns an empty result or a coded miss, never a 500                                                                                                                                             | A search implemented against a partial store, so historic cases stay invisible                                                 |
| 13 Send payment notice       | After a test settlement, the hospital screen shows Paid or Initiated as designed                                                                                                                                   | A notice sent before a UTR or settlement reference exists. Telling the hospital payment happened "on NHCX"                     |
| 14 Task cancel and reprocess | Four recordings, listed below                                                                                                                                                                                      | A Task answer without `ClaimResponse.outcome`, which does not display. A `release` left hanging instead of refused with a code |
| 15 Get status                | Status after queued, after approve, and after payment notice are each distinct                                                                                                                                     | Treating status as a submit. Returning queued forever because no terminal outcome was stored                                   |

The four recordings for checkpoint 14:

1. A preauthorisation cancel by `intimationNumber`. The hospital shows Preauthorization Cancelled, and a later claim on that `CLN` is refused.
2. A claim cancel by `claimNumber`.
3. A reprocess of a rejected claim.
4. A coded refusal of an unknown Task combination.

## The evidence pack

| Evidence                      | What to capture                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| Correlation id and timestamps | The 202 acknowledgement under 30 seconds, and the `on_*` callback later            |
| Hospital screenshot           | Approved, Rejected and Queried, plus the Communication cycle if you use it         |
| Master data                   | The IRDAI product, and the TPA's `processingid`                                    |
| Money                         | The bank UTR, then the `PaymentNotice` that carries it                             |
| Negative tests                | `NHCX-1016`, `NHCX-1043`, `NHCX-1048` and `NHCX-1049`; `PAYR-1032` and `PAYR-1035` |

## Mistakes the demonstration catches

- Deciding before acknowledging. Send the 202 first; decide later.
- The wallet on the wrong benefit. Only type `30` reaches the hospital eligibility screen.
- A decision with a blank `outcome`. A later true decision beats a fake Submitted.

## The NHA documents the demonstration follows

- NHCX Payer Side Use Cases: Sandbox Exit Process.
- Onboarding Providers and Payers, sandbox and production.
- Policy Linking and De-Linking Process.
- The Coverage Eligibility, Preauthorization, Claim and Payment specifications.
- Standard Error Codes and Common Mistakes.
