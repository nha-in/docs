---
id: nhcx.concept.policy-linking
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Linking an ABHA to an insurance policy
summary: >-
  A payer links a person's national health account number to the policies they hold,
  so a hospital can look up the patient's cover from that number alone and address
  its claims to the right processor.
sources:
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Pages 1-2.
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Get Policies request body.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 7.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 7.4 Usage Guidelines, Discovery.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.policy-link-and-delink
  endpoints:
  - nhcx.endpoint.participant-link-abha-policy
  - nhcx.endpoint.v2-participant-link-abha-policy
  - nhcx.endpoint.participant-delink-abha-policy
  - nhcx.endpoint.v2-participant-delink-abha-policy
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.v2-participant-get-policies
  tests:
  - nhcx.test.payer-uc-01
  - nhcx.test.payer-uc-02
  - nhcx.test.payer-uc-03
  - nhcx.test.provider-uc-02
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.participant-code
  - nhcx.concept.coverage-eligibility-purposes
  - nhcx.concept.access-control
  glossary:
  - shared.glossary.abha-number
  - shared.glossary.abha
  - nhcx.glossary.tpa
  - nhcx.glossary.payer
---

# Linking an ABHA to an insurance policy

## In plain words

When a person buys a health policy, the insurer can link it to the person's [ABHA number](../../shared/glossary/abha-number.md). After that, any hospital on NHCX can ask "which policies does this ABHA hold?" and get an answer.

The answer also says who processes claims on each policy: the insurer itself, or a [TPA](../glossary/tpa.md) acting for it. That is the participant a hospital must address.

## Before you start

A payer needs its own participant code. Every insurer has one, even when a TPA handles its claims. See [participant roles](./participant-roles.md).

## What happens

```mermaid
graph LR
  PY["Payer or TPA"] -->|link: ABHA, member ID,<br/>payerid, processingid, policies| REG[("Policy links<br/>in the participant service")]
  H["Hospital"] -->|get policies: ABHA or mobile| REG
  REG -->|policies with payerid, processingid| H
  H -->|claims addressed to processingid| X["NHCX"]
```

### Linking

The payer calls `/participant/link/abha/policy` on the participant service. The request carries:

| Field | Holds |
|---|---|
| `requestid` | A UUID for this request |
| `abhanumber` | The person's ABHA number |
| `mobilenumber` | The person's mobile number |
| `memberid` | The payer's member ID for the person |
| `payerid` | The insurer's participant code |
| `processingid` | The participant code of whoever processes claims: the TPA, or the insurer itself |
| `policies` | A list of `productid` and `productname` pairs |

### Looking up

A hospital calls `/participant/get/policies` with the ABHA number or mobile number. Each policy comes back with its payer and processor. The hospital puts the `processingid` in `x-hcx-recipient_code` for eligibility, preauthorisation and claim messages on that policy.

If the lookup returns nothing, the hospital can ask the payer directly with a coverage eligibility check using the `discovery` purpose. See [coverage eligibility purposes](./coverage-eligibility-purposes.md).

### De-linking

`/participant/delink/abha/policy` removes policies from the link. Only the participant named as `payerid` or `processingid` when the link was made may de-link it. NHCX reads the client ID from the session token and compares it with the one that registered that participant.

When an insurer moves to a new TPA, it de-links its existing policies and links them again with the new TPA's participant code as `processingid`.

## How you know it worked

You have understood this when you can answer both of these.

1. The get policies response shows `payerid` A and `processingid` B. To which participant does your hospital send the claim, and why?
2. A TPA stops handling an insurer's policies. What must happen to the existing links, and who is allowed to do it?

## When it goes wrong

**Claims addressed to the insurer.** A provider that uses the `PayerID` instead of the `processingID` sends claims to a participant that does not process them.

**De-link refused.** The session token belongs to a client other than the one registered for `payerid` or `processingid`. Generate the token with the credentials used when that participant was created.

**Policy not in the link.** De-linking a policy the link does not hold fails with "There is no policies with requested details".

**Nothing found for the patient.** Fall back to a `discovery` eligibility check.
