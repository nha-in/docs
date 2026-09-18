---
id: nhcx.concept.participant-code
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Participant codes and how every message is addressed
summary: >-
  A participant code is the address the exchange issues to each registered organisation,
  and every message carries two of them: the sender's and the recipient's.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/registries
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__registries.md
  hash: sha256:04bf78739fa0c3807a8a5a49d8c3e004f8aba664f524d0344d7fc44c3b2baf42
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/registries, text as shown on the site. Registry table, participant_code row.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 7 Validations.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 7.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Q11.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. Integrator's Journey page 6, step 3c.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 Acceptance scenario body.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Policy Linking Process.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.protocol-headers
  - nhcx.concept.message-identifiers
  - nhcx.concept.policy-linking
  glossary:
  - nhcx.glossary.participant-code
  - shared.glossary.hfr
  endpoints:
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.participant-get-policies
  errors:
  - nhcx.error.nhcx-1003
  - nhcx.error.payr-1001
  sandbox:
  - nhcx.sandbox.test-participants
  - nhcx.sandbox.dummy-payer
---

# Participant codes and how every message is addressed

## In plain words

A [participant code](../glossary/participant-code.md) is your address on the exchange. NHCX issues it when you register. It looks like a number followed by `@` and an instance code, for example `100001@sbx`.

Every message carries two codes: who sent it and who must receive it. NHCX routes on those two codes alone.

## Before you start

You need a confirmed participant record. See [the participant registry](./participant-registry.md).

## What happens

### Where the codes appear

| Place | Field | Holds |
|---|---|---|
| Protected header | `x-hcx-sender_code` | Your code |
| Protected header | `x-hcx-recipient_code` | The code of the participant that must act |
| Certificate lookup | `participantid` in `/fetch/certs` | The code whose certificate you need |
| Your 202 acknowledgement | `result.sender_code`, `result.recipient_code` | The codes from the message you received |
| Policy link | `payerid`, `processingid` | The insurer's code and the TPA's code |

### Codes swap on the way back

```mermaid
graph LR
  subgraph Request
    A1["sender: hospital code"] --> B1["recipient: payer code"]
  end
  subgraph Response
    A2["sender: payer code"] --> B2["recipient: hospital code"]
  end
```

A response reverses the pair. The responder puts its own code in `x-hcx-sender_code`. It puts the original sender's code in `x-hcx-recipient_code`.

### One code per facility

An organisation can hold several participant codes, one for each HFR facility ID. It uses the same ABDM credentials to create all of them.

### Rules for handling a code

- Store the code exactly as NHCX issued it, suffix included.
- Do not build codes or read meaning into the suffix. Sandbox and production codes are both opaque strings.
- Take a payer's code from the participant list or from the policy, never from memory.

## How you know it worked

You have understood this when you can answer both of these.

1. A payer answers your claim. What must it put in `x-hcx-sender_code` and in `x-hcx-recipient_code`?
2. Your hospital group has three facilities with three HFR IDs. How many participant codes do you need, and how many sets of credentials?

## When it goes wrong

**Addressing the wrong party.** A provider must put the policy's `processingID` in `x-hcx-recipient_code`, not the `PayerID`.

**Codes not swapped on a response.** A payer's response must name the original sender as recipient. Otherwise NHCX cannot deliver it to the right system.

**Recipient not registered.** NHCX refuses the message with [NHCX-1003](../errors/nhcx-1003.md).

**Certificate fetched for the wrong code.** The recipient cannot open a message sealed with someone else's key and reports [PAYR-1001](../errors/payr-1001.md).
