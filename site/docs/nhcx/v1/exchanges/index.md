---
title: Exchanges and codes
sidebar_label: Exchanges and codes
description: Every NHCX exchange as prose, with the workflow code that separates transactions sharing one endpoint.
verification: unverified
source: "NHCX Usecases (NHA); Workflow Status Sheets with Codes (18 Aug 2026); NHCX Requests and Responses for UseCases; NHCX Integration Handbook v1.0"
sidebar_position: 0
---

# Exchanges and codes

The endpoint catalogue in prose. What each exchange is for, who drives it, which callback answers it, and which workflow code separates one transaction from another where several share a path.

## In short

- Endpoints alone do not identify a transaction. The workflow code in the header does.
- A new preauthorisation, a resubmission, an enhancement and a query answer all travel on `/v1/preauth/submit` with the same bundle.
- Each code expects a particular status word, and using the wrong one is the portal's first listed mistake.
- The A-series carries no workflow code, because those are registry and session calls rather than claim transactions.

## The pages here

| Page | What it covers |
| --- | --- |
| [Use cases](/docs/nhcx/v1/exchanges/use-cases) | Every exchange with its action endpoint, its callback and its workflow code, grouped by who drives it |
| [Workflow codes](/docs/nhcx/v1/exchanges/workflow-codes) | Every code with the status word it expects, by stage, with the lifecycle diagrams and the places the sources disagree |
| [PMJAY use cases](/docs/nhcx/v1/exchanges/pmjay-use-cases) | The D-series: what a PMJAY integration must fetch, prove and package around the same endpoints |

## These pages and the API reference

The same endpoints appear twice in this portal, on purpose.

| | Here, in Docs | In [API references](/docs/nhcx/v1/api) |
| --- | --- | --- |
| What it is | Prose: what the exchange is for, when to send it, what the answer means | The machine contract: paths, headers, request and response schemas |
| Where it comes from | NHA's use case documents, workflow sheets and value sets | NHA's six Postman collections, authored into OpenAPI 3.1 |
| What it will not tell you | The exact header schema | What goes inside the sealed payload |
| Read it when | Deciding what to build and in what order | Writing the client, or trying a call |

NHA also publishes a Swagger UI per service on the sandbox portal at `hcxsbx.abdm.gov.in`, one each for coverage eligibility, preauth, claim, communication, payment, status, task, search, insurance plan and subscription. Those are live pages rather than downloadable documents, and the portal warns that for use case payloads its value-set sheets and code snippets are the authority rather than the Swagger. That is why the specifications in this portal are built from the Postman collections, which are downloadable and version-stamped.

## What no endpoint tells you

The body of every message endpoint is one field holding a JWE. The exchange reads the protected header and never opens the sealed half, so neither the OpenAPI document nor these pages describe what is inside it. That is the [FHIR reference](/docs/nhcx/v1/fhir-reference/bundles-and-conventions).

## Next

- [Use cases](/docs/nhcx/v1/exchanges/use-cases), the catalogue itself
- [FHIR reference](/docs/nhcx/v1/fhir-reference/bundles-and-conventions), what goes inside the payload
- [JWE, status and errors](/docs/nhcx/v1/concepts/jwe-status-and-errors), the envelope the codes ride on
