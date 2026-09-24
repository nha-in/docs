# NHCX Use Cases

A use case covers each stage of the claims lifecycle: onboarding providers and payers onto the network, verifying coverage, seeking preauthorisation, submitting claims, exchanging supporting information, and reconciling payments. Between them they deliver the core objectives of standardisation, traceability, and predictable auto-adjudication across India's National Health Claims Exchange (NHCX).

## Key Use Cases Overview

- **Onboarding Providers and Payers**: Onboard participants onto NHCX to validate and route requests to target applications.
- **Check Coverage Eligibility**: Called by providers to verify beneficiary coverage, policy validity, sum insured, sub-limits, and document requirements.
- **Preauth Request Submission**: Submitted by providers before admission or planned surgery. Payers respond with a line-item decision.
- **Claim Request Submission**: Submitted by providers upon discharge with final bill, discharge summary, and itemised claims.
- **Communication Request**: Enables payers to query providers for additional documents, flag turnaround-time breaches, or issue policy updates.
- **Payment Notice & Reconciliation**: Payers notify providers of bank transfers, detailing claimed, approved, TDS, and settled amounts.
- **Reprocess / Cancel / Shortfall**: Providers appeal rejected claims, request the balance of a partial payment, or cancel approved preauthorisations.
- **Beneficiary Notifications**: Push notifications to personal health record (PHR) apps on claim status changes.

---

## Master Use Cases Matrix

All 38 use cases by role. Open one to see what it does in plain words, its full detail, the API it calls and where the answer comes back.

### Shared

The following use cases are common to both Payer and Provider participants on the NHCX platform. None of them carries a workflow code, because they are registry and session calls rather than claim transactions.

A1Get participant list

Looks up who is on the network. A hospital uses it to find an insurer, and an insurer uses it to find a hospital.

The participants in the registry, by role. How a provider finds a payer and a payer finds a provider.

**What information goes in and out**

- **You send:** the kind of participant you are looking for, such as insurers.
- **You get back:** each participant's ID, its name, the address it receives messages on, and where to find its encryption certificate.

API call[`/fetch/participants/list`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-fetch-participants-list)

CallbackNone

A2Get policy

Finds the insurance policies a patient holds, using their ABHA number, member ID or mobile number. Each policy names the insurer and the company that processes its claims. Claims are always sent to that processing company.

The policies a beneficiary holds, by ABHA number, member ID or mobile number. Each names the insurer and the processor, and the processor is the recipient for every claim-side call.

**What information goes in and out**

- **You send:** the patient's ABHA number, member ID or mobile number, as `identifiertype` (`AbhaNumber`, `MemberId` or `MobileNo`) and `identifiervalue`.
- **You get back:** each policy number, with the insurer and the claims processor for that policy.

API call[`/participant/get/policies`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-participant-get-policies)

CallbackNone

A3Get public key

Fetches the other side's public key. Every message is locked with the receiver's key, so this comes before sending anything to them.

The recipient's certificate, which is what the bundle is encrypted with. Fetched before anything is addressed to a participant.

**What information goes in and out**

- **You send:** the participant ID of the one you want to write to.
- **You get back:** its public key certificate.

API call[`/fetch/certs`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-fetch-certs)

CallbackNone

A4Get auth token

Gets the pass that every call to the exchange must carry. It is issued with the same client ID and secret used for ABDM.

The ABDM session token every NHCX call carries, minted with your ABDM sandbox client ID and secret.

**What information goes in and out**

- **You send:** your client ID and client secret.
- **You get back:** an access token and how long it stays valid.

API call[`/get/session`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-get-session)

CallbackNone

A5Get status

Asks where an earlier request has got to. Useful when an answer is slow to arrive.

