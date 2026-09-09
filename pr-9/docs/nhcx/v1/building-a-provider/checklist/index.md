# Provider sandbox checklist
What a provider has to demonstrate to leave the sandbox, what to test before asking, and where the first week's failures come from.

## In short

- NHA's provider exit process names thirteen use cases, each demonstrated against the dummy payer.
- `/v1/error` is not on the list but is required, and carries neither of the two usual body shapes.
- Test the unhappy paths: duplicate callbacks, unknown correlation IDs, protocol responses, token expiry mid-flow.
- Several workflow-code families exist that no NHA document describes. Log and escalate them rather than ignoring them.

## The sandbox exit list

NHA's provider exit process names thirteen use cases. Each must be shown working against the dummy payer in the internal demo, then the HTC demo.

| | Use case | Call | Host |
| :---- | :---- | :---- | :---- |
| 1 | Get participant list | `/fetch/participants/list` | |
| 2 | Get policy | `/participant/get/policies` | |
| 3 | Get public key | `/fetch/certs` | |
| 4 | Get auth token | `/get/session` | |
| 5 | Check coverage eligibility | `/v1/coverageeligibility/check` | `/v1/coverageeligibility/on_check` |
| 6 | Request insurance plan | `/v1/insuranceplan/request` | `/v1/insuranceplan/on_request` |
| 7 | Preauthorisation submission | `/v1/preauth/submit` | `/v1/preauth/on_submit` |
| 8 | Respond to communication request | `/v1/communication/on_request` | `/v1/communication/request` |
| 9 | Claim submission | `/v1/claim/submit` | `/v1/claim/on_submit` |
| 10 | Claim search | `/v1/search/submit` | `/v1/search/on_submit` |
| 11 | Acknowledge payment notice | `/v1/paymentnotice/on_request` | `/v1/paymentnotice/request` |
| 12 | Reprocess or cancel | `/v1/task/submit` | `/v1/task/on_submit` |
| 13 | Get status | `/v1/status` | `/v1/on_status` |

Every callback must accept both a `JWEPayload` and a `ProtocolResponse`, and answer with the 202 receipt within 30 seconds. `/v1/error` is not on the list but is required. It is the one path that carries neither of those two shapes: it takes a plain JSON report of an undeliverable request, and must still be answered `202`.

## Scenarios to test before the demo

For any payer:

- Registration; a policy not in force; a limit exhausted.
- Preauthorisation: approve, reduce with a note, query via communication and the answer, reject; enhancement; resubmission; cancel.
- Provisional discharge submission approved, rejected and queried; final claim: approve, reduce, query, in process, forwarded, reject.
- Reprocess after rejection and after a reduced approval; the Task answer parsed as a ClaimResponse.
- Payment 30, 31, 33 and the acknowledgement; a communication of each reason.
- A callback that arrives twice; a callback with an unknown correlation ID; a protocol response.
- Token expiry mid-flow; certificate rotation on the payer side.

For PMJAY, from the test matrix and the FAQ, in addition:

- Biometric registration in each of the three modes; the consent fallback; token refresh and expiry.
- Wallet update; registration cancelled.
- Preauthorisation with an implant, with a stratification, with an STG questionnaire; auto-approval on flags; a query answered on the preauthorisation endpoint.
- Discharge in each of the four modes, and the amount calculation for each; `LM100` before surgery.
- Shortfall after partial payment, refused before 33; the Committee path.
- Unspecified procedure; cyclic procedure across several visits; a newborn on the parent's card; twins.

Under PMJAY, add biometric authentication in all three modes and structured health-information types to the exit list, and expect the PMJAY team demo as an extra step.

The dummy payer's `process/request` hook drives approve, reject and query on demand; `paymentNotice/init` drives a payment notice.

## Where the first week goes wrong

Roughly in the order the portal's own support list has them. Two entries below are reworded from experience rather than quoted, so treat the portal's list as the authority if the two differ:

1. Wrong status word on a leg of the message.
2. No `/v1/error` endpoint.
3. Callback answering with something other than 202 and the receipt.
4. Envelope headers missing or malformed.
5. Registry ID inside the bundle not matching the participant record.
6. `Accept: application/json` missing.
7. Sending to `payerid` instead of `processingid`.
8. Reusing a correlation ID after an error.
9. Retrying a `401` with the same token.
10. Package code or display not matching the plan, character for character.

## Exchanges this documentation does not cover

The workflow sheet defines several families that no NHA document describes beyond their codes. They exist on the network, a participant may receive one, and none is covered here:

- **Final bill.** 45 submitted, 46 approved, 47 queried, 181 query answered, 491 denied. A settlement stage between claim and payment in schemes that use it.
- **Reimbursement claims.** R15, R151, R26, R27, R28, R291, R122, R252 to R254. The member-reimbursement lifecycle, mirroring the cashless one.
- **Discharge correction.** DC01, DC02. Amending a discharge already submitted.
- **Preauthorisation arbitration.** 41, 42. An appeal against a preauthorisation decision, distinct from claim arbitration.
- **Wallet upgrade.** 34, 35. **Fraud alert.** 38, 39. **Grievance.** G11, G12, G13. Each has its own code pair, although the handbook routes wallet and grievance through the communication channel instead.
- **Claim document query.** 161, and 16 for a preauthorisation resubmission, both in the value set without further description.

Treat an incoming code from these families as one to log and escalate rather than one to ignore.

## Before going live

- FHIR bundles emailed for NRCeS validation and passed.
- Internal demo with NHA, then HTC demo.
- Production participant created through the passcode flow; certificate and callback URL registered; own certificate fetched back and checked.
- Under PMJAY, the HEM-to-participant mapping ticket raised, and staff briefed that in-flight TMS cases finish in TMS; see chapter 07.
- A pilot on a few real cases before switching the whole hospital.
