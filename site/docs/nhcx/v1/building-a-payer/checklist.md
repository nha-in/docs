---
title: Payer sandbox checklist
sidebar_label: Payer checklist
description: The fifteen use cases a payer demonstrates to leave the sandbox, the four validations on every response, and where payers go wrong.
verification: unverified
source: NHCX Payer Side Use Cases, Sandbox Exit Process; NHCX-PMJAY-HMIS Test Cases; Sample FHIR bundles; Standard Error Codes; Guidelines for Participant Onboarding, payer onboarding
sidebar_position: 8
---

# Payer sandbox checklist
What a payer has to demonstrate to leave the sandbox, the validations the certification checks on every response, and how to test without a real provider.

## In short

- NHA's payer exit process names fifteen use cases, plus `/v1/error` and, for a scheme, biometric validation.
- Four validations are checked on every answering use case.
- There is no dummy provider on the sandbox: build the calling half yourself and point it at your own code.
- The commonest payer mistakes are a missing adjudication reason and an unversioned rate change.

## The sandbox exit list

NHA's payer exit process names fifteen use cases.

| | Use case | Call | Host |
| :---- | :---- | :---- | :---- |
| 1 | Link ABHA with policy | `/participant/link/abha/policy` | |
| 2 | Get policy | `/participant/get/policies` | |
| 3 | De-link ABHA from policy | `/participant/delink/abha/policy` | |
| 4 | Get participant list | `/fetch/participants/list` | |
| 5 | Get public key | `/fetch/certs` | |
| 6 | Get auth token | `/get/session` | |
| 7 | Respond to coverage eligibility | `/v1/coverageeligibility/on_check` | `/v1/coverageeligibility/check` |
| 8 | Respond to insurance plan request | `/v1/insuranceplan/on_request` | `/v1/insuranceplan/request` |
| 9 | Respond to preauthorisation | `/v1/preauth/on_submit` | `/v1/preauth/submit` |
| 10 | Raise communication request | `/v1/communication/request` | `/v1/communication/on_request` |
| 11 | Respond to claim | `/v1/claim/on_submit` | `/v1/claim/submit` |
| 12 | Respond to search | `/v1/search/on_submit` | `/v1/search/submit` |
| 13 | Send payment notice | `/v1/paymentnotice/request` | `/v1/paymentnotice/on_request` |
| 14 | Respond to task request | `/v1/task/on_submit` | `/v1/task/submit` |
| 15 | Get status | `/v1/status` | `/v1/on_status` |

Plus `/v1/error` and, where the payer is a scheme, the biometric token validation.

## The four validations on every response

The checklist repeats them for every answering use case, so the certification will check them on every one:

1. Payload validates against the NRCeS profiles.
2. `api_call_id` and `correlation_id` are different values.
3. `correlation_id` matches the request being answered.
4. `recipient_code` equals the request's `sender_code`.

And each answer is prepared one of two ways: a sealed bundle when the request was processed, or a protocol response when it could not be opened or failed validation.

## Testing without a provider

There is no dummy provider on the sandbox. The practical route is to build the provider's calling half from Getting Started and the provider section, point it at your own participant code, and drive your queues from it. The 22 sample bundles on the portal give you real PMJAY-shaped requests to feed in: every eligibility purpose, a preauthorisation and its query answer, an enhancement, a cancellation, a claim and its query answer.

Scenarios to cover, from the test matrix and the FAQ:

- Eligibility for each purpose; a beneficiary with an exhausted family wallet; a hospital not authorised for the policy.
- Preauthorisation: auto-approve on flags, TAT approve, manual approve, reduce with a note, query and receive the answer, reject with a denial code; enhancement approved and denied; resubmission; cancel before and after payment.
- Claim: approve, reduce, query, in process, forward, reject; each discharge type; `LM100` before surgery.
- Appeal after rejection; shortfall after partial payment, refused before 33; the Committee's answer inside a Task.
- Payment 30, 31, 33 with UTR and TDS; the acknowledgement; a return payment.
- Communication for each reason; the acknowledgement.
- Unspecified, cyclic with per-visit biometrics, newborn and twins, implants within maximums.
- Duplicate requests on one correlation ID; a request while another is in progress; a malformed bundle answered with a protocol response.

## Where payers go wrong

- Answering with `outcome = complete` and no adjudication reason, so the provider cannot tell approval from rejection.
- Reusing the request's `api_call_id` as the response's.
- Sending business refusals in the envelope, where the exchange logs them, instead of inside the sealed response.
- Rates changed in the plan master without a version bump, so every provider's next claim looks tampered.
- Sending 33 before the bank has confirmed, which opens the shortfall window early.
- TAT auto-approval firing because the queue was not ordered by time remaining.

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

- Enrolment through the NHA or IRDAI portal with the payer or TPA role, the IRDAI registry ID without leading zeros, and the production certificate and callback address.
- Every policy linked with the correct processor.
- The plan master versioned and published for every empanelled hospital.
- FHIR bundles validated by NRCeS; internal demo; HTC demo.
