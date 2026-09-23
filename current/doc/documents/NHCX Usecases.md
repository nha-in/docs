# NHCX Usecases

*Source: `documents/NHCX Usecases.pdf` — extracted full text*

**Pages: 2**


---

## Page 1

National health claim exchange
The National Health Claims Exchange works as exchange gateway that enables the transfer
of health claim requests or responses from one entity to other (destination). Just as
routing switches or email gateways ensure that messages are sent and received with the
appropriate levels of consistency, security, privacy, and durability. National Health Claims
Exchange serves as a protocol for exchanging claims-related information among various
actors, including payers, providers, beneficiaries, regulators, and observers.
HCX Objectives
• Reduce receivable cycles and increase acceptance of cashless claims (even in
smaller hospitals)
• Facilitate insurance innovation by enabling new processes/rules for auto
adjudication, control fraud and abuse prevention.
• Standardized the claims process to reduce the operational overheads and
increase the trust among payers and providers through a transparent and rule-
based mechanism.
• Better patient experience
HCX Key Use cases
Use-Case Name Description
Onboarding providers, payers This functionality will be for onboarding
providers and payers onto the NHCX platform to
validate and route the request to target
applications.
Check Coverage Eligibility This functionality will be called by providers to
check the eligibility of a beneficiary with the
payors via NHCX.
Preauth Request Submission This functionality will be called by providers to
submit the Preauth Request of a beneficiary with
the payors via NHCX. Payer application will
implement the required logic to store the
preauth request details and respond to the
providers through NHCX with the adjudication
details using on_submit callback API.
Predermination Request This functionality will be called by providers to
Submission submit the Predetermination Request of a claim
with the payors via NHCX. Payer application will
implement the required logic to store the
predetermination request details and respond to
the proviers through NHCX with auto

**Table 1.1**

|  | Use-Case Name |  | Description |
|---|---|---|---|
| Onboarding providers, payers |  | This functionality will be for onboarding<br>providers and payers onto the NHCX platform to<br>validate and route the request to target<br>applications. |  |
| Check Coverage Eligibility |  | This functionality will be called by providers to<br>check the eligibility of a beneficiary with the<br>payors via NHCX. |  |
| Preauth Request Submission |  | This functionality will be called by providers to<br>submit the Preauth Request of a beneficiary with<br>the payors via NHCX. Payer application will<br>implement the required logic to store the<br>preauth request details and respond to the<br>providers through NHCX with the adjudication<br>details using on_submit callback API. |  |
| Predermination Request<br>Submission |  | This functionality will be called by providers to<br>submit the Predetermination Request of a claim<br>with the payors via NHCX. Payer application will<br>implement the required logic to store the<br>predetermination request details and respond to<br>the proviers through NHCX with auto |  |


---

## Page 2

adjudication details against the policy and past
history of the beneficiary using on_submit
callbac API.
Claim Request Submission This functionality will be called by providers to
submit the Claim Request of a beneficiary with
the payors via HCX. Payer application will
implement the required logic to store the Claim
request details and submit the claim response
(adjudication details) by calling the on_submit
callback API.
Payment Notice This functionality will be called by payers to
submit the Payment status of a claim with the
bank reference numbers such as scroll status
along with UTR numbers.
Communication Request This functionality will be called by payers to
Submission communicate the remarks of a claim with the
providers via HCX. Provider application will
implement the required logic to store the
communication details and respond to the
payers with required information to process the
claim.
Reprocess Request This functionality will be called by providers to
request payers to reprocess the claim when it is
partially paid or rejected by the claim processing
officer.

**Table 2.1**

|  | adjudication details against the policy and past<br>history of the beneficiary using on_submit<br>callbac API. |
|---|---|
| Claim Request Submission | This functionality will be called by providers to<br>submit the Claim Request of a beneficiary with<br>the payors via HCX. Payer application will<br>implement the required logic to store the Claim<br>request details and submit the claim response<br>(adjudication details) by calling the on_submit<br>callback API. |
| Payment Notice | This functionality will be called by payers to<br>submit the Payment status of a claim with the<br>bank reference numbers such as scroll status<br>along with UTR numbers. |
| Communication Request<br>Submission | This functionality will be called by payers to<br>communicate the remarks of a claim with the<br>providers via HCX. Provider application will<br>implement the required logic to store the<br>communication details and respond to the<br>payers with required information to process the<br>claim. |
| Reprocess Request | This functionality will be called by providers to<br>request payers to reprocess the claim when it is<br>partially paid or rejected by the claim processing<br>officer. |
