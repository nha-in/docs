# NHCX

The Ayushman Bharat Digital Mission ([ABDM](/docs/nhcx/v1/getting-started/glossary#abdm)) is India's national
health data network, run by the National Health Authority ([NHA](/docs/nhcx/v1/getting-started/glossary#nha)).
It is three gateways, not one, and this section documents the third of them.

[NHCX](/docs/nhcx/v1/getting-started/glossary#nhcx) is the National Health Claims Exchange. It carries insurance
claims and their responses between providers and payers. This section covers the exchange as NHA
defines it for any payer, and PMJAY as the scheme that runs on it with its own rules.

## In short

- A hospital connects once and an insurer connects once, each to the exchange. Either can then reach the other.
- Every substantive exchange is asynchronous: a request out, a receipt, and the answer later on a callback.
- Every message is a FHIR bundle sealed for the recipient inside a JWE envelope the exchange can route but not read.
- Both sides build the same base framework first, then the use cases their role needs.
- PMJAY runs the same endpoints with scheme rules layered on top.

## Where to start

| If you are | Start at |
| --- | --- |
| Deciding whether to build | [What NHCX is](/docs/nhcx/v1/concepts/what-nhcx-is), then [claim settlement](/docs/nhcx/v1/concepts/claim-settlement) and [the NHCX way](/docs/nhcx/v1/concepts/nhcx-way-of-claim-settlement) |
| Running a claims desk | [Claim settlement](/docs/nhcx/v1/concepts/claim-settlement), then [Building a provider](/docs/nhcx/v1/building-a-provider) or [Building a payer](/docs/nhcx/v1/building-a-payer) |
| Designing the screens | The [provider UI guide](/docs/nhcx/v1/building-a-provider/ui-guide) or the [payer UI guide](/docs/nhcx/v1/building-a-payer/ui-guide) |
| Engineering a provider | [Get started](/docs/nhcx/v1/getting-started) end to end, then [Building a provider](/docs/nhcx/v1/building-a-provider) |
| Engineering a payer | [Get started](/docs/nhcx/v1/getting-started) end to end, then [Building a payer](/docs/nhcx/v1/building-a-payer) |
| Integrating without building the protocol | The [NHCX adapter](/docs/nhcx/v1/getting-started/nhcx-adapter), then the FHIR reference for the bundles you still write |
| Going live against PMJAY | The [PMJAY sandbox run](/docs/nhcx/v1/building-a-provider/pmjay-sandbox-run), then [PMJAY provider](/docs/nhcx/v1/building-a-provider/pmjay-provider) |
| Writing bundles | [Bundles and conventions](/docs/nhcx/v1/fhir-reference/bundles-and-conventions), then the chapter for your exchange |
| Looking something up | [Workflow codes](/docs/nhcx/v1/exchanges/workflow-codes), the [NHCX glossary](/docs/nhcx/v1/getting-started/nhcx-glossary), [codes and value sets](/docs/nhcx/v1/fhir-reference/codes-and-value-sets) |

## Who is on it

| Participant | What it does |
| --- | --- |
| Provider | A hospital or clinic, identified by its Health Facility Registry entry. |
| Payer | An insurance company, or a government agency paying for a scheme. |
| TPA | A third-party administrator processing claims for an insurer. On the network it behaves as a payer. |
| Regulator | IRDAI and bodies like it, which can search claims across every payer. |
| Scheme sponsor | The owner of a programme, for example NHA for Ayushman Bharat. |
| Patient app | A personal health record app receiving notifications for a beneficiary. |
| NHCX | The exchange in the middle, routing between registered participants. |

Both providers and payers onboard as participants, in sandbox first and then in production.
[Participants and policies](/docs/nhcx/v1/registries/participants-and-policies) covers how that
works and how a beneficiary is matched to a policy.

## HIE-CM or NHCX

Claims are not health records. If your product shares or fetches a patient's clinical record, you
are on HIE-CM. If it submits or adjudicates an insurance claim, you are on NHCX. A hospital system
can end up on both. The two integrations share no API surface.

## What is verified and what is not

Coverage eligibility in all four purposes, the insurance plan, the preauthorisation, an
enhancement, the claim, and the Payer Service adjudication of all three were run against the SHA
HP sandbox payer on 5 and 6 September 2026, end to end to an approved claim. That run is recorded
in the [PMJAY sandbox run](/docs/nhcx/v1/building-a-provider/pmjay-sandbox-run).

Everything else is built from NHA's published documents, collections and sample payloads. Where
those documents disagree with each other, the pages say so and name which reading the live samples
follow rather than picking silently.

## Next

- [Get started](/docs/nhcx/v1/getting-started), the base framework every participant builds
- [Core concepts](/docs/nhcx/v1/concepts), what a claim is made of
- [Exchanges and codes](/docs/nhcx/v1/exchanges), every endpoint with its callback and workflow code
- [FHIR reference](/docs/nhcx/v1/fhir-reference/bundles-and-conventions), what goes inside the sealed payload
- [API references](/docs/nhcx/v1/api), the 41 operations as interactive OpenAPI
- [Choose your gateway](/docs/hiecm/v3)
- [Support](/docs/support), for anything about these pages rather than about NHCX itself