- **FHIR Reference:** [Status and Search, A5](/docs/pr-47/docs/nhcx/v1/reference/fhir/status-and-search#a5-get-status-shared)

Where any request you made got to, by its correlation id. The sandbox's own status page answers without a token.

API call[`/v1/status`API reference](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-v1-status)

Callback[`/v1/on_status`API reference](/docs/pr-47/docs/nhcx/v1/api/other/endpoints/other-webhook-v1-on-status)

A6Receive errors

Where the exchange reports that it could not deliver one of your requests after five tries. Without it, a failed request looks exactly like one still under review, so every participant must have it.

Where the exchange tells you a request could not be delivered after five attempts. Without it a sender never learns that a request died, which looks exactly like a case still under review.

**What information goes in and out**

- **The exchange sends you:** the ID of the request that failed, an error code, and a description of what went wrong.

API callhosted only

Callback[`/v1/error`API reference](/docs/pr-47/docs/nhcx/v1/api/other/endpoints/other-webhook-v1-error)

### Provider

The following use cases are initiated by Provider participants (hospitals, daycare centers) to verify coverage, submit preauthorisations, answer queries, submit claims, and reconcile payments.

B1Check coverage eligibility

Checks that the patient's policy is active, how much cover is left, and which documents the insurer will need. It is usually the first thing a hospital does.

- **Workflow ID:** None
- **FHIR Reference:** [Coverage Eligibility Request, B1](/docs/pr-47/docs/nhcx/v1/reference/fhir/coverage-eligibility-request#b1-check-coverage-eligibility-provider)

Is the policy in force, what is left in the wallet, and what must be attached. One endpoint, four purposes: discovery, validation, benefits, auth-requirements.

API call[`/v1/coverageeligibility/check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-check)

Callback[`/v1/coverageeligibility/on_check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-webhook-v1-coverageeligibility-on-check)

B2Request insurance plan

Downloads the details of the patient's plan: the treatments it covers, the rates it pays, and the documents and forms each one needs.

- **FHIR Reference:** [Insurance Plan Request, B2](/docs/pr-47/docs/nhcx/v1/reference/fhir/insurance-plan-request#b2-request-insurance-plan-provider)

A Task with code poll, keyed on policy number and provider id. The answer is the policy as a benefit structure: packages, rates, documents, questionnaires.

API call[`/v1/insuranceplan/request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-request)

Callback[`/v1/insuranceplan/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-webhook-v1-insuranceplan-on-request)

B3Submit pre-authorisation

Asks the insurer for approval before treatment. The same request is also used to send a revised request, ask for more money, or answer a question from the insurer. The insurer's first reply gives the case its own reference number, and everything after is filed under it.

- **Workflow ID:** [`12`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=12#every-workflow-code), [`121`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=121#every-workflow-code), [`13`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=13#every-workflow-code), [`19`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=19#every-workflow-code), [`131`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=131#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Request, B3](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-request#b3-submit-pre-authorisation-provider)

Permission to treat. A resubmission, an enhancement and a query answer all reuse the same bundle with a new correlation id and the original reference; only the workflow code tells them apart. The acknowledgement on 20 brings the payer's own case number, and the desk files everything under it.

API call[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)

Callback[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-on-submit)

B4Respond to a communication

Replies to a message the insurer sent about a case, such as a request for more documents. The answer goes back on the same case.

- **Workflow ID:** [`24`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=24#every-workflow-code), [`241`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=241#every-workflow-code), [`27`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=27#every-workflow-code)
- **FHIR Reference:** [Communication, B4](/docs/pr-47/docs/nhcx/v1/reference/fhir/communication#b4-respond-to-a-communication-provider)

Acknowledge or answer a message the payer sent about a case. A generic or IRDAI payer raises its query here, as a CommunicationRequest task bundle carrying 24, 241 or 27. The answer is a Communication task bundle on on\_request that echoes the request's correlation id and workflow id. The payer's reason code says what kind of message it was.

API call[`/v1/communication/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-on-request)

Callback[`/v1/communication/request`API reference](/docs/pr-47/docs/nhcx/v1/api/communication/endpoints/communication-webhook-v1-communication-request)

B5Submit claim

Claims payment after the patient is discharged. The amount cannot be more than what was approved before treatment. The insurer's first reply gives the claim its reference number.

- **Workflow ID:** [`15`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=15#every-workflow-code), [`161`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=161#every-workflow-code), [`14`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=14#every-workflow-code)
- **FHIR Reference:** [Claim Request, B5](/docs/pr-47/docs/nhcx/v1/reference/fhir/claim-request#b5-submit-claim-provider)

Reimbursement after discharge. The amount may not exceed what the pre-authorisation approved. The acknowledgement on 25 brings the payer's case number. PMJAY takes a claim query answer on 161 only; 151, 19 and 16 are refused with PAYR-1321.

API call[`/v1/claim/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-submit)

Callback[`/v1/claim/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-webhook-v1-claim-on-submit)

B6Search claims

Looks up claims that match some criteria. The published sources do not agree on which address a hospital uses to search its own claims, so confirm it before building.

- **FHIR Reference:** [Status and Search, B6](/docs/pr-47/docs/nhcx/v1/reference/fhir/status-and-search#b6-search-claims-provider)

Look up claim information by criteria. The provider sandbox exit checklist names /v1/search/submit for claim search, while the Technical Specifications route /search/submit from NHA through NHCX to the payer: a cross-payer search for NHA or a regulator. A provider's search over its own cases is /claim/search in the protocol, which the access-control policy allows for requests that originated from the provider. No source confirms which of the two the sandbox accepts from a provider.

API call[`/v1/search/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-v1-search-submit)

Callback[`/v1/search/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-webhook-v1-search-on-submit)

B7Acknowledge payment notice

Confirms that the hospital received the insurer's payment notice. Every notice must be acknowledged.

- **Workflow ID:** [`30`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=30#every-workflow-code), [`17`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=17#every-workflow-code)
- **FHIR Reference:** [Payment Notice and Acknowledgement, B7](/docs/pr-47/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement#b7-acknowledge-payment-notice-provider)

The receipt for a payment notice, as a Task on this endpoint. The notice arrives on a new thread of its own; a generic payer takes the acknowledgement with the notice's 30 echoed, PMJAY with 17.

API call[`/v1/paymentnotice/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-on-request)

Callback[`/v1/paymentnotice/request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-webhook-v1-paymentnotice-request)

B8Reprocess or cancel

One request for three jobs: appeal a rejected claim, ask for the rest of a part-paid claim, or cancel an approval. An appeal must include a supporting document.

- **Workflow ID:** [`PC01`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=PC01#every-workflow-code), [`36`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=36#every-workflow-code)
- **FHIR Reference:** [Cancel, Reprocess and Shortfall, B8](/docs/pr-47/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#b8-reprocess-or-cancel-provider)

One endpoint, several jobs, told apart by the Task's code and reason: reprocess with claimrejected, shortfall with partialpayment, cancel. A reprocess goes on 36 and is acknowledged on 37; a cancel goes on PC01 and is done on PC02. Both carry the input intimationNumber. A supporting document is mandatory on a reprocess.

API call[`/v1/task/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-v1-task-submit)

Callback[`/v1/task/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-on-submit)

### PMJAY

The following use cases govern the Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) cashless lifecycle as detailed in the official NHA PMJAY Handbook. They follow strict Standard Treatment Guidelines (STG), mandatory biometrics, package rules, and Turnaround Time (TAT) auto-approvals.

D1Fetch the insurance plan

Downloads the scheme's setup for this hospital: the specialities and packages it may offer, their rates, and the documents and forms each one needs. The file is large, so keep a copy and refresh it weekly or whenever the scheme announces a change.

- **FHIR Reference:** [Insurance Plan Request, D1](/docs/pr-47/docs/nhcx/v1/reference/fhir/insurance-plan-request#d1-fetch-the-insurance-plan-pmjay)

Keyed on provider id, policy code and participant id. The answer is the scheme configuration for this hospital: specialities, packages, rates, Claim-Condition flags, mandatory documents and questionnaires. Over twenty megabytes; store it queryable, version it, refresh weekly and on any policychange communication.

API call[`/v1/insuranceplan/request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-request)

Callback[`/v1/insuranceplan/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-webhook-v1-insuranceplan-on-request)

D2Authenticate the beneficiary

Confirms the patient is who they say, by fingerprint, iris or face scan. A successful check gives a pass valid for thirty minutes, used on the cover check and the approval request. A fresh one is needed for the claim. If a scan is impossible, a signed consent form can stand in, except on repeating treatments.

Fingerprint, iris or face; all three must be built. Success yields a user token valid thirty minutes that rides on the eligibility check and the pre-authorisation; a fresh one rides on the claim. Where biometrics are impossible, a signed exemption consent and the matching questionnaire stand in, except on a cyclic case.

**What information goes in and out**

- **It carries:** the patient's ABHA number and the method used to check them.
- **You get back:** a token that the later requests for this patient carry.

API callABHA biometric auth init and verify (not NHCX)

CallbackNone

D3Check coverage eligibility

Shows how much cover is left and what the chosen package needs attached. Register the patient only after cover is confirmed, and check again whenever treatment is added.

- **FHIR Reference:** [Coverage Eligibility Request, D3](/docs/pr-47/docs/nhcx/v1/reference/fhir/coverage-eligibility-request#d3-check-coverage-eligibility-pmjay)

Validation after registration returns the wallet, one benefit entry per wallet with allowed and used. Benefits and auth-requirements before a pre-authorisation return what the package needs attached. Register only after coverage is validated, and validate again every time treatment is added.

API call[`/v1/coverageeligibility/check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-check)

Callback[`/v1/coverageeligibility/on_check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-webhook-v1-coverageeligibility-on-check)

D4Submit pre-authorisation

Asks the scheme for approval, no earlier than one day before admission. It includes the biometric pass or consent, the documents asked for, the treatment guideline form for each package, and the registration and admission dates. It is approved automatically only when it is the first request for the case and every package allows it.

- **Workflow ID:** [`12`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=12#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Request, D4](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-request#d4-submit-pre-authorisation-pmjay)

Sent not more than one day before admission. It carries:

- the biometric token or the consent response
- the documents the auth-requirements answer asked for
- the STG questionnaire for each package
- the registration and admission dates as supporting info

Auto-approved only if it is the first pre-authorisation for the case and every package allows it.

API call[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)

Callback[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-on-submit)

D5Resubmit pre-authorisation

Changes an approved or rejected request to a different amount or package. The new request replaces all earlier ones.

- **Workflow ID:** [`121`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=121#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Request, D5](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-request#d5-resubmit-pre-authorisation-pmjay)

Revises an approved or rejected case for a different amount or package. Nullifies every earlier instance; the payer treats it as the new base request.

API call[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)

Callback[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-on-submit)

D6Raise an enhancement

Asks for more on an approved case. It can be raised as often as needed until discharge, one at a time, and only for packages that allow it. Questions about it arrive on the same case and are answered there.

- **Workflow ID:** [`13`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=13#every-workflow-code), [`131`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=131#every-workflow-code), [`241`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=241#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Enhancement, D6](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-enhancement#d6-raise-an-enhancement-pmjay)

Adds to an approved pre-authorisation, as many times as needed until discharge, one at a time, and only for packages whose plan flag allows it. The bundle carries the approved items and the ones now sought. A query on it arrives as a ClaimResponse on 241, on the case's own thread, and is answered by a fresh submit on 131.

API call[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)

Callback[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-on-submit)

D7Answer a pre-authorisation query

Replies to a question the scheme raised on an approval request. The answer goes on the same case. Sending it as a new request would open a second case by mistake.

- **Workflow ID:** [`19`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=19#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Query and Answer, D7](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-query-and-answer#d7-answer-a-pre-authorisation-query-pmjay)

The query arrived as a ClaimResponse on 24, on the case's own thread, with the question in the item adjudication, not on the communication API. Answer with a fresh submit of the same bundle shape on this code, never as a new 12, which opens a second case.

API call[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-submit)

Callback[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-on-submit)

D8Cancel pre-authorisation

Withdraws an approval request, with a reason such as a change in the treatment plan or the patient's request. Allowed any time before the claim is sent.

- **Workflow ID:** [`PC01`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=PC01#every-workflow-code)
- **FHIR Reference:** [Cancel, Reprocess and Shortfall, D8](/docs/pr-47/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#d8-cancel-pre-authorisation-pmjay)

A Task with code cancel, the case number as input and one of seven reasons: treatmentplanchanged, patientrequest, financialconstraints, alternativetreatment, duplicateclaim, administrativeerror, other. Allowed at any point until the claim is raised.

API call[`/v1/task/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-v1-task-submit)

Callback[`/v1/task/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-on-submit)

D9Submit claim

Claims payment after discharge. There is no separate discharge message: the claim itself records the discharge, with its dates, how the patient left, and a fresh biometric pass. The amount cannot be more than what was approved.

- **Workflow ID:** [`15`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=15#every-workflow-code)
- **FHIR Reference:** [Claim Request, D9](/docs/pr-47/docs/nhcx/v1/reference/fhir/claim-request#d9-submit-claim-pmjay)

There is no discharge submission: the claim asserts the discharge and carries its details. It carries:

- four dates
- the discharge type under category DIS, with the stage as its value
- a fresh biometric token
- on a LAMA or DAMA discharge before or during surgery, LM100 as the single procedure in place of the approved items

The amount may not exceed what was approved.

API call[`/v1/claim/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-submit)

Callback[`/v1/claim/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-webhook-v1-claim-on-submit)

D10Answer a claim query

Replies to a question the scheme raised on a claim, on the same case. The final decision follows, often with a note on why less than the claimed amount was allowed.

- **Workflow ID:** [`161`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=161#every-workflow-code)
- **FHIR Reference:** [Claim Query and Answer, D10](/docs/pr-47/docs/nhcx/v1/reference/fhir/claim-query-and-answer#d10-answer-a-claim-query-pmjay)

As D7, on the claim endpoint: the query is a ClaimResponse on 27, the answer a fresh submit on 161. The sandbox refuses 151, 19 and 16 with PAYR-1321. The final adjudication then arrives with outcome complete and, often, a deductible adjudication naming why the eligible amount is less than the claimed one.

API call[`/v1/claim/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-submit)

Callback[`/v1/claim/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-webhook-v1-claim-on-submit)

D11Reprocess a rejected claim

Appeals a rejected claim, with a supporting document and no amount. Raise it as soon as the rejection arrives. It can be done only once, and the review committee's decision is final.

- **Workflow ID:** [`36`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=36#every-workflow-code)
- **FHIR Reference:** [Cancel, Reprocess and Shortfall, D11](/docs/pr-47/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#d11-reprocess-a-rejected-claim-pmjay)

An appeal, not a resubmission: a Task with code reprocess and reason claimrejected, a supporting document attached, no amount. Raise it the moment the rejection arrives. Once only; the Claim Review Committee is final.

API call[`/v1/task/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-v1-task-submit)

Callback[`/v1/task/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-on-submit)

D12Claim a shortfall

Asks for the rest of a claim that was paid in part. Allowed only after the final payment notice has arrived and been acknowledged. It can be done only once, and not after an appeal.

- **Workflow ID:** [`36`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=36#every-workflow-code)
- **FHIR Reference:** [Cancel, Reprocess and Shortfall, D12](/docs/pr-47/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#d12-claim-a-shortfall-pmjay)

The same Task with reason partialpayment and an amount capped at the difference, allowed only after payment notice 33 has arrived and been acknowledged with 17. Once only, and never after a reprocess.

API call[`/v1/task/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-v1-task-submit)

Callback[`/v1/task/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-on-submit)

D13Acknowledge the payment notice

Up to three notices arrive: when payment starts, when the bank processes it, and when it settles. They show what was paid and what was deducted as tax. The last one carries the bank's transaction reference, so keep it for any dispute.

- **Workflow ID:** [`17`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=17#every-workflow-code)
- **FHIR Reference:** [Payment Notice and Acknowledgement, D13](/docs/pr-47/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement#d13-acknowledge-the-payment-notice-pmjay)

Three notices may arrive: 30 when the transfer is initiated, 31 when the bank processes it, 33 when it settles with the UTR. The reconciliation splits the amount into what was paid and what was deducted as tax. Keep the UTR; it is the reference for any dispute.

API call[`/v1/paymentnotice/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-on-request)

Callback[`/v1/paymentnotice/request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-webhook-v1-paymentnotice-request)

### Payer

The following use cases are implemented by Payer participants (Insurance Companies and Third Party Administrators) to respond to provider inquiries, adjudicate claims, raise queries, and settle payments.

C1Link ABHA with policy

Links a patient's ABHA number, mobile number and member ID to their policy when the policy is created. This is what lets a hospital find the policy later.

Tie the ABHA number, mobile and member id to the policy's products at policy creation, naming the payer and the processor. This is what makes A2 answer.

**What information goes in and out**

- **It carries:** the patient's ABHA number, the policy number, and the insurer the policy belongs to.

API call[`/participant/link/abha/policy`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-participant-link-abha-policy)

CallbackNone

C2De-link ABHA from policy

Removes that link. Only the insurer or claims processor named on the link can do this.

Undo C1. Only the party named as payer or processor on the link may do this.

**What information goes in and out**

- **It carries:** the patient's ABHA number and the policy number to unlink.

API call[`/participant/delink/abha/policy`API reference](/docs/pr-47/docs/nhcx/v1/api/registry/endpoints/registry-participant-delink-abha-policy)

CallbackNone

C3Respond to coverage eligibility

Answers a hospital's cover check with the patient's policy and cover details. An insurer can also ask the exchange to pass the request on to another insurer.

- **FHIR Reference:** [Coverage Eligibility Response, C3](/docs/pr-47/docs/nhcx/v1/reference/fhir/coverage-eligibility-response#c3-respond-to-coverage-eligibility-payer)

The eligibility and plan details for the beneficiary asked about. A payer may instead answer with a forward instruction, asking the exchange to pass the request to another payer.

API call[`/v1/coverageeligibility/on_check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-v1-coverageeligibility-on-check)

Callback[`/v1/coverageeligibility/check`API reference](/docs/pr-47/docs/nhcx/v1/api/eligibility/endpoints/eligibility-webhook-v1-coverageeligibility-check)

C4Respond to insurance plan request

Sends the plan's details to the hospital: covered treatments, rates and required documents. Under PM-JAY this file can be very large.

- **FHIR Reference:** [Insurance Plan Response Overview, C4](/docs/pr-47/docs/nhcx/v1/reference/fhir/insurance-plan-response-overview#c4-respond-to-insurance-plan-request-payer)

The plan as a benefit structure. Under PMJAY this is the scheme configuration for one hospital and can exceed twenty megabytes.

API call[`/v1/insuranceplan/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-v1-insuranceplan-on-request)

Callback[`/v1/insuranceplan/request`API reference](/docs/pr-47/docs/nhcx/v1/api/insurance-plan/endpoints/insurance-plan-webhook-v1-insuranceplan-request)

C5Respond to pre-authorisation

Answers an approval request. The first reply confirms receipt and gives the case a reference number. The decision follows later: an approval, a rejection, or a question for the hospital.

- **Workflow ID:** [`20`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=20#every-workflow-code), [`21`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=21#every-workflow-code), [`23`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=23#every-workflow-code), [`24`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=24#every-workflow-code), [`22`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=22#every-workflow-code), [`231`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=231#every-workflow-code), [`241`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=241#every-workflow-code)
- **FHIR Reference:** [Preauthorisation Response, C5](/docs/pr-47/docs/nhcx/v1/reference/fhir/preauthorisation-response#c5-respond-to-pre-authorisation-payer)

The adjudicated pre-authorisation. The acknowledgement on 20 travels as response.partial and carries the payer's own case number; the decisions travel as response.complete. Read outcome and the adjudication amounts together: complete covers approval and denial alike. Under PMJAY a query is this ClaimResponse on 24 or 241, on the case's own thread.

API call[`/v1/preauth/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-v1-preauth-on-submit)

Callback[`/v1/preauth/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/preauth/endpoints/preauth-webhook-v1-preauth-submit)

C6Raise a communication

Sends a message about a case, such as a request for documents, a warning that a time limit has passed, a grievance or a policy change. PM-JAY does not use this for questions; it asks them on the case itself.

- **Workflow ID:** [`24`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=24#every-workflow-code), [`241`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=241#every-workflow-code), [`27`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=27#every-workflow-code), [`N02`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=N02#every-workflow-code)
- **FHIR Reference:** [Communication, C6](/docs/pr-47/docs/nhcx/v1/reference/fhir/communication#c6-raise-a-communication-payer)

A message about a case, typed by its reason code: additionalinfo, tatquery for a turnaround breach, grievance, walletupdate, policychange, claimArbitration. A generic or IRDAI payer raises its document queries here, as a CommunicationRequest task bundle carrying 24, 241 or 27. It takes the answer as a Communication task bundle on on\_request, echoing the correlation id and workflow id. PMJAY does not use it for queries; its query is the ClaimResponse on the case's own thread.

API call[`/v1/communication/request`API reference](/docs/pr-47/docs/nhcx/v1/api/communication/endpoints/communication-v1-communication-request)

Callback[`/v1/communication/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/communication/endpoints/communication-webhook-v1-communication-on-request)

C7Respond to claim

Decides a claim item by item, showing any deduction and why. The first reply confirms receipt and gives the reference number.

- **Workflow ID:** [`25`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=25#every-workflow-code), [`26`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=26#every-workflow-code), [`27`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=27#every-workflow-code), [`28`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=28#every-workflow-code), [`29`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=29#every-workflow-code), [`291`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=291#every-workflow-code)
- **FHIR Reference:** [Claim Response, C7](/docs/pr-47/docs/nhcx/v1/reference/fhir/claim-response#c7-respond-to-claim-payer)

The adjudicated claim, item by item, with any deduction and its reason. The acknowledgement on 25 travels as response.partial with the payer's case number. Under PMJAY a query is this ClaimResponse on 27, answered by a fresh submit on 161.

API call[`/v1/claim/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-v1-claim-on-submit)

Callback[`/v1/claim/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/claim/endpoints/claim-webhook-v1-claim-submit)

C8Respond to search

Returns the claims that match a search.

- **FHIR Reference:** [Status and Search, C8](/docs/pr-47/docs/nhcx/v1/reference/fhir/status-and-search#c8-respond-to-search-payer)

The ClaimResponse objects matching the criteria asked for.

API call[`/v1/search/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-v1-search-on-submit)

Callback[`/v1/search/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/status/endpoints/status-webhook-v1-search-submit)

C9Send payment notice

Tells the hospital about a payment, itemised into what was approved, what was claimed, and any tax or recovery deducted. The final notice carries the bank's transaction reference.

- **Workflow ID:** [`30`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=30#every-workflow-code), [`31`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=31#every-workflow-code), [`33`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=33#every-workflow-code)
- **FHIR Reference:** [Payment Notice and Acknowledgement, C9](/docs/pr-47/docs/nhcx/v1/reference/fhir/payment-notice-and-acknowledgement#c9-send-payment-notice-payer)

The money, on a new thread of its own, with the reconciliation itemised by type: approved, claimed, tds, servicetax, advance, recovered, penality. The bank's UTR rides on the settled notice.

API call[`/v1/paymentnotice/request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-v1-paymentnotice-request)

Callback[`/v1/paymentnotice/on_request`API reference](/docs/pr-47/docs/nhcx/v1/api/payment-notice/endpoints/payment-notice-webhook-v1-paymentnotice-on-request)

C10Respond to a Task

Answers an appeal, a request for the rest of a part-paid claim, or a cancellation.

- **Workflow ID:** [`252`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=252#every-workflow-code), [`253`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=253#every-workflow-code), [`254`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=254#every-workflow-code), [`PC02`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=PC02#every-workflow-code), [`37`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=37#every-workflow-code)
- **FHIR Reference:** [Cancel, Reprocess and Shortfall, C10](/docs/pr-47/docs/nhcx/v1/reference/fhir/cancel-reprocess-and-shortfall#c10-respond-to-a-task-payer)

The answer to a reprocess, shortfall or cancel. A cancellation done is PC02 and carries the case's ClaimResponse in its output; a reprocess on 36 is acknowledged on 37 as arbitration. Both payers answer this way.

API call[`/v1/task/on_submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-v1-task-on-submit)

Callback[`/v1/task/submit`API reference](/docs/pr-47/docs/nhcx/v1/api/task/endpoints/task-webhook-v1-task-submit)

### Patient app

Personal health record apps and beneficiary portals register on NHCX to receive real-time updates on a patient's claims and authorizations.

E1Subscribe to notifications

A patient's health app signs up when the patient logs in with their ABHA. The latest sign-up replaces any earlier one. The app can hear about claim progress, exchange maintenance, and changes to insurers and hospitals.

- **Workflow ID:** [`N01`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=N01#every-workflow-code), [`N02`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=N02#every-workflow-code), [`N03`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=N03#every-workflow-code), [`N04`](/docs/pr-47/docs/nhcx/v1/concepts/workflow-codes?code=N04#every-workflow-code)

A patient app subscribes when the beneficiary logs in with their ABHA, and the most recent subscription wins. Topics: workflow\_events for claim progress, network\_events for exchange maintenance, participant\_events for changes to payers and providers.

**What information goes in and out**

- **It carries:** the patient's ABHA number, the kinds of update the app wants, and the address the updates should be sent to.

API call[`/v1/notification/subscribe`API reference](/docs/pr-47/docs/nhcx/v1/api/other/endpoints/other-v1-notification-subscribe)

Callback[`/v1/notification/on_subscribe`API reference](/docs/pr-47/docs/nhcx/v1/api/other/endpoints/other-v1-notification-on-subscribe)
