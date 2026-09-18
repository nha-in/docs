---
id: nhcx.sandbox.environments-and-base-urls
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: NHCX environments, hosts and base URLs
summary: >-
  The two environments, the web portals, and the two base addresses every call is
  built on, for testing and for live claims.
sources:
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 13 Important Links and URLs.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q2, Q17 and Q19.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Step 1.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 2-3 curl examples.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Guidelines for Participant Onboarding.
related:
  sandbox:
  - nhcx.sandbox.prerequisites
  - nhcx.sandbox.going-live
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.callback-url-requirements
  concepts:
  - nhcx.concept.session-token
  - nhcx.concept.participant-code
  decisions:
  - nhcx.decision.session-endpoint
  endpoints:
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.coverageeligibility-check
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.everything-returns-401
  glossary:
  - shared.glossary.nhcx
  - shared.glossary.sandbox
  - shared.glossary.abdm
---

# NHCX environments, hosts and base URLs

## In plain words

[NHCX](../../shared/glossary/nhcx.md) runs in two environments. The [sandbox](../../shared/glossary/sandbox.md) is for building and testing. Production carries live claims.

Each environment has two API base addresses. Participant APIs manage your registration, certificates and policies. Use-case APIs carry eligibility checks, preauthorisations, claims and the other claim messages.

## Before you start

- You have credentials for the environment you are calling. See [what you need before you register](prerequisites.md).
- You know how to get a session token. See [the session token](../concepts/session-token.md) and [which session endpoint to call](../decisions/session-endpoint.md).

## What happens

### Addresses by environment

| | Sandbox | Production |
|---|---|---|
| Portal | https://hcxsbx.abdm.gov.in/ | https://nhcx.abdm.gov.in/ |
| Integration documents | https://hcxsbx.abdm.gov.in/#/documents | https://nhcx.abdm.gov.in/#/documents |
| PMJAY hospital system documents | https://hcxsbx.abdm.gov.in/#/hmisdocuments | |
| Participant APIs (`participantBaseUrl`) | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |
| Use-case APIs (`useCaseBaseUrl`) | `https://apisbx.abdm.gov.in/hcx` | `https://apisprod.nha.gov.in/hcx` |
| Dummy payer test APIs | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/dummyhcxpayer` | |
| [ABDM](../../shared/glossary/abdm.md) sandbox, for client credentials | https://sandbox.abdm.gov.in/sandbox/v3/ | |

### Building a full URL

Append the operation path to the base, with one slash between them:

| Call | Full sandbox URL |
|---|---|
| Fetch participant list | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list` |
| Fetch certificates | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs` |
| Get policies | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies` |
| Coverage eligibility check | `https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check` |
| Payment notice acknowledgement | `https://apisbx.abdm.gov.in/hcx/v1/paymentnotice/on_request` |

Every use-case path starts with `/v1/`.

### Participant codes

Treat a participant code as an opaque string, including the part after `@`. Sandbox examples carry `@sbx` or `@hcx`, and the sandbox dummy payer is `1000003538@hcx`.

## How you know it worked

You know you are on the right host when a call to `{participantBaseUrl}/fetch/participants/list` with a valid session token returns the participant list, not `401`.

A use-case call to `{useCaseBaseUrl}/v1/...` with a valid sealed payload returns `202`.

## When it goes wrong

- **Every call returns `401`.** The token expired, or you sent a sandbox token to production. Get a fresh token for the same environment. See [every NHCX call returns 401](../troubleshooting/everything-returns-401.md) and [NHCX-401](../errors/nhcx-401.md).
- **The host does not resolve.** Check for a missing slash between `apisbx.abdm.gov.in` and `hcx`.
- **A use-case call returns not found.** The path is missing `/v1/`, or it is on the participant base instead of the use-case base.
- **Production calls fail after sandbox sign-off.** Production access starts when the provider role is assigned to your production client. Until then, wait for the sign-off communication. See [going live](going-live.md).
