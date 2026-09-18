---
id: nhcx.concept.access-control
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Who may call what: the NHCX access control matrix'
summary: >-
  Each role on the exchange may send and receive only certain messages and search
  only certain data, and the exchange and payers enforce this from the registry
  and the session token.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/access-control
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__access-control.md
  hash: sha256:7c3d7b2cf396a9daaca76ade1c059a8d358d0686b7b7e041e96c5f7f239dae57
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/access-control, text as shown on the site. Access Controls role table.
- url: https://hcxsbx.abdm.gov.in/#/introduction-NHCX/guidlines-for-participant-onboarding
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/introduction-NHCX__guidlines-for-participant-onboarding.md
  hash: sha256:58aaa762f2a04565e2060658b0eda95e3cac4cbb0819b6d865f04cf53066680d
  fetched: '2026-09-14'
  note: Site page /introduction-NHCX/guidlines-for-participant-onboarding, text as shown on the site. Deboarding scenarios.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, Validation for De-Linking.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/registries
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__registries.md
  hash: sha256:04bf78739fa0c3807a8a5a49d8c3e004f8aba664f524d0344d7fc44c3b2baf42
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/registries, text as shown on the site. Participating Organisations/Systems Registry, roles attribute.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Q9 correct Role and Registry mapping.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, 'No user role found' row.
related:
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.policy-linking
  - nhcx.concept.beneficiary-consent
  - nhcx.concept.audit-and-non-repudiation
  - nhcx.concept.grievance-redressal
  - nhcx.concept.session-token
  endpoints:
  - nhcx.endpoint.search-submit
  - nhcx.endpoint.status
  flows:
  - nhcx.flow.claim-search
  - nhcx.flow.status-check
  glossary:
  - nhcx.glossary.irdai
  - nhcx.glossary.payer
  - nhcx.glossary.provider
---

# Who may call what: the NHCX access control matrix

## In plain words

Not every participant may send every message. A hospital may submit claims but not payment notices. A payer may send payment notices but not claims. A regulator may search claims but not submit them.

These rules follow from each participant's registered role. NHCX and the payers check them on every call.

## Before you start

Read [participant roles](./participant-roles.md).

## What happens

### The matrix, version 1

| Role | May send | May receive | May search |
|---|---|---|---|
| `provider` | Eligibility, preauthorisation and claim requests; payment acknowledgements | Their responses; payment notices | Status of preauthorisations and claims it sent |
| `payer`, `agency.tpa` | Responses to eligibility, preauthorisation and claim; payment notices | Those requests; payment acknowledgements | Payment confirmation for notices it sent |
| `agency.regulator` | Claim searches | Search results | Claims, forwarded by NHCX to all payers |
| `research` | Eligibility responses | Eligibility requests | Preauthorisations and claims, aggregate and anonymised only |
| `member.isnp` | As research | As research | As research, plus individual claims with the beneficiary's consent |
| `agency.sponsor` | As a payer | As a payer | As a payer |
| Other NHCX instances | As the use case needs | As the use case needs | Never the payload |

A TPA acts exactly like a payer in version 1. A scheme sponsor, such as the owner of a government scheme, gets payer-level access.

### How the rules are enforced

```mermaid
graph LR
  T["Session token<br/>identifies the client"] --> X["NHCX"]
  RG[("Registry<br/>roles per participant")] --> X
  X -->|allowed| P["Recipient"]
  P -->|checks the sender's role| OK["Processes"]
```

- Your session token identifies your client. NHCX compares it with the participant that client registered.
- The registry records your role. NHCX and payers read it.
- Some actions are tied to one participant. Only the participant named as `payerid` or `processingid` on a policy link may de-link it.

### Losing access

A participant can be removed. A regulator may suspend a provider for fraud, or a payer or TPA. NHCX may remove a participant for serious policy breaches, hacking attempts, or traffic that harms the exchange. A participant may also leave on its own. Removal that is not voluntary comes with warnings, and the participant can appeal through [grievance redressal](./grievance-redressal.md).

## How you know it worked

You have understood this when you can answer both of these.

1. A research body asks NHCX for a named patient's claim history. What does its role allow it to see?
2. Your hospital system tries to search claims raised by another hospital. What does the matrix allow?

## When it goes wrong

**Role and registry type do not match.** A wrong mapping at creation leads to refused calls and wrong routing later.

**No role for the sender.** A payer refuses a sender with no role with the message "No user role found/associated for sender code".

**De-linking with the wrong credentials.** The token must come from the client that created the `payerid` or `processingid` participant.

**Individual data without consent.** An insurance self network platform may query an individual's claims only with that person's consent. See [beneficiary consent](./beneficiary-consent.md).
